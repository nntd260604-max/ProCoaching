import { getDb, withTransaction } from "../db/runtime-db";

export interface ImportBatchInput {
  variantId: string;
  batchCode: string;
  supplierName: string;
  importPrice: number;
  initialQuantity: number;
  manufacturedDate: string;
  expiryDate: string;
}

export function computeBatchStatus(
  expiryDateStr: string,
  remainingQuantity: number
): "AVAILABLE" | "NEAR_EXPIRY" | "EXPIRED" | "DEPLETED" {
  if (remainingQuantity <= 0) return "DEPLETED";
  const now = new Date();
  const exp = new Date(expiryDateStr);
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "EXPIRED";
  if (diffDays <= 60) return "NEAR_EXPIRY";
  return "AVAILABLE";
}

export function importNewInventoryBatch(input: ImportBatchInput) {
  return withTransaction((db) => {
    const variant = db.supplementVariants.find((v) => v.id === input.variantId);
    if (!variant) {
      throw new Error("Không tìm thấy biến thể thực phẩm bổ sung để nhập lô.");
    }

    const status = computeBatchStatus(input.expiryDate, input.initialQuantity);

    const newBatch = {
      id: `batch-${Date.now()}`,
      variantId: input.variantId,
      batchCode: input.batchCode.trim().toUpperCase(),
      supplierName: input.supplierName.trim() || "Nhà phân phối chính hãng",
      importPrice: Number(input.importPrice),
      initialQuantity: Number(input.initialQuantity),
      remainingQuantity: Number(input.initialQuantity),
      manufacturedDate: input.manufacturedDate,
      expiryDate: input.expiryDate,
      batchStatus: status,
      importedAt: new Date().toISOString(),
    };

    db.inventoryBatches.unshift(newBatch);

    // Cập nhật lại tổng tồn kho khả dụng (chỉ cộng các lô chưa hết hạn)
    const now = new Date();
    variant.stockQuantity = db.inventoryBatches
      .filter(
        (b) =>
          b.variantId === variant.id &&
          b.remainingQuantity > 0 &&
          b.batchStatus !== "EXPIRED" &&
          new Date(b.expiryDate).getTime() > now.getTime()
      )
      .reduce((sum, b) => sum + b.remainingQuantity, 0);

    return {
      newBatch,
      updatedVariantStock: variant.stockQuantity,
    };
  });
}

export function applyFlashSaleForNearExpiryVariant(variantId: string, discountPct = 20) {
  return withTransaction((db) => {
    const variant = db.supplementVariants.find((v) => v.id === variantId);
    if (!variant) {
      throw new Error("Không tìm thấy biến thể sản phẩm.");
    }

    const newSalePrice = Math.round((variant.price * (100 - discountPct)) / 100);
    variant.salePrice = newSalePrice;

    return {
      variant,
      discountPct,
      newSalePrice,
    };
  });
}

export function simulateWebhookPaymentIpn(orderId: string) {
  return withTransaction((db) => {
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    order.paymentStatus = "PAID";
    if (order.hasPhysicalItems && order.fulfillmentStatus === "PROCESSING") {
      order.fulfillmentStatus = "SHIPPING";
    }
    return order;
  });
}

export function getAdminAnalyticsAndWarehouse() {
  const db = getDb();
  const now = new Date();

  let supplementRevenue = 0;
  let supplementCogs = 0;
  let supplementGrossProfit = 0;
  let serviceRevenue = 0;

  const paidOrderIds = new Set(
    db.orders.filter((o) => o.paymentStatus === "PAID").map((o) => o.id)
  );

  for (const item of db.orderItems) {
    if (!paidOrderIds.has(item.orderId)) continue;
    if (item.itemType === "COURSE_MEMBERSHIP") {
      serviceRevenue += item.lineTotal;
    } else if (item.itemType === "SUPPLEMENT_VARIANT") {
      supplementRevenue += item.lineTotal;
      const batch = db.inventoryBatches.find((b) => b.id === item.allocatedBatchId);
      const unitCost = batch ? batch.importPrice : Math.round(item.unitPrice * 0.72);
      const totalCost = unitCost * item.quantity;
      supplementCogs += totalCost;
      supplementGrossProfit += item.lineTotal - totalCost;
    }
  }

  const enrichedBatches = db.inventoryBatches
    .map((b) => {
      const variant = db.supplementVariants.find((v) => v.id === b.variantId);
      const product = variant
        ? db.supplementProducts.find((p) => p.id === variant.productId)
        : null;
      const daysUntilExpiry = Math.ceil(
        (new Date(b.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const computedStatus = computeBatchStatus(b.expiryDate, b.remainingQuantity);
      return {
        ...b,
        batchStatus: computedStatus,
        daysUntilExpiry,
        variantSku: variant?.sku || "N/A",
        variantFlavor: variant?.flavor || "",
        variantWeight: variant?.weightLabel || "",
        variantPrice: variant?.price || 0,
        variantSalePrice: variant?.salePrice || null,
        productName: product?.name || "Thực phẩm bổ sung",
      };
    })
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const nearExpiryBatches = enrichedBatches.filter((b) => b.batchStatus === "NEAR_EXPIRY");
  const expiredBatches = enrichedBatches.filter((b) => b.batchStatus === "EXPIRED");

  const enrichedOrders = db.orders.map((o) => {
    const user = db.users.find((u) => u.id === o.userId);
    const items = db.orderItems
      .filter((i) => i.orderId === o.id)
      .map((i) => {
        const batch = i.allocatedBatchId
          ? db.inventoryBatches.find((b) => b.id === i.allocatedBatchId)
          : null;
        return {
          ...i,
          allocatedBatchCode: batch?.batchCode || null,
          allocatedBatchExpiry: batch?.expiryDate || null,
          allocatedBatchImportPrice: batch?.importPrice || null,
        };
      });
    return {
      ...o,
      customerName: user?.fullName || "Khách hàng",
      customerEmail: user?.email || "",
      items,
    };
  });

  return {
    metrics: {
      totalRevenue: supplementRevenue + serviceRevenue,
      serviceRevenue,
      supplementRevenue,
      supplementCogs,
      supplementGrossProfit,
      totalGrossProfit: serviceRevenue + supplementGrossProfit,
      totalOrders: db.orders.length,
      nearExpiryCount: nearExpiryBatches.length,
      expiredCount: expiredBatches.length,
    },
    batches: enrichedBatches,
    nearExpiryBatches,
    expiredBatches,
    orders: enrichedOrders,
  };
}

