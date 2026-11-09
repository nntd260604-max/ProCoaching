"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Package,
  ArrowRight,
  UserCheck,
  Dumbbell,
  ShieldCheck,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";
import { GlassPanel, SolidCard, StatusBadge } from "@/components/ui/Surface";

interface SupplementItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  targetGoal: string;
  allergenTags: string[];
  variants: {
    id: string;
    sku: string;
    flavor: string;
    weightLabel: string;
    price: number;
    salePrice: number | null;
    stockQuantity: number;
    imageUrl: string;
  }[];
}

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  courseType: string;
  price: number;
  durationDays: number;
  ptSessionsIncluded: number;
  thumbnailUrl: string;
  trainerName: string;
}

const GOAL_LABEL: Record<string, string> = {
  MUSCLE_GAIN: "Tăng cơ",
  FAT_LOSS: "Giảm mỡ",
  ENDURANCE: "Tăng sức bền",
  RECOVERY: "Phục hồi",
};

const COURSE_TYPE_LABEL: Record<string, string> = {
  HYBRID_COMBO: "Combo Thẻ Tập + PT + Video",
  ONLINE_VIDEO: "Khóa học Video",
  PT_PACKAGE: "Gói PT 1-1",
  GYM_MEMBERSHIP: "Thẻ phòng tập",
};

