import React from "react";
import Link from "next/link";
import { Dumbbell, ShieldCheck, QrCode, PackageCheck, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 text-slate-950">
                <Dumbbell className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white">
                GYM<span className="text-emerald-400">HUB</span> HYBRID
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Hệ thống Quản lý Phòng tập, Đào tạo Trực tuyến (Online Video Courses), Đặt lịch PT 1-1 và Thương mại điện tử Thực phẩm bổ sung theo chuẩn FEFO.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              6 Nghiệp Vụ Trọng Tâm Đồ Án
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <PackageCheck className="h-3.5 w-3.5 text-orange-400" />
                Xuất kho Thực phẩm bổ sung theo Lô FEFO
              </li>
              <li className="flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-emerald-400" />
                Điểm danh Mã QR Động TOTP 60 giây
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-sky-400" />
                AI Tư vấn TDEE & Sàng lọc Dị ứng
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                Học Video chống tua bài (Ngưỡng 80%)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Phân Hệ Khách Hàng
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tdee-calculator" className="hover:text-emerald-400">
                  Công cụ Đo BMI/TDEE & Thực đơn AI
                </Link>
              </li>
              <li>
                <Link href="/supplements" className="hover:text-emerald-400">
                  Cửa hàng Whey & Pre-Workout
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-emerald-400">
                  Khóa học Video & Thẻ tập Phòng Gym
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              3 Phân Hệ Bảo Vệ Đồ Án
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard/member" className="text-emerald-400 hover:underline">
                  → Portal Hội Viên (Thẻ QR 60s & Học Video)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/trainer" className="text-orange-400 hover:underline">
                  → Portal Huấn Luyện Viên (Quét QR PT 1-1)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="text-amber-400 hover:underline">
                  → Portal Quản Trị Viên (Kho Lô Hàng FEFO)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 GymHub Hybrid Platform — Đồ Án Tốt Nghiệp Kỹ Thuật Phần Mềm (19 Bảng 3NF PostgreSQL + Prisma ORM).</p>
          <p className="mt-2 sm:mt-0">Next.js 14 App Router • TypeScript • Tailwind CSS • Zustand</p>
        </div>
      </div>
    </footer>
  );
}

