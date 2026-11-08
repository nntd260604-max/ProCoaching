"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  PlaySquare,
  Calendar,
  Activity,
  Copy,
  CheckCircle2,
  RefreshCw,
  Clock,
  UserCheck,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

function DynamicQrSvg({ token }: { token: string }) {
  const size = 21;
  const cells: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isBorder || isInner) {
          cells[r0 + r][c0 + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  let hash = 2166136261;
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      const seed =
        (hash ^ (r * 31 + c * 17) ^ token.charCodeAt((r + c) % token.length)) >>>
        0;
      cells[r][c] = seed % 2 === 0;
    }
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-48 w-48"
        shapeRendering="crispEdges"
      >
        {cells.map((row, rIdx) =>
          row.map((filled, cIdx) =>
            filled ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx}
                y={rIdx}
                width={1}
                height={1}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const {
    activeUserId,
    setClipboardQrToken,
    switchDemoRole,
    pushToast,
  } = useHybridCartStore();

  const [activeTab, setActiveTab] = useState<
    "QR_PASS" | "COURSES" | "PT_BOOKING" | "HISTORY"
  >("QR_PASS");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [memberData, setMemberData] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [liveQrToken, setLiveQrToken] = useState<string>("");

  const [selectedTrainerId, setSelectedTrainerId] = useState("user-trainer-01");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trainerSlots, setTrainerSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [focusArea, setFocusArea] = useState(
    "Thân trên: Ngực - Vai - Tay sau (Hypertrophy)"
  );
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const fetchMemberDashboard = useCallback(async () => {
    const res = await fetch(
      `/api/member?userId=${activeUserId || "user-member-01"}`
    );
    const data = await res.json();
    setMemberData(data);
    if (data.enrollments?.[0]?.qrData) {
      setLiveQrToken(data.enrollments[0].qrData.qrToken);
      setCountdown(data.enrollments[0].qrData.expiresInSeconds);
    }
  }, [activeUserId]);

  const refreshQrOnly = useCallback(async (enrollmentId: string) => {
    const res = await fetch(`/api/qr-checkin?enrollmentId=${enrollmentId}`);
    const data = await res.json();
    if (res.ok && data.qrToken) {
      setLiveQrToken(data.qrToken);
      setCountdown(data.expiresInSeconds);
    }
  }, []);

  useEffect(() => {
    fetchMemberDashboard();
  }, [fetchMemberDashboard]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const firstEnrollId =
            memberData?.enrollments?.[0]?.id || "enroll-member-01";
          refreshQrOnly(firstEnrollId);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [memberData, refreshQrOnly]);

  const fetchSlots = useCallback(async () => {
    const res = await fetch(
      `/api/pt-bookings?trainerId=${selectedTrainerId}&date=${selectedDate}`
    );
    const data = await res.json();
    if (data.slots) {
      setTrainerSlots(data.slots);
      setSelectedSlot(null);
    }
  }, [selectedTrainerId, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleCopyToken = (token: string) => {
    setClipboardQrToken(token);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(token).catch(() => {});
    }
    pushToast({
      title: "Đã sao chép Mã QR 60 giây!",
      description: token,
      type: "success",
    });
  };

  const handleBookPtSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      pushToast({
        title: "Chưa chọn ca tập",
        description: "Vui lòng chọn 1 khung giờ còn trống của Huấn luyện viên.",
        type: "warning",
      });
      return;
    }

    const activeEnrollment = memberData?.enrollments?.[0];
    if (!activeEnrollment) return;

    setBookingSubmitting(true);
    try {
      const res = await fetch("/api/pt-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: activeEnrollment.id,
          memberId: memberData.member.id,
          trainerId: selectedTrainerId,
          bookingDate: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          focusArea,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể đặt lịch");
      }

      pushToast({
        title: "Đặt lịch tập 1-1 với PT thành công!",
        description: `Ca ${selectedSlot.startTime} - ${selectedSlot.endTime} ngày ${selectedDate}`,
        type: "success",
      });
      await fetchSlots();
      await fetchMemberDashboard();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi đặt lịch";
      pushToast({
        title: "Không thể đặt lịch tập",
        description: msg,
        type: "error",
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (!memberData) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm font-medium text-slate-600">
        Đang tải thông tin Hội viên...
      </div>
    );
  }

  const primaryEnrollment = memberData.enrollments?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Top Member Header Card */}
      <div className="solid-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={memberData.member.avatarUrl}
            alt={memberData.member.fullName}
            className="h-14 w-14 rounded-2xl object-cover border-2 border-emerald-600"
          />
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              Hội Viên Chính Thức
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-0.5">
              Xin chào, {memberData.member.fullName}
            </h1>
            <p className="text-xs font-medium text-slate-600">
              {memberData.member.email} • SĐT: {memberData.member.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-emerald-800">
              Số buổi PT 1-1 còn lại
            </div>
            <div className="font-mono text-xl font-extrabold text-emerald-700">
              {primaryEnrollment?.remainingPtSessions ?? 0} /{" "}
              {primaryEnrollment?.totalPtSessions ?? 0} buổi
            </div>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-indigo-800">
              Tiến độ Khóa học Video
            </div>
            <div className="font-mono text-xl font-extrabold text-indigo-700">
              {primaryEnrollment?.progressPct ?? 0}%
            </div>
          </div>
        </div>
      </div>

      {/* 4 Clean Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          {
            id: "QR_PASS",
            label: "Thẻ Tập & Mã QR 60s",
            icon: QrCode,
          },
          {
            id: "COURSES",
            label: "Khóa Học Video Của Tôi",
            icon: PlaySquare,
          },
          {
            id: "PT_BOOKING",
            label: "Đặt Lịch Tập PT 1-1",
            icon: Calendar,
          },
          {
            id: "HISTORY",
            label: "Chỉ Số Cơ Thể & Đơn Hàng",
            icon: Activity,
          },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  t.id as "QR_PASS" | "COURSES" | "PT_BOOKING" | "HISTORY"
                )
              }
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs sm:text-sm font-bold transition ${
                active
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* AREA 1: VIP DARK GLASS MEMBERSHIP QR PASS + SOLID INFO CARDS */}
      {activeTab === "QR_PASS" && primaryEnrollment && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Selective Dark Glass VIP Pass */}
          <div className="lg:col-span-6 glass-dark-pass p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Thẻ Hội Viên Điện Tử • Đổi Mã Mỗi 60 Giây
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">
                  Quét Mã QR Ra Vào Phòng Tập & Điểm Danh PT
                </h2>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-bold text-emerald-300">
                ĐANG HOẠT ĐỘNG
              </span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-5 py-2">
              <DynamicQrSvg token={liveQrToken || "GHQR.DEMO"} />

              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    Tự động làm mới sau:
                  </span>
                  <span className="font-mono text-sm font-extrabold text-emerald-400">
                    {countdown}s / 60s
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    style={{ width: `${(countdown / 60) * 100}%` }}
                    className={`h-full transition-all duration-1000 ${
                      countdown <= 10 ? "bg-rose-500" : "bg-emerald-400"
                    }`}
                  />
                </div>
              </div>

              <div className="w-full rounded-2xl border border-white/15 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Mã xác thực hiện tại:</span>
                  <button
                    type="button"
                    onClick={() => refreshQrOnly(primaryEnrollment.id)}
                    className="inline-flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" /> Đổi mã ngay
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-emerald-300 break-all bg-slate-900 p-2.5 rounded-xl border border-white/10">
                  {liveQrToken}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyToken(liveQrToken)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Sao chép mã QR Token
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyToken(liveQrToken);
                      switchDemoRole("TRAINER");
                      router.push("/dashboard/trainer");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                  >
                    Quét thử tại màn hình PT <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Crisp Solid White Cards for Membership Details & Check-in History */}
          <div className="lg:col-span-6 space-y-6">
            <div className="solid-card p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Thông Tin Gói Tập Đang Sử Dụng
              </h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Gói đăng ký:</span>
                  <span className="font-bold text-slate-900 text-right max-w-xs">
                    {primaryEnrollment.course?.title}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5">
                  <span className="font-medium text-slate-500">
                    Huấn luyện viên phụ trách:
                  </span>
                  <span className="font-bold text-indigo-600">
                    {primaryEnrollment.trainerName}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5">
                  <span className="font-medium text-slate-500">
                    Ngày hết hạn thẻ:
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {new Date(primaryEnrollment.expiresAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5">
                  <span className="font-medium text-slate-500">
                    Số buổi PT 1-1 còn lại:
                  </span>
                  <span className="font-mono text-sm font-extrabold text-emerald-600">
                    {primaryEnrollment.remainingPtSessions} /{" "}
                    {primaryEnrollment.totalPtSessions} buổi
                  </span>
                </div>
              </div>
            </div>

            <div className="solid-card p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Lịch Sử Điểm Danh Phòng Tập Gần Đây
              </h3>
              <div className="space-y-2.5">
                {memberData.checkins.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (chk: any) => (
                    <div
                      key={chk.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs"
                    >
                      <div className="space-y-1">
                        <div>
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold mr-2 ${
                              chk.checkinType === "PT_SESSION"
                                ? "bg-indigo-600 text-white"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {chk.checkinType === "PT_SESSION"
                              ? "Buổi tập PT 1-1"
                              : "Tự tập phòng Gym"}
                          </span>
                          <span className="font-bold text-slate-900">
                            Xác nhận bởi: {chk.verifiedByName}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          Mã phiên: {chk.qrTokenHash}
                        </div>
                      </div>
                      <div className="text-right font-medium text-slate-600">
                        {new Date(chk.checkinTime).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AREA 2: MY VIDEO COURSES */}
      {activeTab === "COURSES" && (
        <div className="space-y-6">
          {memberData.enrollments.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (enr: any) => (
              <div key={enr.id} className="solid-card p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Khóa Học Đã Kích Hoạt
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                      {enr.course?.title}
                    </h2>
                    <p className="text-xs font-medium text-slate-600 mt-1">
                      Huấn luyện viên:{" "}
                      <strong className="text-slate-900">{enr.trainerName}</strong>{" "}
                      • Tiến độ hoàn thành:{" "}
                      <strong className="text-emerald-600">
                        {enr.progressPct}%
                      </strong>
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/member/courses/${enr.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition"
                  >
                    <PlaySquare className="h-4 w-4" />
                    Vào Phòng Học Video
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {enr.modules.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (mod: any) => (
                      <div
                        key={mod.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                      >
                        <div className="text-xs font-extrabold text-slate-900">
                          {mod.title}
                        </div>
                        <div className="space-y-2">
                          {mod.lessons.map(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (les: any) => (
                              <Link
                                key={les.id}
                                href={`/dashboard/member/courses/${enr.id}?lessonId=${les.id}`}
                                className="block rounded-lg border border-slate-200 bg-white p-3 hover:border-indigo-400 transition"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-900 line-clamp-2">
                                    {les.title}
                                  </span>
                                  {les.progress?.isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                                  )}
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
                                  <span className="font-mono">
                                    {les.progress?.watchedSeconds || 0}s /{" "}
                                    {les.durationSeconds}s
                                  </span>
                                  <span
                                    className={
                                      les.progress?.isCompleted
                                        ? "text-emerald-600 font-bold"
                                        : "text-amber-600 font-semibold"
                                    }
                                  >
                                    {les.progress?.isCompleted
                                      ? "Đã hoàn thành"
                                      : `Đang học (${les.progress?.lastPositionSec || 0}s)`}
                                  </span>
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* AREA 3: BOOK 1-1 PT SESSION */}
      {activeTab === "PT_BOOKING" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <form
            onSubmit={handleBookPtSession}
            className="lg:col-span-7 solid-card p-6 sm:p-8 space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Đặt Lịch Tập Trực Tiếp
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Đặt Lịch Tập Kèm 1-1 Cùng Huấn Luyện Viên
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  1. Chọn Huấn Luyện Viên
                </label>
                <select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900"
                >
                  {memberData.trainers.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} — {t.profile?.specialties}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  2. Chọn Ngày Tập
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                3. Chọn Khung Giờ (Ca đã có học viên đặt sẽ tự động khóa):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trainerSlots.map((slot) => {
                  const isSelected =
                    selectedSlot?.startTime === slot.startTime;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.isBooked}
                      onClick={() =>
                        setSelectedSlot({
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        })
                      }
                      className={`flex flex-col items-start justify-between rounded-xl border p-3.5 text-left transition ${
                        slot.isBooked
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                          : isSelected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-950"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-sm font-extrabold">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.isBooked ? (
                          <Lock className="h-4 w-4 text-rose-500" />
                        ) : (
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              isSelected
                                ? "text-indigo-600"
                                : "text-slate-300"
                            }`}
                          />
                        )}
                      </div>
                      <span className="mt-1.5 text-[11px] font-semibold">
                        {slot.isBooked ? (
                          <span className="text-rose-600">
                            Đã kín ({slot.bookedByMemberName})
                          </span>
                        ) : (
                          <span className="text-emerald-600">Còn trống</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-slate-700">
                4. Chọn Nhóm Cơ Mục Tiêu Trong Buổi Tập
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900"
              >
                <option value="Thân trên: Ngực - Vai - Tay sau (Push Hypertrophy)">
                  Thân trên: Ngực - Vai - Tay sau (Push Hypertrophy)
                </option>
                <option value="Thân dưới: Barbell Squat & Romanian Deadlift (Chân - Mông)">
                  Thân dưới: Barbell Squat & Romanian Deadlift (Chân - Mông)
                </option>
                <option value="Lưng - Xô & Tay trước (Pull Day + Core Bracing)">
                  Lưng - Xô & Tay trước (Pull Day + Core Bracing)
                </option>
                <option value="Tập HIIT Đốt Mỡ Toàn Thân & Phục Hồi Cơ">
                  Tập HIIT Đốt Mỡ Toàn Thân & Phục Hồi Cơ
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={bookingSubmitting}
              className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition"
            >
              {bookingSubmitting
                ? "Đang xác nhận lịch hẹn..."
                : "Xác Nhận Đặt Lịch Tập 1-1"}
            </button>
          </form>

          {/* Bookings List */}
          <div className="lg:col-span-5 solid-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-600" />
              Lịch Hẹn Tập PT Của Bạn
            </h3>

            <div className="space-y-3">
              {memberData.bookings.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (b: any) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">
                        {b.bookingDate} • {b.startTime} - {b.endTime}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          b.status === "COMPLETED"
                            ? "bg-emerald-600 text-white"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        {b.status === "COMPLETED"
                          ? "ĐÃ HOÀN THÀNH"
                          : "SẮP TỚI"}
                      </span>
                    </div>
                    <div className="text-indigo-700 font-bold">
                      {b.trainerName}
                    </div>
                    <div className="font-medium text-slate-700">
                      Nhóm cơ: {b.focusArea}
                    </div>
                    {b.trainerNotes && (
                      <div className="rounded-lg bg-white p-2.5 text-slate-700 border border-slate-200">
                        <strong className="text-emerald-700">
                          Đánh giá của HLV:
                        </strong>{" "}
                        {b.trainerNotes}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* AREA 4: BODY METRICS & ORDERS HISTORY */}
      {activeTab === "HISTORY" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Body Metrics */}
          <div className="lg:col-span-5 solid-card p-6 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Theo Dõi Thể Trạng
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                Lịch Sử Đo Chỉ Số Cơ Thể & TDEE
              </h2>
            </div>

            <div className="space-y-3">
              {memberData.bodyMetrics.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (m: any, idx: number) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Lần đo #{idx + 1} (
                        {new Date(m.recordedAt).toLocaleDateString("vi-VN")})
                      </span>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 font-mono font-bold text-slate-800">
                        BMI: {m.bmi}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-white border border-slate-200 p-2">
                        <div className="text-[10px] font-medium text-slate-500">
                          Cân nặng
                        </div>
                        <div className="font-mono text-sm font-extrabold text-slate-900">
                          {m.weightKg} kg
                        </div>
                      </div>
                      <div className="rounded-lg bg-white border border-slate-200 p-2">
                        <div className="text-[10px] font-medium text-slate-500">
                          Tỷ lệ mỡ
                        </div>
                        <div className="font-mono text-sm font-extrabold text-amber-600">
                          {m.bodyFatPct ?? "--"}%
                        </div>
                      </div>
                      <div className="rounded-lg bg-white border border-slate-200 p-2">
                        <div className="text-[10px] font-medium text-slate-500">
                          TDEE
                        </div>
                        <div className="font-mono text-sm font-extrabold text-emerald-600">
                          {m.tdeeCalories} kcal
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Orders & FEFO Batch Traceability */}
          <div className="lg:col-span-7 solid-card p-6 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Minh Bạch Nguồn Gốc Lô Hàng
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                Lịch Sử Đơn Hàng & Mã Lô Xuất Kho
              </h2>
            </div>

            <div className="space-y-4">
              {memberData.orders.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (ord: any) => (
                  <div
                    key={ord.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="font-mono text-sm font-extrabold text-slate-900">
                          {ord.orderCode}
                        </span>
                        <span className="ml-2 font-medium text-slate-500">
                          ({new Date(ord.createdAt).toLocaleDateString("vi-VN")})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-bold text-emerald-700">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                        <span className="font-mono text-sm font-extrabold text-slate-900">
                          {ord.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (item: any) => (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-white p-3 border border-slate-200"
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900">
                                {item.itemNameSnapshot} (x{item.quantity})
                              </div>
                              {item.allocatedBatchCode ? (
                                <div className="inline-flex flex-wrap items-center gap-2 text-[11px]">
                                  <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono font-bold text-emerald-700">
                                    Mã lô: {item.allocatedBatchCode}
                                  </span>
                                  <span className="font-mono font-medium text-slate-600">
                                    HSD: {item.allocatedBatchExpiry}
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-block rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                                  Đã kích hoạt thẻ tập & khóa học
                                </span>
                              )}
                            </div>
                            <div className="font-mono font-extrabold text-slate-900 shrink-0">
                              {item.lineTotal.toLocaleString("vi-VN")}đ
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
