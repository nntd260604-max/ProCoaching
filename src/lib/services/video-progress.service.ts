import { withTransaction } from "../db/runtime-db";

export interface VideoHeartbeatInput {
  enrollmentId: string;
  userId: string;
  lessonId: string;
  addedWatchedSeconds: number;
  lastPositionSec: number;
}

export function updateLessonProgressHeartbeat(input: VideoHeartbeatInput) {
  return withTransaction((db) => {
    const lesson = db.courseLessons.find((l) => l.id === input.lessonId);
    if (!lesson) {
      throw new Error("Không tìm thấy bài giảng video.");
    }

    const enrollment = db.userEnrollments.find((e) => e.id === input.enrollmentId);
    if (!enrollment) {
      throw new Error("Không tìm thấy thẻ ghi danh khóa học.");
    }

    let progress = db.userLessonProgress.find(
      (p) => p.userId === input.userId && p.lessonId === input.lessonId
    );

    const nowIso = new Date().toISOString();
    const requiredSeconds = Math.ceil(lesson.durationSeconds * 0.8);

    if (!progress) {
      const initialWatched = Math.min(lesson.durationSeconds, Math.max(0, input.addedWatchedSeconds));
      const completed = initialWatched >= requiredSeconds;
      progress = {
        id: `prog-${Date.now()}`,
        enrollmentId: input.enrollmentId,
        userId: input.userId,
        lessonId: input.lessonId,
        watchedSeconds: initialWatched,
        lastPositionSec: Math.min(lesson.durationSeconds, Math.max(0, input.lastPositionSec)),
        isCompleted: completed,
        completedAt: completed ? nowIso : null,
        updatedAt: nowIso,
      };
      db.userLessonProgress.push(progress);
    } else {
      progress.watchedSeconds = Math.min(
        lesson.durationSeconds,
        progress.watchedSeconds + Math.max(0, input.addedWatchedSeconds)
      );
      progress.lastPositionSec = Math.min(
        lesson.durationSeconds,
        Math.max(0, input.lastPositionSec)
      );
      progress.updatedAt = nowIso;

      // QUY TẮC CHỐNG TUA BÀI (ANTI-SKIP RULE):
      // Chỉ đánh dấu hoàn thành khi tổng thời gian thực xem (watchedSeconds) >= 80% thời lượng bài giảng
      if (!progress.isCompleted && progress.watchedSeconds >= requiredSeconds) {
        progress.isCompleted = true;
        progress.completedAt = nowIso;
      }
    }

    // Tính lại phần trăm hoàn thành tổng khóa học (progressPct) trên UserEnrollment
    const courseModuleIds = db.courseModules
      .filter((m) => m.courseId === enrollment.courseId)
      .map((m) => m.id);
    const allCourseLessons = db.courseLessons.filter((l) => courseModuleIds.includes(l.moduleId));

    if (allCourseLessons.length > 0) {
      const completedCount = allCourseLessons.filter((l) =>
        db.userLessonProgress.some(
          (p) => p.userId === input.userId && p.lessonId === l.id && p.isCompleted
        )
      ).length;
      enrollment.progressPct = Number(
        ((completedCount / allCourseLessons.length) * 100).toFixed(2)
      );
    }

    return {
      progress,
      requiredSeconds,
      durationSeconds: lesson.durationSeconds,
      courseProgressPct: enrollment.progressPct,
    };
  });
}

