"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  CalendarClock,
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
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm font-medium text-slate-600">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const unitPrice = activeVariant.salePrice ?? activeVariant.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <Link
        href="/supplements"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Cửa hàng Thực phẩm bổ sung
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Product Image & Crisp Nutrition Facts Table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="solid-card p-4 overflow-hidden">
            <img
              src={activeVariant.imageUrl}
              alt={product.name}
              className="h-80 w-full rounded-xl object-cover bg-slate-50"
            />
          </div>

          <div className="solid-card p-6 space-y-4">
            <div className="border-b-2 border-slate-900 pb-3">
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                Bảng Thành Phần Dinh Dưỡng
              </h3>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Khẩu phần mỗi lần dùng:{" "}
                <strong className="text-slate-900">{product.nutritionFacts.servingSize}</strong> •{" "}
                <strong className="text-slate-900">{activeVariant.servingsCount} lần dùng/hộp</strong>
              </p>
            </div>

            <div className="flex items-baseline justify-between border-b border-slate-200 py-2">
              <span className="text-sm font-bold text-slate-900">Năng lượng (Calories)</span>
              <span className="font-mono text-2xl font-extrabold text-emerald-600">
                {product.nutritionFacts.calories} kcal
              </span>
            </div>

            <div className="space-y-2.5 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-2">
                <span className="font-bold text-slate-800">Chất đạm (Protein)</span>
                <span className="font-mono font-extrabold text-emerald-700">
                  {product.nutritionFacts.proteinGrams}g
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-medium text-slate-600">Tinh bột (Carbohydrate)</span>
                <span className="font-mono font-bold text-slate-900">
                  {product.nutritionFacts.carbsGrams}g
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-medium text-slate-600">Chất béo (Fat)</span>
                <span className="font-mono font-bold text-slate-900">
                  {product.nutritionFacts.fatGrams}g
                </span>
              </div>
              {product.nutritionFacts.bcaaGrams !== undefined && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-600">Axit amin BCAA</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {product.nutritionFacts.bcaaGrams}g
                  </span>
                </div>
              )}
              {product.nutritionFacts.caffeineMg !== undefined && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-600">Hàm lượng Caffeine</span>
                  <span className="font-mono font-bold text-amber-600">
                    {product.nutritionFacts.caffeineMg} mg
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Info, Variant Selector, Nearest Expiry Batch & Add to Cart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="solid-card p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  {product.brand} • Xuất xứ {product.originCountry}
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
                  Mã: {activeVariant.sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {product.name}
              </h1>
              <p className="text-sm font-medium leading-relaxed text-slate-700">
                {product.description}
              </p>
            </div>

            {/* Allergen Badge */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              {product.allergenTags.length === 0 ? (
                <div className="flex items-center gap-2.5 text-xs font-medium text-emerald-800">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>An toàn dị ứng:</strong> Không chứa đường sữa Lactose, không Gluten, không Caffeine liều cao.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-xs font-medium text-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>
                    <strong>Lưu ý thành phần:</strong> Sản phẩm có chứa{" "}
                    <strong className="underline">{product.allergenTags.join(", ")}</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* Variant Selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Chọn Hương Vị & Trọng Lượng
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
                      className={`flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/60"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">{v.flavor}</div>
                        <div className="text-xs font-medium text-slate-600 mt-0.5">
                          {v.weightLabel} • {v.servingsCount} lần dùng
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-mono text-base font-extrabold text-emerald-700">
                          {vPrice.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          Còn {v.stockQuantity} hộp
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nearest FEFO Batch Info */}
            {activeVariant.nextFefoBatch && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-emerald-900">
                  <CalendarClock className="h-4 w-4 text-emerald-600" />
                  <span>
                    Lô hàng xuất kho hiện tại:{" "}
                    <strong className="font-mono">{activeVariant.nextFefoBatch.batchCode}</strong>
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-800">
                  Hạn sử dụng: {activeVariant.nextFefoBatch.expiryDate}
                </span>
              </div>
            )}

            {/* Price & Add to Cart */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Đơn giá bán</div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-mono text-3xl font-extrabold text-slate-900">
                      {unitPrice.toLocaleString("vi-VN")}đ
                    </span>
                    {activeVariant.salePrice && (
                      <span className="font-mono text-sm text-slate-400 line-through">
                        {activeVariant.price.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                  <input
                    type="number"
                    min={1}
                    max={activeVariant.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-center font-mono text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition"
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm Vào Giỏ Hàng ({(unitPrice * quantity).toLocaleString("vi-VN")}đ)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
