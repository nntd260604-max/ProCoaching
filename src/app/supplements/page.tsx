"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Filter,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  Search,
  Sparkles,
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
    MUSCLE_GAIN: "Tăng cơ (Muscle Gain)",
    FAT_LOSS: "Giảm mỡ (Fat Loss)",
    ENDURANCE: "Tăng sức bền (Endurance)",
    RECOVERY: "Phục hồi cơ (Recovery)",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/30 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-xs font-bold text-orange-400">
          <Package className="h-3.5 w-3.5" />
          Quản Lý Tồn Kho Lô Hàng Chuẩn FEFO (First Expired, First Out)
        </div>
        <h1 className="mt-3 text-2xl sm:text-4xl font-black text-white">
          Cửa Hàng Thực Phẩm Bổ Sung Chính Hãng
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl">
          Mỗi sản phẩm đều công khai bảng thành phần{" "}
          <strong className="text-white">Nutrition Facts</strong>, nhãn cảnh báo dị ứng{" "}
          <strong className="text-amber-400">Allergen Tags</strong> và mã lô hàng{" "}
          <strong className="text-emerald-400">FEFO Batch</strong> sẽ được xuất kho khi bạn đặt mua.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên Whey, Creatine, Pre-Workout..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
          >
            <option value="ALL">Tất cả Danh mục Thực phẩm bổ sung</option>
            <option value="cat-whey">Whey Protein Tăng Cơ</option>
            <option value="cat-pre">Pre-Workout & Tăng Sức Bền</option>
            <option value="cat-creatine">Creatine & Phục Hồi Cơ</option>
            <option value="cat-plant">Đạm Thực Vật & Giảm Mỡ</option>
          </select>

          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
          >
            <option value="ALL">Tất cả Mục tiêu Tập luyện</option>
            <option value="MUSCLE_GAIN">Tăng cơ nạc (Muscle Gain)</option>
            <option value="FAT_LOSS">Giảm mỡ siết cơ (Fat Loss)</option>
            <option value="ENDURANCE">Tăng sức bền (Endurance)</option>
            <option value="RECOVERY">Phục hồi cơ (Recovery)</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLactoseFreeOnly(!lactoseFreeOnly)}
              className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                lactoseFreeOnly
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-950 text-slate-400"
              }`}
            >
              ✓ Không Lactose
            </button>
            <button
              type="button"
              onClick={() => setCaffeineFreeOnly(!caffeineFreeOnly)}
              className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                caffeineFreeOnly
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-950 text-slate-400"
              }`}
            >
              ✓ Không Caffeine
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((prod) => {
          const primaryVar = prod.variants[0];
          if (!primaryVar) return null;
          const unitPrice = primaryVar.salePrice ?? primaryVar.price;

          return (
            <div
              key={prod.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/75 overflow-hidden hover:border-orange-500/50 transition"
            >
              <div>
                <div className="relative h-56 bg-slate-950 overflow-hidden">
                  <img
                    src={primaryVar.imageUrl}
                    alt={prod.name}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-slate-950/90 border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-white">
                      {prod.brand} • {prod.originCountry}
                    </span>
                    <span className="rounded-md bg-orange-500 px-2.5 py-1 text-[11px] font-black text-slate-950">
                      {goalBadgeMap[prod.targetGoal] || prod.targetGoal}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {prod.allergenTags.length === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        An toàn dị ứng (0g Lactose / 0 Caffeine)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Chứa: {prod.allergenTags.join(", ")}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/supplements/${prod.slug}`}
                    className="block text-base font-bold text-white hover:text-orange-300 line-clamp-2"
                  >
                    {prod.name}
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>

                  {/* Nutrition Facts Mini Strip */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950 p-2.5 text-center border border-slate-800/80 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Calories</div>
                      <div className="font-bold text-white">{prod.nutritionFacts.calories}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Protein</div>
                      <div className="font-bold text-emerald-400">
                        {prod.nutritionFacts.proteinGrams}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Biến thể</div>
                      <div className="font-bold text-orange-400">
                        {prod.variants.length} hương vị
                      </div>
                    </div>
                  </div>

                  {/* FEFO Batch Info */}
                  {primaryVar.nextFefoBatch && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-[11px] text-slate-300 flex items-center justify-between">
                      <span>
                        Lô xuất kho FEFO:{" "}
                        <strong className="font-mono text-emerald-400">
                          {primaryVar.nextFefoBatch.batchCode}
                        </strong>
                      </span>
                      <span>EXP: {primaryVar.nextFefoBatch.expiryDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-baseline justify-between border-t border-slate-800 pt-3">
                  <div>
                    <span className="text-xl font-black text-white">
                      {unitPrice.toLocaleString("vi-VN")}đ
                    </span>
                    {primaryVar.salePrice && (
                      <span className="ml-2 text-xs text-slate-500 line-through">
                        {primaryVar.price.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Còn {primaryVar.stockQuantity} hộp
                  </span>
                </div>

                <div className="flex gap-2">
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
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-orange-400 transition"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Thêm Vào Giỏ
                  </button>
                  <Link
                    href={`/supplements/${prod.slug}`}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Chọn Mùi Vị
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

