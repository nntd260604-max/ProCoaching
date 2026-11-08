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
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm font-medium text-slate-600">
        Đang tải chi tiết khóa học...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Danh sách Gói tập & Khóa học
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="solid-card p-6 sm:p-8 space-y-5">
            <div className="space-y-2.5">
              <span className="inline-block rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
                Huấn luyện viên: {course.trainerName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {course.title}
              </h1>
              <p className="text-sm font-medium leading-relaxed text-slate-700">
                {course.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Calendar className="h-5 w-5 text-emerald-600 mb-1.5" />
                <div className="text-xs font-medium text-slate-500">Thời hạn sử dụng</div>
                <div className="text-lg font-extrabold text-slate-900">
                  {course.durationDays} Ngày
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <UserCheck className="h-5 w-5 text-indigo-600 mb-1.5" />
                <div className="text-xs font-medium text-slate-500">Huấn luyện PT 1-1</div>
                <div className="text-lg font-extrabold text-indigo-700">
                  {course.ptSessionsIncluded} Buổi kèm riêng
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <QrCode className="h-5 w-5 text-emerald-600 mb-1.5" />
                <div className="text-xs font-medium text-slate-500">Thẻ vào cửa</div>
                <div className="text-lg font-extrabold text-emerald-700">Mã QR 60 giây</div>
              </div>
            </div>
          </div>

          {/* Curriculum Modules */}
          <div className="solid-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <PlaySquare className="h-5 w-5 text-indigo-600" />
                Nội Dung Giáo Trình Video
              </h2>
              <button
                type="button"
                onClick={() => router.push("/dashboard/member/courses/enroll-member-01")}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Vào phòng học thử →
              </button>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                >
                  <div className="text-sm font-bold text-slate-900">{mod.title}</div>
                  <div className="space-y-2">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Play className="h-3.5 w-3.5 text-indigo-600" />
                          <span className="font-semibold text-slate-800">{les.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {les.isFreePreview && (
                            <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              Xem thử
                            </span>
                          )}
                          <span className="font-mono text-slate-500">
                            {les.durationSeconds}s
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Purchase Card */}
        <div className="lg:col-span-5">
          <div className="solid-card p-6 space-y-5 sticky top-24">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
              <video
                src={course.previewVideoUrl}
                poster={course.thumbnailUrl}
                controls
                className="h-56 w-full object-cover"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500">Học phí trọn gói</div>
              <div className="font-mono text-3xl font-extrabold text-slate-900 mt-1">
                {course.price.toLocaleString("vi-VN")}đ
              </div>
            </div>

            <ul className="space-y-2.5 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Mở ngay thẻ hội viên QR 60 giây sau khi thanh toán
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Tự động lưu tiến độ bài giảng video đang học
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Đặt lịch tập 1-1 linh hoạt với {course.trainerName}
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition"
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm Vào Giỏ Hàng
              </button>

              <Link
                href="/dashboard/member/courses/enroll-member-01"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                <PlaySquare className="h-4 w-4 text-indigo-600" />
                Vào Phòng Học Video Mẫu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
