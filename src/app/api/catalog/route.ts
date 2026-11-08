import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/runtime-db";
import { computeBatchStatus } from "@/lib/services/admin-warehouse.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const now = new Date();

  const supplements = db.supplementProducts.map((prod) => {
    const category = db.categories.find((c) => c.id === prod.categoryId);
    const variants = db.supplementVariants
      .filter((v) => v.productId === prod.id)
      .map((v) => {
        const batches = db.inventoryBatches
          .filter((b) => b.variantId === v.id)
          .map((b) => ({
            ...b,
            batchStatus: computeBatchStatus(b.expiryDate, b.remainingQuantity),
          }))
          .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

        const nextFefoBatch = batches.find(
          (b) =>
            b.remainingQuantity > 0 &&
            b.batchStatus !== "EXPIRED" &&
            new Date(b.expiryDate).getTime() > now.getTime()
        );

        return {
          ...v,
          batches,
          nextFefoBatch: nextFefoBatch || null,
        };
      });

    return {
      ...prod,
      categoryName: category?.name || "Thực phẩm bổ sung",
      variants,
    };
  });

  const courses = db.coursesMemberships.map((course) => {
    const category = db.categories.find((c) => c.id === course.categoryId);
    const trainer = db.users.find((u) => u.id === course.trainerId);
    const trainerProfile = db.trainerProfiles.find((tp) => tp.userId === course.trainerId);
    const modules = db.courseModules
      .filter((m) => m.courseId === course.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((mod) => ({
        ...mod,
        lessons: db.courseLessons
          .filter((l) => l.moduleId === mod.id)
          .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)),
      }));

    return {
      ...course,
      categoryName: category?.name || "Gói tập & Khóa học",
      trainerName: trainer?.fullName || "HLV GymHub",
      trainerAvatar: trainer?.avatarUrl || null,
      trainerSpecialties: trainerProfile?.specialties || "",
      modules,
    };
  });

  const trainers = db.users
    .filter((u) => u.role === "TRAINER")
    .map((u) => ({
      ...u,
      profile: db.trainerProfiles.find((tp) => tp.userId === u.id) || null,
    }));

  return NextResponse.json({
    categories: db.categories,
    supplements,
    courses,
    trainers,
    vouchers: db.vouchers,
    users: db.users,
  });
}

