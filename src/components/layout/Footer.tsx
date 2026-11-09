import React from "react";
import Link from "next/link";
import { Dumbbell, ShieldCheck, QrCode, PackageCheck, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-600 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Dumbbell className="h-5 w-5" aria-hidden="true" />
              </div>
              <span
                className="text-lg font-extrabold tracking-tight text-slate-900"
                translate="no"
              >
                Gym<span className="text-emerald-600">Hub</span>
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-slate-600 text-pretty">
              Hệ sinh thái phòng tập thông minh, khóa học video kỹ thuật, đặt lịch huấn luyện viên 1-1 và thực phẩm bổ sung chính hãng.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Tiện Ích Nổi Bật
            </h2>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li className="flex items-center gap-1.5">
                <PackageCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                Cam kết xuất kho hạn dùng mới nhất
              </li>
              <li className="flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
                Thẻ hội viên QR tự động làm mới 60 giây
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                Tư vấn dinh dưỡng TDEE & sàng lọc dị ứng
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
                Lưu tiến độ bài giảng video tự động
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Dịch Vụ & Sản Phẩm
            </h2>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link
                  href="/tdee-calculator"
                  className="text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  Đo BMI/TDEE & Gợi ý thực đơn AI
                </Link>
              </li>
              <li>
                <Link
                  href="/supplements"
                  className="text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  Cửa hàng Thực phẩm bổ sung
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  Khóa học Video & Gói tập PT 1-1
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Khu Vực Quản Lý
            </h2>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <Link
                  href="/dashboard/member"
                  className="text-emerald-700 hover:text-emerald-600 transition-colors"
                >
                  → Trang Hội Viên (Thẻ QR & Khóa học)
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/trainer"
                  className="text-indigo-700 hover:text-indigo-600 transition-colors"
                >
                  → Trang Huấn Luyện Viên (Điểm danh QR)
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin"
                  className="text-slate-800 hover:text-emerald-600 transition-colors"
                >
                  → Trang Quản Trị (Kho Lô Hàng & Doanh Thu)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-slate-500">
          <p>© 2026 GymHub Platform. Nền tảng Thể hình & Dinh dưỡng Toàn diện.</p>
          <p className="mt-2 sm:mt-0">Hỗ trợ Hội viên • Huấn luyện viên • Quản trị kho</p>
        </div>
      </div>
    </footer>
  );
}
