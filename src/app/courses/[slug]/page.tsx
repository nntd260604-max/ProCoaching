"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PlaySquare,
  QrCode,
  UserCheck,
  Calendar,
  ShoppingBag,
  CheckCircle2,
  Play,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  courseType: string;
  level: string;
  targetGoal: string;
  price: number;
  durationDays: number;
  ptSessionsIncluded: number;
  thumbnailUrl: string;
  previewVideoUrl: string;
  description: string;
  trainerName: string;
  trainerSpecialties: string;
  modules: {
    id: string;
    title: string;
    sortOrder: number;
    lessons: {
      id: string;
      title: string;
      durationSeconds: number;
      workoutGuideMd: string;
      isFreePreview: boolean;
    }[];
  }[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || "");
  const { addItem, setCartOpen } = useHybridCartStore();

  const [course, setCourse] = useState<CourseDetail | null>(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.courses || []).find((c: CourseDetail) => c.slug === slug);
        if (found) setCourse(found);
      });
  }, [slug]);

  if (!course) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-400">
        Đang tải chi tiết khóa học & gói tập...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Danh sách Khóa học & Gói tập
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="inline-block rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
              Loại gói: {course.courseType} • Trình độ: {course.level}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{course.title}</h1>
            <p className="text-sm leading-relaxed text-slate-300">{course.description}</p>
          </div>

          {/* Quyền lợi Gói Tập */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <Calendar className="h-5 w-5 text-emerald-400 mb-1.5" />
              <div className="text-xs text-slate-400">Thời hạn thẻ tập</div>
              <div className="text-lg font-black text-white">{course.durationDays} Ngày</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <UserCheck className="h-5 w-5 text-orange-400 mb-1.5" />
              <div className="text-xs text-slate-400">Huấn luyện PT 1-1</div>
              <div className="text-lg font-black text-orange-400">
                {course.ptSessionsIncluded} Buổi kèm riêng
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <QrCode className="h-5 w-5 text-sky-400 mb-1.5" />
              <div className="text-xs text-slate-400">Check-in Phòng tập</div>
              <div className="text-lg font-black text-sky-400">Mã QR Động 60s</div>
            </div>
          </div>

          {/* Danh sách Chương & Bài giảng Video */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlaySquare className="h-5 w-5 text-emerald-400" />
                Đề Cương Chương Học & Bài Giảng Video (`course_modules`)
              </h2>
              <button
                type="button"
                onClick={() => router.push("/dashboard/member/courses/enroll-member-01")}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                Vào Phòng Học Video Demo →
              </button>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 space-y-3"
                >
                  <div className="text-sm font-bold text-emerald-400">{mod.title}</div>
                  <div className="space-y-2">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/70 px-3.5 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Play className="h-3.5 w-3.5 text-orange-400" />
                          <span className="font-semibold text-white">{les.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {les.isFreePreview && (
                            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                              Học thử miễn phí
                            </span>
                          )}
                          <span className="text-slate-400">{les.durationSeconds}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Purchase Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 sticky top-24">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <video
                src={course.previewVideoUrl}
                poster={course.thumbnailUrl}
                controls
                className="h-56 w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-400">Học phí / Giá gói tập niêm yết</div>
              <div className="text-3xl font-black text-emerald-400">
                {course.price.toLocaleString("vi-VN")}đ
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                Cấp ngay thẻ tập Mã QR Động 60s sau khi thanh toán
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                Tự động lưu vị trí giây đang xem dở (`last_position_sec`)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                Đặt lịch tập 1-1 với {course.trainerName} chống trùng ca
              </li>
            </ul>

            <div className="space-y-2.5 pt-2">
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm Gói Tập Vào Giỏ Hàng Hỗn Hợp
              </button>

              <Link
                href="/dashboard/member/courses/enroll-member-01"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
              >
                <PlaySquare className="h-4 w-4" />
                Mở Trình Phát Video Chống Tua Bài (Demo Học Viên)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

