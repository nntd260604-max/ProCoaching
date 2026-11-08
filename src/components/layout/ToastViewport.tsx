"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

export function ToastViewport() {
  const { toasts, dismissToast } = useHybridCartStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
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
            className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.1)]"
          >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-900">{t.title}</div>
              {t.description && (
                <div className="mt-0.5 font-medium text-slate-700">{t.description}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
