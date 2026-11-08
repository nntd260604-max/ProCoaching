import crypto from "crypto";
import { getDb, withTransaction } from "../db/runtime-db";

export function computeHmacSignature(secretKey: string, enrollmentId: string, timeWindow: number): string {
  return crypto
    .createHmac("sha256", secretKey)
    .update(`${enrollmentId}:${timeWindow}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
}

export function generateDynamicQrToken(enrollmentId: string) {
  const db = getDb();
  const enrollment = db.userEnrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) {
    throw new Error("Không tìm thấy thẻ tập của hội viên.");
  }

  const nowMs = Date.now();
  const timeWindow = Math.floor(nowMs / 60000);
  const secondsIntoWindow = Math.floor((nowMs % 60000) / 1000);
  const expiresInSeconds = 60 - secondsIntoWindow;

  const signature = computeHmacSignature(enrollment.qrSecretKey, enrollment.id, timeWindow);
  const qrToken = `GHQR.${enrollment.id}.${timeWindow}.${signature}`;

  const member = db.users.find((u) => u.id === enrollment.userId);
  const course = db.coursesMemberships.find((c) => c.id === enrollment.courseId);

  return {
    enrollmentId: enrollment.id,
    memberName: member?.fullName || "Hội viên",
    courseTitle: course?.title || "Gói tập GymHub",
    qrToken,
    signature,
    timeWindow,
    expiresInSeconds,
    remainingPtSessions: enrollment.remainingPtSessions,
    expiresAt: enrollment.expiresAt,
    status: enrollment.status,
  };
}

export interface VerifyQrCheckinInput {
  qrToken: string;
  checkinType: "GYM_ENTRY" | "PT_SESSION";
  verifiedById?: string;
  ptBookingId?: string | null;
  trainerNotes?: string | null;
}

export function verifyAndProcessQrCheckin(input: VerifyQrCheckinInput) {
  const rawToken = (input.qrToken || "").trim();
  const parts = rawToken.split(".");

  if (parts.length !== 4 || parts[0] !== "GHQR") {
    throw new Error(
      "Định dạng mã QR không hợp lệ. Mã chuẩn phải có cấu trúc GHQR.<EnrollmentID>.<TimestampWindow>.<HMAC>"
    );
  }

  const [, enrollmentId, windowStr, providedSig] = parts;
  const tokenWindow = parseInt(windowStr, 10);
  if (isNaN(tokenWindow)) {
    throw new Error("Dấu thời gian (Timestamp Window) trong mã QR không hợp lệ.");
  }

  return withTransaction((db) => {
    const enrollment = db.userEnrollments.find((e) => e.id === enrollmentId);
    if (!enrollment) {
      throw new Error("Không tìm thấy thẻ tập tương ứng với mã QR này.");
    }

    if (enrollment.status !== "ACTIVE") {
      throw new Error(`Thẻ tập hiện đang ở trạng thái ${enrollment.status}, không thể Check-in.`);
    }

    if (new Date(enrollment.expiresAt).getTime() < Date.now()) {
      throw new Error("Thẻ tập đã hết hạn sử dụng. Vui lòng gia hạn gói tập.");
    }

    // Kiểm tra chữ ký số TOTP 60 giây (Chấp nhận cửa sổ hiện tại hoặc lệch tối đa 2 phút khi demo chuyển tab)
    const currentWindow = Math.floor(Date.now() / 60000);
    if (Math.abs(currentWindow - tokenWindow) > 2) {
      throw new Error(
        "Mã QR Động 60 giây đã hết hạn! Vui lòng lấy mã QR mới nhất trên màn hình Thẻ Tập của Học viên."
      );
    }

    const expectedSig = computeHmacSignature(enrollment.qrSecretKey, enrollment.id, tokenWindow);
    if (expectedSig !== providedSig.toUpperCase()) {
      throw new Error("Chữ ký bảo mật HMAC-SHA256 không khớp! Phát hiện mã QR giả mạo.");
    }

    const qrTokenHash = crypto.createHash("sha256").update(rawToken).digest("hex").slice(0, 32);

    let updatedBooking = null;

    if (input.checkinType === "PT_SESSION") {
      if (enrollment.remainingPtSessions <= 0) {
        throw new Error("Hội viên đã sử dụng hết số buổi tập PT 1-1 trong gói này.");
      }

      // Tìm lịch hẹn PT cần điểm danh
      const targetBooking = input.ptBookingId
        ? db.ptBookings.find((b) => b.id === input.ptBookingId)
        : db.ptBookings.find(
            (b) => b.enrollmentId === enrollment.id && b.status === "CONFIRMED"
          );

      if (targetBooking) {
        if (targetBooking.status === "COMPLETED") {
          throw new Error("Ca tập PT này đã được điểm danh hoàn thành trước đó.");
        }
        targetBooking.status = "COMPLETED";
        if (input.trainerNotes && input.trainerNotes.trim().length > 0) {
          targetBooking.trainerNotes = input.trainerNotes.trim();
        }
        updatedBooking = targetBooking;
      }

      // Trừ 1 buổi PT trong thẻ hội viên
      enrollment.remainingPtSessions = Math.max(0, enrollment.remainingPtSessions - 1);
    }

    const newCheckin = {
      id: `chk-${Date.now()}`,
      enrollmentId: enrollment.id,
      memberId: enrollment.userId,
      ptBookingId: updatedBooking?.id || input.ptBookingId || null,
      verifiedById: input.verifiedById || "user-trainer-01",
      checkinType: input.checkinType,
      qrTokenHash: `sha256-${qrTokenHash}`,
      checkinTime: new Date().toISOString(),
      checkoutTime: null,
    };

    db.gymCheckins.unshift(newCheckin);

    const member = db.users.find((u) => u.id === enrollment.userId);
    const course = db.coursesMemberships.find((c) => c.id === enrollment.courseId);

    return {
      checkin: newCheckin,
      memberName: member?.fullName || "Hội viên",
      courseTitle: course?.title || "Gói tập",
      remainingPtSessions: enrollment.remainingPtSessions,
      completedBooking: updatedBooking,
    };
  });
}

