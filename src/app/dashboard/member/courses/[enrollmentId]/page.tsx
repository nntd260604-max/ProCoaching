"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
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
      const res = await fetch(
        `/api/member?userId=${activeUserId || "user-member-01"}`
      );
      const data = await res.json();
      const found =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.enrollments?.find((e: any) => e.id === enrollmentId) ||
        data.enrollments?.[0];
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
  }, [
    activeLesson?.id,
    activeLesson?.durationSeconds,
    activeLesson?.progress?.lastPositionSec,
  ]);

  const sendProgressHeartbeat = async (
    addedSec: number,
    currentPosSec: number
  ) => {
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
            title: "Đã hoàn thành bài học!",
            description: `Bạn đã xem đủ trên 80% thời lượng bài "${activeLesson.title}".`,
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
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm font-medium text-slate-600">
        Đang mở phòng học Video...
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
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Trang Hội Viên
        </Link>
        <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
          Tiến độ khóa học: {enrollment.progressPct}%
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Video Player, Real-time Watched Progress & Workout Guide */}
        <div className="lg:col-span-8 space-y-6">
          <div className="solid-card p-3 overflow-hidden">
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
                const currentPos = Math.floor(e.currentTarget.currentTime);
                if (currentPos > 0 && currentPos % 10 === 0 && !syncing) {
                  sendProgressHeartbeat(2, currentPos);
                }
              }}
              className="aspect-video w-full rounded-xl bg-slate-950 object-cover"
            />
          </div>

          {/* Watched Progress Bar Card */}
          <div className="solid-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Đã hoàn thành bài học (&ge; 80%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700">
                      <Clock className="h-3.5 w-3.5" /> Cần xem tối thiểu {requiredSec} giây (80%) để hoàn thành
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 mt-2">
                  {activeLesson.title}
                </h1>
              </div>

              <button
                type="button"
                disabled={syncing}
                onClick={() =>
                  sendProgressHeartbeat(
                    15,
                    Math.min(
                      durationSec,
                      (activeLesson.progress?.lastPositionSec || 0) + 15
                    )
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition shrink-0"
              >
                <FastForward className="h-4 w-4" />
                {syncing ? "Đang lưu tiến độ..." : "Cộng nhanh +15 giây thực xem"}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>
                  Thời lượng đã xem:{" "}
                  <strong className="font-mono text-slate-900">
                    {watchedSec}s / {durationSec}s ({watchedPct}%)
                  </strong>
                </span>
                <span>
                  Vị trí đang phát:{" "}
                  <strong className="font-mono text-indigo-600">
                    {activeLesson.progress?.lastPositionSec || 0}s
                  </strong>
                </span>
              </div>

              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div
                  style={{ width: `${watchedPct}%` }}
                  className={`h-full transition-all duration-500 ${
                    isCompleted ? "bg-emerald-600" : "bg-indigo-600"
                  }`}
                />
                <div
                  style={{ left: "80%" }}
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
                  title="Mốc 80% hoàn thành bài học"
                />
              </div>
              <div className="flex justify-between text-[11px] font-medium text-slate-500">
                <span>0%</span>
                <span className="text-emerald-700 font-bold">
                  ↑ Mốc 80% ({requiredSec}s) — Tự động ghi nhận hoàn thành
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Workout Guide (Sets x Reps) */}
          <div className="solid-card p-6 space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-emerald-600" />
              Hướng Dẫn Thực Hành (Số Hiệp & Số Lần Lặp)
            </h3>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 whitespace-pre-line">
              {activeLesson.workoutGuideMd ||
                "Thực hiện 4 hiệp x 8-12 lần lặp (Reps), nghỉ 60-90 giây giữa các hiệp."}
            </div>
          </div>
        </div>

        {/* Right Column: Modules & Lessons List */}
        <div className="lg:col-span-4">
          <div className="solid-card p-6 space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Giáo Trình Khóa Học
                </span>
                <h2 className="text-base font-extrabold text-slate-900">
                  Danh Sách Bài Giảng ({enrollment.progressPct}%)
                </h2>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="space-y-4">
              {enrollment.modules.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (mod: any) => (
                  <div key={mod.id} className="space-y-2">
                    <div className="text-xs font-extrabold text-slate-800">
                      {mod.title}
                    </div>
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
                              className={`w-full flex items-start justify-between gap-2.5 rounded-xl border p-3 text-left transition ${
                                isCurrent
                                  ? "border-indigo-600 bg-indigo-50/70"
                                  : "border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <Play className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {les.title}
                                  </div>
                                  <div className="font-mono text-[11px] font-medium text-slate-500 mt-1">
                                    Đã xem: {les.progress?.watchedSeconds || 0}s /{" "}
                                    {les.durationSeconds}s
                                  </div>
                                </div>
                              </div>
                              {les.progress?.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
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
