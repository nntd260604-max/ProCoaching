"use client";

import React, { useEffect, useState, useCallback, startTransition } from "react";
import {
  ShieldCheck,
  Package,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Zap,
  RefreshCw,
  CheckCircle2,
  Layers,
  DollarSign,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";
import { GlassPanel, SolidCard } from "@/components/ui/Surface";

export default function AdminDashboardPage() {
  const pushToast = useHybridCartStore((s) => s.pushToast);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminData, setAdminData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "WAREHOUSE_FEFO" | "ORDERS_WEBHOOK" | "IMPORT_BATCH"
  >("WAREHOUSE_FEFO");

  const [variantId, setVariantId] = useState("var-iso100-5lb-choco");
  const [batchCode, setBatchCode] = useState("LOT-2027-ISO-99A");
  const [supplierName, setSupplierName] = useState(
    "Công ty TNHH Dinh Dưỡng Thể Thao Việt Mỹ"
  );
  const [importPrice, setImportPrice] = useState(1650000);
  const [initialQuantity, setInitialQuantity] = useState(25);
  const [manufacturedDate, setManufacturedDate] = useState("2026-10-01");
  const [expiryDate, setExpiryDate] = useState("2028-04-01");
  const [submitting, setSubmitting] = useState(false);

  const loadAdminData = useCallback(async () => {
    const res = await fetch("/api/admin/warehouse");
    const data = await res.json();
    setAdminData(data);
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleImportBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/warehouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "IMPORT_BATCH",
          variantId,
          batchCode,
          supplierName,
          importPrice,
          initialQuantity,
          manufacturedDate,
          expiryDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi nhập lô hàng");

      pushToast({
        title: `Đã nhập kho lô ${data.newBatch.batchCode} thành công!`,
        description: `Tổng tồn kho khả dụng mới của sản phẩm: ${data.updatedVariantStock} hộp.`,
        type: "success",
      });
      await loadAdminData();
      startTransition(() => setActiveTab("WAREHOUSE_FEFO"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể nhập lô";
      pushToast({ title: "Lỗi nhập kho", description: msg, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlashSaleNearExpiry = async (
    targetVariantId: string,
    productName: string
  ) => {
    const res = await fetch("/api/admin/warehouse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "FLASH_SALE",
        variantId: targetVariantId,
        discountPct: 25,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      pushToast({
        title: "Đã kích hoạt ưu đãi giảm 25% xả kho cận hạn!",
        description: `${productName} giảm còn ${data.newSalePrice.toLocaleString("vi-VN")}đ để đẩy nhanh tốc độ xuất kho.`,
        type: "success",
      });
      await loadAdminData();
    }
  };

  const handleWebhookIpn = async (orderId: string, orderCode: string) => {
    const res = await fetch("/api/admin/warehouse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "WEBHOOK_IPN",
        orderId,
      }),
    });
    if (res.ok) {
      pushToast({
        title: `Xác nhận thanh toán đơn ${orderCode}!`,
        description:
          "Trạng thái đơn hàng đã cập nhật sang Đã thanh toán & Đang giao.",
        type: "success",
      });
      await loadAdminData();
    }
  };

  const handleResetDemo = async () => {
    const res = await fetch("/api/admin/warehouse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "RESET_DEMO" }),
    });
    if (res.ok) {
      pushToast({
        title: "Đã khôi phục dữ liệu mẫu ban đầu!",
        description:
          "Toàn bộ tồn kho lô hàng và lịch tập đã trở về trạng thái chuẩn.",
        type: "info",
      });
      await loadAdminData();
    }
  };

  if (!adminData) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm font-medium text-slate-600">
        Đang tải dữ liệu Quản trị Kho & Báo cáo Doanh thu…
      </div>
    );
  }

  const { metrics, batches, nearExpiryBatches, orders, variants } = adminData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Top Admin Header */}
      <SolidCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Quản Trị
            Hệ Thống & Kho Lô Hàng
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1 text-balance">
            Quản Trị Kho Hàng Theo Hạn Dùng (FEFO) & Doanh Thu
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-1 text-pretty">
            Theo dõi tồn kho từng lô nhập, cảnh báo lô sắp hết hạn dưới 60 ngày và thống kê lợi nhuận gộp thực tế.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDemo}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors self-start md:self-auto"
        >
          <RefreshCw
            className="h-3.5 w-3.5 text-emerald-600"
            aria-hidden="true"
          />
          Khôi Phục Dữ Liệu Mẫu
        </button>
      </SolidCard>

      {/* Top Glass KPI Strip (4 Focal Glass Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Doanh Thu Gói Tập & Khóa Học</span>
            <TrendingUp
              className="h-4 w-4 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <div className="font-mono text-2xl font-extrabold text-indigo-700 mt-2 tabular-nums">
            {metrics.serviceRevenue.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">
            Biên lợi nhuận dịch vụ số: ~100%
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Doanh Thu Thực Phẩm Bổ Sung</span>
            <Package className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">
            {metrics.supplementRevenue.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 tabular-nums">
            Giá vốn lô xuất: {metrics.supplementCogs.toLocaleString("vi-VN")}đ
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Lợi Nhuận Gộp Thực Tế</span>
            <DollarSign
              className="h-4 w-4 text-emerald-600"
              aria-hidden="true"
            />
          </div>
          <div className="font-mono text-2xl font-extrabold text-emerald-600 mt-2 tabular-nums">
            +{metrics.supplementGrossProfit.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">
            Giá bán trừ Giá nhập của đúng lô đã xuất
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 border-amber-200/90">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Lô Hàng Sắp Hết Hạn (&lt;60 ngày)</span>
            <AlertTriangle
              className="h-4 w-4 text-amber-600"
              aria-hidden="true"
            />
          </div>
          <div className="font-mono text-2xl font-extrabold text-amber-600 mt-2 tabular-nums">
            {metrics.nearExpiryCount} lô cận hạn
          </div>
          <div className="text-[11px] font-semibold text-rose-600 mt-1 tabular-nums">
            {metrics.expiredCount} lô đã hết hạn (Tự động khóa xuất)
          </div>
        </GlassPanel>
      </div>

      {/* Near-Expiry Alert Strip (< 60 days) */}
      {nearExpiryBatches.length > 0 ? (
        <SolidCard className="p-6 border-amber-300 bg-amber-50/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-amber-900">
              <AlertTriangle
                className="h-5 w-5 text-amber-600 shrink-0"
                aria-hidden="true"
              />
              Cần Xử Lý: Các Lô Hàng Sắp Hết Hạn Sử Dụng (Còn Dưới 60 Ngày)
            </div>
            <span className="text-xs font-semibold text-amber-800">
              Hệ thống đang tự động ưu tiên xuất các lô này trước tiên (FEFO)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearExpiryBatches.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (b: any) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-amber-200 bg-white p-4 flex flex-col justify-between space-y-3 text-xs shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-900"
                        translate="no"
                      >
                        {b.batchCode}
                      </span>
                      <span className="font-bold text-amber-700 tabular-nums">
                        Còn {b.daysUntilExpiry} ngày
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 line-clamp-1">
                      {b.productName}
                    </div>
                    <div className="font-medium text-slate-600">
                      {b.variantFlavor} ({b.variantWeight}) • Tồn lô:{" "}
                      <strong className="text-slate-900 tabular-nums">
                        {b.remainingQuantity} hộp
                      </strong>
                    </div>
                    <div className="font-medium text-slate-600">
                      Giá vốn:{" "}
                      <span className="font-mono tabular-nums">
                        {b.importPrice.toLocaleString("vi-VN")}đ
                      </span>{" "}
                      • Giá bán:{" "}
                      <strong className="font-mono text-emerald-700 tabular-nums">
                        {(b.variantSalePrice ?? b.variantPrice).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleFlashSaleNearExpiry(b.variantId, b.productName)
                    }
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                  >
                    <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                    Kích Hoạt Flash Sale -25% Xả Kho
                  </button>
                </div>
              )
            )}
          </div>
        </SolidCard>
      ) : null}

      {/* Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Các mục quản trị kho và đơn hàng"
        className="flex flex-wrap gap-2.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "WAREHOUSE_FEFO"}
          onClick={() =>
            startTransition(() => setActiveTab("WAREHOUSE_FEFO"))
          }
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "WAREHOUSE_FEFO"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Layers className="h-4 w-4" aria-hidden="true" />
          Danh Sách Lô Hàng FEFO ({batches.length} lô)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "IMPORT_BATCH"}
          onClick={() => startTransition(() => setActiveTab("IMPORT_BATCH"))}
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "IMPORT_BATCH"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          Nhập Lô Hàng Mới
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "ORDERS_WEBHOOK"}
          onClick={() =>
            startTransition(() => setActiveTab("ORDERS_WEBHOOK"))
          }
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "ORDERS_WEBHOOK"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Đơn Hàng & Đối Soát Lô Xuất ({orders.length})
        </button>
      </div>

      {/* TAB 1: CRISP SOLID WHITE FEFO INVENTORY TABLE */}
      {activeTab === "WAREHOUSE_FEFO" ? (
        <SolidCard className="overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Bảng Quản Lý Lô Hàng Theo Thứ Tự Ưu Tiên Xuất Kho (FEFO)
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Lô có hạn sử dụng gần nhất luôn xếp trên cùng để xuất trước. Các lô đã quá hạn được khóa tự động.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase font-bold">
                <tr>
                  <th className="px-5 py-3.5">Mã Lô Hàng</th>
                  <th className="px-5 py-3.5">Sản Phẩm & Hương Vị</th>
                  <th className="px-5 py-3.5">Giá Vốn Nhập</th>
                  <th className="px-5 py-3.5">Tồn Kho Lô</th>
                  <th className="px-5 py-3.5">Hạn Sử Dụng</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {batches.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (b: any) => {
                    const statusBadge =
                      b.batchStatus === "AVAILABLE"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : b.batchStatus === "NEAR_EXPIRY"
                        ? "bg-amber-50 border-amber-300 text-amber-800"
                        : b.batchStatus === "EXPIRED"
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : "bg-slate-100 border-slate-200 text-slate-600";

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-5 py-4 font-mono font-bold text-slate-900">
                          <span translate="no">{b.batchCode}</span>
                          <div className="text-[11px] font-sans font-medium text-slate-500 mt-0.5">
                            {b.supplierName}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">
                            {b.productName}
                          </div>
                          <div className="font-medium text-slate-600 mt-0.5">
                            {b.variantFlavor} • {b.variantWeight} (Mã:{" "}
                            <span className="font-mono" translate="no">
                              {b.variantSku}
                            </span>
                            )
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-800 tabular-nums">
                          {b.importPrice.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-5 py-4 font-mono tabular-nums">
                          <span className="font-extrabold text-slate-900">
                            {b.remainingQuantity}
                          </span>{" "}
                          / {b.initialQuantity} hộp
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-mono font-bold text-slate-900 tabular-nums">
                            {b.expiryDate}
                          </div>
                          <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                            {b.daysUntilExpiry > 0
                              ? `Còn ${b.daysUntilExpiry} ngày`
                              : `Quá hạn ${Math.abs(b.daysUntilExpiry)} ngày`}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block rounded-lg border px-2.5 py-1 text-[11px] font-bold ${statusBadge}`}
                          >
                            {b.batchStatus === "AVAILABLE" ? "Còn hạn xa" : null}
                            {b.batchStatus === "NEAR_EXPIRY"
                              ? "Sắp hết hạn (<60 ngày)"
                              : null}
                            {b.batchStatus === "EXPIRED"
                              ? "Đã hết hạn (Khóa xuất)"
                              : null}
                            {b.batchStatus === "DEPLETED" ? "Đã xuất hết" : null}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </SolidCard>
      ) : null}

      {/* TAB 2: IMPORT NEW BATCH FORM */}
      {activeTab === "IMPORT_BATCH" ? (
        <form
          onSubmit={handleImportBatch}
          className="max-w-3xl solid-card p-6 sm:p-8 space-y-5"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Phiếu Nhập Kho Lô Mới
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Nhập Lô Hàng Thực Phẩm Bổ Sung Vào Kho
            </h2>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Hệ thống sẽ tự động xếp thứ tự ưu tiên xuất kho theo ngày hết hạn và cộng dồn số lượng tồn kho.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label
                htmlFor="admin-variant"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Chọn Sản Phẩm & Hương Vị *
              </label>
              <select
                id="admin-variant"
                name="variantId"
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900"
              >
                {variants.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (v: any) => (
                    <option key={v.id} value={v.id}>
                      [{v.sku}] {v.productName} — {v.flavor} ({v.weightLabel})
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="admin-batch-code"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Mã Số Lô Hàng *
              </label>
              <input
                id="admin-batch-code"
                name="batchCode"
                type="text"
                autoComplete="off"
                spellCheck={false}
                required
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="admin-supplier"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Nhà Phân Phối / Nguồn Nhập
              </label>
              <input
                id="admin-supplier"
                name="supplierName"
                type="text"
                autoComplete="off"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-medium text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="admin-import-price"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Giá Vốn Nhập Kho / Hộp (VNĐ) *
              </label>
              <input
                id="admin-import-price"
                name="importPrice"
                type="number"
                inputMode="numeric"
                required
                min={50000}
                step={10000}
                value={importPrice}
                onChange={(e) => setImportPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono font-bold text-emerald-700 tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="admin-initial-qty"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Số Lượng Nhập (Hộp) *
              </label>
              <input
                id="admin-initial-qty"
                name="initialQuantity"
                type="number"
                inputMode="numeric"
                required
                min={1}
                max={1000}
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono font-bold text-slate-900 tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="admin-mfg-date"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Ngày Sản Xuất
              </label>
              <input
                id="admin-mfg-date"
                name="manufacturedDate"
                type="date"
                value={manufacturedDate}
                onChange={(e) => setManufacturedDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="admin-exp-date"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Ngày Hết Hạn Sử Dụng *
              </label>
              <input
                id="admin-exp-date"
                name="expiryDate"
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono font-bold text-indigo-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            {submitting
              ? "Đang lưu phiếu nhập kho…"
              : "Xác Nhận Nhập Lô Hàng Mới"}
          </button>
        </form>
      ) : null}

      {/* TAB 3: ORDERS & FEFO BATCH TRACEABILITY */}
      {activeTab === "ORDERS_WEBHOOK" ? (
        <div className="space-y-4">
          {orders.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (ord: any) => (
              <SolidCard key={ord.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span
                      className="font-mono text-base font-extrabold text-slate-900"
                      translate="no"
                    >
                      Đơn hàng: {ord.orderCode}
                    </span>
                    <span className="ml-3 font-medium text-slate-600">
                      Khách hàng:{" "}
                      <strong className="text-slate-900">
                        {ord.customerName}
                      </strong>{" "}
                      ({ord.customerEmail})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-lg bg-slate-100 px-3 py-1 font-bold text-slate-700"
                      translate="no"
                    >
                      {ord.paymentMethod}
                    </span>
                    <span
                      className={`rounded-lg px-3 py-1 font-bold ${
                        ord.paymentStatus === "PAID"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                    <span className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1 font-bold text-indigo-700">
                      Giao vận: {ord.fulfillmentStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleWebhookIpn(ord.id, ord.orderCode)}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      Xác nhận Webhook ({ord.paymentMethod})
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {ord.items.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (item: any) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900">
                            {item.itemNameSnapshot} (x{item.quantity})
                          </div>
                          {item.allocatedBatchCode ? (
                            <div className="flex flex-wrap items-center gap-3 text-[11px]">
                              <span
                                className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono font-bold text-emerald-700"
                                translate="no"
                              >
                                Xuất từ lô: {item.allocatedBatchCode}
                              </span>
                              <span className="font-mono font-medium text-slate-600 tabular-nums">
                                HSD: {item.allocatedBatchExpiry}
                              </span>
                              {item.allocatedBatchImportPrice ? (
                                <span className="font-mono text-indigo-700 font-semibold tabular-nums">
                                  Giá vốn:{" "}
                                  {item.allocatedBatchImportPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ → Lãi gộp: +
                                  {(
                                    (item.unitPrice -
                                      item.allocatedBatchImportPrice) *
                                    item.quantity
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="inline-block rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                              Gói Tập / Khóa Học Video — Đã mở thẻ hội viên
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-sm font-extrabold text-slate-900 tabular-nums">
                          {item.lineTotal.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    )
                  )}
                </div>
              </SolidCard>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
