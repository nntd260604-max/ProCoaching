"use client";

import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Package,
  Zap,
  Trash2,
  Plus,
  Minus,
  Truck,
  Tag,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";
import { useRouter } from "next/navigation";

interface CheckoutReceipt {
  order: {
    id: string;
    orderCode: string;
    totalAmount: number;
    subtotalAmount: number;
    shippingFee: number;
    discountAmount: number;
    paymentMethod: string;
    hasPhysicalItems: boolean;
  };
  fefoAllocations: {
    sku: string;
    itemName: string;
    batchCode: string;
    expiryDate: string;
    quantityAllocated: number;
    importPrice: number;
    unitSalePrice: number;
    grossProfit: number;
  }[];
  activatedEnrollments: {
    id: string;
    courseId: string;
    qrSecretKey: string;
    expiresAt: string;
    totalPtSessions: number;
  }[];
}

export function HybridCartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    activeUserId,
    pushToast,
  } = useHybridCartStore();

  const [voucherCode, setVoucherCode] = useState("WHEYCOMBO");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"VNPAY" | "MOMO" | "PAYOS" | "COD">("VNPAY");

  const [recipientName, setRecipientName] = useState("Nguyễn Minh Quân");
  const [phone, setPhone] = useState("0908123456");
  const [addressLine, setAddressLine] = useState("268 Lý Thường Kiệt, Phường 14");
  const [district, setDistrict] = useState("Quận 10");
  const [city, setCity] = useState("TP. Hồ Chí Minh");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<CheckoutReceipt | null>(null);

  if (!isCartOpen) return null;

  const physicalItems = items.filter((i) => i.itemType === "SUPPLEMENT_VARIANT");
  const digitalItems = items.filter((i) => i.itemType === "COURSE_MEMBERSHIP");
  const hasPhysicalItems = physicalItems.length > 0;

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingFee = hasPhysicalItems ? (subtotal >= 2000000 ? 0 : 30000) : 0;
  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyVoucher = async (presetCode?: string) => {
    const targetCode = presetCode ?? voucherCode;
    if (presetCode) setVoucherCode(presetCode);
    try {
      const res = await fetch("/api/checkout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: targetCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountAmount(data.discountAmount);
        setVoucherMessage(data.message);
        pushToast({
          title: "Áp dụng Voucher thành công!",
          description: data.message,
          type: "success",
        });
      } else {
        setDiscountAmount(0);
        setVoucherMessage(data.message);
        pushToast({
          title: "Không thể áp dụng mã giảm giá",
          description: data.message,
          type: "warning",
        });
      }
    } catch {
      setVoucherMessage("Lỗi kiểm tra mã giảm giá.");
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        userId: activeUserId || "user-member-01",
        items: items.map((i) => ({
          itemType: i.itemType,
          supplementVariantId: i.supplementVariantId,
          courseId: i.courseId,
          quantity: i.quantity,
        })),
        shippingAddress: hasPhysicalItems
          ? { recipientName, phone, addressLine, district, city }
          : null,
        voucherCode: discountAmount > 0 ? voucherCode : null,
        paymentMethod,
        simulateImmediatePaid: true,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Thanh toán thất bại");
      }

      setReceipt(data);
      clearCart();
      setDiscountAmount(0);
      pushToast({
        title: `Thanh toán thành công đơn ${data.order.orderCode}!`,
        description: "Đã tự động xuất kho lô FEFO và kích hoạt thẻ tập QR động.",
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra khi thanh toán";
      pushToast({
        title: "Lỗi thanh toán đơn hàng",
        description: msg,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">
                Giỏ Hàng Hỗn Hợp (Hybrid Cart & FEFO)
              </h2>
              <p className="text-xs text-slate-400">
                Tích hợp Sản phẩm vật lý (Xuất lô FEFO) & Gói tập/Khóa học (Kích hoạt ngay)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setReceipt(null);
              setCartOpen(false);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {receipt ? (
            <div className="space-y-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Database Transaction (ACID) Thành Công
                  </span>
                  <h3 className="text-xl font-black text-white">
                    Mã đơn: {receipt.order.orderCode}
                  </h3>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Phương thức thanh toán:</span>
                  <span className="font-bold text-white">{receipt.order.paymentMethod} (PAID)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tổng thanh toán:</span>
                  <span className="text-base font-black text-emerald-400">
                    {receipt.order.totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {receipt.fefoAllocations.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <Package className="h-4 w-4" />
                    1. Kết quả Thuật toán Xuất Kho Lô Hàng FEFO (First Expired, First Out)
                  </h4>
                  {receipt.fefoAllocations.map((alloc, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-orange-500/30 bg-slate-900/80 p-3.5 text-xs space-y-1.5"
                    >
                      <div className="font-bold text-white">{alloc.itemName}</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded bg-orange-500/20 px-2 py-0.5 font-mono font-semibold text-orange-300">
                          Lô xuất FEFO: {alloc.batchCode}
                        </span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                          Hạn dùng: {alloc.expiryDate}
                        </span>
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                          SL trừ kho: {alloc.quantityAllocated} hộp
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Giá vốn lô nhập: {alloc.importPrice.toLocaleString("vi-VN")}đ/hộp → Lợi nhuận gộp ghi nhận:{" "}
                        <strong className="text-emerald-400">
                          +{alloc.grossProfit.toLocaleString("vi-VN")}đ
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {receipt.activatedEnrollments.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Zap className="h-4 w-4" />
                    2. Đã Kích Hoạt Tức Thì Thẻ Tập QR Động 60s & Khóa Học
                  </h4>
                  {receipt.activatedEnrollments.map((enr) => (
                    <div
                      key={enr.id}
                      className="rounded-xl border border-emerald-500/30 bg-slate-900/80 p-3.5 text-xs space-y-1"
                    >
                      <div className="font-bold text-emerald-300">
                        Mã Thẻ Ghi Danh: {enr.id}
                      </div>
                      <div className="text-slate-300">
                        Số buổi PT 1-1 được cấp:{" "}
                        <strong className="text-white">{enr.totalPtSessions} buổi</strong> • Hạn thẻ:{" "}
                        {new Date(enr.expiresAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Khóa TOTP QR: {enr.qrSecretKey}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    setCartOpen(false);
                    router.push("/dashboard/member");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Mở Tủ Đồ Hội Viên & Thẻ QR 60s <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    setCartOpen(false);
                    router.push("/dashboard/admin");
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                >
                  Xem Kho FEFO (Admin)
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-14 w-14 text-slate-700 mb-3" />
              <h3 className="text-lg font-bold text-slate-300">Giỏ hàng Hỗn hợp đang trống</h3>
              <p className="text-sm text-slate-500 max-w-xs mt-1">
                Hãy thêm Thực phẩm bổ sung (Whey, Pre-workout) hoặc Khóa học/Gói tập PT để trải nghiệm thanh toán Hybrid.
              </p>
            </div>
          ) : (
            <form id="hybrid-checkout-form" onSubmit={handleCheckout} className="space-y-6">
              {/* Nhóm 1: Sản phẩm vật lý */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                    <Package className="h-4 w-4" />
                    Nhóm 1: Sản phẩm vật lý — Giao tận nơi & Xuất lô FEFO ({physicalItems.length})
                  </h3>
                  {hasPhysicalItems && (
                    <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-orange-300">
                      Cần địa chỉ giao hàng
                    </span>
                  )}
                </div>

                {physicalItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 p-3 text-xs text-slate-500">
                    Chưa có Thực phẩm bổ sung vật lý trong giỏ.
                  </div>
                ) : (
                  physicalItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 rounded-xl border border-slate-800 bg-slate-900/80 p-3"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.name}</div>
                        <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-orange-400">
                            {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="rounded bg-slate-800 p-1 text-slate-300 hover:bg-slate-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="rounded bg-slate-800 p-1 text-slate-300 hover:bg-slate-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="ml-1 rounded p-1 text-rose-400 hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Nhóm 2: Khóa học & Thẻ tập (Kích hoạt ngay) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Zap className="h-4 w-4" />
                    Nhóm 2: Khóa học & Thẻ tập — Kích hoạt ngay ({digitalItems.length})
                  </h3>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                    Cấp mã QR 60s tức thì
                  </span>
                </div>

                {digitalItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 p-3 text-xs text-slate-500">
                    Chưa có Khóa học hoặc Thẻ tập trong giỏ.
                  </div>
                ) : (
                  digitalItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.name}</div>
                        <div className="text-xs text-emerald-300/80 truncate">{item.subtitle}</div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-emerald-400">
                            {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="rounded p-1 text-rose-400 hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Điều kiện hiển thị Form Giao hàng vật lý (hasPhysicalItems) */}
              {hasPhysicalItems ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                    <Truck className="h-4 w-4 text-orange-400" />
                    Thông tin Giao Hàng Vật Lý (`hasPhysicalItems = true`)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Người nhận *</label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Số điện thoại *</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">Địa chỉ nhận hàng *</label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Quận / Huyện</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Tỉnh / Thành phố</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <strong>Đơn hàng 100% Dịch vụ số (`hasPhysicalItems = false`):</strong> Đã tự động ẩn bước nhập địa chỉ giao hàng và miễn phí vận chuyển.
                  </div>
                </div>
              )}

              {/* Voucher giảm giá */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Tag className="h-3.5 w-3.5 text-emerald-400" />
                  Mã Giảm Giá Khuyến Mãi (Voucher)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã (VD: GYMHUB50, WHEYCOMBO)"
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono uppercase text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher()}
                    className="rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-700 border border-emerald-500/30"
                  >
                    Áp dụng
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["GYMHUB50", "WHEYCOMBO", "CLEARANCE20"].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleApplyVoucher(code)}
                      className="rounded bg-slate-800/90 px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300"
                    >
                      +{code}
                    </button>
                  ))}
                </div>
                {voucherMessage && (
                  <p className="text-xs text-emerald-400 font-medium">{voucherMessage}</p>
                )}
              </div>

              {/* Phương thức thanh toán */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                  Cổng Thanh Toán Trực Tuyến
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["VNPAY", "MOMO", "PAYOS", "COD"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                        paymentMethod === method
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                          : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary */}
        {!receipt && items.length > 0 && (
          <div className="border-t border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tạm tính ({items.length} dòng sản phẩm):</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              {hasPhysicalItems && (
                <div className="flex justify-between text-slate-400">
                  <span>Phí vận chuyển (Miễn phí đơn từ 2Tr):</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-semibold">Miễn phí (0đ)</span>
                    ) : (
                      `${shippingFee.toLocaleString("vi-VN")}đ`
                    )}
                  </span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Giảm giá Voucher ({voucherCode}):</span>
                  <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-black text-white">
                <span>Tổng thanh toán:</span>
                <span className="text-emerald-400">
                  {finalTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="hybrid-checkout-form"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-orange-500 px-5 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting
                ? "Đang xử lý Transaction Xuất Kho FEFO & Cấp Thẻ QR..."
                : `Thanh Toán Ngay (${finalTotal.toLocaleString("vi-VN")}đ)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

