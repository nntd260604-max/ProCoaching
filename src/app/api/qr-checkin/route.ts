import { NextRequest, NextResponse } from "next/server";
import {
  generateDynamicQrToken,
  verifyAndProcessQrCheckin,
  VerifyQrCheckinInput,
} from "@/lib/services/qr-checkin.service";
import { getDb } from "@/lib/db/runtime-db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const enrollmentId = req.nextUrl.searchParams.get("enrollmentId") || "enroll-member-01";
    const tokenData = generateDynamicQrToken(enrollmentId);
    return NextResponse.json(tokenData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Không thể sinh mã QR động.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyQrCheckinInput;
    const result = verifyAndProcessQrCheckin(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Xác thực mã QR thất bại.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT() {
  // Helper API cho trang Trainer lấy danh sách lịch hẹn PT & lịch sử quét QR
  const db = getDb();
  const bookings = db.ptBookings.map((b) => {
    const member = db.users.find((u) => u.id === b.memberId);
    const trainer = db.users.find((u) => u.id === b.trainerId);
    const enrollment = db.userEnrollments.find((e) => e.id === b.enrollmentId);
    let liveQrToken = "";
    if (enrollment) {
      try {
        liveQrToken = generateDynamicQrToken(enrollment.id).qrToken;
      } catch {
        liveQrToken = "";
      }
    }
    return {
      ...b,
      memberName: member?.fullName || "Hội viên",
      memberPhone: member?.phone || "",
      memberAvatar: member?.avatarUrl || null,
      trainerName: trainer?.fullName || "HLV",
      remainingPtSessions: enrollment?.remainingPtSessions ?? 0,
      liveQrToken,
    };
  });

  const checkins = db.gymCheckins.map((c) => {
    const member = db.users.find((u) => u.id === c.memberId);
    const staff = db.users.find((u) => u.id === c.verifiedById);
    return {
      ...c,
      memberName: member?.fullName || "Hội viên",
      verifiedByName: staff?.fullName || "HLV / Lễ tân",
    };
  });

  return NextResponse.json({ bookings, checkins });
}

