"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Calculator,
  Package,
  PlaySquare,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  CalendarCheck,
  ShoppingBag,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

interface SupplementItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  targetGoal: string;
  allergenTags: string[];
  categoryName: string;
  variants: {
    id: string;
    sku: string;
    flavor: string;
    weightLabel: string;
    price: number;
    salePrice: number | null;
    stockQuantity: number;
    imageUrl: string;
    nextFefoBatch: {
      batchCode: string;
      expiryDate: string;
      batchStatus: string;
    } | null;
  }[];
}

interface CourseItem {
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
  trainerName: string;
}

export default function HomePage() {
  const { addItem, setCartOpen } = useHybridCartStore();
  const [supplements, setSupplements] = useState<SupplementItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        if (data.supplements) setSupplements(data.supplements.slice(0, 4));
        if (data.courses) setCourses(data.courses.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const coreFeatures = [
    {
      badge: "Nghiệp vụ 01",
      title: "Giỏ Hàng Hỗn Hợp (Hybrid Cart & ACID)",
      desc: "Mua chung Thực phẩm bổ sung vật lý (cần giao hàng) và Khóa học/Thẻ tập (kích hoạt mã QR ngay) trong cùng 1 đơn hàng.",
      icon: ShoppingBag,
      href: "/supplements",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      badge: "Nghiệp vụ 02",
      title: "Quản Lý Kho Lô Hàng Chuẩn FEFO",
      desc: "Tự động truy vấn lô hàng hết hạn sớm nhất (First Expired, First Out) để trừ tồn kho trước và tính lợi nhuận gộp thực tế.",
      icon: Package,
      href: "/dashboard/admin",
      color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    },
    {
      badge: "Nghiệp vụ 03",
      title: "Đo BMI/TDEE & AI Sàng Lọc Dị Ứng",
      desc: "Tính chuẩn Mifflin-St Jeor, tự động loại trừ Whey chứa Lactose hoặc Pre-Workout chứa Caffeine cao theo cơ địa học viên.",
      icon: Calculator,
      href: "/tdee-calculator",
      color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    },
    {
      badge: "Nghiệp vụ 04",
      title: "Khóa Học Video Chống Tua Bài (80%)",
      desc: "Đồng bộ giây đang xem qua Heartbeat 10s, khôi phục vị trí xem dở và chỉ tích hoàn thành khi thực xem đạt >= 80% thời lượng.",
      icon: PlaySquare,
      href: "/dashboard/member",
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      badge: "Nghiệp vụ 05",
      title: "Đặt Lịch Tập 1-1 Với PT Chống Trùng Ca",
      desc: "Kiểm tra số buổi PT còn lại, khóa tự động các khung giờ đã có học viên đặt bằng ràng buộc Unique Index CSDL.",
      icon: CalendarCheck,
      href: "/dashboard/member",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      badge: "Nghiệp vụ 06",
      title: "Điểm Danh Phòng Tập Mã QR Động 60s",
      desc: "Sinh mã TOTP HMAC-SHA256 đổi mới mỗi 60 giây. Khi PT quét mã sẽ tự động trừ 1 buổi PT và hoàn thành lịch hẹn.",
      icon: QrCode,
      href: "/dashboard/trainer",
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    },
  ];

  const courseTypeLabel: Record<string, string> = {
    HYBRID_COMBO: "Combo Thẻ Tập + PT + Video",
    ONLINE_VIDEO: "Khóa Học Video Online",
    PT_PACKAGE: "Huấn Luyện PT 1-1",
    GYM_MEMBERSHIP: "Thẻ Tập Phòng Gym",
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 pt-12 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Nền Tảng All-In-One: Gym Membership • PT 1-1 • Video Courses • Supplement FEFO
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
                Đột Phá Thể Hình Cùng{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-orange-400 bg-clip-text text-transparent">
                  GymHub Hybrid
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Hệ sinh thái khép kín giúp hội viên đo chỉ số{" "}
                <strong className="text-white">BMI/TDEE bằng AI lọc dị ứng</strong>, mua sắm{" "}
                <strong className="text-orange-400">Thực phẩm bổ sung truy xuất lô FEFO</strong>, học kỹ thuật qua{" "}
                <strong className="text-emerald-400">Video chống tua bài</strong> và điểm danh phòng tập bằng{" "}
                <strong className="text-white">Mã QR Động 60 giây</strong>.
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link
                  href="/tdee-calculator"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:opacity-95 transition"
                >
                  <Calculator className="h-4 w-4" />
                  Đo BMI/TDEE & Nhận Thực Đơn AI
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/supplements"
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-6 py-3.5 text-sm font-bold text-orange-300 hover:bg-orange-500/20 transition"
                >
                  <Package className="h-4 w-4" />
                  Cửa Hàng Whey & Pre-Workout
                </Link>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
                >
                  <ShoppingBag className="h-4 w-4 text-emerald-400" />
                  Mở Giỏ Hàng Hỗn Hợp
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
                  <div className="text-2xl font-black text-emerald-400">19 Bảng</div>
                  <div className="text-xs text-slate-400">CSDL Chuẩn 3NF PostgreSQL</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
                  <div className="text-2xl font-black text-orange-400">100% FEFO</div>
                  <div className="text-xs text-slate-400">Xuất Lô Hết Hạn Sớm Trước</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
                  <div className="text-2xl font-black text-sky-400">TOTP 60s</div>
                  <div className="text-xs text-slate-400">Mã QR Động Chống Mượn Thẻ</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
                  <div className="text-2xl font-black text-amber-400">&gt;= 80%</div>
                  <div className="text-xs text-slate-400">Kiểm Soát Tiến Độ Xem Video</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Demo Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Trải Nghiệm Nhanh Cho Hội Đồng
                    </span>
                    <h3 className="text-lg font-black text-white">
                      3 Phân Hệ Thực Thi Thời Gian Thực
                    </h3>
                  </div>
                  <Layers className="h-6 w-6 text-orange-400" />
                </div>

                <div className="space-y-3">
                  <Link
                    href="/dashboard/member"
                    className="block rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 hover:border-emerald-400 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-emerald-400">
                        1. Phân Hệ Hội Viên (Member Portal)
                      </span>
                      <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">
                      Thẻ Tập QR Động 60s • Học Video Chống Tua • Đặt Lịch PT 1-1
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Lấy mã QR Token 60s trực tiếp để đem sang màn hình PT quét thử.
                    </p>
                  </Link>

                  <Link
                    href="/dashboard/trainer"
                    className="block rounded-2xl border border-orange-500/30 bg-orange-950/20 p-4 hover:border-orange-400 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-orange-400">
                        2. Phân Hệ Huấn Luyện Viên (Trainer Portal)
                      </span>
                      <ArrowRight className="h-4 w-4 text-orange-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">
                      Máy Quét Mã QR Check-in Ca Tập PT & Ghi Chú Giáo Án
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Xác thực chữ ký số QR 60s, tự động trừ 1 buổi PT và hoàn thành ca dạy.
                    </p>
                  </Link>

                  <Link
                    href="/dashboard/admin"
                    className="block rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 hover:border-amber-400 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-amber-400">
                        3. Phân Hệ Quản Trị Viên (Admin FEFO Warehouse)
                      </span>
                      <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">
                      Quản Lý Lô Hàng Cận Date FEFO & Báo Cáo Lợi Nhuận Gộp
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Cảnh báo lô hàng hạn dưới 60 ngày, nhập lô mới & kích hoạt Flash Sale xả kho.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Business Modules Grid */}
      <section className="mx-auto max-w-7xl px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Kiến Trúc Nghiệp Vụ Cốt Lõi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              6 Thuật Toán & Luồng Xử Lý Đắt Giá Trong Đồ Án
            </h2>
          </div>
          <Link
            href="/tdee-calculator"
            className="text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            Khám phá Công cụ AI TDEE <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.badge}
                href={feat.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${feat.color}`}
                    >
                      <Icon className="h-4 w-4" />
                      {feat.badge}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">{feat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Supplements with FEFO Batch Preview */}
      <section className="mx-auto max-w-7xl px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Supplement E-Commerce • Chuẩn Xuất Kho FEFO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Thực Phẩm Bổ Sung Chính Hãng (Kèm Nhãn Sàng Lọc Dị Ứng)
            </h2>
          </div>
          <Link
            href="/supplements"
            className="text-sm font-bold text-orange-400 hover:underline flex items-center gap-1"
          >
            Xem toàn bộ cửa hàng <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supplements.map((prod) => {
            const v = prod.variants[0];
            if (!v) return null;
            const unitPrice = v.salePrice ?? v.price;

            return (
              <div
                key={prod.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-orange-500/40 transition"
              >
                <div>
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={v.imageUrl}
                      alt={prod.name}
                      className="h-full w-full object-cover opacity-90 hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-slate-950/90 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-200">
                        {prod.brand}
                      </span>
                      {prod.allergenTags.length === 0 ? (
                        <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-black text-slate-950">
                          Không Lactose / Dị ứng
                        </span>
                      ) : (
                        <span className="rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-black text-slate-950 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Chứa: {prod.allergenTags.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="text-[11px] font-semibold text-orange-400">
                      {prod.categoryName} • {v.flavor} ({v.weightLabel})
                    </div>
                    <Link
                      href={`/supplements/${prod.slug}`}
                      className="block text-sm font-bold text-white hover:text-orange-300 line-clamp-2"
                    >
                      {prod.name}
                    </Link>

                    {v.nextFefoBatch && (
                      <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-2 text-[11px] text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Lô xuất FEFO tiếp theo:</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {v.nextFefoBatch.batchCode}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span>Hạn dùng: {v.nextFefoBatch.expiryDate}</span>
                          <span className="text-slate-300">Tồn: {v.stockQuantity} hộp</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-white">
                        {unitPrice.toLocaleString("vi-VN")}đ
                      </span>
                      {v.salePrice && (
                        <span className="ml-2 text-xs text-slate-500 line-through">
                          {v.price.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
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
                      className="flex-1 rounded-xl bg-orange-500 px-3 py-2.5 text-xs font-black text-slate-950 hover:bg-orange-400 transition"
                    >
                      + Thêm Vào Giỏ
                    </button>
                    <Link
                      href={`/supplements/${prod.slug}`}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses & Gym/PT Memberships */}
      <section className="mx-auto max-w-7xl px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Digital Activation • Cấp Thẻ QR Động 60s & Mở Khóa Video Ngay
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Gói Tập Phòng Gym, Huấn Luyện PT 1-1 & Khóa Học Video Online
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            Xem tất cả gói tập <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-emerald-500/40 transition"
            >
              <div className="sm:w-56 h-48 sm:h-auto shrink-0 relative bg-slate-950">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 left-3 rounded-md bg-emerald-500 px-2.5 py-1 text-[10px] font-black text-slate-950">
                  {courseTypeLabel[course.courseType] || course.courseType}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">{course.trainerName}</span>
                    <span>•</span>
                    <span>Hiệu lực: {course.durationDays} ngày</span>
                    <span>•</span>
                    <span className="font-bold text-orange-400">
                      {course.ptSessionsIncluded > 0
                        ? `Kèm ${course.ptSessionsIncluded} buổi PT 1-1`
                        : "Học Video 24/7"}
                    </span>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="block text-base font-bold text-white hover:text-emerald-300"
                  >
                    {course.title}
                  </Link>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <div>
                    <div className="text-xs text-slate-400">Học phí / Giá gói trọn bộ</div>
                    <div className="text-lg font-black text-emerald-400">
                      {course.price.toLocaleString("vi-VN")}đ
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: course.id,
                          itemType: "COURSE_MEMBERSHIP",
                          courseId: course.id,
                          name: course.title,
                          subtitle: `Hiệu lực ${course.durationDays} ngày • ${course.ptSessionsIncluded} buổi PT 1-1`,
                          unitPrice: course.price,
                          imageUrl: course.thumbnailUrl,
                          skuOrBadge: course.courseType,
                        })
                      }
                      className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition"
                    >
                      + Thêm Gói Vào Giỏ
                    </button>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

