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
  CheckCircle2,
  ArrowRight,
  Truck,
  Tag,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";
import { useRouter } from "next/navigation";

interface CheckoutReceipt {
  order: {
    id: string;
    orderCode: string;
    totalAmount: number;
    paymentMethod: string;
  };
  fefoAllocations: {
    itemName: string;
    batchCode: string;
    expiryDate: string;
    quantityAllocated: number;
  }[];
  activatedEnrollments: {
    id: string;
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
    if (!targetCode.trim()) return;
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
      } else {
        setDiscountAmount(0);
        setVoucherMessage(data.message);
      }
    } catch {
      setVoucherMessage("Không thể kiểm tra mã giảm giá.");
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
        title: `Thanh toán thành công đơn ${data.order.orderCode}`,
        description: "Đã xuất lô hàng FEFO & kích hoạt gói tập.",
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra khi thanh toán";
      pushToast({
        title: "Không thể thanh toán",
        description: msg,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30">
      {/* Tầng 2: Khung ngoài Ngăn kéo Giỏ hàng dùng Selective Glass (Không lồng blur bên trong) */}
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white/85 backdrop-blur-xl border-l border-white/80 text-slate-900 shadow-[0_8px_32px_rgba(15,23,42,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                Giỏ hàng Hỗn hợp
              </h2>
              <p className="text-xs font-medium text-slate-600">
                {physicalItems.length} sản phẩm giao tận nơi • {digitalItems.length} gói kích hoạt ngay
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setReceipt(null);
              setCartOpen(false);
            }}
            className="rounded-xl bg-white border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {receipt ? (
            /* Tầng 1: Bề mặt nội dung đọc nền đặc bg-white bên trong ngăn kéo kính */
            <div className="solid-card p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Đặt hàng thành công
                  </span>
                  <h3 className="font-mono text-lg font-extrabold text-slate-900">
                    {receipt.order.orderCode}
                  </h3>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Tổng thanh toán ({receipt.order.paymentMethod}):
                </span>
                <span className="font-mono text-base font-extrabold text-emerald-700">
                  {receipt.order.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {receipt.fefoAllocations.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Lô hàng thực phẩm bổ sung xuất kho (FEFO)
                  </div>
                  {receipt.fefoAllocations.map((alloc, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-900">{alloc.itemName}</div>
                      <div className="flex flex-wrap gap-2 text-slate-700 font-medium">
                        <span className="font-mono font-bold text-emerald-700">
                          Mã lô: {alloc.batchCode}
                        </span>
                        <span>• Hạn dùng: {alloc.expiryDate}</span>
                        <span>• Số lượng: {alloc.quantityAllocated} hộp</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {receipt.activatedEnrollments.length > 0 && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs space-y-1">
                  <div className="font-bold text-indigo-900">
                    Đã kích hoạt Thẻ tập QR & Khóa học trực tuyến
                  </div>
                  <div className="font-medium text-indigo-800">
                    Bạn có thể mở mã QR động 60 giây hoặc học video ngay trong mục Cá nhân.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  setCartOpen(false);
                  router.push("/dashboard/member");
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
              >
                Mở Thẻ tập QR & Đơn hàng của tôi <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="solid-card p-10 text-center space-y-3">
              <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="text-base font-bold text-slate-900">Giỏ hàng của bạn đang trống</h3>
              <p className="text-xs font-medium text-slate-600 max-w-xs mx-auto">
                Hãy chọn thêm Thực phẩm bổ sung hoặc Gói tập / Khóa học phù hợp với mục tiêu của bạn.
              </p>
            </div>
          ) : (
            <form id="hybrid-checkout-form" onSubmit={handleCheckout} className="space-y-6">
              {/* Nhóm 1: Sản phẩm vật lý (Nền đặc bg-white) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    <Package className="h-4 w-4 text-emerald-600" />
                    Sản phẩm vật lý (Giao tận nơi - Xuất lô FEFO)
                  </h3>
                  <span className="text-xs font-bold text-slate-600">
                    {physicalItems.length} sản phẩm
                  </span>
                </div>

                {physicalItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-3.5 text-xs font-medium text-slate-500">
                    Chưa có thực phẩm bổ sung trong giỏ.
                  </div>
                ) : (
                  physicalItems.map((item) => (
                    <div
                      key={item.id}
                      className="solid-card p-3.5 flex items-center gap-3.5"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs font-medium text-slate-600 truncate">
                          {item.subtitle}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-mono text-sm font-extrabold text-emerald-700">
                            {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-700 hover:bg-slate-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center font-mono text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-700 hover:bg-slate-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="ml-1 rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
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

              {/* Nhóm 2: Khóa học & Thẻ tập (Nền đặc bg-white) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    <Zap className="h-4 w-4 text-indigo-600" />
                    Khóa học & Thẻ tập (Kích hoạt ngay)
                  </h3>
                  <span className="text-xs font-bold text-slate-600">
                    {digitalItems.length} gói
                  </span>
                </div>

                {digitalItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-3.5 text-xs font-medium text-slate-500">
                    Chưa có khóa học hoặc gói tập trong giỏ.
                  </div>
                ) : (
                  digitalItems.map((item) => (
                    <div
                      key={item.id}
                      className="solid-card p-3.5 flex items-center gap-3.5"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs font-medium text-indigo-700 truncate">
                          {item.subtitle}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-mono text-sm font-extrabold text-indigo-700">
                            {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Địa chỉ giao hàng (Chỉ hiển thị khi có sản phẩm vật lý, nền đặc bg-white) */}
              {hasPhysicalItems && (
                <div className="solid-card p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    Địa chỉ nhận hàng
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Người nhận *</label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Địa chỉ *</label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Quận / Huyện</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tỉnh / Thành phố</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mã giảm giá & Thanh toán (Nền đặc bg-white) */}
              <div className="solid-card p-4 space-y-3">
                <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  <Tag className="h-3.5 w-3.5 text-emerald-600" />
                  Mã ưu đãi & Phương thức thanh toán
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã (VD: GYMHUB50, WHEYCOMBO)"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher()}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    Áp dụng
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["GYMHUB50", "WHEYCOMBO", "CLEARANCE20"].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleApplyVoucher(code)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      +{code}
                    </button>
                  ))}
                </div>
                {voucherMessage && (
                  <p className="text-xs font-bold text-emerald-700">{voucherMessage}</p>
                )}

                <div className="grid grid-cols-4 gap-2 pt-2">
                  {(["VNPAY", "MOMO", "PAYOS", "COD"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border py-2 text-xs font-bold transition ${
                        paymentMethod === method
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
          <div className="border-t border-slate-200/80 bg-white p-5 space-y-3">
            <div className="space-y-1 text-xs font-medium">
              <div className="flex justify-between text-slate-700">
                <span>Tạm tính:</span>
                <span className="font-mono font-bold">{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              {hasPhysicalItems && (
                <div className="flex justify-between text-slate-700">
                  <span>Phí vận chuyển:</span>
                  <span className="font-mono font-bold">
                    {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Giảm giá:</span>
                  <span className="font-mono font-bold">
                    -{discountAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                <span>Tổng cộng:</span>
                <span className="font-mono text-emerald-700">
                  {finalTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="hybrid-checkout-form"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
            >
              {isSubmitting
                ? "Đang xử lý đơn hàng..."
                : `Thanh toán ngay (${finalTotal.toLocaleString("vi-VN")}đ)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
