"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  Search,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

interface SupplementProductItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  brand: string;
  originCountry: string;
  description: string;
  nutritionFacts: {
    servingSize: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    caffeineMg?: number;
  };
  allergenTags: string[];
  targetGoal: string;
  variants: {
    id: string;
    sku: string;
    flavor: string;
    weightLabel: string;
    servingsCount: number;
    price: number;
    salePrice: number | null;
    stockQuantity: number;
    imageUrl: string;
    nextFefoBatch: {
      batchCode: string;
      expiryDate: string;
      batchStatus: string;
    } | null;
  }[];
}

export default function SupplementsPage() {
  const { addItem } = useHybridCartStore();
  const [products, setProducts] = useState<SupplementProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedGoal, setSelectedGoal] = useState("ALL");
  const [lactoseFreeOnly, setLactoseFreeOnly] = useState(false);
  const [caffeineFreeOnly, setCaffeineFreeOnly] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        if (data.supplements) setProducts(data.supplements);
      })
      .catch(() => {});
  }, []);

  const filtered = products.filter((p) => {
    if (
      search.trim() !== "" &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.brand.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (selectedCategory !== "ALL" && p.categoryId !== selectedCategory) return false;
    if (selectedGoal !== "ALL" && p.targetGoal !== selectedGoal) return false;
    if (lactoseFreeOnly && p.allergenTags.includes("LACTOSE")) return false;
    if (caffeineFreeOnly && p.allergenTags.includes("HIGH_CAFFEINE")) return false;
    return true;
  });

  const goalBadgeMap: Record<string, string> = {
    MUSCLE_GAIN: "Tăng cơ",
    FAT_LOSS: "Giảm mỡ",
    ENDURANCE: "Tăng sức bền",
    RECOVERY: "Phục hồi cơ",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {/* Top Focal Glass Filter Bar */}
      <div className="glass-panel p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <Package className="h-3.5 w-3.5" />
              Thực Phẩm Bổ Sung Chính Hãng • Xuất Kho Theo Hạn Dùng Mới Nhất
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Cửa Hàng Thực Phẩm Bổ Sung
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-700">
              Lọc nhanh sản phẩm theo mục tiêu tập luyện và thành phần an toàn cho cơ địa của bạn.
            </p>
          </div>
          <span className="rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700">
            Hiển thị {filtered.length} sản phẩm
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên Whey, Creatine, Pre-Workout..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">Tất cả danh mục</option>
            <option value="cat-whey">Whey Protein Tăng Cơ</option>
            <option value="cat-pre">Pre-Workout & Tăng Sức Bền</option>
            <option value="cat-creatine">Creatine & Phục Hồi Cơ</option>
            <option value="cat-plant">Đạm Thực Vật & Giảm Mỡ</option>
          </select>

          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">Tất cả mục tiêu</option>
            <option value="MUSCLE_GAIN">Tăng cơ nạc</option>
            <option value="FAT_LOSS">Giảm mỡ siết cơ</option>
            <option value="ENDURANCE">Tăng sức bền</option>
            <option value="RECOVERY">Phục hồi cơ</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLactoseFreeOnly(!lactoseFreeOnly)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                lactoseFreeOnly
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Không Lactose
            </button>
            <button
              type="button"
              onClick={() => setCaffeineFreeOnly(!caffeineFreeOnly)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                caffeineFreeOnly
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Không Caffeine
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid: 3 Columns, Solid White Cards, Max 4 Clean Items per Card */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((prod) => {
          const primaryVar = prod.variants[0];
          if (!primaryVar) return null;
          const unitPrice = primaryVar.salePrice ?? primaryVar.price;

          return (
            <div
              key={prod.id}
              className="solid-card p-6 flex flex-col justify-between hover:border-emerald-300 transition"
            >
              <div className="space-y-4">
                {/* 1. Image */}
                <Link
                  href={`/supplements/${prod.slug}`}
                  className="block overflow-hidden rounded-xl border border-slate-100 bg-slate-50 h-52"
                >
                  <img
                    src={primaryVar.imageUrl}
                    alt={prod.name}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                  />
                </Link>

                {/* 2. Up to 2 Badges (Goal + Allergen status) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {goalBadgeMap[prod.targetGoal] || prod.targetGoal} •{" "}
                    {prod.nutritionFacts.proteinGrams}g Protein
                  </span>
                  {prod.allergenTags.length === 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Không gây dị ứng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      Có {prod.allergenTags.join(", ")}
                    </span>
                  )}
                </div>

                {/* 3. Brand + Name */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {prod.brand} • {prod.originCountry}
                  </div>
                  <Link
                    href={`/supplements/${prod.slug}`}
                    className="mt-1 block text-lg font-bold text-slate-900 hover:text-emerald-600 line-clamp-2"
                  >
                    {prod.name}
                  </Link>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {primaryVar.flavor} • {primaryVar.weightLabel}
                  </p>
                </div>
              </div>

              {/* 4. Price + Add to Cart Button */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xl font-extrabold text-slate-900">
                    {unitPrice.toLocaleString("vi-VN")}đ
                  </div>
                  {primaryVar.salePrice && (
                    <div className="font-mono text-xs text-slate-400 line-through">
                      {primaryVar.price.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/supplements/${prod.slug}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: primaryVar.id,
                        itemType: "SUPPLEMENT_VARIANT",
                        supplementVariantId: primaryVar.id,
                        name: prod.name,
                        subtitle: `${primaryVar.flavor} • ${primaryVar.weightLabel}`,
                        unitPrice,
                        imageUrl: primaryVar.imageUrl,
                        skuOrBadge: primaryVar.sku,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Thêm giỏ
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
