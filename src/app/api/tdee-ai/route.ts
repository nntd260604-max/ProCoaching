import { NextRequest, NextResponse } from "next/server";
import { generateAiNutritionConsultation, TdeeCalculationInput } from "@/lib/services/tdee-ai.service";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TdeeCalculationInput;
    if (!body.heightCm || !body.weightKg || !body.age) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Chiều cao, Cân nặng và Độ tuổi." },
        { status: 400 }
      );
    }

    const result = await generateAiNutritionConsultation({
      userId: body.userId || "user-member-01",
      gender: body.gender || "MALE",
      age: Number(body.age),
      heightCm: Number(body.heightCm),
      weightKg: Number(body.weightKg),
      bodyFatPct: body.bodyFatPct ? Number(body.bodyFatPct) : null,
      activityLevel: Number(body.activityLevel || 1.55),
      fitnessGoal: body.fitnessGoal || "MUSCLE_GAIN",
      allergies: Array.isArray(body.allergies) ? body.allergies : [],
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi xử lý tính toán TDEE & AI.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

