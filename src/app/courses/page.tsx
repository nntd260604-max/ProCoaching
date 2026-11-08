"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlaySquare,
  QrCode,
  UserCheck,
  Calendar,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  courseType: "ONLINE_VIDEO" | "GYM_MEMBERSHIP" | "PT_PACKAGE" | "HYBRID_COMBO";
  level: string;
  targetGoal: string;
  price: number;
  durationDays: number;
  ptSessionsIncluded: number;
  thumbnailUrl: string;
  description: string;
  trainerName: string;
  trainerSpecialties: string;
  modules: {
    id: string;
    title: string;
    lessons: { id: string; title: string; durationSeconds: number }[];
  }[];
}

export default function CoursesPage() {
  const { addItem, setCartOpen } = useHybridCartStore();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch(() => {});
  }, []);

  const filtered = courses.filter((c) =>
    selectedType === "ALL" ? true : c.courseType === selectedType
  );

  const typeLabels: Record<string, { label: string; badgeClass: string }> = {
    HYBRID_COMBO: {
      label: "HYBRID_COMBO (Thẻ Tập + PT + Video)",
      badgeClass: "bg-gradient-to-r from-emerald-500 to-orange-500 text-slate-950",
    },
    ONLINE_VIDEO: {
      label: "ONLINE_VIDEO (Khóa Học Video)",
      badgeClass: "bg-sky-500 text-slate-950",
    },
    PT_PACKAGE: {
      label: "PT_PACKAGE (Gói Kèm PT 1-1)",
      badgeClass: "bg-orange-500 text-slate-950",
    },
    GYM_MEMBERSHIP: {
      label: "GYM_MEMBERSHIP (Thẻ Tập QR 60s)",
      badgeClass: "bg-emerald-500 text-slate-950",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
          <PlaySquare className="h-3.5 w-3.5" />
          Kích Hoạt Kỹ Thuật Số Ngay Sau Khi Thanh Toán (`user_enrollments`)
        </div>
        <h1 className="mt-3 text-2xl sm:text-4xl font-black text-white">
          Khóa Học Video Trực Tuyến, Thẻ Tập QR & Gói Huấn Luyện PT 1-1
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl">
          Sau khi thanh toán, hệ thống tự động sinh khóa bí mật{" "}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-emerald-300">qr_secret_key</code>{" "}
          để mở thẻ ra vào phòng tập 60 giây, cộng số buổi PT 1-1 và mở khóa toàn bộ bài giảng Video chống tua bài.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "ALL", label: "Tất cả Gói Tập & Khóa Học" },
          { id: "HYBRID_COMBO", label: "Combo Toàn Diện (HYBRID_COMBO)" },
          { id: "PT_PACKAGE", label: "Huấn Luyện PT 1-1 (PT_PACKAGE)" },
          { id: "ONLINE_VIDEO", label: "Khóa Học Video (ONLINE_VIDEO)" },
          { id: "GYM_MEMBERSHIP", label: "Thẻ Phòng Tập (GYM_MEMBERSHIP)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedType(tab.id)}
            className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
              selectedType === tab.id
                ? "border-emerald-500 bg-emerald-500 text-slate-950"
                : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered.map((course) => {
          const tInfo = typeLabels[course.courseType] || typeLabels.ONLINE_VIDEO;
          const totalLessons = course.modules.reduce(
            (sum, m) => sum + (m.lessons?.length || 0),
            0
          );

          return (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/75 overflow-hidden hover:border-emerald-500/50 transition"
            >
              <div>
                <div className="relative h-60 bg-slate-950">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-black shadow-md ${tInfo.badgeClass}`}
                    >
                      {tInfo.label}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 font-semibold text-emerald-400">
                      <Calendar className="h-3.5 w-3.5" />
                      Thời hạn: {course.durationDays} ngày
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 font-semibold text-orange-400">
                      <UserCheck className="h-3.5 w-3.5" />
                      {course.ptSessionsIncluded > 0
                        ? `Tặng ${course.ptSessionsIncluded} buổi PT 1-1`
                        : "Tự học Video Online"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 font-semibold text-sky-400">
                      <QrCode className="h-3.5 w-3.5" />
                      Cấp Thẻ QR Động 60s
                    </span>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="block text-xl font-black text-white hover:text-emerald-400 transition"
                  >
                    {course.title}
                  </Link>

                  <p className="text-xs leading-relaxed text-slate-400">
                    {course.description}
                  </p>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs space-y-1.5">
                    <div className="font-bold text-slate-200">
                      Giảng viên / HLV phụ trách:{" "}
                      <span className="text-emerald-400">{course.trainerName}</span>
                    </div>
                    <div className="text-slate-400">
                      Giáo trình bao gồm: <strong>{course.modules.length} chương</strong> •{" "}
                      <strong>{totalLessons} bài giảng video kỹ thuật</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 mt-2">
                <div className="pt-4">
                  <div className="text-xs text-slate-400">Trọn gói (Không phát sinh phụ phí)</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {course.price.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        id: course.id,
                        itemType: "COURSE_MEMBERSHIP",
                        courseId: course.id,
                        name: course.title,
                        subtitle: `Hiệu lực ${course.durationDays} ngày • ${course.ptSessionsIncluded} buổi PT 1-1`,
                        unitPrice: course.price,
                        imageUrl: course.thumbnailUrl,
                        skuOrBadge: course.courseType,
                      });
                      setCartOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-slate-950 hover:bg-emerald-400 transition"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Đăng Ký Gói Ngay
                  </button>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Xem Giáo Trình
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

