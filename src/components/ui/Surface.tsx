import React from "react";

type BadgeTone = "emerald" | "indigo" | "amber" | "rose" | "slate";

const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  rose: "bg-rose-50 border-rose-200 text-rose-700",
  slate: "bg-slate-100 border-slate-200 text-slate-700",
};

export function GlassPanel({
  children,
  className = "",
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Component className={`glass-panel ${className}`.trim()}>
      {children}
    </Component>
  );
}

export function SolidCard({
  children,
  className = "",
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Component className={`solid-card ${className}`.trim()}>
      {children}
    </Component>
  );
}

export function DarkPassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-dark-pass ${className}`.trim()}>
      {children}
    </div>
  );
}

export function StatusBadge({
  tone = "slate",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold ${BADGE_TONE_CLASSES[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
