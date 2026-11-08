import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/runtime-db";
import { generateDynamicQrToken } from "@/lib/services/qr-checkin.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "user-member-01";
  const db = getDb();

  const member = db.users.find((u) => u.id === userId) || db.users[0];

  const enrollments = db.userEnrollments
    .filter((e) => e.userId === member.id)
    .map((e) => {
      const course = db.coursesMemberships.find((c) => c.id === e.courseId);
      const trainer = db.users.find((u) => u.id === e.assignedTrainerId);
      const modules = db.courseModules
        .filter((m) => m.courseId === e.courseId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((m) => ({
          ...m,
          lessons: db.courseLessons
            .filter((l) => l.moduleId === m.id)
            .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
            .map((l) => {
              const prog = db.userLessonProgress.find(
                (p) => p.userId === member.id && p.lessonId === l.id
              );
              return {
                ...l,
                progress: prog || {
                  watchedSeconds: 0,
                  lastPositionSec: 0,
                  isCompleted: false,
                  completedAt: null,
                },
              };
            }),
        }));

      const qrData = generateDynamicQrToken(e.id);

      return {
        ...e,
        course,
        trainerName: trainer?.fullName || "HLV Lê Hoàng Nam",
        trainerAvatar: trainer?.avatarUrl || null,
        modules,
        qrData,
      };
    });

  const bookings = db.ptBookings
    .filter((b) => b.memberId === member.id)
    .map((b) => {
      const trainer = db.users.find((u) => u.id === b.trainerId);
      const course = db.userEnrollments.find((e) => e.id === b.enrollmentId);
      return {
        ...b,
        trainerName: trainer?.fullName || "HLV GymHub",
        trainerAvatar: trainer?.avatarUrl || null,
        enrollmentId: course?.id || b.enrollmentId,
      };
    });

  const checkins = db.gymCheckins
    .filter((c) => c.memberId === member.id)
    .map((c) => {
      const staff = db.users.find((u) => u.id === c.verifiedById);
      return {
        ...c,
        verifiedByName: staff?.fullName || "Hệ thống Gate QR",
      };
    });

  const bodyMetrics = db.bodyMetricsLogs
    .filter((m) => m.userId === member.id)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  const aiConsultations = db.aiConsultationLogs.filter((a) => a.userId === member.id);

  const orders = db.orders
    .filter((o) => o.userId === member.id)
    .map((o) => {
      const items = db.orderItems
        .filter((i) => i.orderId === o.id)
        .map((i) => {
          const batch = i.allocatedBatchId
            ? db.inventoryBatches.find((b) => b.id === i.allocatedBatchId)
            : null;
          return {
            ...i,
            allocatedBatchCode: batch?.batchCode || null,
            allocatedBatchExpiry: batch?.expiryDate || null,
          };
        });
      return {
        ...o,
        items,
      };
    });

  const trainers = db.users
    .filter((u) => u.role === "TRAINER")
    .map((u) => ({
      ...u,
      profile: db.trainerProfiles.find((tp) => tp.userId === u.id) || null,
    }));

  return NextResponse.json({
    member,
    enrollments,
    bookings,
    checkins,
    bodyMetrics,
    aiConsultations,
    orders,
    trainers,
  });
}

