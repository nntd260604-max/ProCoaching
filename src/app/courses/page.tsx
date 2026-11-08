"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlaySquare,
  QrCode,
  UserCheck,
  Calendar,
  ShoppingBag,
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
      label: "Gói Toàn Diện (Thẻ Tập + PT + Video)",
      badgeClass: "bg-indigo-600 text-white",
    },
    ONLINE_VIDEO: {
      label: "Khóa Học Video",
      badgeClass: "bg-emerald-600 text-white",
    },
    PT_PACKAGE: {
      label: "Huấn Luyện Kèm PT 1-1",
      badgeClass: "bg-indigo-600 text-white",
    },
    GYM_MEMBERSHIP: {
      label: "Thẻ Hội Viên Phòng Tập",
      badgeClass: "bg-emerald-600 text-white",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {/* Top Focal Glass Panel */}
      <div className="glass-panel p-6 sm:p-8 space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
            <PlaySquare className="h-3.5 w-3.5" />
            Kích Hoạt Tự Động Ngay Sau Khi Thanh Toán
          </div>
          <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Khóa Tập Video, Thẻ Hội Viên & Gói Kèm PT 1-1
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-700 max-w-3xl">
            Mở khóa ngay giáo trình video hướng dẫn kỹ thuật, cấp thẻ QR ra vào phòng tập và đặt lịch tập 1-1 cùng Huấn luyện viên.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: "Tất cả gói tập" },
            { id: "HYBRID_COMBO", label: "Gói Toàn Diện" },
            { id: "PT_PACKAGE", label: "Huấn Luyện PT 1-1" },
            { id: "ONLINE_VIDEO", label: "Khóa Học Video" },
            { id: "GYM_MEMBERSHIP", label: "Thẻ Phòng Tập" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                selectedType === tab.id
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid: Solid White Cards */}
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
              className="solid-card p-6 flex flex-col justify-between hover:border-indigo-300 transition"
            >
              <div className="space-y-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="relative block h-56 overflow-hidden rounded-xl border border-slate-100 bg-slate-100"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-lg px-3 py-1 text-xs font-bold shadow-sm ${tInfo.badgeClass}`}
                  >
                    {tInfo.label}
                  </span>
                </Link>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-emerald-700">
                    <Calendar className="h-3.5 w-3.5" />
                    Thời hạn {course.durationDays} ngày
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-indigo-700">
                    <UserCheck className="h-3.5 w-3.5" />
                    {course.ptSessionsIncluded > 0
                      ? `${course.ptSessionsIncluded} buổi PT 1-1`
                      : "Tự học Video"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
                    <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                    Thẻ QR phòng tập
                  </span>
                </div>

                <div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="block text-xl font-extrabold text-slate-900 hover:text-indigo-600 transition"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1">
                  <div className="font-bold text-slate-800">
                    Huấn luyện viên:{" "}
                    <span className="text-indigo-600">{course.trainerName}</span>
                  </div>
                  <div className="font-medium text-slate-600">
                    Giáo trình: <strong>{course.modules.length} chương</strong> •{" "}
                    <strong>{totalLessons} bài giảng video</strong>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-500">Học phí trọn gói</div>
                  <div className="font-mono text-2xl font-extrabold text-slate-900">
                    {course.price.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Xem giáo trình
                  </Link>
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
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-sm"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
