import { withTransaction, getDb } from "../db/runtime-db";

export interface HybridCartCheckoutItem {
  itemType: "SUPPLEMENT_VARIANT" | "COURSE_MEMBERSHIP";
  supplementVariantId?: string;
  courseId?: string;
  quantity: number;
}

export interface ShippingAddressInput {
  recipientName: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  note?: string;
}

export interface HybridCheckoutInput {
  userId: string;
  items: HybridCartCheckoutItem[];
  shippingAddress?: ShippingAddressInput | null;
  voucherCode?: string | null;
  paymentMethod: "VNPAY" | "MOMO" | "PAYOS" | "COD";
  simulateImmediatePaid?: boolean;
}

export interface FefoAllocationDetail {
  variantId: string;
  sku: string;
  itemName: string;
  allocatedBatchId: string;
  batchCode: string;
  expiryDate: string;
  importPrice: number;
  unitSalePrice: number;
  quantityAllocated: number;
  grossProfit: number;
}

export function processHybridCheckoutWithFefo(input: HybridCheckoutInput) {
  if (!input.items || input.items.length === 0) {
    throw new Error("Giỏ hàng đang trống. Vui lòng chọn ít nhất 1 sản phẩm hoặc gói tập.");
  }

  const hasPhysicalItems = input.items.some((i) => i.itemType === "SUPPLEMENT_VARIANT");
  if (hasPhysicalItems && (!input.shippingAddress || !input.shippingAddress.addressLine)) {
    throw new Error(
      "Giỏ hàng có chứa Thực phẩm bổ sung vật lý. Vui lòng nhập đầy đủ địa chỉ giao hàng."
    );
  }

  return withTransaction((db) => {
    const now = new Date();
    const nowIso = now.toISOString();
    let subtotalAmount = 0;

    const fefoAllocations: FefoAllocationDetail[] = [];
    const createdOrderItems: typeof db.orderItems = [];
    const createdEnrollments: typeof db.userEnrollments = [];

    const orderId = `ord-${Date.now()}`;
    const dateStamp = nowIso.slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `GH-${dateStamp}-${randomSuffix}`;

    for (const cartItem of input.items) {
      if (cartItem.itemType === "SUPPLEMENT_VARIANT") {
        const variant = db.supplementVariants.find((v) => v.id === cartItem.supplementVariantId);
        if (!variant) {
          throw new Error(`Không tìm thấy biến thể sản phẩm: ${cartItem.supplementVariantId}`);
        }
        const product = db.supplementProducts.find((p) => p.id === variant.productId);
        const unitPrice = variant.salePrice ?? variant.price;
        const itemFullName = `${product?.name || "Thực phẩm bổ sung"} - ${variant.flavor} (${variant.weightLabel})`;

        // THUẬT TOÁN FEFO (First Expired, First Out):
        // Truy vấn các lô hàng của biến thể có remainingQuantity > 0 VÀ expiryDate > NOW()
        // Sắp xếp theo expiryDate tăng dần (ASC) - Lô nào hết hạn sớm nhất được xuất trước!
        const validBatches = db.inventoryBatches
          .filter(
            (b) =>
              b.variantId === variant.id &&
              b.remainingQuantity > 0 &&
              b.batchStatus !== "EXPIRED" &&
              new Date(b.expiryDate).getTime() > now.getTime()
          )
          .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

        const totalAvailableInValidBatches = validBatches.reduce(
          (sum, b) => sum + b.remainingQuantity,
          0
        );

        if (totalAvailableInValidBatches < cartItem.quantity) {
          throw new Error(
            `Sản phẩm "${itemFullName}" chỉ còn ${totalAvailableInValidBatches} hộp khả dụng trong các lô còn hạn sử dụng.`
          );
        }

        let remainingToAllocate = cartItem.quantity;

        for (const batch of validBatches) {
          if (remainingToAllocate <= 0) break;

          const takeQty = Math.min(batch.remainingQuantity, remainingToAllocate);
          batch.remainingQuantity -= takeQty;
          if (batch.remainingQuantity === 0) {
            batch.batchStatus = "DEPLETED";
          }
          remainingToAllocate -= takeQty;

          const lineTotal = takeQty * unitPrice;
          subtotalAmount += lineTotal;

          const orderItemId = `oi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          createdOrderItems.push({
            id: orderItemId,
            orderId,
            itemType: "SUPPLEMENT_VARIANT",
            supplementVariantId: variant.id,
            allocatedBatchId: batch.id,
            courseId: null,
            itemNameSnapshot: itemFullName,
            quantity: takeQty,
            unitPrice,
            lineTotal,
          });

          fefoAllocations.push({
            variantId: variant.id,
            sku: variant.sku,
            itemName: itemFullName,
            allocatedBatchId: batch.id,
            batchCode: batch.batchCode,
            expiryDate: batch.expiryDate,
            importPrice: batch.importPrice,
            unitSalePrice: unitPrice,
            quantityAllocated: takeQty,
            grossProfit: (unitPrice - batch.importPrice) * takeQty,
          });
        }

        // Đồng bộ lại tổng tồn kho khả dụng (chỉ tính các lô chưa hết hạn) trên biến thể
        variant.stockQuantity = db.inventoryBatches
          .filter(
            (b) =>
              b.variantId === variant.id &&
              b.remainingQuantity > 0 &&
              b.batchStatus !== "EXPIRED" &&
              new Date(b.expiryDate).getTime() > now.getTime()
          )
          .reduce((sum, b) => sum + b.remainingQuantity, 0);
      } else if (cartItem.itemType === "COURSE_MEMBERSHIP") {
        const course = db.coursesMemberships.find((c) => c.id === cartItem.courseId);
        if (!course) {
          throw new Error(`Không tìm thấy gói tập / khóa học: ${cartItem.courseId}`);
        }

        const unitPrice = course.price;
        const lineTotal = unitPrice * cartItem.quantity;
        subtotalAmount += lineTotal;

        const orderItemId = `oi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        createdOrderItems.push({
          id: orderItemId,
          orderId,
          itemType: "COURSE_MEMBERSHIP",
          supplementVariantId: null,
          allocatedBatchId: null,
          courseId: course.id,
          itemNameSnapshot: course.title,
          quantity: cartItem.quantity,
          unitPrice,
          lineTotal,
        });

        // Tự động kích hoạt UserEnrollment (Thẻ tập QR + Quyền học Video + Cộng buổi PT)
        const expiresAtDate = new Date(now);
        expiresAtDate.setDate(expiresAtDate.getDate() + course.durationDays * cartItem.quantity);

        const totalPt = course.ptSessionsIncluded * cartItem.quantity;
        const enrollmentId = `enroll-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const qrSecretKey = `GYMHUB-TOTP-${input.userId.slice(-4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

        const newEnrollment = {
          id: enrollmentId,
          userId: input.userId,
          courseId: course.id,
          orderId,
          assignedTrainerId: course.trainerId || "user-trainer-01",
          qrSecretKey,
          activatedAt: nowIso,
          expiresAt: expiresAtDate.toISOString(),
          totalPtSessions: totalPt,
          remainingPtSessions: totalPt,
          progressPct: 0,
          status: "ACTIVE" as const,
        };

        db.userEnrollments.unshift(newEnrollment);
        createdEnrollments.push(newEnrollment);
      }
    }

    // Tính phí vận chuyển (Chỉ tính nếu có sản phẩm vật lý và đơn dưới 2.000.000đ)
    const shippingFee = hasPhysicalItems ? (subtotalAmount >= 2000000 ? 0 : 30000) : 0;

    // Kiểm tra và áp dụng Voucher giảm giá
    let discountAmount = 0;
    let appliedVoucherId: string | null = null;

    if (input.voucherCode && input.voucherCode.trim() !== "") {
      const codeUpper = input.voucherCode.trim().toUpperCase();
      const voucher = db.vouchers.find((v) => v.code.toUpperCase() === codeUpper);
      if (!voucher) {
        throw new Error(`Mã giảm giá "${codeUpper}" không tồn tại.`);
      }
      if (voucher.usedCount >= voucher.usageLimit) {
        throw new Error(`Mã giảm giá "${codeUpper}" đã hết lượt sử dụng.`);
      }
      if (new Date(voucher.validUntil).getTime() < now.getTime()) {
        throw new Error(`Mã giảm giá "${codeUpper}" đã hết hạn.`);
      }
      if (subtotalAmount < voucher.minOrderValue) {
        throw new Error(
          `Đơn hàng tối thiểu phải đạt ${voucher.minOrderValue.toLocaleString("vi-VN")}đ để áp dụng mã ${codeUpper}.`
        );
      }

      appliedVoucherId = voucher.id;
      if (voucher.discountType === "PERCENTAGE") {
        discountAmount = Math.round((subtotalAmount * voucher.discountValue) / 100);
      } else {
        discountAmount = voucher.discountValue;
      }
      voucher.usedCount += 1;
    }

    const totalAmount = Math.max(0, subtotalAmount + shippingFee - discountAmount);
    const isPaidImmediately = input.simulateImmediatePaid !== false;

    const newOrder = {
      id: orderId,
      orderCode,
      userId: input.userId,
      voucherId: appliedVoucherId,
      hasPhysicalItems,
      shippingAddress: hasPhysicalItems ? (input.shippingAddress ?? null) : null,
      subtotalAmount,
      shippingFee,
      discountAmount,
      totalAmount,
      paymentMethod: input.paymentMethod,
      paymentStatus: isPaidImmediately ? ("PAID" as const) : ("PENDING" as const),
      fulfillmentStatus: hasPhysicalItems ? ("PROCESSING" as const) : ("DIGITAL_ONLY" as const),
      createdAt: nowIso,
    };

    db.orders.unshift(newOrder);
    db.orderItems.push(...createdOrderItems);

    return {
      order: newOrder,
      items: createdOrderItems,
      fefoAllocations,
      activatedEnrollments: createdEnrollments,
    };
  });
}

export function validateVoucherPreview(code: string, subtotal: number) {
  const db = getDb();
  const clean = code.trim().toUpperCase();
  const voucher = db.vouchers.find((v) => v.code.toUpperCase() === clean);
  if (!voucher) {
    return { valid: false, message: "Mã giảm giá không tồn tại.", discountAmount: 0 };
  }
  if (subtotal < voucher.minOrderValue) {
    return {
      valid: false,
      message: `Cần mua tối thiểu ${voucher.minOrderValue.toLocaleString("vi-VN")}đ để dùng mã ${voucher.code}.`,
      discountAmount: 0,
    };
  }
  const discountAmount =
    voucher.discountType === "PERCENTAGE"
      ? Math.round((subtotal * voucher.discountValue) / 100)
      : voucher.discountValue;

  return {
    valid: true,
    voucher,
    discountAmount,
    message: `Áp dụng mã ${voucher.code} thành công (-${discountAmount.toLocaleString("vi-VN")}đ)!`,
  };
}

