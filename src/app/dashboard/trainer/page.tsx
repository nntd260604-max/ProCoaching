"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  QrCode,
  UserCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ScanLine,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";

export default function TrainerDashboardPage() {
  const { clipboardQrToken, pushToast } = useHybridCartStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [checkins, setCheckins] = useState<any[]>([]);

  const [qrTokenInput, setQrTokenInput] = useState("");
  const [checkinType, setCheckinType] = useState<"PT_SESSION" | "GYM_ENTRY">("PT_SESSION");
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [trainerNotes, setTrainerNotes] = useState(
    "Học viên hoàn thành xuất sắc 4 hiệp Squat 80kg x 8 reps, kỹ thuật gồng Core chuẩn."
  );
  const [verifying, setVerifying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scanResult, setScanResult] = useState<any>(null);

  const loadTrainerData = useCallback(async () => {
    const res = await fetch("/api/qr-checkin", { method: "PUT" });
    const data = await res.json();
    if (data.bookings) {
      setBookings(data.bookings);
      const firstConfirmed = data.bookings.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (b: any) => b.status === "CONFIRMED"
      );
      if (firstConfirmed) {
        setSelectedBookingId(firstConfirmed.id);
        if (!qrTokenInput && firstConfirmed.liveQrToken) {
          setQrTokenInput(clipboardQrToken || firstConfirmed.liveQrToken);
        }
      }
    }
    if (data.checkins) {
      setCheckins(data.checkins);
    }
  }, [clipboardQrToken, qrTokenInput]);

  useEffect(() => {
    loadTrainerData();
  }, [loadTrainerData]);

  useEffect(() => {
    if (clipboardQrToken) {
      setQrTokenInput(clipboardQrToken);
    }
  }, [clipboardQrToken]);

  const handleVerifyQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrTokenInput.trim()) {
      pushToast({
        title: "Chưa nhập mã QR Token",
        description: "Hãy dán mã QR từ màn hình Học viên hoặc bấm nút Lấy mã QR mẫu.",
        type: "warning",
      });
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/qr-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrToken: qrTokenInput.trim(),
          checkinType,
          verifiedById: "user-trainer-01",
          ptBookingId: checkinType === "PT_SESSION" ? selectedBookingId || null : null,
          trainerNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Xác thực QR thất bại");
      }

      setScanResult(data);
      pushToast({
        title: "Quét & Xác thực Mã QR Động 60s Thành Công!",
        description:
          checkinType === "PT_SESSION"
            ? `Đã hoàn thành buổi tập PT và trừ 1 buổi. Còn lại: ${data.remainingPtSessions} buổi.`
            : `Đã ghi nhận lượt vào phòng tập cho ${data.memberName}.`,
        type: "success",
      });
      await loadTrainerData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xác thực mã QR";
      pushToast({
        title: "Từ chối Check-in QR",
        description: msg,
        type: "error",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateLiveToken = async () => {
    const res = await fetch("/api/qr-checkin?enrollmentId=enroll-member-01");
    const data = await res.json();
    if (data.qrToken) {
      setQrTokenInput(data.qrToken);
      pushToast({
        title: "Đã đồng bộ mã QR 60s mới nhất của học viên Nguyễn Minh Quân!",
        description: data.qrToken,
        type: "info",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Trainer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 p-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&auto=format&fit=crop&q=80"
            alt="HLV Lê Hoàng Nam"
            className="h-16 w-16 rounded-2xl object-cover border-2 border-orange-500"
          />
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-300">
              <UserCheck className="h-3 w-3" /> Phân Hệ Huấn Luyện Viên Cá Nhân (Trainer Portal)
            </span>
            <h1 className="text-2xl font-black text-white mt-0.5">
              HLV Trưởng Lê Hoàng Nam (NASM-CPT, ISSA)
            </h1>
            <p className="text-xs text-slate-400">
              Chuyên môn: Hypertrophy, Powerlifting & Phục hồi chấn thương • Đánh giá: 4.95/5.0 ⭐
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="rounded-2xl border border-orange-500/30 bg-slate-950/80 px-4 py-2.5 text-center">
            <div className="text-[11px] text-slate-400">Ca dạy đang chờ (Confirmed)</div>
            <div className="text-xl font-black text-orange-400">
              {bookings.filter((b) => b.status === "CONFIRMED").length} ca
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 px-4 py-2.5 text-center">
            <div className="text-[11px] text-slate-400">Đã hoàn thành (Completed)</div>
            <div className="text-xl font-black text-emerald-400">
              {bookings.filter((b) => b.status === "COMPLETED").length} ca
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Công cụ Quét / Xác thực Mã QR Check-in 60s */}
        <div className="lg:col-span-6 space-y-6">
          <form
            onSubmit={handleVerifyQr}
            className="rounded-3xl border border-orange-500/40 bg-slate-900/85 p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  TOTP 60s Verification & ACID Session Deduction
                </span>
                <h2 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-orange-400" />
                  Máy Quét / Xác Thực Mã QR Check-in Học Viên
                </h2>
              </div>
              <button
                type="button"
                onClick={handleSimulateLiveToken}
                className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
              >
                + Mô Phỏng Quét QR Nhanh
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-300">
                1. Chọn Loại Điểm Danh (`checkin_type`)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCheckinType("PT_SESSION")}
                  className={`rounded-xl border p-3 text-left transition ${
                    checkinType === "PT_SESSION"
                      ? "border-orange-500 bg-orange-500/20 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  <div className="font-black text-orange-400">PT_SESSION (Buổi tập PT 1-1)</div>
                  <div className="text-[11px] mt-0.5">
                    Chuyển lịch hẹn sang COMPLETED & trừ 1 buổi PT
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckinType("GYM_ENTRY")}
                  className={`rounded-xl border p-3 text-left transition ${
                    checkinType === "GYM_ENTRY"
                      ? "border-emerald-500 bg-emerald-500/20 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  <div className="font-black text-emerald-400">GYM_ENTRY (Tự tập)</div>
                  <div className="text-[11px] mt-0.5">
                    Chỉ kiểm tra hạn thẻ QR, không trừ buổi PT
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-slate-300">
                2. Mã QR Token 60 Giây Của Học Viên (`GHQR.&lt;EnrollmentID&gt;.&lt;Window&gt;.&lt;HMAC&gt;`)
              </label>
              <input
                type="text"
                value={qrTokenInput}
                onChange={(e) => setQrTokenInput(e.target.value)}
                placeholder="Dán mã QR Token 60s từ màn hình Hội viên vào đây..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 font-mono text-xs font-bold text-emerald-300"
              />
            </div>

            {checkinType === "PT_SESSION" && (
              <>
                <div className="space-y-1.5 text-xs">
                  <label className="block font-bold text-slate-300">
                    3. Chọn Ca Hẹn PT Cần Hoàn Thành (`pt_bookings`)
                  </label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white"
                  >
                    {bookings
                      .filter((b) => b.status === "CONFIRMED")
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.memberName} • Ngày {b.bookingDate} ({b.startTime} - {b.endTime}) •{" "}
                          {b.focusArea}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="block font-bold text-slate-300">
                    4. Ghi Chú Đánh Giá Mức Tạ & Kỹ Thuật Sau Buổi Tập (`trainer_notes`)
                  </label>
                  <textarea
                    rows={3}
                    value={trainerNotes}
                    onChange={(e) => setTrainerNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-emerald-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 hover:opacity-95"
            >
              <QrCode className="h-4 w-4" />
              {verifying
                ? "Đang kiểm tra chữ ký HMAC-SHA256 & Trừ buổi PT..."
                : "Xác Thực Mã QR & Điểm Danh Hoàn Thành"}
            </button>
          </form>

          {scanResult && (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/20 p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-black text-emerald-400 text-sm">
                <CheckCircle2 className="h-5 w-5" />
                Kết Quả Transaction Điểm Danh QR Thành Công!
              </div>
              <div className="text-slate-200">
                Học viên: <strong>{scanResult.memberName}</strong> • Gói:{" "}
                <strong>{scanResult.courseTitle}</strong>
              </div>
              <div className="text-slate-300">
                Số buổi PT 1-1 còn lại sau khi trừ:{" "}
                <strong className="text-orange-400 text-sm">
                  {scanResult.remainingPtSessions} buổi
                </strong>
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                Mã băm chống Replay Attack: {scanResult.checkin.qrTokenHash}
              </div>
            </div>
          )}
        </div>

        {/* Right: Danh sách Lịch hẹn của Học viên & Nhật ký Quét QR */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-400" />
              Danh Sách Lịch Dạy PT 1-1 Trong Tuần (`pt_bookings`)
            </h3>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-white">
                      Học viên: <span className="text-emerald-400">{b.memberName}</span> (Còn{" "}
                      {b.remainingPtSessions} buổi PT)
                    </div>
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-[10px] font-black ${
                        b.status === "COMPLETED"
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-orange-500 text-slate-950"
                      }`}
                    >
                      {b.status === "COMPLETED" ? "COMPLETED (Đã tập)" : "CONFIRMED (Chờ tập)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-orange-400" />
                    <span>
                      Ngày {b.bookingDate} • Ca {b.startTime} - {b.endTime}
                    </span>
                  </div>

                  <div className="text-slate-400">
                    Nhóm cơ: <strong className="text-slate-200">{b.focusArea}</strong>
                  </div>

                  {b.trainerNotes && (
                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-slate-300">
                      <strong className="text-emerald-400">Ghi chú HLV:</strong> {b.trainerNotes}
                    </div>
                  )}

                  {b.status === "CONFIRMED" && b.liveQrToken && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingId(b.id);
                        setCheckinType("PT_SESSION");
                        setQrTokenInput(b.liveQrToken);
                        pushToast({
                          title: "Đã nạp mã QR của ca tập này vào Máy Quét!",
                          description: "Bấm 'Xác Thực Mã QR & Điểm Danh Hoàn Thành' ở cột trái.",
                          type: "info",
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 px-3 py-1.5 text-[11px] font-bold text-orange-300 hover:bg-orange-500/30"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5" />
                      Chọn Ca Này & Nạp Mã QR 60s Để Điểm Danh
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Nhật Ký Xác Thực QR Tại Phòng Tập (`gym_checkins`)
            </h3>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {checkins.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                >
                  <div>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-black mr-2 ${
                        c.checkinType === "PT_SESSION"
                          ? "bg-orange-500 text-slate-950"
                          : "bg-emerald-500 text-slate-950"
                      }`}
                    >
                      {c.checkinType}
                    </span>
                    <span className="font-bold text-white">{c.memberName}</span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {c.qrTokenHash}
                    </div>
                  </div>
                  <div className="text-right text-slate-400">
                    <div>{new Date(c.checkinTime).toLocaleTimeString("vi-VN")}</div>
                    <div className="text-[10px]">{c.verifiedByName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

