"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Flame,
  ShoppingBag,
  Utensils,
  Activity,
  Dumbbell,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

interface ConsultationResult {
  bmi: number;
  bmiCategory: string;
  macros: {
    bmr: number;
    tdee: number;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    proteinPct: number;
    carbsPct: number;
    fatPct: number;
  };
  excludedAllergens: string[];
  excludedProducts: {
    id: string;
    name: string;
    matchedAllergens: string[];
  }[];
  mealPlanMarkdown: string;
  reasoning: string;
  recommendedSupplements: {
    product: {
      id: string;
      name: string;
      slug: string;
      brand: string;
      allergenTags: string[];
    };
    variant: {
      id: string;
      sku: string;
      flavor: string;
      weightLabel: string;
      price: number;
      salePrice: number | null;
      imageUrl: string;
    };
  }[];
  recommendedCourses: {
    id: string;
    title: string;
    slug: string;
    courseType: string;
    price: number;
    durationDays: number;
    ptSessionsIncluded: number;
    thumbnailUrl: string;
  }[];
}

const ALLERGY_OPTIONS = [
  {
    code: "LACTOSE",
    label: "Bất dung nạp Lactose (Đau bụng khi uống sữa / Whey Concentrate)",
  },
  {
    code: "HIGH_CAFFEINE",
    label: "Nhạy cảm Caffeine (Tim đập nhanh, mất ngủ khi tập tối)",
  },
  {
    code: "SOY",
    label: "Dị ứng Đậu nành (Soy Lecithin)",
  },
  {
    code: "GLUTEN",
    label: "Dị ứng Gluten (Lúa mì / Yến mạch thường)",
  },
];

