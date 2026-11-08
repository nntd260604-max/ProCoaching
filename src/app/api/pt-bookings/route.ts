import { NextRequest, NextResponse } from "next/server";
import {
  getTrainerSlotsForDate,
  createPtBooking,
  CreatePtBookingInput,
} from "@/lib/services/pt-booking.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const trainerId = req.nextUrl.searchParams.get("trainerId") || "user-trainer-01";
  const date =
    req.nextUrl.searchParams.get("date") || new Date().toISOString().split("T")[0];

  const slots = getTrainerSlotsForDate(trainerId, date);
  return NextResponse.json({ trainerId, date, slots });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreatePtBookingInput;
    const booking = createPtBooking(body);
    return NextResponse.json({ booking });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Không thể đặt lịch tập PT.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

