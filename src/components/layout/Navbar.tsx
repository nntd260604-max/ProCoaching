"use client";

import React, { startTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, ShoppingBag, User } from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/tdee-calculator", label: "Đo TDEE & AI" },
  { href: "/supplements", label: "Thực phẩm bổ sung" },
  { href: "/courses", label: "Gói tập & Khóa học" },
] as const;

const ROLE_ITEMS = [
  { id: "MEMBER", label: "Hội viên", href: "/dashboard/member" },
  { id: "TRAINER", label: "PT", href: "/dashboard/trainer" },
  { id: "ADMIN", label: "Admin", href: "/dashboard/admin" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const items = useHybridCartStore((s) => s.items);
  const setCartOpen = useHybridCartStore((s) => s.setCartOpen);
  const activeRole = useHybridCartStore((s) => s.activeRole);
  const switchDemoRole = useHybridCartStore((s) => s.switchDemoRole);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleRoleSwitch = (role: "MEMBER" | "TRAINER" | "ADMIN") => {
    startTransition(() => {
      switchDemoRole(role);
      if (role === "MEMBER") router.push("/dashboard/member");
      if (role === "TRAINER") router.push("/dashboard/trainer");
      if (role === "ADMIN") router.push("/dashboard/admin");
    });
  };

  const portalHref =
    activeRole === "ADMIN"
      ? "/dashboard/admin"
      : activeRole === "TRAINER"
      ? "/dashboard/trainer"
      : "/dashboard/member";

  return (
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-white/70 shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 rounded-xl"
          aria-label="GymHub Trang chủ"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Dumbbell className="h-5 w-5" aria-hidden="true" />
          </div>
          <span
            className="text-xl font-extrabold tracking-tight text-slate-900"
            translate="no"
          >
            Gym<span className="text-emerald-600">Hub</span>
          </span>
        </Link>

        {/* Main Navigation Links */}
        <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Segmented Role Switcher + Portal Link + Cart Button */}
        <div className="flex items-center gap-3">
          {/* Segmented Pill Control chuyển vai trò (Nền đặc, không lồng blur) */}
          <div
            role="group"
            aria-label="Chuyển đổi vai trò"
            className="hidden sm:inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80"
          >
            {ROLE_ITEMS.map((roleItem) => {
              const active = activeRole === roleItem.id;
              return (
                <button
                  key={roleItem.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleRoleSwitch(roleItem.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    active
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {roleItem.label}
                </button>
              );
            })}
          </div>

          <Link
            href={portalHref}
            aria-label={
              activeRole === "ADMIN"
                ? "Trang Quản trị"
                : activeRole === "TRAINER"
                ? "Lịch dạy PT"
                : "Thẻ tập QR"
            }
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-bold transition-colors ${
              pathname.startsWith("/dashboard")
                ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                : "border-slate-200/80 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">
              {activeRole === "ADMIN"
                ? "Quản trị"
                : activeRole === "TRAINER"
                ? "Lịch dạy PT"
                : "Thẻ tập QR"}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Mở giỏ hàng (${totalCount} sản phẩm)`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <ShoppingBag className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 font-mono text-xs font-extrabold text-white tabular-nums">
              {totalCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="flex lg:hidden items-center justify-between overflow-x-auto border-t border-slate-200/60 bg-white px-4 py-2 gap-2">
        <div className="flex items-center gap-1.5">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Chuyển đổi vai trò trên di động"
          className="flex sm:hidden items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 shrink-0"
        >
          {ROLE_ITEMS.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={activeRole === r.id}
              onClick={() => handleRoleSwitch(r.id)}
              className={`rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                activeRole === r.id
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