export default function TdeeCalculatorPage() {
  const { addItem, setCartOpen, activeUserId } = useHybridCartStore();

  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [age, setAge] = useState(23);
  const [heightCm, setHeightCm] = useState(174);
  const [weightKg, setWeightKg] = useState(69);
  const [bodyFatPct, setBodyFatPct] = useState(16.5);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [fitnessGoal, setFitnessGoal] = useState<"MUSCLE_GAIN" | "FAT_LOSS" | "ENDURANCE">(
    "MUSCLE_GAIN"
  );
  const [allergies, setAllergies] = useState<string[]>(["LACTOSE"]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultationResult | null>(null);

  const toggleAllergy = (code: string) => {
    setAllergies((prev) =>
      prev.includes(code) ? prev.filter((a) => a !== code) : [...prev, code]
    );
  };

  const runCalculation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tdee-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUserId,
          gender,
          age,
          heightCm,
          weightKg,
          bodyFatPct,
          activityLevel,
          fitnessGoal,
          allergies,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFullComboToCart = () => {
    if (!result) return;
    for (const item of result.recommendedSupplements) {
      const unitPrice = item.variant.salePrice ?? item.variant.price;
      addItem({
        id: item.variant.id,
        itemType: "SUPPLEMENT_VARIANT",
        supplementVariantId: item.variant.id,
        name: item.product.name,
        subtitle: `${item.variant.flavor} • ${item.variant.weightLabel}`,
        unitPrice,
        imageUrl: item.variant.imageUrl,
        skuOrBadge: item.variant.sku,
      });
    }
    if (result.recommendedCourses[0]) {
      const c = result.recommendedCourses[0];
      addItem({
        id: c.id,
        itemType: "COURSE_MEMBERSHIP",
        courseId: c.id,
        name: c.title,
        subtitle: `Hiệu lực ${c.durationDays} ngày • Kèm ${c.ptSessionsIncluded} buổi PT 1-1`,
        unitPrice: c.price,
        imageUrl: c.thumbnailUrl,
        skuOrBadge: c.courseType,
      });
    }
    setCartOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          Công Thức Khoa Học Mifflin-St Jeor & AI Sàng Lọc Dị Ứng (`ai_consultation_logs`)
        </div>
        <h1 className="mt-3 text-2xl sm:text-4xl font-black text-white">
          Đo Chỉ Số BMI / TDEE & Trợ Lý AI Tư Vấn Thực Đơn Lọc Dị Ứng
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl">
          Hệ thống tự động tính toán năng lượng tiêu hao (TDEE), phân bổ tỷ lệ{" "}
          <strong className="text-emerald-400">Macro (Protein - Carb - Fat)</strong> và loại bỏ hoàn toàn các sản phẩm Thực phẩm bổ sung có chứa thành phần gây dị ứng trong{" "}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-orange-300">allergen_tags</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form */}
        <form
          onSubmit={runCalculation}
          className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/75 p-6 space-y-5 self-start"
        >
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">1. Nhập Thông Số Cơ Thể & Cơ Địa</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender("MALE")}
              className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                gender === "MALE"
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-800 bg-slate-950 text-slate-400"
              }`}
            >
              Nam giới (+5 BMR)
            </button>
            <button
              type="button"
              onClick={() => setGender("FEMALE")}
              className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                gender === "FEMALE"
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-800 bg-slate-950 text-slate-400"
              }`}
            >
              Nữ giới (-161 BMR)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Chiều cao (cm)</label>
              <input
                type="number"
                min={120}
                max={230}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-bold text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Cân nặng (kg)</label>
              <input
                type="number"
                step="0.5"
                min={30}
                max={200}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-bold text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Độ tuổi</label>
              <input
                type="number"
                min={14}
                max={80}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-bold text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tỷ lệ mỡ InBody (%)
              </label>
              <input
                type="number"
                step="0.5"
                min={4}
                max={55}
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-bold text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="block font-semibold text-slate-300">
              Cường độ vận động trong tuần (Activity Multiplier)
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-white"
            >
              <option value={1.2}>Ít vận động (Nhân viên văn phòng, không tập - Hệ số 1.2)</option>
              <option value={1.375}>Vận động nhẹ (Tập 1-3 buổi/tuần - Hệ số 1.375)</option>
              <option value={1.55}>Vận động vừa (Tập Gym 3-5 buổi/tuần - Hệ số 1.55)</option>
              <option value={1.725}>Năng động cao (Tập nặng 6-7 buổi/tuần - Hệ số 1.725)</option>
              <option value={1.9}>Vận động viên chuyên nghiệp (2 buổi/ngày - Hệ số 1.9)</option>
            </select>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block font-semibold text-slate-300">
              Mục tiêu Hình thể (Fitness Goal)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "MUSCLE_GAIN", label: "Tăng Cơ (+350 Kcal)" },
                { id: "FAT_LOSS", label: "Giảm Mỡ (-450 Kcal)" },
                { id: "ENDURANCE", label: "Tăng Sức Bền" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() =>
                    setFitnessGoal(g.id as "MUSCLE_GAIN" | "FAT_LOSS" | "ENDURANCE")
                  }
                  className={`rounded-xl border px-2.5 py-2.5 text-xs font-bold transition ${
                    fitnessGoal === g.id
                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bộ lọc Dị ứng / Cơ địa */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldAlert className="h-4 w-4" />
              Sàng Lọc Dị Ứng & Cơ Địa Nhạy Cảm (`allergen_tags`)
            </div>
            <div className="space-y-2">
              {ALLERGY_OPTIONS.map((opt) => {
                const checked = allergies.includes(opt.code);
                return (
                  <label
                    key={opt.code}
                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer text-xs transition ${
                      checked
                        ? "border-amber-500/50 bg-amber-500/15 text-white"
                        : "border-slate-800 bg-slate-950/70 text-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAllergy(opt.code)}
                      className="mt-0.5 h-4 w-4 accent-emerald-500"
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-orange-500 px-5 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
          >
            <Sparkles className="h-4 w-4" />
            {loading
              ? "AI đang phân tích TDEE & Lọc nhãn dị ứng..."
              : "Phân Tích Chỉ Số & Tạo Thực Đơn AI"}
          </button>
        </form>

        {/* Right Results */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <>
              {/* 1. Các chỉ số BMI, BMR, TDEE, Macro */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="text-xs text-slate-400">Chỉ số BMI</div>
                  <div className="text-2xl font-black text-white mt-1">{result.bmi}</div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                    {result.bmiCategory}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="text-xs text-slate-400">BMR (Trao đổi chất nền)</div>
                  <div className="text-2xl font-black text-sky-400 mt-1">
                    {result.macros.bmr.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Kcal / ngày (Mifflin-St Jeor)</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="text-xs text-slate-400">TDEE Tiêu hao</div>
                  <div className="text-2xl font-black text-orange-400 mt-1">
                    {result.macros.tdee.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Kcal / ngày</div>
                </div>
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-4">
                  <div className="text-xs text-emerald-300 font-semibold">Calo Mục Tiêu</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {result.macros.calories.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-[11px] text-emerald-200/80 mt-1">Kcal nạp mỗi ngày</div>
                </div>
              </div>

              {/* Biểu đồ Phân bổ Macro */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    Biểu Đồ Phân Bổ Dinh Dưỡng Đa Lượng (Macro Breakdown)
                  </h3>
                  <span className="text-xs text-slate-400">
                    1g Protein = 4 Kcal • 1g Carb = 4 Kcal • 1g Fat = 9 Kcal
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-950">
                  <div
                    style={{ width: `${result.macros.proteinPct}%` }}
                    className="bg-emerald-500 transition-all"
                    title="Protein"
                  />
                  <div
                    style={{ width: `${result.macros.carbsPct}%` }}
                    className="bg-sky-500 transition-all"
                    title="Carbs"
                  />
                  <div
                    style={{ width: `${result.macros.fatPct}%` }}
                    className="bg-orange-500 transition-all"
                    title="Fat"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-slate-950/90 border border-emerald-500/30 p-3">
                    <div className="text-xs font-bold text-emerald-400">
                      Chất Đạm (Protein - {result.macros.proteinPct}%)
                    </div>
                    <div className="text-xl font-black text-white mt-0.5">
                      {result.macros.proteinGrams}g / ngày
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {result.macros.proteinGrams * 4} Kcal
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-950/90 border border-sky-500/30 p-3">
                    <div className="text-xs font-bold text-sky-400">
                      Tinh Bột (Carbs - {result.macros.carbsPct}%)
                    </div>
                    <div className="text-xl font-black text-white mt-0.5">
                      {result.macros.carbsGrams}g / ngày
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {result.macros.carbsGrams * 4} Kcal
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-950/90 border border-orange-500/30 p-3">
                    <div className="text-xs font-bold text-orange-400">
                      Chất Béo (Fat - {result.macros.fatPct}%)
                    </div>
                    <div className="text-xl font-black text-white mt-0.5">
                      {result.macros.fatGrams}g / ngày
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {result.macros.fatGrams * 9} Kcal
                    </div>
                  </div>
                </div>
              </div>

              {/* Báo cáo Sàng lọc Dị ứng */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Báo Cáo Bộ Lọc An Toàn Dị Ứng (`allergen_tags`)
                </div>
                <p className="text-xs leading-relaxed text-slate-200">{result.reasoning}</p>
                {result.excludedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.excludedProducts.map((ex) => (
                      <span
                        key={ex.id}
                        className="rounded-lg border border-rose-500/30 bg-rose-950/40 px-2.5 py-1 text-[11px] font-medium text-rose-300"
                      >
                        Đã loại trừ: {ex.name} (Chứa: {ex.matchedAllergens.join(", ")})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Thực đơn mẫu 1 ngày */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Utensils className="h-5 w-5 text-orange-400" />
                  Thực Đơn Mẫu 1 Ngày Do AI Thiết Kế Riêng Cho Bạn
                </div>
                <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line">
                  {result.mealPlanMarkdown}
                </div>
              </div>

              {/* Combo Khóa Học + Thực Phẩm Bổ Sung Đã Lọc Dị Ứng */}
              <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Allergen-Free Hybrid Combo
                    </span>
                    <h3 className="text-lg font-black text-white">
                      Combo Thực Phẩm Bổ Sung + Gói Tập Đề Xuất (An Toàn 100%)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFullComboToCart}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-orange-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Thêm Trọn Bộ Combo Vào Giỏ Hàng
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {result.recommendedSupplements.map((item) => {
                    const price = item.variant.salePrice ?? item.variant.price;
                    return (
                      <div
                        key={item.variant.id}
                        className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3.5 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <img
                            src={item.variant.imageUrl}
                            alt={item.product.name}
                            className="h-32 w-full rounded-xl object-cover"
                          />
                          <span className="inline-block rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            Thực phẩm bổ sung • An toàn dị ứng
                          </span>
                          <div className="text-xs font-bold text-white line-clamp-2">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.variant.flavor} ({item.variant.weightLabel})
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-sm font-black text-orange-400">
                            {price.toLocaleString("vi-VN")}đ
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              addItem({
                                id: item.variant.id,
                                itemType: "SUPPLEMENT_VARIANT",
                                supplementVariantId: item.variant.id,
                                name: item.product.name,
                                subtitle: `${item.variant.flavor} • ${item.variant.weightLabel}`,
                                unitPrice: price,
                                imageUrl: item.variant.imageUrl,
                                skuOrBadge: item.variant.sku,
                              })
                            }
                            className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 hover:text-slate-950"
                          >
                            + Giỏ hàng
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {result.recommendedCourses[0] && (
                    <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/90 p-3.5 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <img
                          src={result.recommendedCourses[0].thumbnailUrl}
                          alt={result.recommendedCourses[0].title}
                          className="h-32 w-full rounded-xl object-cover"
                        />
                        <span className="inline-block rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-300">
                          Gói Tập / Khóa Học • Kích hoạt QR ngay
                        </span>
                        <div className="text-xs font-bold text-white line-clamp-2">
                          {result.recommendedCourses[0].title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Hiệu lực {result.recommendedCourses[0].durationDays} ngày •{" "}
                          {result.recommendedCourses[0].ptSessionsIncluded} buổi PT 1-1
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-sm font-black text-emerald-400">
                          {result.recommendedCourses[0].price.toLocaleString("vi-VN")}đ
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const c = result.recommendedCourses[0];
                            addItem({
                              id: c.id,
                              itemType: "COURSE_MEMBERSHIP",
                              courseId: c.id,
                              name: c.title,
                              subtitle: `Hiệu lực ${c.durationDays} ngày • ${c.ptSessionsIncluded} buổi PT`,
                              unitPrice: c.price,
                              imageUrl: c.thumbnailUrl,
                              skuOrBadge: c.courseType,
                            });
                          }}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 hover:text-slate-950"
                        >
                          + Giỏ hàng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

