import { getDb, withTransaction } from "../db/runtime-db";

export interface CreatePtBookingInput {
  enrollmentId: string;
  memberId: string;
  trainerId: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  focusArea: string;
}

export function getTrainerSlotsForDate(trainerId: string, bookingDate: string) {
  const db = getDb();
  const dateObj = new Date(`${bookingDate}T00:00:00`);
  const dayOfWeek = isNaN(dateObj.getDay()) ? 1 : dateObj.getDay();

  const availabilities = db.trainerAvailabilities.filter(
    (a) => a.trainerId === trainerId && a.dayOfWeek === dayOfWeek && a.isActive
  );

  const existingBookings = db.ptBookings.filter(
    (b) =>
      b.trainerId === trainerId &&
      b.bookingDate === bookingDate &&
      b.status !== "CANCELLED"
  );

  return availabilities.map((slot) => {
    const booked = existingBookings.find((b) => b.startTime === slot.startTime);
    const bookedMember = booked ? db.users.find((u) => u.id === booked.memberId) : null;
    return {
      ...slot,
      isBooked: Boolean(booked),
      bookingId: booked?.id || null,
      bookingStatus: booked?.status || null,
      bookedByMemberName: bookedMember?.fullName || null,
      focusArea: booked?.focusArea || null,
    };
  });
}

export function createPtBooking(input: CreatePtBookingInput) {
  return withTransaction((db) => {
    const enrollment = db.userEnrollments.find((e) => e.id === input.enrollmentId);
    if (!enrollment) {
      throw new Error("Không tìm thấy thẻ tập của hội viên.");
    }

    if (enrollment.status !== "ACTIVE") {
      throw new Error("Thẻ tập không ở trạng thái kích hoạt.");
    }

    if (enrollment.remainingPtSessions <= 0) {
      throw new Error("Bạn đã hết số buổi tập PT 1-1 trong gói này. Vui lòng mua thêm gói PT.");
    }

    // Kiểm tra ràng buộc chống trùng lịch @@unique([trainerId, bookingDate, startTime])
    const conflict = db.ptBookings.find(
      (b) =>
        b.trainerId === input.trainerId &&
        b.bookingDate === input.bookingDate &&
        b.startTime === input.startTime &&
        b.status !== "CANCELLED"
    );

    if (conflict) {
      throw new Error(
        `Ca tập ${input.startTime} - ${input.endTime} ngày ${input.bookingDate} của HLV này đã có người đặt! Vui lòng chọn khung giờ khác.`
      );
    }

    const newBooking = {
      id: `booking-${Date.now()}`,
      enrollmentId: input.enrollmentId,
      memberId: input.memberId,
      trainerId: input.trainerId,
      bookingDate: input.bookingDate,
      startTime: input.startTime,
      endTime: input.endTime,
      focusArea: input.focusArea || "Tập toàn thân & Hiệu chỉnh kỹ thuật Compound",
      trainerNotes: null,
      status: "CONFIRMED" as const,
    };

    db.ptBookings.unshift(newBooking);

    return newBooking;
  });
}

