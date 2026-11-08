import { getDb, withTransaction } from "../db/runtime-db";

export interface TdeeCalculationInput {
  userId?: string;
  gender: "MALE" | "FEMALE";
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number | null;
  activityLevel: number; // 1.2, 1.375, 1.55, 1.725, 1.9
  fitnessGoal: "MUSCLE_GAIN" | "FAT_LOSS" | "ENDURANCE" | "RECOVERY";
  allergies: string[]; // ['LACTOSE', 'HIGH_CAFFEINE', 'GLUTEN', 'SOY']
}

export interface MacroTargets {
  bmr: number;
  tdee: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export function calculateBodyMetricsAndMacros(input: TdeeCalculationInput): {
  bmi: number;
  bmiCategory: string;
  macros: MacroTargets;
} {
  const heightM = input.heightCm / 100;
  const bmi = Number((input.weightKg / (heightM * heightM)).toFixed(2));

  let bmiCategory = "Bình thường - Chuẩn Thể Hình";
  if (bmi < 18.5) bmiCategory = "Thiếu cân (Cần tăng cơ & cân nặng)";
  else if (bmi < 23) bmiCategory = "Bình thường - Tối ưu phát triển cơ bắp";
  else if (bmi < 25) bmiCategory = "Thừa cân nhẹ (Nên Body Recomposition)";
  else bmiCategory = "Thừa cân / Mỡ cao (Ưu tiên cắt giảm mỡ)";

  // Công thức Mifflin-St Jeor chuẩn quốc tế
  const baseBmr = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  const bmr = Math.round(input.gender === "MALE" ? baseBmr + 5 : baseBmr - 161);
  const tdee = Math.round(bmr * input.activityLevel);

  let targetCalories = tdee;
  let proteinPct = 30;
  let carbsPct = 45;
  let fatPct = 25;

  if (input.fitnessGoal === "MUSCLE_GAIN") {
    targetCalories = tdee + 350;
    proteinPct = 30;
    carbsPct = 45;
    fatPct = 25;
  } else if (input.fitnessGoal === "FAT_LOSS") {
    targetCalories = Math.max(1250, tdee - 450);
    proteinPct = 38;
    carbsPct = 32;
    fatPct = 30;
  } else if (input.fitnessGoal === "ENDURANCE") {
    targetCalories = tdee + 200;
    proteinPct = 25;
    carbsPct = 55;
    fatPct = 20;
  } else {
    targetCalories = tdee;
    proteinPct = 32;
    carbsPct = 43;
    fatPct = 25;
  }

  const proteinGrams = Math.round((targetCalories * (proteinPct / 100)) / 4);
  const carbsGrams = Math.round((targetCalories * (carbsPct / 100)) / 4);
  const fatGrams = Math.round((targetCalories * (fatPct / 100)) / 9);

  return {
    bmi,
    bmiCategory,
    macros: {
      bmr,
      tdee,
      calories: targetCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      proteinPct,
      carbsPct,
      fatPct,
    },
  };
}

export async function generateAiNutritionConsultation(input: TdeeCalculationInput) {
  const { bmi, bmiCategory, macros } = calculateBodyMetricsAndMacros(input);
  const db = getDb();
  const normalizedAllergies = (input.allergies || []).map((a) => a.toUpperCase());

  // 1. Lọc các sản phẩm Thực phẩm bổ sung AN TOÀN (Không chứa nhãn dị ứng trùng với học viên)
  const safeSupplements = db.supplementProducts.filter((prod) => {
    if (!prod.isActive) return false;
    const hasOverlap = prod.allergenTags.some((tag) =>
      normalizedAllergies.includes(tag.toUpperCase())
    );
    return !hasOverlap;
  });

  // Lưu danh sách sản phẩm đã bị loại trừ vì dị ứng để giải trình minh bạch trên giao diện
  const excludedProducts = db.supplementProducts
    .filter((prod) =>
      prod.allergenTags.some((tag) => normalizedAllergies.includes(tag.toUpperCase()))
    )
    .map((prod) => ({
      id: prod.id,
      name: prod.name,
      matchedAllergens: prod.allergenTags.filter((tag) =>
        normalizedAllergies.includes(tag.toUpperCase())
      ),
    }));

  // 2. Chọn bộ Combo Thực phẩm bổ sung phù hợp nhất với mục tiêu + không gây dị ứng
  const goalMatchedSupplements = safeSupplements.sort((a, b) => {
    const aScore = a.targetGoal === input.fitnessGoal ? 2 : 1;
    const bScore = b.targetGoal === input.fitnessGoal ? 2 : 1;
    return bScore - aScore;
  });

  const selectedSupplements = goalMatchedSupplements.slice(0, 2).map((prod) => {
    const primaryVariant =
      db.supplementVariants.find((v) => v.productId === prod.id && v.stockQuantity > 0) ||
      db.supplementVariants.find((v) => v.productId === prod.id)!;
    return {
      product: prod,
      variant: primaryVariant,
    };
  });

  // 3. Chọn Khóa học / Gói tập phù hợp mục tiêu
  const recommendedCourses = db.coursesMemberships
    .filter((c) => c.targetGoal === input.fitnessGoal || c.courseType === "HYBRID_COMBO")
    .slice(0, 2);

  // 4. Sinh thực đơn cá nhân hóa (Kết hợp Gemini API nếu có key hoặc Rule Engine Chuyên Gia Dinh Dưỡng)
  const mainProteinSupp = selectedSupplements[0]?.product.name || "Whey Isolate Tinh Khiết";
  const secondarySupp = selectedSupplements[1]?.product.name || "Creatine Monohydrate";

  const milkAlternative = normalizedAllergies.includes("LACTOSE")
    ? "sữa hạnh nhân không đường (Đã loại bỏ sữa bò chứa Lactose)"
    : "sữa tươi tách béo không đường";

  const carbSource = normalizedAllergies.includes("GLUTEN")
    ? "khoai lang mật & gạo lứt (Không chứa Gluten)"
    : "yến mạch nguyên cán & bánh mì nguyên cám";

  const preWorkoutNote = normalizedAllergies.includes("HIGH_CAFFEINE")
    ? "Sử dụng **Applied Nutrition ABE Pump Stim-Free (0mg Caffeine)** trước tập 25 phút để bơm cơ căng mà không gây tim đập nhanh hay mất ngủ."
    : "Có thể dùng 1 muỗng Pre-Workout trước tập 25 phút để tối ưu sự tỉnh táo và sức bền.";

  const goalLabelMap: Record<string, string> = {
    MUSCLE_GAIN: "Tăng Cơ Nạc Tối Đa (Lean Hypertrophy)",
    FAT_LOSS: "Giảm Mỡ Siết Cơ Săn Chắc (Cutting / Fat Loss)",
    ENDURANCE: "Tăng Sức Bền & Hiệu Suất Tim Mạch (Endurance)",
    RECOVERY: "Phục Hồi Cơ Bắp & Tái Tạo Năng Lượng",
  };

  let mealPlanMarkdown = `### Thực Đơn Cá Nhân Hóa 1 Ngày: ${goalLabelMap[input.fitnessGoal]} (${macros.calories.toLocaleString("vi-VN")} Kcal)
- **Tổng quan Macro mục tiêu:** **${macros.proteinGrams}g Protein** (${macros.proteinPct}%) • **${macros.carbsGrams}g Tinh bột** (${macros.carbsPct}%) • **${macros.fatGrams}g Chất béo tốt** (${macros.fatPct}%).
- **Bữa sáng (07:00 - ${Math.round(macros.calories * 0.25)} Kcal):** Chế biến ${carbSource} cùng 3 quả trứng gà ta + 200ml ${milkAlternative} + 1 quả chuối chín.
- **Bữa phụ sáng (10:00 - ${Math.round(macros.calories * 0.1)} Kcal):** 30g hạt điều/hạnh nhân rang mộc + 1 quả táo xanh.
- **Bữa trưa (12:30 - ${Math.round(macros.calories * 0.3)} Kcal):** 200g ức gà phi lê áp chảo (hoặc thăn bò nạc) + 220g cơm gạo lứt + đĩa bông cải xanh luộc trộn 1 muỗng dầu Ô-liu Extra Virgin.
- **Trước buổi tập 30 phút (17:00 - ${Math.round(macros.calories * 0.1)} Kcal):** 1 củ khoai lang nhỏ (120g) + ${preWorkoutNote}
- **Ngay sau tập 15 phút (19:00 - 130 Kcal):** 1 muỗng **${mainProteinSupp}** pha với 300ml nước lọc mát + 5g **${secondarySupp}** giúp phục hồi sợi cơ tức thì.
- **Bữa tối (20:15 - ${Math.round(macros.calories * 0.2)} Kcal):** 180g phi lê cá hồi (hoặc cá chẽm hấp gừng) + 150g cơm trắng/khoai lang + salad rau mầm trộn giấm táo.`;

  // Nếu có cấu hình GEMINI_API_KEY, gọi trực tiếp Google Gemini để mở rộng lời khuyên
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10) {
    try {
      const promptText = `Bạn là Chuyên gia Dinh dưỡng Thể hình của hệ thống GymHub. Học viên có BMI=${bmi}, BMR=${macros.bmr}, TDEE=${macros.tdee} Kcal, mục tiêu=${goalLabelMap[input.fitnessGoal]}, dị ứng=${normalizedAllergies.join(", ") || "Không có"}. Hãy viết thực đơn 1 ngày bằng tiếng Việt chuẩn Markdown đạt ${macros.calories} Kcal (${macros.proteinGrams}g Protein, ${macros.carbsGrams}g Carb, ${macros.fatGrams}g Fat), kết hợp sử dụng sản phẩm ${mainProteinSupp}.`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        }
      );
      if (res.ok) {
        const json = await res.json();
        const aiText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText && aiText.length > 80) {
          mealPlanMarkdown = aiText;
        }
      }
    } catch {
      // Giữ nguyên thực đơn chuẩn từ Rule Engine nếu mạng hoặc API key không khả dụng
    }
  }

  const reasoning =
    normalizedAllergies.length > 0
      ? `Hệ thống AI đã phát hiện bạn có cơ địa nhạy cảm/dị ứng với [${normalizedAllergies.join(", ")}]. Đã tự động loại bỏ ${excludedProducts.length} sản phẩm chứa thành phần kích ứng (${excludedProducts.map((e) => e.name).join(", ")}) và chọn lọc các sản phẩm tinh khiết 100% an toàn cho hệ tiêu hóa & tim mạch.`
      : `Dựa trên chỉ số TDEE ${macros.tdee.toLocaleString("vi-VN")} Kcal và mục tiêu ${goalLabelMap[input.fitnessGoal]}, hệ thống đề xuất bộ đôi Thực phẩm bổ sung hấp thụ nhanh kết hợp Gói tập tiêu chuẩn.`;

  // 5. Lưu lịch sử vào body_metrics_logs & ai_consultation_logs
  const targetUserId = input.userId || "user-member-01";
  const savedRecord = withTransaction((state) => {
    const metricsId = `metrics-${Date.now()}`;
    const aiLogId = `ai-consult-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newMetricsLog = {
      id: metricsId,
      userId: targetUserId,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      bodyFatPct: input.bodyFatPct ?? null,
      activityLevel: input.activityLevel,
      bmi,
      tdeeCalories: macros.tdee,
      fitnessGoal: input.fitnessGoal,
      allergies: normalizedAllergies,
      recordedAt: nowIso,
    };

    const newAiLog = {
      id: aiLogId,
      userId: targetUserId,
      metricsLogId: metricsId,
      targetMacros: {
        bmr: macros.bmr,
        tdee: macros.tdee,
        calories: macros.calories,
        proteinGrams: macros.proteinGrams,
        carbsGrams: macros.carbsGrams,
        fatGrams: macros.fatGrams,
      },
      excludedAllergens: normalizedAllergies,
      mealPlanMarkdown,
      recommendedItems: {
        supplementVariantIds: selectedSupplements.map((s) => s.variant.id),
        courseIds: recommendedCourses.map((c) => c.id),
        reasoning,
      },
      createdAt: nowIso,
    };

    state.bodyMetricsLogs.push(newMetricsLog);
    state.aiConsultationLogs.unshift(newAiLog);

    return { newMetricsLog, newAiLog };
  });

  return {
    bmi,
    bmiCategory,
    macros,
    excludedAllergens: normalizedAllergies,
    excludedProducts,
    mealPlanMarkdown,
    reasoning,
    recommendedSupplements: selectedSupplements,
    recommendedCourses,
    consultationId: savedRecord.newAiLog.id,
  };
}

