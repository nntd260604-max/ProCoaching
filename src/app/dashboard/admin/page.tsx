"use client";

import React, { useEffect, useState, useCallback } from "react";
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

export default function AdminDashboardPage() {
  const { pushToast } = useHybridCartStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminData, setAdminData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"WAREHOUSE_FEFO" | "ORDERS_WEBHOOK" | "IMPORT_BATCH">(
    "WAREHOUSE_FEFO"
  );

  // Form Nhập lô hàng mới (InventoryBatch)
  const [variantId, setVariantId] = useState("var-iso100-5lb-choco");
  const [batchCode, setBatchCode] = useState("LOT-2027-ISO-99A");
  const [supplierName, setSupplierName] = useState("Công ty TNHH Dinh Dưỡng Thể Thao Việt Mỹ");
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
        description: `Tổng tồn kho khả dụng mới của biến thể: ${data.updatedVariantStock} hộp.`,
        type: "success",
      });
      await loadAdminData();
      setActiveTab("WAREHOUSE_FEFO");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể nhập lô";
      pushToast({ title: "Lỗi nhập kho", description: msg, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlashSaleNearExpiry = async (targetVariantId: string, productName: string) => {
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
        title: "Đã kích hoạt Flash Sale -25% xả kho cận date!",
        description: `${productName} giảm còn ${data.newSalePrice.toLocaleString("vi-VN")}đ để đẩy nhanh lô FEFO.`,
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
        title: `Webhook IPN Xác nhận Thanh toán Đơn ${orderCode}!`,
        description: "Trạng thái đơn chuyển sang PAID & SHIPPING.",
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
        title: "Đã khôi phục dữ liệu mẫu gốc (19 bảng)!",
        description: "Sẵn sàng cho lượt thuyết trình bảo vệ đồ án tiếp theo.",
        type: "info",
      });
      await loadAdminData();
    }
  };

  if (!adminData) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-400">
        Đang tải Hệ thống Quản trị Kho Lô Hàng FEFO & Báo cáo Tài chính...
      </div>
    );
  }

  const { metrics, batches, nearExpiryBatches, orders, variants } = adminData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-6">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Phân Hệ Quản Trị Viên (Admin FEFO Warehouse & COGS Analytics)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Trung Tâm Điều Hành Đa Luồng & Quản Trị Lô Hàng FEFO
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tách bạch Doanh thu Dịch vụ (Khóa học/Thẻ tập) và Lợi nhuận gộp Thực phẩm bổ sung (`Giá bán - Giá vốn lô FEFO`).
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDemo}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 self-start md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
          Khôi Phục Dữ Liệu Gốc (Reset Demo)
        </button>
      </div>

      {/* Multi-Stream Analytics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Doanh Thu Dịch Vụ Số (Gói Tập/Video)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {metrics.serviceRevenue.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Biên lợi nhuận gộp dịch vụ: ~100%
          </div>
        </div>

        <div className="rounded-2xl border border-orange-500/30 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Doanh Thu Thực Phẩm Bổ Sung</span>
            <Package className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400 mt-2">
            {metrics.supplementRevenue.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Giá vốn lô xuất (COGS): {metrics.supplementCogs.toLocaleString("vi-VN")}đ
          </div>
        </div>

        <div className="rounded-2xl border border-sky-500/30 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lợi Nhuận Gộp Thực Phẩm Bổ Sung</span>
            <DollarSign className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 mt-2">
            +{metrics.supplementGrossProfit.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Tính chính xác từ `unit_price - batch.import_price`
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>Cảnh Báo Lô Hàng Cận Date (&lt;60 ngày)</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {metrics.nearExpiryCount} lô cận date
          </div>
          <div className="text-[11px] text-rose-400 mt-1 font-medium">
            {metrics.expiredCount} lô đã hết hạn (Tự động khóa xuất kho)
          </div>
        </div>
      </div>

      {/* Cảnh báo nổi bật các Lô hàng Cận Date (< 60 ngày) */}
      {nearExpiryBatches.length > 0 && (
        <div className="rounded-3xl border border-amber-500/50 bg-amber-950/20 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-black text-amber-300">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              CẢNH BÁO NỔI BẬT: CÁC LÔ HÀNG CẬN DATE (HẠN SỬ DỤNG CÒN DƯỚI 60 NGÀY)
            </div>
            <span className="text-xs text-amber-200/80">
              Thuật toán FEFO đang tự động ưu tiên xuất các lô này trước tiên!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearExpiryBatches.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (b: any) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-amber-500/40 bg-slate-950/90 p-4 flex flex-col justify-between space-y-3 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-amber-500 px-2 py-0.5 font-mono text-[11px] font-black text-slate-950">
                        {b.batchCode}
                      </span>
                      <span className="font-bold text-amber-400">
                        Còn {b.daysUntilExpiry} ngày
                      </span>
                    </div>
                    <div className="font-bold text-white line-clamp-1">{b.productName}</div>
                    <div className="text-slate-400">
                      {b.variantFlavor} ({b.variantWeight}) • Tồn lô:{" "}
                      <strong className="text-white">{b.remainingQuantity} hộp</strong>
                    </div>
                    <div className="text-slate-400">
                      Giá vốn nhập: {b.importPrice.toLocaleString("vi-VN")}đ • Giá bán hiện tại:{" "}
                      <strong className="text-emerald-400">
                        {(b.variantSalePrice ?? b.variantPrice).toLocaleString("vi-VN")}đ
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFlashSaleNearExpiry(b.variantId, b.productName)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-amber-300"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Tạo Nhanh Flash Sale -25% Xả Kho Lô Cận Date
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab("WAREHOUSE_FEFO")}
          className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-xs sm:text-sm font-bold transition ${
            activeTab === "WAREHOUSE_FEFO"
              ? "border-amber-400 bg-amber-400 text-slate-950"
              : "border-slate-800 bg-slate-900 text-slate-300"
          }`}
        >
          <Layers className="h-4 w-4" />
          1. Danh Sách Kho Lô Hàng Chuẩn FEFO ({batches.length} lô)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("IMPORT_BATCH")}
          className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-xs sm:text-sm font-bold transition ${
            activeTab === "IMPORT_BATCH"
              ? "border-emerald-500 bg-emerald-500 text-slate-950"
              : "border-slate-800 bg-slate-900 text-slate-300"
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          2. Nhập Lô Hàng Mới (`inventory_batches`)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ORDERS_WEBHOOK")}
          className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-xs sm:text-sm font-bold transition ${
            activeTab === "ORDERS_WEBHOOK"
              ? "border-orange-500 bg-orange-500 text-slate-950"
              : "border-slate-800 bg-slate-900 text-slate-300"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          3. Quản Lý Đơn Hàng Hỗn Hợp & Webhook IPN ({orders.length})
        </button>
      </div>

      {/* TAB 1: BẢNG KHO LÔ HÀNG CHUẨN FEFO */}
      {activeTab === "WAREHOUSE_FEFO" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-white">
                Bảng Quản Lý Tất Cả Lô Hàng Thực Phẩm Bổ Sung (`inventory_batches`)
              </h2>
              <p className="text-xs text-slate-400">
                Sắp xếp theo `expiry_date ASC` (FEFO). Màu sắc tự động phân loại: Xanh (`AVAILABLE`), Vàng cam (`NEAR_EXPIRY` &lt;60 ngày), Đỏ (`EXPIRED`).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/90 text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3.5">Mã Lô (`batch_code`)</th>
                  <th className="px-4 py-3.5">Sản Phẩm & Biến Thể</th>
                  <th className="px-4 py-3.5">Giá Nhập (`import_price`)</th>
                  <th className="px-4 py-3.5">Tồn Kho Lô</th>
                  <th className="px-4 py-3.5">Hạn Sử Dụng (`EXP`)</th>
                  <th className="px-4 py-3.5">Trạng Thái FEFO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {batches.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (b: any) => {
                    const statusBadge =
                      b.batchStatus === "AVAILABLE"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : b.batchStatus === "NEAR_EXPIRY"
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : b.batchStatus === "EXPIRED"
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                        : "bg-slate-800 border-slate-700 text-slate-400";

                    return (
                      <tr key={b.id} className="hover:bg-slate-950/50">
                        <td className="px-4 py-3.5 font-mono font-bold text-white">
                          {b.batchCode}
                          <div className="text-[10px] font-sans text-slate-500">
                            {b.supplierName}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-white">{b.productName}</div>
                          <div className="text-slate-400">
                            {b.variantFlavor} • {b.variantWeight} (SKU: {b.variantSku})
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-orange-400">
                          {b.importPrice.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-black text-white">{b.remainingQuantity}</span> /{" "}
                          {b.initialQuantity} hộp
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-white">{b.expiryDate}</div>
                          <div className="text-[11px] text-slate-400">
                            {b.daysUntilExpiry > 0
                              ? `Còn ${b.daysUntilExpiry} ngày`
                              : `Quá hạn ${Math.abs(b.daysUntilExpiry)} ngày`}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block rounded-lg border px-2.5 py-1 text-[11px] font-black ${statusBadge}`}
                          >
                            {b.batchStatus === "AVAILABLE" && "AVAILABLE (Hạn xa)"}
                            {b.batchStatus === "NEAR_EXPIRY" && "NEAR_EXPIRY (Cận date <60d)"}
                            {b.batchStatus === "EXPIRED" && "EXPIRED (Đã khóa xuất)"}
                            {b.batchStatus === "DEPLETED" && "DEPLETED (Đã xuất hết)"}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FORM NHẬP LÔ HÀNG MỚI */}
      {activeTab === "IMPORT_BATCH" && (
        <form
          onSubmit={handleImportBatch}
          className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/85 p-6 sm:p-8 space-y-5"
        >
          <div>
            <span className="text-xs font-bold uppercase text-emerald-400">
              Warehouse Batch Inbound (`inventory_batches`)
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">
              Nhập Lô Hàng Thực Phẩm Bổ Sung Mới Vào Kho FEFO
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sau khi nhập lô mới, hệ thống tự động phân loại trạng thái hạn dùng và cộng dồn tồn kho khả dụng lên `supplement_variants`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1.5">
                Chọn Biến Thể Sản Phẩm (`variant_id`) *
              </label>
              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white"
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
              <label className="block font-bold text-slate-300 mb-1.5">
                Mã Số Lô (`batch_code`) *
              </label>
              <input
                type="text"
                required
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono font-bold text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Nhà Phân Phối (`supplier_name`)
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Giá Vốn Nhập Kho / Hộp (`import_price` VNĐ) *
              </label>
              <input
                type="number"
                required
                min={50000}
                step={10000}
                value={importPrice}
                onChange={(e) => setImportPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Số Lượng Nhập (`initial_quantity`) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={1000}
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-bold text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Ngày Sản Xuất (`manufactured_date`)
              </label>
              <input
                type="date"
                value={manufacturedDate}
                onChange={(e) => setManufacturedDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Ngày Hết Hạn (`expiry_date` - Quyết định thứ tự FEFO) *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-bold text-orange-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
          >
            {submitting
              ? "Đang lưu lô hàng mới & cộng dồn tồn kho..."
              : "Xác Nhận Nhập Lô Hàng Vào Kho FEFO"}
          </button>
        </form>
      )}

      {/* TAB 3: QUẢN LÝ ĐƠN HÀNG HỖN HỢP & WEBHOOK IPN */}
      {activeTab === "ORDERS_WEBHOOK" && (
        <div className="space-y-4">
          {orders.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (ord: any) => (
              <div
                key={ord.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-base font-black text-white">
                      Đơn hàng: {ord.orderCode}
                    </span>
                    <span className="ml-3 text-slate-400">
                      Khách hàng: <strong className="text-slate-200">{ord.customerName}</strong> (
                      {ord.customerEmail})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-800 px-3 py-1 font-bold text-slate-200">
                      Cổng: {ord.paymentMethod}
                    </span>
                    <span
                      className={`rounded-lg px-3 py-1 font-black ${
                        ord.paymentStatus === "PAID"
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-amber-400 text-slate-950"
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                    <span className="rounded-lg bg-slate-800 px-3 py-1 font-bold text-sky-400">
                      Giao vận: {ord.fulfillmentStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleWebhookIpn(ord.id, ord.orderCode)}
                      className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-bold text-emerald-300 hover:bg-emerald-500/25"
                    >
                      Mô Phỏng Webhook IPN ({ord.paymentMethod})
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {ord.items.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (item: any) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-slate-950 p-3.5 border border-slate-800"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-white">
                            [{item.itemType}] {item.itemNameSnapshot} (x{item.quantity})
                          </div>
                          {item.allocatedBatchCode ? (
                            <div className="flex flex-wrap items-center gap-3 text-[11px]">
                              <span className="rounded bg-orange-500/20 border border-orange-500/40 px-2 py-0.5 font-mono font-bold text-orange-300">
                                Truy vết Lô FEFO đã xuất: {item.allocatedBatchCode}
                              </span>
                              <span className="text-slate-400">
                                Hạn dùng lô: {item.allocatedBatchExpiry}
                              </span>
                              {item.allocatedBatchImportPrice && (
                                <span className="text-emerald-400 font-semibold">
                                  Giá vốn lô:{" "}
                                  {item.allocatedBatchImportPrice.toLocaleString("vi-VN")}đ → Lãi gộp: +
                                  {(
                                    (item.unitPrice - item.allocatedBatchImportPrice) *
                                    item.quantity
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-block rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                              Gói Tập / Khóa Học Video — Đã cấp thẻ `user_enrollments`
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-black text-white">
                          {item.lineTotal.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

