"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PlaySquare,
  CheckCircle2,
  Clock,
  FastForward,
  ShieldCheck,
  Dumbbell,
  Play,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

export default function MemberVideoClassroomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const enrollmentId = String(params?.enrollmentId || "enroll-member-01");
  const initialLessonId = searchParams.get("lessonId");

  const { activeUserId, pushToast } = useHybridCartStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [enrollment, setEnrollment] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const loadClassroomData = useCallback(
    async (preserveLessonId?: string) => {
      const res = await fetch(`/api/member?userId=${activeUserId || "user-member-01"}`);
      const data = await res.json();
      const found =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.enrollments?.find((e: any) => e.id === enrollmentId) || data.enrollments?.[0];
      if (found) {
        setEnrollment(found);
        const allLessons = found.modules.flatMap(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (m: any) => m.lessons
        );
        const targetId = preserveLessonId || initialLessonId;
        const chosen =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          allLessons.find((l: any) => l.id === targetId) || allLessons[0];
        setActiveLesson(chosen);
      }
    },
    [activeUserId, enrollmentId, initialLessonId]
  );

  useEffect(() => {
    loadClassroomData();
  }, [loadClassroomData]);

  // Khôi phục vị trí giây đang xem dở (last_position_sec - Resume Playback)
  useEffect(() => {
    if (videoRef.current && activeLesson?.progress?.lastPositionSec) {
      try {
        videoRef.current.currentTime = Math.min(
          activeLesson.durationSeconds - 2,
          activeLesson.progress.lastPositionSec
        );
      } catch {
        // Ignore if metadata not loaded yet
      }
    }
  }, [activeLesson?.id, activeLesson?.durationSeconds, activeLesson?.progress?.lastPositionSec]);

  const sendProgressHeartbeat = async (addedSec: number, currentPosSec: number) => {
    if (!activeLesson || !enrollment) return;
    setSyncing(true);
    try {
      const wasCompleted = activeLesson.progress?.isCompleted;
      const res = await fetch("/api/video-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: enrollment.id,
          userId: activeUserId || "user-member-01",
          lessonId: activeLesson.id,
          addedWatchedSeconds: addedSec,
          lastPositionSec: Math.round(currentPosSec),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (!wasCompleted && data.progress.isCompleted) {
          pushToast({
            title: "Chúc mừng! Đã đạt >= 80% thời lượng thực xem!",
            description: `Bài học "${activeLesson.title}" đã được tự động tích xanh Hoàn thành.`,
            type: "success",
          });
        }
        await loadClassroomData(activeLesson.id);
      }
    } finally {
      setSyncing(false);
    }
  };

  if (!enrollment || !activeLesson) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-400">
        Đang mở phòng học Video trực tuyến...
      </div>
    );
  }

  const watchedSec = activeLesson.progress?.watchedSeconds || 0;
  const durationSec = activeLesson.durationSeconds || 60;
  const requiredSec = Math.ceil(durationSec * 0.8);
  const watchedPct = Math.min(100, Math.round((watchedSec / durationSec) * 100));
  const isCompleted = Boolean(activeLesson.progress?.isCompleted);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/member"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Tủ Đồ Hội Viên
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400">
            Tiến độ tổng khóa học: {enrollment.progressPct}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Video Player & Anti-Skip Tracker */}
        <div className="lg:col-span-8 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <video
              ref={videoRef}
              key={activeLesson.id}
              src={activeLesson.videoUrl}
              controls
              onLoadedMetadata={(e) => {
                const pos = activeLesson.progress?.lastPositionSec || 0;
                if (pos > 0 && pos < durationSec) {
                  e.currentTarget.currentTime = pos;
                }
              }}
              onTimeUpdate={(e) => {
                // Tự động gửi Heartbeat mỗi khi xem thêm 10 giây
                const currentPos = Math.floor(e.currentTarget.currentTime);
                if (currentPos > 0 && currentPos % 10 === 0 && !syncing) {
                  sendProgressHeartbeat(2, currentPos);
                }
              }}
              className="aspect-video w-full bg-black object-cover"
            />
          </div>

          {/* Thanh kiểm soát Chống Tua Bài (Anti-Skip Progress Bar) */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/85 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                    Heartbeat 10s • Resume Playback
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2.5 py-0.5 text-[11px] font-black text-slate-950">
                      <CheckCircle2 className="h-3.5 w-3.5" /> ĐÃ HOÀN THÀNH BÀI HỌC (&gt;= 80%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                      <Clock className="h-3.5 w-3.5" /> Cần xem tối thiểu {requiredSec}s (80%) để mở khóa hoàn thành
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-black text-white mt-2">{activeLesson.title}</h1>
              </div>

              {/* Nút Mô phỏng Heartbeat +15s giúp Hội đồng chấm đồ án test nhanh ngưỡng 80% */}
              <button
                type="button"
                disabled={syncing}
                onClick={() =>
                  sendProgressHeartbeat(
                    15,
                    Math.min(durationSec, (activeLesson.progress?.lastPositionSec || 0) + 15)
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md hover:opacity-95 shrink-0"
              >
                <FastForward className="h-4 w-4" />
                {syncing
                  ? "Đang đồng bộ Heartbeat..."
                  : "Mô Phỏng Xem Thực Tế +15 Giây (Test Ngưỡng 80%)"}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>
                  Thời gian thực xem tích lũy (`watched_seconds`):{" "}
                  <strong className="text-emerald-400">{watchedSec} giây</strong> / {durationSec}{" "}
                  giây ({watchedPct}%)
                </span>
                <span>
                  Vị trí dừng gần nhất (`last_position_sec`):{" "}
                  <strong className="text-orange-400">
                    {activeLesson.progress?.lastPositionSec || 0}s
                  </strong>
                </span>
              </div>

              <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                <div
                  style={{ width: `${watchedPct}%` }}
                  className={`h-full transition-all duration-500 ${
                    isCompleted ? "bg-emerald-500" : "bg-orange-500"
                  }`}
                />
                {/* Vạch mốc 80% */}
                <div
                  style={{ left: "80%" }}
                  className="absolute top-0 bottom-0 w-0.5 bg-white"
                  title="Ngưỡng 80% mở khóa hoàn thành"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0%</span>
                <span className="text-emerald-400 font-bold">
                  ↑ Mốc 80% ({requiredSec}s) — Tự động tích xanh Hoàn thành
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Hướng dẫn Sets x Reps bên dưới Video */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-emerald-400" />
              Giáo Án Thực Hành Sets x Reps & Lưu Ý Kỹ Thuật (`workout_guide_md`)
            </h3>
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line">
              {activeLesson.workoutGuideMd ||
                "Thực hiện 4 hiệp x 8-12 lần lặp (Reps), nghỉ 60-90 giây giữa các hiệp."}
            </div>
          </div>
        </div>

        {/* Right Curriculum Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-400">
                  Danh Sách Bài Tập
                </span>
                <h2 className="text-base font-black text-white">
                  Nội Dung Khóa Học ({enrollment.progressPct}%)
                </h2>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="space-y-4">
              {enrollment.modules.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (mod: any) => (
                  <div key={mod.id} className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">{mod.title}</div>
                    <div className="space-y-2">
                      {mod.lessons.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (les: any) => {
                          const isCurrent = les.id === activeLesson.id;
                          return (
                            <button
                              key={les.id}
                              type="button"
                              onClick={() => setActiveLesson(les)}
                              className={`w-full flex items-start justify-between gap-2.5 rounded-2xl border p-3 text-left transition ${
                                isCurrent
                                  ? "border-emerald-500 bg-emerald-500/15"
                                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <Play className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-bold text-white">{les.title}</div>
                                  <div className="text-[11px] text-slate-400 mt-1">
                                    Đã xem: {les.progress?.watchedSeconds || 0}s /{" "}
                                    {les.durationSeconds}s
                                  </div>
                                </div>
                              </div>
                              {les.progress?.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <Clock className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

