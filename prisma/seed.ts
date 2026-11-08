import { PrismaClient } from "@prisma/client";
import { createInitialSeedData } from "../src/lib/db/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Bắt đầu khởi tạo dữ liệu mẫu (Seed Data) cho GymHub Hybrid Platform (19 bảng)...");

  const data = createInitialSeedData();

  // Xóa dữ liệu cũ theo thứ tự khóa ngoại
  await prisma.orderItem.deleteMany();
  await prisma.gymCheckin.deleteMany();
  await prisma.ptBooking.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.userEnrollment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.courseLesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.courseMembership.deleteMany();
  await prisma.inventoryBatch.deleteMany();
  await prisma.supplementVariant.deleteMany();
  await prisma.supplementProduct.deleteMany();
  await prisma.category.deleteMany();
  await prisma.aiConsultationLog.deleteMany();
  await prisma.bodyMetricsLog.deleteMany();
  await prisma.trainerAvailability.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Tạo Users
  for (const u of data.users) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        passwordHash: u.passwordHash,
        fullName: u.fullName,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        role: u.role,
        status: u.status,
        createdAt: new Date(u.createdAt),
      },
    });
  }

  // 2. Tạo Trainer Profiles
  for (const tp of data.trainerProfiles) {
    await prisma.trainerProfile.create({
      data: {
        id: tp.id,
        userId: tp.userId,
        bio: tp.bio,
        specialties: tp.specialties,
        certifications: tp.certifications,
        yearsExperience: tp.yearsExperience,
        ratingAvg: tp.ratingAvg,
      },
    });
  }

  // 3. Tạo Categories
  for (const c of data.categories) {
    await prisma.category.create({
      data: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        categoryType: c.categoryType,
        parentId: c.parentId,
      },
    });
  }

  // 4. Tạo Supplement Products
  for (const p of data.supplementProducts) {
    await prisma.supplementProduct.create({
      data: {
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        originCountry: p.originCountry,
        description: p.description,
        nutritionFacts: p.nutritionFacts,
        allergenTags: p.allergenTags,
        targetGoal: p.targetGoal,
        isActive: p.isActive,
      },
    });
  }

  // 5. Tạo Supplement Variants
  for (const v of data.supplementVariants) {
    await prisma.supplementVariant.create({
      data: {
        id: v.id,
        productId: v.productId,
        sku: v.sku,
        flavor: v.flavor,
        weightLabel: v.weightLabel,
        servingsCount: v.servingsCount,
        weightGrams: v.weightGrams,
        price: v.price,
        salePrice: v.salePrice,
        stockQuantity: v.stockQuantity,
        imageUrl: v.imageUrl,
      },
    });
  }

  // 6. Tạo Inventory Batches (Chuẩn FEFO)
  for (const b of data.inventoryBatches) {
    await prisma.inventoryBatch.create({
      data: {
        id: b.id,
        variantId: b.variantId,
        batchCode: b.batchCode,
        supplierName: b.supplierName,
        importPrice: b.importPrice,
        initialQuantity: b.initialQuantity,
        remainingQuantity: b.remainingQuantity,
        manufacturedDate: new Date(b.manufacturedDate),
        expiryDate: new Date(b.expiryDate),
        batchStatus: b.batchStatus,
        importedAt: new Date(b.importedAt),
      },
    });
  }

  // 7. Tạo Courses & Memberships
  for (const cm of data.coursesMemberships) {
    await prisma.courseMembership.create({
      data: {
        id: cm.id,
        categoryId: cm.categoryId,
        trainerId: cm.trainerId,
        title: cm.title,
        slug: cm.slug,
        courseType: cm.courseType,
        level: cm.level,
        targetGoal: cm.targetGoal,
        price: cm.price,
        durationDays: cm.durationDays,
        ptSessionsIncluded: cm.ptSessionsIncluded,
        thumbnailUrl: cm.thumbnailUrl,
        previewVideoUrl: cm.previewVideoUrl,
      },
    });
  }

  // 8. Tạo Course Modules
  for (const m of data.courseModules) {
    await prisma.courseModule.create({
      data: {
        id: m.id,
        courseId: m.courseId,
        title: m.title,
        sortOrder: m.sortOrder,
      },
    });
  }

  // 9. Tạo Course Lessons
  for (const l of data.courseLessons) {
    await prisma.courseLesson.create({
      data: {
        id: l.id,
        moduleId: l.moduleId,
        title: l.title,
        videoUrl: l.videoUrl,
        durationSeconds: l.durationSeconds,
        workoutGuideMd: l.workoutGuideMd,
        isFreePreview: l.isFreePreview,
        sortOrder: Number(l.sortOrder),
      },
    });
  }

  // 10. Tạo Vouchers
  for (const v of data.vouchers) {
    await prisma.voucher.create({
      data: {
        id: v.id,
        code: v.code,
        discountType: v.discountType,
        discountValue: v.discountValue,
        minOrderValue: v.minOrderValue,
        usageLimit: v.usageLimit,
        usedCount: v.usedCount,
        validUntil: new Date(v.validUntil),
      },
    });
  }

  // 11. Tạo Orders
  for (const o of data.orders) {
    await prisma.order.create({
      data: {
        id: o.id,
        orderCode: o.orderCode,
        userId: o.userId,
        voucherId: o.voucherId,
        hasPhysicalItems: o.hasPhysicalItems,
        shippingAddress: o.shippingAddress ?? undefined,
        subtotalAmount: o.subtotalAmount,
        shippingFee: o.shippingFee,
        discountAmount: o.discountAmount,
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        fulfillmentStatus: o.fulfillmentStatus,
        createdAt: new Date(o.createdAt),
      },
    });
  }

  // 12. Tạo Order Items (kèm allocatedBatchId theo FEFO)
  for (const oi of data.orderItems) {
    await prisma.orderItem.create({
      data: {
        id: oi.id,
        orderId: oi.orderId,
        itemType: oi.itemType,
        supplementVariantId: oi.supplementVariantId,
        allocatedBatchId: oi.allocatedBatchId,
        courseId: oi.courseId,
        itemNameSnapshot: oi.itemNameSnapshot,
        quantity: oi.quantity,
        unitPrice: oi.unitPrice,
        lineTotal: oi.lineTotal,
      },
    });
  }

  // 13. Tạo User Enrollments
  for (const ue of data.userEnrollments) {
    await prisma.userEnrollment.create({
      data: {
        id: ue.id,
        userId: ue.userId,
        courseId: ue.courseId,
        orderId: ue.orderId,
        assignedTrainerId: ue.assignedTrainerId,
        qrSecretKey: ue.qrSecretKey,
        activatedAt: new Date(ue.activatedAt),
        expiresAt: new Date(ue.expiresAt),
        totalPtSessions: ue.totalPtSessions,
        remainingPtSessions: ue.remainingPtSessions,
        progressPct: ue.progressPct,
        status: ue.status,
      },
    });
  }

  // 14. Tạo User Lesson Progress
  for (const ulp of data.userLessonProgress) {
    await prisma.userLessonProgress.create({
      data: {
        id: ulp.id,
        enrollmentId: ulp.enrollmentId,
        userId: ulp.userId,
        lessonId: ulp.lessonId,
        watchedSeconds: ulp.watchedSeconds,
        lastPositionSec: ulp.lastPositionSec,
        isCompleted: ulp.isCompleted,
        completedAt: ulp.completedAt ? new Date(ulp.completedAt) : null,
      },
    });
  }

  // 15. Tạo Trainer Availabilities
  for (const ta of data.trainerAvailabilities) {
    await prisma.trainerAvailability.create({
      data: {
        id: ta.id,
        trainerId: ta.trainerId,
        dayOfWeek: ta.dayOfWeek,
        startTime: ta.startTime,
        endTime: ta.endTime,
        isActive: ta.isActive,
      },
    });
  }

  // 16. Tạo PT Bookings
  for (const pb of data.ptBookings) {
    await prisma.ptBooking.create({
      data: {
        id: pb.id,
        enrollmentId: pb.enrollmentId,
        memberId: pb.memberId,
        trainerId: pb.trainerId,
        bookingDate: new Date(pb.bookingDate),
        startTime: pb.startTime,
        endTime: pb.endTime,
        focusArea: pb.focusArea,
        trainerNotes: pb.trainerNotes,
        status: pb.status,
      },
    });
  }

  // 17. Tạo Gym Checkins
  for (const gc of data.gymCheckins) {
    await prisma.gymCheckin.create({
      data: {
        id: gc.id,
        enrollmentId: gc.enrollmentId,
        memberId: gc.memberId,
        ptBookingId: gc.ptBookingId,
        verifiedById: gc.verifiedById,
        checkinType: gc.checkinType,
        qrTokenHash: gc.qrTokenHash,
        checkinTime: new Date(gc.checkinTime),
        checkoutTime: gc.checkoutTime ? new Date(gc.checkoutTime) : null,
      },
    });
  }

  // 18. Tạo Body Metrics Logs
  for (const bm of data.bodyMetricsLogs) {
    await prisma.bodyMetricsLog.create({
      data: {
        id: bm.id,
        userId: bm.userId,
        heightCm: bm.heightCm,
        weightKg: bm.weightKg,
        bodyFatPct: bm.bodyFatPct,
        activityLevel: bm.activityLevel,
        bmi: bm.bmi,
        tdeeCalories: bm.tdeeCalories,
        fitnessGoal: bm.fitnessGoal,
        allergies: bm.allergies,
        recordedAt: new Date(bm.recordedAt),
      },
    });
  }

  // 19. Tạo AI Consultation Logs
  for (const ai of data.aiConsultationLogs) {
    await prisma.aiConsultationLog.create({
      data: {
        id: ai.id,
        userId: ai.userId,
        metricsLogId: ai.metricsLogId,
        targetMacros: ai.targetMacros,
        excludedAllergens: ai.excludedAllergens,
        mealPlanMarkdown: ai.mealPlanMarkdown,
        recommendedItems: ai.recommendedItems,
        createdAt: new Date(ai.createdAt),
      },
    });
  }

  console.log("✅ Đã khởi tạo thành công toàn bộ 19 bảng dữ liệu mẫu cho GymHub Hybrid Platform!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi chạy seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

