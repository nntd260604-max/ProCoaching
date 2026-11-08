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

export default function HomePage() {
  const { addItem } = useHybridCartStore();
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

  const goalLabel: Record<string, string> = {
    MUSCLE_GAIN: "Tăng cơ",
    FAT_LOSS: "Giảm mỡ",
    ENDURANCE: "Tăng sức bền",
    RECOVERY: "Phục hồi",
  };

  const courseTypeLabel: Record<string, string> = {
    HYBRID_COMBO: "Combo Thẻ Tập + PT + Video",
    ONLINE_VIDEO: "Khóa học Video",
    PT_PACKAGE: "Gói PT 1-1",
    GYM_MEMBERSHIP: "Thẻ phòng tập",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-16">
      {/* Tầng 2: Khối Tiêu Điểm Hero (Selective Glass Panel) */}
      <section className="glass-panel p-8 sm:p-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Hệ sinh thái Thể hình & Dinh dưỡng Toàn diện
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.15]">
              Tập luyện chuẩn khoa học & dinh dưỡng cá nhân hóa cùng{" "}
              <span className="text-emerald-600">GymHub</span>
            </h1>

            <p className="text-base font-medium text-slate-700 leading-relaxed max-w-2xl">
              Tính chỉ số BMI/TDEE kết hợp AI gợi ý thực đơn lọc dị ứng, đặt lịch tập 1-1 cùng Huấn luyện viên cá nhân, học video trực tuyến và mua sắm thực phẩm bổ sung chính hãng.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link
                href="/tdee-calculator"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <Calculator className="h-4 w-4" />
                Đo BMI/TDEE & Nhận Thực Đơn AI
              </Link>
              <Link
                href="/supplements"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                <Package className="h-4 w-4 text-indigo-600" />
                Cửa hàng Thực phẩm bổ sung
              </Link>
            </div>
          </div>

          {/* 3 Điểm Nhấn Dịch Vụ (Nền đặc bg-white bên trong tấm kính để không lồng blur) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Thẻ Tập Mã QR Động 60s & Video Chống Tua
                </h3>
                <p className="text-xs font-medium text-slate-700 mt-1">
                  Check-in phòng tập bảo mật mỗi 60 giây và tự động lưu tiến độ bài giảng video.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Đặt Lịch Tập 1-1 Cùng Huấn Luyện Viên
                </h3>
                <p className="text-xs font-medium text-slate-700 mt-1">
                  Chọn khung giờ rảnh của PT theo thời gian thực và theo dõi nhận xét sau mỗi buổi.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Thực Phẩm Bổ Sung Quản Lý Lô FEFO
                </h3>
                <p className="text-xs font-medium text-slate-700 mt-1">
                  Cam kết hạn sử dụng minh bạch và tự động sàng lọc thành phần dị ứng Lactose, Caffeine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tầng 1: Danh sách Thực phẩm bổ sung nổi bật (Solid Cards, 3 cột, gap-6, p-6, đúng 4 thông tin) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Thực phẩm bổ sung nổi bật
            </h2>
            <p className="text-sm font-medium text-slate-700 mt-1">
              Sàng lọc rõ nhãn dị ứng và cam kết hạn sử dụng mới nhất
            </p>
          </div>
          <Link
            href="/supplements"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {supplements.map((prod) => {
            const v = prod.variants[0];
            if (!v) return null;
            const unitPrice = v.salePrice ?? v.price;

            return (
              <div
                key={prod.id}
                className="solid-card p-6 flex flex-col justify-between space-y-5"
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
                      className="h-full w-full object-cover hover:scale-105 transition duration-300"
                    />
                  </Link>

                  {/* 2. Tối đa 2 Badge nhỏ (Mục tiêu & Không chứa Lactose/Caffeine) */}
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                      {goalLabel[prod.targetGoal] || prod.targetGoal}
                    </span>
                    {prod.allergenTags.length === 0 ? (
                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Không Lactose / Caffeine
                      </span>
                    ) : (
                      <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        Chứa: {prod.allergenTags.join(", ")}
                      </span>
                    )}
                  </div>

                  {/* 3. Tên + Thương hiệu */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {prod.brand} • {v.weightLabel}
                    </div>
                    <Link
                      href={`/supplements/${prod.slug}`}
                      className="mt-1 block text-base font-bold text-slate-900 hover:text-emerald-600 line-clamp-2"
                    >
                      {prod.name}
                    </Link>
                  </div>
                </div>

                {/* 4. Giá tiền + Nút thêm vào giỏ */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-mono text-lg font-extrabold text-emerald-700">
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
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
                  >
                    + Thêm vào giỏ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tầng 1: Gói tập & Khóa học Online (Solid Cards, 3 cột, gap-6, p-6) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Gói tập Phòng Gym, PT 1-1 & Khóa học Video
            </h2>
            <p className="text-sm font-medium text-slate-700 mt-1">
              Kích hoạt ngay thẻ tập QR động 60 giây và lộ trình bài giảng sau khi đăng ký
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="solid-card p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="block overflow-hidden rounded-xl bg-slate-100 h-48"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                  />
                </Link>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {courseTypeLabel[course.courseType] || course.courseType}
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {course.durationDays} ngày
                    {course.ptSessionsIncluded > 0
                      ? ` • ${course.ptSessionsIncluded} buổi PT`
                      : ""}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500">
                    Phụ trách: {course.trainerName}
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="mt-1 block text-base font-bold text-slate-900 hover:text-indigo-600 line-clamp-2"
                  >
                    {course.title}
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-mono text-lg font-extrabold text-indigo-700">
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
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  Đăng ký gói
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
