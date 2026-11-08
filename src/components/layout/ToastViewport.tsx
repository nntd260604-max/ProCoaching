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

        const borderClass =
          t.type === "success"
            ? "border-emerald-500/50 bg-slate-900/95 text-emerald-300"
            : t.type === "warning"
            ? "border-amber-500/50 bg-slate-900/95 text-amber-300"
            : t.type === "error"
            ? "border-rose-500/50 bg-slate-900/95 text-rose-300"
            : "border-sky-500/50 bg-slate-900/95 text-sky-300";

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-xl backdrop-blur-md transition ${borderClass}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <div className="font-bold text-white">{t.title}</div>
              {t.description && (
                <div className="mt-0.5 text-slate-300 leading-relaxed">{t.description}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

