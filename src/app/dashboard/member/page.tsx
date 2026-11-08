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
  Package,
  ArrowRight,
  Lock,
  Sparkles,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

// Sinh ma trận QR SVG trực quan thay đổi theo chuỗi qrToken 60 giây
function DynamicQrSvg({ token }: { token: string }) {
  const size = 21;
  const cells: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Vẽ 3 góc định vị chuẩn QR (Finder Patterns)
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

  // Băm chuỗi token để điền các điểm dữ liệu động
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

      const seed = (hash ^ (r * 31 + c * 17) ^ token.charCodeAt((r + c) % token.length)) >>> 0;
      cells[r][c] = seed % 2 === 0;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-52 w-52 rounded-2xl bg-white p-3 shadow-inner"
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
              fill="#020617"
            />
          ) : null
        )
      )}
    </svg>
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

  const [activeTab, setActiveTab] = useState<"QR_PASS" | "COURSES" | "PT_BOOKING" | "HISTORY">(
    "QR_PASS"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [memberData, setMemberData] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [liveQrToken, setLiveQrToken] = useState<string>("");

  // State cho Tab Đặt lịch PT 1-1
  const [selectedTrainerId, setSelectedTrainerId] = useState("user-trainer-01");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trainerSlots, setTrainerSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(
    null
  );
  const [focusArea, setFocusArea] = useState("Thân trên: Ngực - Vai - Tay sau (Hypertrophy)");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const fetchMemberDashboard = useCallback(async () => {
    const res = await fetch(`/api/member?userId=${activeUserId || "user-member-01"}`);
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

  // Bộ đếm ngược 60 giây tự động đổi mã QR TOTP
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const firstEnrollId = memberData?.enrollments?.[0]?.id || "enroll-member-01";
          refreshQrOnly(firstEnrollId);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [memberData, refreshQrOnly]);

  // Tải danh sách ca rảnh của PT khi đổi PT hoặc đổi ngày
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
      title: "Đã sao chép Mã QR Token 60s!",
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
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-400">
        Đang tải Dashboard Hội viên...
      </div>
    );
  }

  const primaryEnrollment = memberData.enrollments?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Member Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6">
        <div className="flex items-center gap-4">
          <img
            src={memberData.member.avatarUrl}
            alt={memberData.member.fullName}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500"
          />
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3 w-3" /> Hội Viên Chính Thức (Member Portal)
            </span>
            <h1 className="text-2xl font-black text-white mt-0.5">
              Xin chào, {memberData.member.fullName}
            </h1>
            <p className="text-xs text-slate-400">
              {memberData.member.email} • SĐT: {memberData.member.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 px-4 py-2.5 text-center">
            <div className="text-[11px] text-slate-400">Số buổi PT 1-1 còn lại</div>
            <div className="text-xl font-black text-emerald-400">
              {primaryEnrollment?.remainingPtSessions ?? 0} /{" "}
              {primaryEnrollment?.totalPtSessions ?? 0} buổi
            </div>
          </div>
          <div className="rounded-2xl border border-orange-500/30 bg-slate-950/80 px-4 py-2.5 text-center">
            <div className="text-[11px] text-slate-400">Tiến độ Khóa học Video</div>
            <div className="text-xl font-black text-orange-400">
              {primaryEnrollment?.progressPct ?? 0}%
            </div>
          </div>
        </div>
      </div>

      {/* 4 Functional Tabs Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          {
            id: "QR_PASS",
            label: "1. Thẻ Tập & Mã QR Động 60s",
            icon: QrCode,
          },
          {
            id: "COURSES",
            label: "2. Khóa Học Video Chống Tua",
            icon: PlaySquare,
          },
          {
            id: "PT_BOOKING",
            label: "3. Đặt Lịch Tập 1-1 Với PT",
            icon: Calendar,
          },
          {
            id: "HISTORY",
            label: "4. Lịch Sử Chỉ Số & Đơn Hàng FEFO",
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
                setActiveTab(t.id as "QR_PASS" | "COURSES" | "PT_BOOKING" | "HISTORY")
              }
              className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-xs sm:text-sm font-bold transition ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: THẺ TẬP & MÃ QR CHECK-IN ĐỘNG 60 GIÂY */}
      {activeTab === "QR_PASS" && primaryEnrollment && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Dynamic TOTP QR Pass • Cửa Sổ 60 Giây
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Thẻ Ra Vào Phòng Tập & Điểm Danh PT 1-1
                </h2>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-black text-emerald-300">
                {primaryEnrollment.status}
              </span>
            </div>

            {/* QR Matrix & Countdown */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/90 p-6 space-y-4">
              <DynamicQrSvg token={liveQrToken || "GHQR.DEMO"} />

              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    Tự động đổi mã QR mới sau:
                  </span>
                  <span className="font-mono text-sm font-black text-emerald-400">
                    {countdown}s / 60s
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    style={{ width: `${(countdown / 60) * 100}%` }}
                    className={`h-full transition-all duration-1000 ${
                      countdown <= 10 ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />
                </div>
              </div>

              {/* Token String & Copy for Defense Demo */}
              <div className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Mã Token TOTP 60s (Dùng để quét tại màn hình PT/Admin):</span>
                  <button
                    type="button"
                    onClick={() => refreshQrOnly(primaryEnrollment.id)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" /> Làm mới
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-emerald-300 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {liveQrToken}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyToken(liveQrToken)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Sao Chép Mã QR Token
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyToken(liveQrToken);
                      switchDemoRole("TRAINER");
                      router.push("/dashboard/trainer");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/15 px-3 py-2.5 text-xs font-bold text-orange-300 hover:bg-orange-500/25"
                  >
                    Đem Sang Màn Hình PT Quét Ngay <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Thông tin thẻ & Nhật ký Check-in */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-base font-bold text-white">
                Thông Tin Thẻ Ghi Danh (`user_enrollments`)
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Gói đăng ký:</span>
                  <span className="font-bold text-white text-right max-w-xs">
                    {primaryEnrollment.course?.title}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">HLV Cá nhân phụ trách:</span>
                  <span className="font-bold text-emerald-400">
                    {primaryEnrollment.trainerName}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Ngày hết hạn thẻ:</span>
                  <span className="font-bold text-white">
                    {new Date(primaryEnrollment.expiresAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Số buổi PT 1-1 còn lại:</span>
                  <span className="text-sm font-black text-orange-400">
                    {primaryEnrollment.remainingPtSessions} / {primaryEnrollment.totalPtSessions} buổi
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-base font-bold text-white">
                Nhật Ký Điểm Danh QR Gần Đây (`gym_checkins`)
              </h3>
              <div className="space-y-2.5">
                {memberData.checkins.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (chk: any) => (
                    <div
                      key={chk.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs"
                    >
                      <div>
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-black mr-2 ${
                            chk.checkinType === "PT_SESSION"
                              ? "bg-orange-500 text-slate-950"
                              : "bg-emerald-500 text-slate-950"
                          }`}
                        >
                          {chk.checkinType === "PT_SESSION"
                            ? "PT_SESSION (Tập cùng PT)"
                            : "GYM_ENTRY (Tự tập)"}
                        </span>
                        <span className="font-semibold text-white">
                          Xác thực bởi: {chk.verifiedByName}
                        </span>
                        <div className="text-[11px] text-slate-500 font-mono mt-1">
                          Hash: {chk.qrTokenHash}
                        </div>
                      </div>
                      <div className="text-right text-slate-400">
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

      {/* TAB 2: KHÓA HỌC VIDEO CỦA TÔI */}
      {activeTab === "COURSES" && (
        <div className="space-y-6">
          {memberData.enrollments.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (enr: any) => (
              <div
                key={enr.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-400">
                      Khóa Học Đã Kích Hoạt • Chống Tua Bài 80% (`user_lesson_progress`)
                    </span>
                    <h2 className="text-xl font-black text-white mt-1">
                      {enr.course?.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Giảng viên hướng dẫn: <strong>{enr.trainerName}</strong> • Tiến độ hoàn thành:{" "}
                      <strong className="text-emerald-400">{enr.progressPct}%</strong>
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/member/courses/${enr.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
                  >
                    <PlaySquare className="h-4 w-4" />
                    Vào Phòng Học Video Trực Tuyến
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Danh sách bài học và trạng thái hoàn thành */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {enr.modules.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (mod: any) => (
                      <div
                        key={mod.id}
                        className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 space-y-3"
                      >
                        <div className="text-xs font-bold text-emerald-400">{mod.title}</div>
                        <div className="space-y-2">
                          {mod.lessons.map(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (les: any) => (
                              <Link
                                key={les.id}
                                href={`/dashboard/member/courses/${enr.id}?lessonId=${les.id}`}
                                className="block rounded-xl border border-slate-800 bg-slate-900 p-3 hover:border-emerald-500/40 transition"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-white line-clamp-2">
                                    {les.title}
                                  </span>
                                  {les.progress?.isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                                  )}
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                                  <span>
                                    Đã xem: {les.progress?.watchedSeconds || 0}s /{" "}
                                    {les.durationSeconds}s
                                  </span>
                                  <span
                                    className={
                                      les.progress?.isCompleted
                                        ? "text-emerald-400 font-bold"
                                        : "text-amber-400"
                                    }
                                  >
                                    {les.progress?.isCompleted
                                      ? "Đã hoàn thành (>=80%)"
                                      : `Dừng ở giây ${les.progress?.lastPositionSec || 0}s`}
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

      {/* TAB 3: ĐẶT LỊCH TẬP 1-1 VỚI PT CHỐNG TRÙNG CA */}
      {activeTab === "PT_BOOKING" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <form
            onSubmit={handleBookPtSession}
            className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Anti-Double-Booking Engine • `@@unique([trainerId, bookingDate, startTime])`
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                Đặt Lịch Tập Kèm 1-1 Cùng Huấn Luyện Viên Cá Nhân (PT)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  1. Chọn Huấn Luyện Viên (PT)
                </label>
                <select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white"
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
                <label className="block font-bold text-slate-300 mb-1.5">
                  2. Chọn Ngày Tập (`booking_date`)
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-bold text-white"
                />
              </div>
            </div>

            {/* Khung giờ làm việc của PT */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-300">
                3. Chọn Ca Làm Việc Của PT (Ca đã có người đặt sẽ tự động khóa mờ):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trainerSlots.map((slot) => {
                  const isSelected = selectedSlot?.startTime === slot.startTime;
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
                      className={`flex flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition ${
                        slot.isBooked
                          ? "cursor-not-allowed border-rose-500/30 bg-rose-950/20 text-slate-500 opacity-60"
                          : isSelected
                          ? "border-emerald-500 bg-emerald-500/20 text-white"
                          : "border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-black">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.isBooked ? (
                          <Lock className="h-4 w-4 text-rose-400" />
                        ) : (
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              isSelected ? "text-emerald-400" : "text-slate-600"
                            }`}
                          />
                        )}
                      </div>
                      <span className="mt-1.5 text-[11px]">
                        {slot.isBooked ? (
                          <span className="text-rose-400 font-semibold">
                            Đã kín lịch ({slot.bookedByMemberName})
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Còn trống</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chọn Nhóm cơ mục tiêu */}
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-300">
                4. Chọn Nhóm Cơ Muốn Tập Trung (`focus_area`)
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white"
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
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-orange-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
            >
              {bookingSubmitting
                ? "Đang kiểm tra trùng lịch & lưu CSDL..."
                : "Xác Nhận Đặt Lịch Tập 1-1 Với PT"}
            </button>
          </form>

          {/* Danh sách Lịch hẹn của học viên */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-orange-400" />
              Lịch Hẹn Tập PT Của Bạn (`pt_bookings`)
            </h3>

            <div className="space-y-3">
              {memberData.bookings.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (b: any) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        Ngày {b.bookingDate} • Ca {b.startTime} - {b.endTime}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                          b.status === "COMPLETED"
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-orange-500 text-slate-950"
                        }`}
                      >
                        {b.status === "COMPLETED" ? "ĐÃ HOÀN THÀNH" : "ĐÃ ĐẶT LỊCH"}
                      </span>
                    </div>
                    <div className="text-emerald-400 font-semibold">{b.trainerName}</div>
                    <div className="text-slate-300">Nhóm cơ: {b.focusArea}</div>
                    {b.trainerNotes && (
                      <div className="rounded-lg bg-slate-900 p-2.5 text-slate-300 border border-slate-800">
                        <strong className="text-orange-400">Nhận xét của PT:</strong>{" "}
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

      {/* TAB 4: LỊCH SỬ CHỈ SỐ CƠ THỂ & ĐƠN HÀNG XUẤT KHO FEFO */}
      {activeTab === "HISTORY" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Biểu đồ Chỉ số Cơ thể */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-400">
                Body Metrics Progression (`body_metrics_logs`)
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                Biểu Đồ Theo Dõi Cân Nặng & TDEE Qua Các Lần Đo
              </h2>
            </div>

            <div className="space-y-3">
              {memberData.bodyMetrics.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (m: any, idx: number) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">
                        Lần đo #{idx + 1} ({new Date(m.recordedAt).toLocaleDateString("vi-VN")})
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-white">
                        BMI: {m.bmi}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="rounded-lg bg-slate-900 p-2">
                        <div className="text-[10px] text-slate-400">Cân nặng</div>
                        <div className="text-sm font-black text-white">{m.weightKg} kg</div>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2">
                        <div className="text-[10px] text-slate-400">Tỷ lệ mỡ</div>
                        <div className="text-sm font-black text-orange-400">
                          {m.bodyFatPct ?? "--"}%
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2">
                        <div className="text-[10px] text-slate-400">TDEE</div>
                        <div className="text-sm font-black text-emerald-400">
                          {m.tdeeCalories} Kcal
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Danh sách Đơn hàng & Mã lô FEFO đã xuất */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase text-orange-400">
                FEFO Batch Traceability (`order_items.allocated_batch_id`)
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                Lịch Sử Đơn Hàng Hỗn Hợp & Truy Xuất Mã Lô Hàng FEFO
              </h2>
            </div>

            <div className="space-y-4">
              {memberData.orders.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (ord: any) => (
                  <div
                    key={ord.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-sm font-black text-white">
                          Mã đơn: {ord.orderCode}
                        </span>
                        <span className="ml-2 text-slate-400">
                          ({new Date(ord.createdAt).toLocaleDateString("vi-VN")})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 font-bold text-emerald-300">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                        <span className="text-sm font-black text-emerald-400">
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
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-900 p-3 border border-slate-800/80"
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-white">
                                {item.itemNameSnapshot} (x{item.quantity})
                              </div>
                              {item.allocatedBatchCode ? (
                                <div className="inline-flex items-center gap-2 text-[11px]">
                                  <span className="rounded bg-orange-500/20 border border-orange-500/40 px-2 py-0.5 font-mono font-bold text-orange-300">
                                    Đã xuất từ Lô FEFO: {item.allocatedBatchCode}
                                  </span>
                                  <span className="text-slate-400">
                                    Hạn dùng lô: {item.allocatedBatchExpiry}
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-block rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                                  Dịch vụ số — Đã kích hoạt Thẻ Tập QR
                                </span>
                              )}
                            </div>
                            <div className="font-black text-white shrink-0">
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

