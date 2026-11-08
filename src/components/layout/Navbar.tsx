"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dumbbell,
  ShoppingBag,
  Calculator,
  PlaySquare,
  Package,
  QrCode,
  ShieldCheck,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    items,
    setCartOpen,
    activeRole,
    switchDemoRole,
  } = useHybridCartStore();

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const physicalCount = items
    .filter((i) => i.itemType === "SUPPLEMENT_VARIANT")
    .reduce((sum, i) => sum + i.quantity, 0);
  const digitalCount = items
    .filter((i) => i.itemType === "COURSE_MEMBERSHIP")
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleRoleSwitch = (role: "MEMBER" | "TRAINER" | "ADMIN") => {
    switchDemoRole(role);
    if (role === "MEMBER") router.push("/dashboard/member");
    if (role === "TRAINER") router.push("/dashboard/trainer");
    if (role === "ADMIN") router.push("/dashboard/admin");
  };

  const navLinks = [
    { href: "/", label: "Trang chủ", icon: Dumbbell },
    { href: "/tdee-calculator", label: "Đo TDEE & AI Thực Đơn", icon: Calculator, highlight: true },
    { href: "/supplements", label: "Thực phẩm bổ sung (FEFO)", icon: Package },
    { href: "/courses", label: "Khóa học & Gói PT", icon: PlaySquare },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      {/* Top Bar: Bộ chuyển đổi nhanh vai trò Demo phục vụ Hội đồng bảo vệ đồ án */}
      <div className="border-b border-slate-800/60 bg-slate-900/90 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-3 w-3" /> Đồ Án Tốt Nghiệp KTPM
            </span>
            <span className="hidden sm:inline text-slate-400">
              GymHub Hybrid Platform • 19 Bảng 3NF • Xuất Kho FEFO • QR Động 60s • Video Chống Tua 80%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Chuyển vai trò Demo:</span>
            <button
              type="button"
              onClick={() => handleRoleSwitch("MEMBER")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                activeRole === "MEMBER"
                  ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              Hội viên (Member)
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("TRAINER")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                activeRole === "TRAINER"
                  ? "bg-orange-500 text-slate-950 shadow-sm shadow-orange-500/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              HLV Cá nhân (PT)
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("ADMIN")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                activeRole === "ADMIN"
                  ? "bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Quản trị Kho (Admin)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <Dumbbell className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              GYM<span className="text-emerald-400">HUB</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-orange-400">
              Hybrid Fitness & Supplement
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : item.highlight
                    ? "text-orange-400 hover:bg-orange-500/10"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="mx-2 h-5 w-px bg-slate-800" />

          <Link
            href={
              activeRole === "ADMIN"
                ? "/dashboard/admin"
                : activeRole === "TRAINER"
                ? "/dashboard/trainer"
                : "/dashboard/member"
            }
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              pathname.startsWith("/dashboard")
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-900 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10"
            }`}
          >
            <QrCode className="h-4 w-4" />
            {activeRole === "ADMIN"
              ? "Portal Quản Trị (FEFO)"
              : activeRole === "TRAINER"
              ? "Portal HLV (Quét QR)"
              : "Tủ Đồ Hội Viên (QR 60s)"}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-slate-900/90 px-3.5 py-2 text-sm font-semibold text-white hover:border-emerald-400 hover:bg-slate-800 transition"
          >
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-xs font-bold leading-none">Giỏ hàng Hỗn hợp</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {physicalCount} Vật lý • {digitalCount} Dịch vụ số
              </div>
            </div>
            <span className="ml-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-orange-500 px-1.5 text-xs font-black text-slate-950">
              {totalCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Nav */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/70 bg-slate-950 px-3 py-2 gap-2">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-900 text-slate-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/dashboard/member"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300"
        >
          <QrCode className="h-3.5 w-3.5" />
          Hội viên QR
        </Link>
        <Link
          href="/dashboard/trainer"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 px-3 py-1.5 text-xs font-semibold text-orange-300"
        >
          <UserCheck className="h-3.5 w-3.5" />
          HLV PT
        </Link>
        <Link
          href="/dashboard/admin"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin FEFO
        </Link>
      </div>
    </header>
  );
}

