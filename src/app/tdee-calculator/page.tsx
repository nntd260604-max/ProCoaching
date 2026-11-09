"use client";

import React, { useState, useEffect, startTransition } from "react";
import {
  Calculator,
  ShoppingBag,
  Utensils,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";
import { GlassPanel, SolidCard } from "@/components/ui/Surface";

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
  mealPlanMarkdown: string;
  reasoning: string;
  recommendedSupplements: {
    product: {
      id: string;
      name: string;
      slug: string;
      brand: string;
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
  { code: "LACTOSE", label: "Bất dung nạp Lactose" },
  { code: "HIGH_CAFFEINE", label: "Nhạy cảm Caffeine" },
  { code: "SOY", label: "Dị ứng Đậu nành" },
  { code: "GLUTEN", label: "Dị ứng Gluten" },
] as const;

const GOAL_OPTIONS = [
  { id: "MUSCLE_GAIN", label: "Tăng cơ" },
  { id: "FAT_LOSS", label: "Giảm mỡ" },
  { id: "ENDURANCE", label: "Tăng sức bền" },
] as const;

export default function TdeeCalculatorPage() {
  const addItem = useHybridCartStore((s) => s.addItem);
  const setCartOpen = useHybridCartStore((s) => s.setCartOpen);
  const activeUserId = useHybridCartStore((s) => s.activeUserId);

  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [age, setAge] = useState(23);
  const [heightCm, setHeightCm] = useState(174);
  const [weightKg, setWeightKg] = useState(69);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [fitnessGoal, setFitnessGoal] = useState<
    "MUSCLE_GAIN" | "FAT_LOSS" | "ENDURANCE"
  >("MUSCLE_GAIN");
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
          activityLevel,
          fitnessGoal,
          allergies,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        startTransition(() => {
          setResult(data);
        });
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
        subtitle: `Thời hạn ${c.durationDays} ngày • ${c.ptSessionsIncluded} buổi PT`,
        unitPrice: c.price,
        imageUrl: c.thumbnailUrl,
        skuOrBadge: c.courseType,
      });
    }
    setCartOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 text-balance">
          Công Cụ Đo BMI / TDEE & Tư Vấn Thực Đơn AI
        </h1>
        <p className="text-sm font-medium text-slate-700 text-pretty">
          Tính toán năng lượng tiêu hao, tỷ lệ dinh dưỡng đa lượng (Macro) và nhận gợi ý thực đơn an toàn với cơ địa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Tầng 1: Khối nhập liệu Form dùng nền đặc bg-white (solid-card) */}
        <form
          onSubmit={runCalculation}
          className="lg:col-span-5 solid-card p-6 space-y-5 self-start"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calculator
              className="h-5 w-5 text-emerald-600"
              aria-hidden="true"
            />
            <h2 className="text-base font-extrabold text-slate-900">
              Nhập chỉ số cơ thể & cơ địa
            </h2>
          </div>

          <div
            role="group"
            aria-label="Chọn giới tính"
            className="grid grid-cols-2 gap-2.5"
          >
            <button
              type="button"
              aria-pressed={gender === "MALE"}
              onClick={() => setGender("MALE")}
              className={`rounded-xl border py-2.5 text-xs font-bold transition-colors ${
                gender === "MALE"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Nam giới
            </button>
            <button
              type="button"
              aria-pressed={gender === "FEMALE"}
              onClick={() => setGender("FEMALE")}
              className={`rounded-xl border py-2.5 text-xs font-bold transition-colors ${
                gender === "FEMALE"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Nữ giới
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label
                htmlFor="tdee-height"
                className="block font-bold text-slate-700 mb-1"
              >
                Chiều cao (cm)
              </label>
              <input
                id="tdee-height"
                name="heightCm"
                type="number"
                inputMode="numeric"
                min={120}
                max={230}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm font-bold text-slate-900 tabular-nums"
              />
            </div>
            <div>
              <label
                htmlFor="tdee-weight"
                className="block font-bold text-slate-700 mb-1"
              >
                Cân nặng (kg)
              </label>
              <input
                id="tdee-weight"
                name="weightKg"
                type="number"
                inputMode="decimal"
                step="0.5"
                min={30}
                max={200}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm font-bold text-slate-900 tabular-nums"
              />
            </div>
            <div>
              <label
                htmlFor="tdee-age"
                className="block font-bold text-slate-700 mb-1"
              >
                Độ tuổi
              </label>
              <input
                id="tdee-age"
                name="age"
                type="number"
                inputMode="numeric"
                min={14}
                max={80}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm font-bold text-slate-900 tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label
              htmlFor="tdee-activity"
              className="block font-bold text-slate-700"
            >
              Mức độ vận động
            </label>
            <select
              id="tdee-activity"
              name="activityLevel"
              value={activityLevel}
              onChange={(e) => setActivityLevel(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900"
            >
              <option value={1.2}>Ít vận động (Làm việc văn phòng)</option>
              <option value={1.375}>Vận động nhẹ (Tập 1-3 buổi/tuần)</option>
              <option value={1.55}>Vận động vừa (Tập 3-5 buổi/tuần)</option>
              <option value={1.725}>Năng động cao (Tập 6-7 buổi/tuần)</option>
              <option value={1.9}>Vận động viên cường độ cao</option>
            </select>
          </div>

          <div className="space-y-2 text-xs">
            <span className="block font-bold text-slate-700">
              Mục tiêu tập luyện
            </span>
            <div
              role="group"
              aria-label="Chọn mục tiêu tập luyện"
              className="grid grid-cols-3 gap-2"
            >
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={fitnessGoal === g.id}
                  onClick={() => setFitnessGoal(g.id)}
                  className={`rounded-xl border px-2.5 py-2.5 text-xs font-bold transition-colors ${
                    fitnessGoal === g.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkbox Dị ứng */}
          <div className="space-y-2 text-xs">
            <span className="block font-bold text-slate-700">
              Sàng lọc Dị ứng / Cơ địa nhạy cảm
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALLERGY_OPTIONS.map((opt) => {
                const checked = allergies.includes(opt.code);
                return (
                  <label
                    key={opt.code}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer font-semibold transition-colors ${
                      checked
                        ? "border-amber-500 bg-amber-50/70 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`allergy-${opt.code}`}
                      checked={checked}
                      onChange={() => toggleAllergy(opt.code)}
                      className="h-4 w-4 accent-emerald-600"
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {loading
              ? "Đang tính toán…"
              : "Phân tích BMI/TDEE & Gợi ý Thực đơn"}
          </button>
        </form>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6" aria-live="polite">
          {result ? (
            <>
              {/* Tầng 2: Khối Kết quả Tiêu điểm (Focal Glass Card) */}
              <GlassPanel className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Kết quả phân tích chỉ số cơ thể
                    </span>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                      Tổng hợp BMI, TDEE & Phân bổ Macro mỗi ngày
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {result.bmiCategory}
                  </span>
                </div>

                {/* 4 Ô chỉ số nền đặc bg-white bên trong tấm kính */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                    <div className="text-xs font-bold text-slate-600">
                      Chỉ số BMI
                    </div>
                    <div className="font-mono text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                      {result.bmi}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                    <div className="text-xs font-bold text-slate-600">
                      BMR Nền
                    </div>
                    <div className="font-mono text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                      {result.macros.bmr.toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                    <div className="text-xs font-bold text-slate-600">
                      TDEE Tiêu hao
                    </div>
                    <div className="font-mono text-2xl font-extrabold text-indigo-700 mt-1 tabular-nums">
                      {result.macros.tdee.toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4">
                    <div className="text-xs font-bold text-emerald-800">
                      Calo mục tiêu
                    </div>
                    <div className="font-mono text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
                      {result.macros.calories.toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>

                {/* 3 Thanh Macro (Protein / Carb / Fat) */}
                <div className="space-y-3">
                  <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{ width: `${result.macros.proteinPct}%` }}
                      className="bg-emerald-600 transition-[width] duration-300"
                    />
                    <div
                      style={{ width: `${result.macros.carbsPct}%` }}
                      className="bg-indigo-600 transition-[width] duration-300"
                    />
                    <div
                      style={{ width: `${result.macros.fatPct}%` }}
                      className="bg-amber-500 transition-[width] duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                      <div className="text-xs font-bold text-emerald-700">
                        Protein ({result.macros.proteinPct}%)
                      </div>
                      <div className="font-mono text-lg font-extrabold text-slate-900 mt-0.5 tabular-nums">
                        {result.macros.proteinGrams}g
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                      <div className="text-xs font-bold text-indigo-700">
                        Carbs ({result.macros.carbsPct}%)
                      </div>
                      <div className="font-mono text-lg font-extrabold text-slate-900 mt-0.5 tabular-nums">
                        {result.macros.carbsGrams}g
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                      <div className="text-xs font-bold text-amber-700">
                        Fat ({result.macros.fatPct}%)
                      </div>
                      <div className="font-mono text-lg font-extrabold text-slate-900 mt-0.5 tabular-nums">
                        {result.macros.fatGrams}g
                      </div>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              {/* Tầng 1: Thực đơn gợi ý 1 ngày (Nền đặc bg-white dễ đọc) */}
              <SolidCard className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <Utensils
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden="true"
                  />
                  Thực đơn gợi ý trong ngày
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 text-xs font-medium text-emerald-900">
                  <CheckCircle2
                    className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{result.reasoning}</span>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-xs sm:text-sm font-medium leading-relaxed text-slate-800 whitespace-pre-line">
                  {result.mealPlanMarkdown}
                </div>
              </SolidCard>

              {/* Tầng 1: Combo Khóa học + Thực phẩm bổ sung đã lọc dị ứng */}
              <SolidCard className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Combo Khóa học + Thực phẩm bổ sung gợi ý
                    </h3>
                    <p className="text-xs font-medium text-slate-700">
                      Đã tự động lọc bỏ các thành phần gây dị ứng theo cơ địa của bạn
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFullComboToCart}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    Thêm trọn bộ Combo vào giỏ hàng
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {result.recommendedSupplements.map((item) => {
                    const price =
                      item.variant.salePrice ?? item.variant.price;
                    return (
                      <div
                        key={item.variant.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <img
                            src={item.variant.imageUrl}
                            alt={item.product.name}
                            width={320}
                            height={220}
                            loading="lazy"
                            className="h-28 w-full rounded-lg object-cover bg-white"
                          />
                          <div className="text-xs font-bold text-slate-900 line-clamp-2">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] font-medium text-slate-600">
                            {item.variant.flavor} ({item.variant.weightLabel})
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                          <span className="font-mono text-sm font-extrabold text-emerald-700 tabular-nums">
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
                            className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                          >
                            + Thêm
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {result.recommendedCourses[0] ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <img
                          src={result.recommendedCourses[0].thumbnailUrl}
                          alt={result.recommendedCourses[0].title}
                          width={320}
                          height={220}
                          loading="lazy"
                          className="h-28 w-full rounded-lg object-cover bg-white"
                        />
                        <div className="text-xs font-bold text-slate-900 line-clamp-2">
                          {result.recommendedCourses[0].title}
                        </div>
                        <div className="text-[11px] font-medium text-indigo-700">
                          Thời hạn {result.recommendedCourses[0].durationDays}{" "}
                          ngày
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="font-mono text-sm font-extrabold text-indigo-700 tabular-nums">
                          {result.recommendedCourses[0].price.toLocaleString(
                            "vi-VN"
                          )}
                          đ
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
                              subtitle: `Thời hạn ${c.durationDays} ngày`,
                              unitPrice: c.price,
                              imageUrl: c.thumbnailUrl,
                              skuOrBadge: c.courseType,
                            });
                          }}
                          className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-600 transition-colors"
                        >
                          + Thêm
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </SolidCard>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
