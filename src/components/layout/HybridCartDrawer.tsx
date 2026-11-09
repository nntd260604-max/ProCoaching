"use client";

import React, { useState, useEffect, useCallback } from "react";
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

const PRESET_VOUCHERS = ["GYMHUB50", "WHEYCOMBO", "CLEARANCE20"] as const;
const PAYMENT_METHODS = ["VNPAY", "MOMO", "PAYOS", "COD"] as const;

export function HybridCartDrawer() {
  const router = useRouter();
  const items = useHybridCartStore((s) => s.items);
  const isCartOpen = useHybridCartStore((s) => s.isCartOpen);
  const setCartOpen = useHybridCartStore((s) => s.setCartOpen);
  const removeItem = useHybridCartStore((s) => s.removeItem);
  const updateQuantity = useHybridCartStore((s) => s.updateQuantity);
  const clearCart = useHybridCartStore((s) => s.clearCart);
  const activeUserId = useHybridCartStore((s) => s.activeUserId);
  const pushToast = useHybridCartStore((s) => s.pushToast);

  const [voucherCode, setVoucherCode] = useState("WHEYCOMBO");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "VNPAY" | "MOMO" | "PAYOS" | "COD"
  >("VNPAY");

  const [recipientName, setRecipientName] = useState("Nguyễn Minh Quân");
  const [phone, setPhone] = useState("0908123456");
  const [addressLine, setAddressLine] = useState(
    "268 Lý Thường Kiệt, Phường 14"
  );
  const [district, setDistrict] = useState("Quận 10");
  const [city, setCity] = useState("TP. Hồ Chí Minh");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<CheckoutReceipt | null>(null);

  const handleCloseDrawer = useCallback(() => {
    setReceipt(null);
    setCartOpen(false);
  }, [setCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseDrawer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, handleCloseDrawer]);

  if (!isCartOpen) return null;

  const physicalItems = items.filter(
    (i) => i.itemType === "SUPPLEMENT_VARIANT"
  );
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
        description: "Đã xuất lô hàng mới nhất & kích hoạt gói tập.",
        type: "success",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi thanh toán";
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30"
    >
      <button
        type="button"
        aria-label="Đóng ngăn giỏ hàng"
        onClick={handleCloseDrawer}
        className="flex-1 cursor-default"
      />
      {/* Tầng 2: Khung ngoài Ngăn kéo Giỏ hàng dùng Selective Glass */}
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white/85 backdrop-blur-xl border-l border-white/80 text-slate-900 shadow-[0_8px_32px_rgba(15,23,42,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="cart-drawer-title"
                className="text-base font-extrabold tracking-tight text-slate-900"
              >
                Giỏ Hàng Của Bạn
              </h2>
              <p className="text-xs font-medium text-slate-600">
                {physicalItems.length} sản phẩm giao tận nơi •{" "}
                {digitalItems.length} gói kích hoạt ngay
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Đóng giỏ hàng"
            onClick={handleCloseDrawer}
            className="rounded-xl bg-white border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
          {receipt ? (
            <div className="solid-card p-6 space-y-5" aria-live="polite">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Đặt hàng thành công
                  </span>
                  <h3
                    className="font-mono text-lg font-extrabold text-slate-900"
                    translate="no"
                  >
                    {receipt.order.orderCode}
                  </h3>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Tổng thanh toán ({receipt.order.paymentMethod}):
                </span>
                <span className="font-mono text-base font-extrabold text-emerald-700 tabular-nums">
                  {receipt.order.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {receipt.fefoAllocations.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Lô hàng thực phẩm bổ sung xuất kho
                  </div>
                  {receipt.fefoAllocations.map((alloc, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-900">
                        {alloc.itemName}
                      </div>
                      <div className="flex flex-wrap gap-2 text-slate-700 font-medium">
                        <span
                          className="font-mono font-bold text-emerald-700"
                          translate="no"
                        >
                          Mã lô: {alloc.batchCode}
                        </span>
                        <span className="font-mono">
                          • HSD: {alloc.expiryDate}
                        </span>
                        <span>• Số lượng: {alloc.quantityAllocated} hộp</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {receipt.activatedEnrollments.length > 0 ? (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs space-y-1">
                  <div className="font-bold text-indigo-900">
                    Đã kích hoạt Thẻ tập QR & Khóa học trực tuyến
                  </div>
                  <div className="font-medium text-indigo-800">
                    Bạn có thể mở mã QR động 60 giây hoặc học video ngay trong mục Cá nhân.
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  handleCloseDrawer();
                  router.push("/dashboard/member");
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                Mở Thẻ tập QR & Đơn hàng của tôi{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="solid-card p-10 text-center space-y-3">
              <ShoppingBag
                className="mx-auto h-12 w-12 text-slate-400"
                aria-hidden="true"
              />
              <h3 className="text-base font-bold text-slate-900">
                Giỏ hàng của bạn đang trống
              </h3>
              <p className="text-xs font-medium text-slate-600 max-w-xs mx-auto text-pretty">
                Hãy chọn thêm Thực phẩm bổ sung hoặc Gói tập / Khóa học phù hợp với mục tiêu của bạn.
              </p>
            </div>
          ) : (
            <form
              id="hybrid-checkout-form"
              onSubmit={handleCheckout}
              className="space-y-6"
            >
              {/* Nhóm 1: Sản phẩm vật lý */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    <Package
                      className="h-4 w-4 text-emerald-600"
                      aria-hidden="true"
                    />
                    Sản phẩm vật lý (Giao tận nơi)
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
                        width={64}
                        height={64}
                        loading="lazy"
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
                          <span className="font-mono text-sm font-extrabold text-emerald-700 tabular-nums">
                            {(item.unitPrice * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              aria-label={`Giảm số lượng ${item.name}`}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <Minus className="h-3 w-3" aria-hidden="true" />
                            </button>
                            <span className="w-6 text-center font-mono text-xs font-bold text-slate-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Tăng số lượng ${item.name}`}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <Plus className="h-3 w-3" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                              onClick={() => removeItem(item.id)}
                              className="ml-1 rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            >
                              <Trash2
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Nhóm 2: Khóa học & Thẻ tập */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    <Zap
                      className="h-4 w-4 text-indigo-600"
                      aria-hidden="true"
                    />
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
                        width={64}
                        height={64}
                        loading="lazy"
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
                          <span className="font-mono text-sm font-extrabold text-indigo-700 tabular-nums">
                            {(item.unitPrice * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </span>
                          <button
                            type="button"
                            aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Địa chỉ giao hàng */}
              {hasPhysicalItems ? (
                <div className="solid-card p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    <Truck
                      className="h-4 w-4 text-emerald-600"
                      aria-hidden="true"
                    />
                    Địa chỉ nhận hàng
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label
                        htmlFor="cart-recipient"
                        className="block font-bold text-slate-700 mb-1"
                      >
                        Người nhận *
                      </label>
                      <input
                        id="cart-recipient"
                        name="recipientName"
                        type="text"
                        autoComplete="name"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cart-phone"
                        className="block font-bold text-slate-700 mb-1"
                      >
                        Số điện thoại *
                      </label>
                      <input
                        id="cart-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="cart-address"
                        className="block font-bold text-slate-700 mb-1"
                      >
                        Địa chỉ *
                      </label>
                      <input
                        id="cart-address"
                        name="addressLine"
                        type="text"
                        autoComplete="street-address"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cart-district"
                        className="block font-bold text-slate-700 mb-1"
                      >
                        Quận / Huyện
                      </label>
                      <input
                        id="cart-district"
                        name="district"
                        type="text"
                        autoComplete="address-level2"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cart-city"
                        className="block font-bold text-slate-700 mb-1"
                      >
                        Tỉnh / Thành phố
                      </label>
                      <input
                        id="cart-city"
                        name="city"
                        type="text"
                        autoComplete="address-level1"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Mã giảm giá & Thanh toán */}
              <div className="solid-card p-4 space-y-3">
                <label
                  htmlFor="cart-voucher"
                  className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-900"
                >
                  <Tag
                    className="h-3.5 w-3.5 text-emerald-600"
                    aria-hidden="true"
                  />
                  Mã ưu đãi & Phương thức thanh toán
                </label>
                <div className="flex gap-2">
                  <input
                    id="cart-voucher"
                    name="voucherCode"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={voucherCode}
                    onChange={(e) =>
                      setVoucherCode(e.target.value.toUpperCase())
                    }
                    placeholder="Nhập mã (VD: GYMHUB50, WHEYCOMBO)…"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher()}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_VOUCHERS.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleApplyVoucher(code)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      translate="no"
                    >
                      +{code}
                    </button>
                  ))}
                </div>
                {voucherMessage ? (
                  <p
                    className="text-xs font-bold text-emerald-700"
                    aria-live="polite"
                  >
                    {voucherMessage}
                  </p>
                ) : null}

                <div
                  role="group"
                  aria-label="Chọn cổng thanh toán"
                  className="grid grid-cols-4 gap-2 pt-2"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method}
                      type="button"
                      aria-pressed={paymentMethod === method}
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                        paymentMethod === method
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                      translate="no"
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
        {!receipt && items.length > 0 ? (
          <div className="border-t border-slate-200/80 bg-white p-5 space-y-3">
            <div className="space-y-1 text-xs font-medium">
              <div className="flex justify-between text-slate-700">
                <span>Tạm tính:</span>
                <span className="font-mono font-bold tabular-nums">
                  {subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
              {hasPhysicalItems ? (
                <div className="flex justify-between text-slate-700">
                  <span>Phí vận chuyển:</span>
                  <span className="font-mono font-bold tabular-nums">
                    {shippingFee === 0
                      ? "Miễn phí"
                      : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              ) : null}
              {discountAmount > 0 ? (
                <div className="flex justify-between text-emerald-700">
                  <span>Giảm giá:</span>
                  <span className="font-mono font-bold tabular-nums">
                    -{discountAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                <span>Tổng cộng:</span>
                <span className="font-mono text-emerald-700 tabular-nums">
                  {finalTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="hybrid-checkout-form"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting
                ? "Đang xử lý đơn hàng…"
                : `Thanh toán ngay (${finalTotal.toLocaleString("vi-VN")}đ)`}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
