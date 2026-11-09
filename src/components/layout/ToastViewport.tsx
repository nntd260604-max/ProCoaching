"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

export function ToastViewport() {
  const toasts = useHybridCartStore((s) => s.toasts);
  const dismissToast = useHybridCartStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Thông báo hệ thống"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => {
        const Icon =
          t.type === "success"
            ? CheckCircle2
            : t.type === "warning"
            ? AlertTriangle
            : t.type === "error"
            ? XCircle
            : Info;

        const iconColor =
          t.type === "success"
            ? "text-emerald-600"
            : t.type === "warning"
            ? "text-amber-600"
            : t.type === "error"
            ? "text-rose-600"
            : "text-indigo-600";

        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.1)]"
          >
            <Icon
              className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0 text-xs">
              <div className="font-bold text-slate-900">{t.title}</div>
              {t.description ? (
                <div className="mt-0.5 font-medium text-slate-700 break-words">
                  {t.description}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Đóng thông báo"
              onClick={() => dismissToast(t.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
