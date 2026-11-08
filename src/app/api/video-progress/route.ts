import { NextRequest, NextResponse } from "next/server";
import {
  updateLessonProgressHeartbeat,
  VideoHeartbeatInput,
} from "@/lib/services/video-progress.service";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VideoHeartbeatInput;
    const result = updateLessonProgressHeartbeat({
      enrollmentId: body.enrollmentId || "enroll-member-01",
      userId: body.userId || "user-member-01",
      lessonId: body.lessonId,
      addedWatchedSeconds: Number(body.addedWatchedSeconds || 0),
      lastPositionSec: Number(body.lastPositionSec || 0),
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi cập nhật tiến độ bài giảng.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

