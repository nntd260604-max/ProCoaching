"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

interface VariantDetail {
  id: string;
  sku: string;
  flavor: string;
  weightLabel: string;
  servingsCount: number;
  weightGrams: number;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  imageUrl: string;
  batches: {
    id: string;
    batchCode: string;
    expiryDate: string;
    remainingQuantity: number;
    batchStatus: string;
  }[];
  nextFefoBatch: {
    batchCode: string;
    expiryDate: string;
  } | null;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  brand: string;
  originCountry: string;
  categoryName: string;
  description: string;
  allergenTags: string[];
  targetGoal: string;
  nutritionFacts: {
    servingSize: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    bcaaGrams?: number;
    caffeineMg?: number;
    creatineGrams?: number;
  };
  variants: VariantDetail[];
}

export default function SupplementDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const { addItem, setCartOpen } = useHybridCartStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.supplements || []).find(
          (p: ProductDetail) => p.slug === slug
        );
        if (found) {
          setProduct(found);
          if (found.variants?.[0]) {
            setSelectedVariantId(found.variants[0].id);
          }
        }
      });
  }, [slug]);

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-400">
        Đang tải thông tin chi tiết sản phẩm & lô hàng FEFO...
      </div>
    );
  }

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const unitPrice = activeVariant.salePrice ?? activeVariant.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <Link
        href="/supplements"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Cửa hàng Thực phẩm bổ sung
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Image & Nutrition Facts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <img
              src={activeVariant.imageUrl}
              alt={product.name}
              className="h-96 w-full object-cover"
            />
          </div>

          {/* Bảng Nutrition Facts chuẩn */}
          <div className="rounded-3xl border-2 border-slate-700 bg-slate-950 p-6 space-y-3">
            <div className="border-b-4 border-white pb-2">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                Nutrition Facts
              </h3>
              <p className="text-xs text-slate-300">
                Khẩu phần mỗi lần dùng (Serving Size):{" "}
                <strong>{product.nutritionFacts.servingSize}</strong>
              </p>
              <p className="text-xs text-slate-400">
                Số lần dùng mỗi hộp: <strong>{activeVariant.servingsCount} muỗng</strong>
              </p>
            </div>

            <div className="flex items-baseline justify-between border-b-2 border-slate-700 py-2">
              <span className="text-base font-black text-white">Calories (Năng lượng)</span>
              <span className="text-2xl font-black text-emerald-400">
                {product.nutritionFacts.calories} Kcal
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-800">
              <div className="flex justify-between pt-2">
                <span className="font-bold text-white">Protein (Chất đạm tinh khiết)</span>
                <span className="font-black text-emerald-400">
                  {product.nutritionFacts.proteinGrams}g
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-300">Total Carbohydrate (Tinh bột)</span>
                <span className="font-bold text-white">
                  {product.nutritionFacts.carbsGrams}g
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-300">Total Fat (Chất béo)</span>
                <span className="font-bold text-white">{product.nutritionFacts.fatGrams}g</span>
              </div>
              {product.nutritionFacts.bcaaGrams !== undefined && (
                <div className="flex justify-between pt-2">
                  <span className="text-slate-300">BCAAs Tự nhiên (Leucine, Isoleucine, Valine)</span>
                  <span className="font-bold text-orange-400">
                    {product.nutritionFacts.bcaaGrams}g
                  </span>
                </div>
              )}
              {product.nutritionFacts.caffeineMg !== undefined && (
                <div className="flex justify-between pt-2">
                  <span className="text-slate-300">Hàm lượng Caffeine</span>
                  <span className="font-bold text-amber-400">
                    {product.nutritionFacts.caffeineMg} mg
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Info & Variant Picker + FEFO Batch Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-xs font-bold text-orange-400">
                {product.brand} • Xuất xứ {product.originCountry}
              </span>
              <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-mono text-slate-300">
                SKU: {activeVariant.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">{product.name}</h1>
            <p className="text-sm leading-relaxed text-slate-300">{product.description}</p>
          </div>

          {/* Cảnh báo dị ứng */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            {product.allergenTags.length === 0 ? (
              <div className="flex items-center gap-2.5 text-xs text-emerald-300">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <strong>Chứng nhận An Toàn Dị Ứng (`allergen_tags = []`):</strong> Sản phẩm không chứa đường sữa Lactose, không Gluten, không Caffeine liều cao.
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-xs text-amber-300">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <strong>Cảnh báo thành phần dị ứng (`allergen_tags`):</strong> Sản phẩm có chứa{" "}
                  <span className="font-black underline">
                    {product.allergenTags.join(", ")}
                  </span>
                  . Học viên dị ứng với thành phần này sẽ được AI tự động lọc sang dòng Isolate/Plant.
                </div>
              </div>
            )}
          </div>

          {/* Chọn Biến thể Hương vị & Trọng lượng */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Chọn Biến Thể Hương Vị & Quy Cách Đóng Gói (`supplement_variants`):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.variants.map((v) => {
                const isSelected = v.id === activeVariant.id;
                const vPrice = v.salePrice ?? v.price;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/15"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{v.flavor}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {v.weightLabel} • {v.servingsCount} lần dùng
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-base font-black text-orange-400">
                        {vPrice.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        Tồn kho: {v.stockQuantity} hộp
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Giá & Nút Mua */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Đơn giá bán ưu đãi</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-emerald-400">
                    {unitPrice.toLocaleString("vi-VN")}đ
                  </span>
                  {activeVariant.salePrice && (
                    <span className="text-sm text-slate-500 line-through">
                      {activeVariant.price.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Số lượng:</span>
                <input
                  type="number"
                  min={1}
                  max={activeVariant.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-center text-sm font-bold text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  addItem({
                    id: activeVariant.id,
                    itemType: "SUPPLEMENT_VARIANT",
                    supplementVariantId: activeVariant.id,
                    name: product.name,
                    subtitle: `${activeVariant.flavor} • ${activeVariant.weightLabel}`,
                    unitPrice,
                    quantity,
                    imageUrl: activeVariant.imageUrl,
                    skuOrBadge: activeVariant.sku,
                  });
                  setCartOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 hover:opacity-95"
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm Vào Giỏ Hàng Hỗn Hợp ({(unitPrice * quantity).toLocaleString("vi-VN")}đ)
              </button>
            </div>
          </div>

          {/* Minh bạch Danh sách Lô hàng FEFO của Biến thể này */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Layers className="h-4 w-4" />
              Thứ Tự Xuất Kho Lô Hàng Tự Động Theo Chuẩn FEFO (`inventory_batches`)
            </div>
            <p className="text-xs text-slate-400">
              Khi bạn bấm thanh toán, hệ thống tự động chọn lô còn hạn sử dụng có{" "}
              <code className="text-orange-300">expiry_date ASC</code> sớm nhất để xuất trước, đồng thời khóa các lô đã hết hạn.
            </p>
            <div className="space-y-2">
              {activeVariant.batches.map((b, idx) => (
                <div
                  key={b.id}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-xs ${
                    b.batchStatus === "EXPIRED"
                      ? "border-rose-500/30 bg-rose-950/20 text-rose-300"
                      : idx === 0
                      ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                      : "border-slate-800 bg-slate-950 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{b.batchCode}</span>
                    {b.batchStatus !== "EXPIRED" && idx === 0 && (
                      <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                        Ưu tiên xuất FEFO #1
                      </span>
                    )}
                    {b.batchStatus === "NEAR_EXPIRY" && (
                      <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        Cận date (&lt; 60 ngày)
                      </span>
                    )}
                    {b.batchStatus === "EXPIRED" && (
                      <span className="rounded bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">
                        Đã hết hạn (Tự động bỏ qua)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Hạn dùng: {b.expiryDate}</span>
                    <span className="font-bold">Tồn lô: {b.remainingQuantity} hộp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

