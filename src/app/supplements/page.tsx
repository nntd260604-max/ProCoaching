"use client";

import React, {
  useEffect,
  useState,
  useDeferredValue,
  startTransition,
} from "react";
import Link from "next/link";
import {
  Package,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  Search,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";
import { GlassPanel, SolidCard, StatusBadge } from "@/components/ui/Surface";

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

const GOAL_BADGE_MAP: Record<string, string> = {
  MUSCLE_GAIN: "Tăng cơ",
  FAT_LOSS: "Giảm mỡ",
  ENDURANCE: "Tăng sức bền",
  RECOVERY: "Phục hồi cơ",
};

export default function SupplementsPage() {
  const addItem = useHybridCartStore((s) => s.addItem);
  const [products, setProducts] = useState<SupplementProductItem[]>([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
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
    const q = deferredSearch.trim().toLowerCase();
    if (
      q !== "" &&
      !p.name.toLowerCase().includes(q) &&
      !p.brand.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (selectedCategory !== "ALL" && p.categoryId !== selectedCategory)
      return false;
    if (selectedGoal !== "ALL" && p.targetGoal !== selectedGoal) return false;
    if (lactoseFreeOnly && p.allergenTags.includes("LACTOSE")) return false;
    if (caffeineFreeOnly && p.allergenTags.includes("HIGH_CAFFEINE"))
      return false;
    return true;
  });

  const handleResetFilters = () => {
    startTransition(() => {
      setSearch("");
      setSelectedCategory("ALL");
      setSelectedGoal("ALL");
      setLactoseFreeOnly(false);
      setCaffeineFreeOnly(false);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {/* Top Focal Glass Filter Bar */}
      <GlassPanel className="p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <Package className="h-3.5 w-3.5" aria-hidden="true" />
              Thực Phẩm Bổ Sung Chính Hãng • Xuất Kho Theo Hạn Dùng Mới Nhất
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 text-balance">
              Cửa Hàng Thực Phẩm Bổ Sung
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-700 text-pretty">
              Lọc nhanh sản phẩm theo mục tiêu tập luyện và thành phần an toàn cho cơ địa của bạn.
            </p>
          </div>
          <span
            aria-live="polite"
            className="rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 tabular-nums"
          >
            Hiển thị {filtered.length} sản phẩm
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="supp-search"
              name="search"
              type="search"
              aria-label="Tìm tên thực phẩm bổ sung hoặc thương hiệu"
              autoComplete="off"
              spellCheck={false}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên Whey, Creatine, Pre-Workout…"
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs font-medium text-slate-900"
            />
          </div>

          <select
            id="supp-category"
            name="category"
            aria-label="Lọc theo danh mục sản phẩm"
            value={selectedCategory}
            onChange={(e) =>
              startTransition(() => setSelectedCategory(e.target.value))
            }
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800"
          >
            <option value="ALL">Tất cả danh mục</option>
            <option value="cat-whey">Whey Protein Tăng Cơ</option>
            <option value="cat-pre">Pre-Workout & Tăng Sức Bền</option>
            <option value="cat-creatine">Creatine & Phục Hồi Cơ</option>
            <option value="cat-plant">Đạm Thực Vật & Giảm Mỡ</option>
          </select>

          <select
            id="supp-goal"
            name="goal"
            aria-label="Lọc theo mục tiêu tập luyện"
            value={selectedGoal}
            onChange={(e) =>
              startTransition(() => setSelectedGoal(e.target.value))
            }
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800"
          >
            <option value="ALL">Tất cả mục tiêu</option>
            <option value="MUSCLE_GAIN">Tăng cơ nạc</option>
            <option value="FAT_LOSS">Giảm mỡ siết cơ</option>
            <option value="ENDURANCE">Tăng sức bền</option>
            <option value="RECOVERY">Phục hồi cơ</option>
          </select>

          <div
            role="group"
            aria-label="Lọc thành phần dị ứng"
            className="flex items-center gap-2"
          >
            <button
              type="button"
              aria-pressed={lactoseFreeOnly}
              onClick={() =>
                startTransition(() => setLactoseFreeOnly((v) => !v))
              }
              className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${
                lactoseFreeOnly
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Không Lactose
            </button>
            <button
              type="button"
              aria-pressed={caffeineFreeOnly}
              onClick={() =>
                startTransition(() => setCaffeineFreeOnly((v) => !v))
              }
              className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${
                caffeineFreeOnly
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Không Caffeine
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Empty State Handling */}
      {filtered.length === 0 ? (
        <SolidCard className="p-10 text-center space-y-3">
          <Package
            className="mx-auto h-10 w-10 text-slate-400"
            aria-hidden="true"
          />
          <h2 className="text-base font-bold text-slate-900">
            Không tìm thấy sản phẩm phù hợp với bộ lọc
          </h2>
          <p className="text-xs font-medium text-slate-600">
            Hãy thử từ khóa khác hoặc đặt lại bộ lọc để xem toàn bộ danh mục thực phẩm bổ sung.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </SolidCard>
      ) : (
        /* Product Grid: 3 Columns, Solid White Cards, Max 4 Clean Items per Card */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prod) => {
            const primaryVar = prod.variants[0];
            if (!primaryVar) return null;
            const unitPrice = primaryVar.salePrice ?? primaryVar.price;

            return (
              <SolidCard
                key={prod.id}
                className="p-6 flex flex-col justify-between hover:border-emerald-300"
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
                      width={480}
                      height={320}
                      loading="lazy"
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* 2. Up to 2 Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="emerald">
                      {GOAL_BADGE_MAP[prod.targetGoal] || prod.targetGoal} •{" "}
                      {prod.nutritionFacts.proteinGrams}g Protein
                    </StatusBadge>
                    {prod.allergenTags.length === 0 ? (
                      <StatusBadge tone="slate">
                        <ShieldCheck
                          className="h-3.5 w-3.5 text-emerald-600"
                          aria-hidden="true"
                        />
                        Không gây dị ứng
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="amber">
                        <AlertTriangle
                          className="h-3.5 w-3.5 text-amber-600"
                          aria-hidden="true"
                        />
                        Có {prod.allergenTags.join(", ")}
                      </StatusBadge>
                    )}
                  </div>

                  {/* 3. Brand + Name */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {prod.brand} • {prod.originCountry}
                    </div>
                    <Link
                      href={`/supplements/${prod.slug}`}
                      className="mt-1 block text-lg font-bold text-slate-900 hover:text-emerald-600 line-clamp-2 transition-colors"
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
                    <div className="font-mono text-xl font-extrabold text-slate-900 tabular-nums">
                      {unitPrice.toLocaleString("vi-VN")}đ
                    </div>
                    {primaryVar.salePrice ? (
                      <div className="font-mono text-xs text-slate-400 line-through tabular-nums">
                        {primaryVar.price.toLocaleString("vi-VN")}đ
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/supplements/${prod.slug}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
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
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      <ShoppingBag
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      Thêm giỏ
                    </button>
                  </div>
                </div>
              </SolidCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
