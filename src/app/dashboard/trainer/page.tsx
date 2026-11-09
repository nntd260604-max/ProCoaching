"use client";

import React, { useEffect, useState, useCallback, startTransition } from "react";
import {
  QrCode,
  UserCheck,
  CheckCircle2,
  Calendar,
  ScanLine,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import { useHybridCartStore } from "@/store/useHybridCartStore";
import { SolidCard } from "@/components/ui/Surface";

export default function TrainerDashboardPage() {
  const clipboardQrToken = useHybridCartStore((s) => s.clipboardQrToken);
  const pushToast = useHybridCartStore((s) => s.pushToast);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [checkins, setCheckins] = useState<any[]>([]);

  const [qrTokenInput, setQrTokenInput] = useState("");
  const [checkinType, setCheckinType] = useState<"PT_SESSION" | "GYM_ENTRY">(
    "PT_SESSION"
  );
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [trainerNotes, setTrainerNotes] = useState(
    "Học viên hoàn thành tốt 4 hiệp Squat 80kg x 8 lần, giữ lưng thẳng và kiểm soát nhịp thở tốt."
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
        setQrTokenInput((prev) =>
          prev ? prev : clipboardQrToken || firstConfirmed.liveQrToken || ""
        );
      }
    }
    if (data.checkins) {
      setCheckins(data.checkins);
    }
  }, [clipboardQrToken]);

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
        title: "Chưa nhập mã QR",
        description:
          "Hãy dán mã QR từ màn hình Hội viên hoặc bấm nút Lấy mã QR mẫu.",
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
          ptBookingId:
            checkinType === "PT_SESSION" ? selectedBookingId || null : null,
          trainerNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Xác thực QR thất bại");
      }

      startTransition(() => {
        setScanResult(data);
      });
      pushToast({
        title: "Điểm danh QR thành công!",
        description:
          checkinType === "PT_SESSION"
            ? `Đã hoàn thành buổi tập và trừ 1 buổi PT. Còn lại: ${data.remainingPtSessions} buổi.`
            : `Đã ghi nhận lượt vào phòng tập cho ${data.memberName}.`,
        type: "success",
      });
      await loadTrainerData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xác thực mã QR";
      pushToast({
        title: "Từ chối điểm danh QR",
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
        title: "Đã lấy mã QR 60s hiện tại của hội viên Nguyễn Minh Quân!",
        description: data.qrToken,
        type: "info",
      });
    }
  };

  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Top Trainer Profile Bar */}
      <SolidCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&auto=format&fit=crop&q=80"
            alt="HLV Lê Hoàng Nam"
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover border-2 border-indigo-600"
          />
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              <UserCheck className="h-3 w-3" aria-hidden="true" /> Huấn Luyện
              Viên Cá Nhân (PT)
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-0.5">
              HLV Lê Hoàng Nam (Chứng chỉ NASM-CPT)
            </h1>
            <p className="text-xs font-medium text-slate-600">
              Chuyên môn: Tăng cơ giảm mỡ, Sức mạnh & Phục hồi vận động • Đánh
              giá: 4.95/5.0
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-indigo-800">
              Ca dạy sắp tới
            </div>
            <div className="font-mono text-xl font-extrabold text-indigo-700 tabular-nums">
              {confirmedCount} ca
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-emerald-800">
              Đã hoàn thành
            </div>
            <div className="font-mono text-xl font-extrabold text-emerald-700 tabular-nums">
              {completedCount} ca
            </div>
          </div>
        </div>
      </SolidCard>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Focal Glass Panel for QR Check-in Scanner */}
        <div className="lg:col-span-6 space-y-6">
          <form
            onSubmit={handleVerifyQr}
            className="glass-panel p-6 sm:p-8 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Xác Thực Mã QR Động 60 Giây
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                  <ScanLine
                    className="h-5 w-5 text-indigo-600"
                    aria-hidden="true"
                  />
                  Điểm Danh Hội Viên & Buổi Tập PT 1-1
                </h2>
              </div>
              <button
                type="button"
                onClick={handleSimulateLiveToken}
                className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                + Lấy Mã QR 60s Hiện Tại
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="block font-bold text-slate-700">
                1. Chọn hình thức điểm danh
              </span>
              <div
                role="group"
                aria-label="Chọn hình thức điểm danh"
                className="grid grid-cols-2 gap-3"
              >
                <button
                  type="button"
                  aria-pressed={checkinType === "PT_SESSION"}
                  onClick={() => setCheckinType("PT_SESSION")}
                  className={`rounded-xl border p-3.5 text-left transition-colors ${
                    checkinType === "PT_SESSION"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-950"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold text-indigo-700">
                    Buổi tập PT 1-1
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                    Hoàn thành ca dạy & trừ 1 buổi PT
                  </div>
                </button>
                <button
                  type="button"
                  aria-pressed={checkinType === "GYM_ENTRY"}
                  onClick={() => setCheckinType("GYM_ENTRY")}
                  className={`rounded-xl border p-3.5 text-left transition-colors ${
                    checkinType === "GYM_ENTRY"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold text-emerald-700">
                    Ra vào phòng tập
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                    Kiểm tra thẻ tập, không trừ buổi PT
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label
                htmlFor="trainer-qr-token"
                className="block font-bold text-slate-700"
              >
                2. Mã QR Token 60 giây của Hội viên
              </label>
              <input
                id="trainer-qr-token"
                name="qrToken"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={qrTokenInput}
                onChange={(e) => setQrTokenInput(e.target.value)}
                placeholder="Dán mã QR từ màn hình Hội viên vào đây…"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 font-mono text-xs font-bold text-slate-900"
              />
            </div>

            {checkinType === "PT_SESSION" ? (
              <>
                <div className="space-y-1.5 text-xs">
                  <label
                    htmlFor="trainer-booking-select"
                    className="block font-bold text-slate-700"
                  >
                    3. Chọn ca hẹn PT cần xác nhận hoàn thành
                  </label>
                  <select
                    id="trainer-booking-select"
                    name="selectedBookingId"
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900"
                  >
                    {bookings
                      .filter((b) => b.status === "CONFIRMED")
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.memberName} • Ngày {b.bookingDate} ({b.startTime} -{" "}
                          {b.endTime}) • {b.focusArea}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label
                    htmlFor="trainer-notes"
                    className="block font-bold text-slate-700"
                  >
                    4. Ghi chú đánh giá mức tạ & kỹ thuật sau buổi tập
                  </label>
                  <textarea
                    id="trainer-notes"
                    name="trainerNotes"
                    rows={3}
                    value={trainerNotes}
                    onChange={(e) => setTrainerNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900"
                  />
                </div>
              </>
            ) : null}

            <button
              type="submit"
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <QrCode className="h-4 w-4" aria-hidden="true" />
              {verifying
                ? "Đang kiểm tra mã QR & cập nhật buổi tập…"
                : "Xác Nhận Điểm Danh QR"}
            </button>
          </form>

          {scanResult ? (
            <SolidCard
              className="p-5 border-emerald-300 bg-emerald-50/60 space-y-2 text-xs"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 text-sm">
                <CheckCircle2
                  className="h-5 w-5 text-emerald-600"
                  aria-hidden="true"
                />
                Điểm Danh Thành Công!
              </div>
              <div className="font-medium text-slate-800">
                Hội viên: <strong>{scanResult.memberName}</strong> • Gói tập:{" "}
                <strong>{scanResult.courseTitle}</strong>
              </div>
              <div className="font-medium text-slate-700">
                Số buổi PT 1-1 còn lại:{" "}
                <strong className="font-mono text-emerald-700 text-sm tabular-nums">
                  {scanResult.remainingPtSessions} buổi
                </strong>
              </div>
            </SolidCard>
          ) : null}
        </div>

        {/* Right: Solid White Cards for Weekly PT Schedule & Check-in Logs */}
        <div className="lg:col-span-6 space-y-6">
          <SolidCard className="p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar
                className="h-5 w-5 text-indigo-600"
                aria-hidden="true"
              />
              Lịch Dạy Kèm PT 1-1 Trong Tuần
            </h3>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-slate-900">
                      Học viên:{" "}
                      <span className="text-indigo-600">{b.memberName}</span>{" "}
                      (Còn {b.remainingPtSessions} buổi)
                    </div>
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                        b.status === "COMPLETED"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {b.status === "COMPLETED"
                        ? "ĐÃ HOÀN THÀNH"
                        : "CHỜ ĐIỂM DANH"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono font-semibold text-slate-700 tabular-nums">
                    <Clock
                      className="h-3.5 w-3.5 text-indigo-600"
                      aria-hidden="true"
                    />
                    <span>
                      Ngày {b.bookingDate} • Ca {b.startTime} - {b.endTime}
                    </span>
                  </div>

                  <div className="font-medium text-slate-600">
                    Nhóm cơ:{" "}
                    <strong className="text-slate-900">{b.focusArea}</strong>
                  </div>

                  {b.trainerNotes ? (
                    <div className="rounded-lg bg-white border border-slate-200 p-2.5 text-slate-700">
                      <strong className="text-emerald-700">
                        Đánh giá HLV:
                      </strong>{" "}
                      {b.trainerNotes}
                    </div>
                  ) : null}

                  {b.status === "CONFIRMED" && b.liveQrToken ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingId(b.id);
                        setCheckinType("PT_SESSION");
                        setQrTokenInput(b.liveQrToken);
                        pushToast({
                          title: "Đã nạp mã QR của ca tập này vào khung quét!",
                          description:
                            "Bấm 'Xác Nhận Điểm Danh QR' ở cột bên trái để hoàn tất.",
                          type: "info",
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      <ClipboardCheck
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      Chọn ca này & nạp mã QR để điểm danh
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </SolidCard>

          <SolidCard className="p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Nhật Ký Điểm Danh Gần Đây
            </h3>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {checkins.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                >
                  <div>
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold mr-2 ${
                        c.checkinType === "PT_SESSION"
                          ? "bg-indigo-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {c.checkinType === "PT_SESSION" ? "Tập PT" : "Tự tập"}
                    </span>
                    <span className="font-bold text-slate-900">
                      {c.memberName}
                    </span>
                    <div
                      className="text-[10px] text-slate-500 font-mono mt-0.5"
                      translate="no"
                    >
                      {c.qrTokenHash}
                    </div>
                  </div>
                  <div className="text-right font-medium text-slate-600">
                    <div className="font-mono tabular-nums">
                      {new Date(c.checkinTime).toLocaleTimeString("vi-VN")}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {c.verifiedByName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SolidCard>
        </div>
      </div>
    </div>
  );
}