export default function HomePage() {
  const addItem = useHybridCartStore((s) => s.addItem);
  const [supplements, setSupplements] = useState<SupplementItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        if (data.supplements) setSupplements(data.supplements.slice(0, 3));
        if (data.courses) setCourses(data.courses.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-16">
      {/* Tầng 2: Khối Tiêu Điểm Hero (Selective Glass Panel) */}
      <GlassPanel as="section" className="p-8 sm:p-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck
                className="h-3.5 w-3.5 text-emerald-600"
                aria-hidden="true"
              />
              Hệ sinh thái Thể hình & Dinh dưỡng Toàn diện
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.15] text-balance">
              Tập luyện chuẩn khoa học & dinh dưỡng cá nhân hóa cùng{" "}
              <span className="text-emerald-600" translate="no">
                GymHub
              </span>
            </h1>

            <p className="text-base font-medium text-slate-700 leading-relaxed max-w-2xl text-pretty">
              Tính chỉ số BMI/TDEE kết hợp AI gợi ý thực đơn lọc dị ứng, đặt lịch tập 1-1 cùng Huấn luyện viên cá nhân, học video trực tuyến và mua sắm thực phẩm bổ sung chính hãng.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link
                href="/tdee-calculator"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Đo BMI/TDEE & Nhận Thực Đơn AI
              </Link>
              <Link
                href="/supplements"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <Package
                  className="h-4 w-4 text-indigo-600"
                  aria-hidden="true"
                />
                Cửa hàng Thực phẩm bổ sung
              </Link>
            </div>
          </div>

          {/* 3 Điểm Nhấn Dịch Vụ (Nền đặc bg-white bên trong tấm kính để không lồng blur) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Dumbbell className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Thẻ Tập Mã QR Động 60s & Khóa Học Video
                </h2>
                <p className="text-xs font-medium text-slate-700 mt-1 text-pretty">
                  Check-in phòng tập bảo mật mỗi 60 giây và tự động lưu tiến độ bài giảng video.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <UserCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Đặt Lịch Tập 1-1 Cùng Huấn Luyện Viên
                </h2>
                <p className="text-xs font-medium text-slate-700 mt-1 text-pretty">
                  Chọn khung giờ rảnh của PT theo thời gian thực và theo dõi nhận xét sau mỗi buổi.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Package className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Thực Phẩm Bổ Sung Xuất Kho Hạn Mới Nhất
                </h2>
                <p className="text-xs font-medium text-slate-700 mt-1 text-pretty">
                  Cam kết hạn sử dụng minh bạch và tự động sàng lọc thành phần dị ứng Lactose, Caffeine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Tầng 1: Danh sách Thực phẩm bổ sung nổi bật */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 text-balance">
              Thực phẩm bổ sung nổi bật
            </h2>
            <p className="text-sm font-medium text-slate-700 mt-1">
              Sàng lọc rõ nhãn dị ứng và cam kết hạn sử dụng mới nhất
            </p>
          </div>
          <Link
            href="/supplements"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {supplements.map((prod) => {
            const v = prod.variants[0];
            if (!v) return null;
            const unitPrice = v.salePrice ?? v.price;

            return (
              <SolidCard
                key={prod.id}
                className="p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* 1. Hình ảnh */}
                  <Link
                    href={`/supplements/${prod.slug}`}
                    className="block overflow-hidden rounded-xl bg-slate-100 h-52"
                  >
                    <img
                      src={v.imageUrl}
                      alt={prod.name}
                      width={480}
                      height={320}
                      loading="lazy"
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* 2. Tối đa 2 Badge nhỏ */}
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge tone="indigo">
                      {GOAL_LABEL[prod.targetGoal] || prod.targetGoal}
                    </StatusBadge>
                    {prod.allergenTags.length === 0 ? (
                      <StatusBadge tone="emerald">
                        Không Lactose / Caffeine
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="amber">
                        Chứa: {prod.allergenTags.join(", ")}
                      </StatusBadge>
                    )}
                  </div>

                  {/* 3. Tên + Thương hiệu */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {prod.brand} • {v.weightLabel}
                    </div>
                    <Link
                      href={`/supplements/${prod.slug}`}
                      className="mt-1 block text-base font-bold text-slate-900 hover:text-emerald-600 line-clamp-2 transition-colors"
                    >
                      {prod.name}
                    </Link>
                  </div>
                </div>

                {/* 4. Giá tiền + Nút thêm vào giỏ */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-mono text-lg font-extrabold text-emerald-700 tabular-nums">
                    {unitPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: v.id,
                        itemType: "SUPPLEMENT_VARIANT",
                        supplementVariantId: v.id,
                        name: prod.name,
                        subtitle: `${v.flavor} • ${v.weightLabel}`,
                        unitPrice,
                        imageUrl: v.imageUrl,
                        skuOrBadge: v.sku,
                      })
                    }
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                  >
                    + Thêm vào giỏ
                  </button>
                </div>
              </SolidCard>
            );
          })}
        </div>
      </section>

      {/* Tầng 1: Gói tập & Khóa học Online */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 text-balance">
              Gói tập Phòng Gym, PT 1-1 & Khóa học Video
            </h2>
            <p className="text-sm font-medium text-slate-700 mt-1">
              Kích hoạt ngay thẻ tập QR động 60 giây và lộ trình bài giảng sau khi đăng ký
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <SolidCard
              key={course.id}
              className="p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="block overflow-hidden rounded-xl bg-slate-100 h-48"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    width={480}
                    height={300}
                    loading="lazy"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone="indigo">
                    {COURSE_TYPE_LABEL[course.courseType] || course.courseType}
                  </StatusBadge>
                  <StatusBadge tone="emerald">
                    {course.durationDays} ngày
                    {course.ptSessionsIncluded > 0
                      ? ` • ${course.ptSessionsIncluded} buổi PT`
                      : ""}
                  </StatusBadge>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500">
                    Phụ trách: {course.trainerName}
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="mt-1 block text-base font-bold text-slate-900 hover:text-indigo-600 line-clamp-2 transition-colors"
                  >
                    {course.title}
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-mono text-lg font-extrabold text-indigo-700 tabular-nums">
                  {course.price.toLocaleString("vi-VN")}đ
                </span>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: course.id,
                      itemType: "COURSE_MEMBERSHIP",
                      courseId: course.id,
                      name: course.title,
                      subtitle: `Thời hạn ${course.durationDays} ngày • ${course.ptSessionsIncluded} buổi PT`,
                      unitPrice: course.price,
                      imageUrl: course.thumbnailUrl,
                      skuOrBadge: course.courseType,
                    })
                  }
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                >
                  Đăng ký gói
                </button>
              </div>
            </SolidCard>
          ))}
        </div>
      </section>
    </div>
  );
}
