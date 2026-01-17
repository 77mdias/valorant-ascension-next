"use server";

import { db } from "@/lib/prisma";
import { LESSON_COMPLETE_RATIO } from "@/schemas/lessonProgress";
import {
  calculateStreaks,
  type DailyStudyRecord,
} from "@/lib/streakCalculator";

const DAY_IN_MS = 86_400_000;
const MIN_SECONDS_FOR_STREAK = 300; // 5 minutos

const toDayKey = (value: Date) => value.toISOString().slice(0, 10);

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const watchedSecondsFromProgress = (options: {
  lastPosition?: number | null;
  totalDuration?: number | null;
  lessonDuration?: number | null;
  progress?: number | null;
}) => {
  const safeDuration = Math.max(
    options.totalDuration ?? 0,
    options.lessonDuration ?? 0,
  );
  const positionBased = Math.min(options.lastPosition ?? 0, safeDuration || 0);
  const ratioBased = safeDuration * clamp01(options.progress ?? 0);

  return Math.max(positionBased, ratioBased, 0);
};

const buildTimeline = (records: DailyStudyRecord[], days: number) => {
  const grouped = new Map<string, number>();

  for (const record of records) {
    const date =
      record.date instanceof Date ? record.date : new Date(record.date);
    if (Number.isNaN(date.getTime())) continue;
    const key = toDayKey(date);
    const current = grouped.get(key) ?? 0;
    grouped.set(key, current + Math.max(record.seconds, 0));
  }

  const today = new Date();
  const start = new Date(today.getTime() - (days - 1) * DAY_IN_MS);

  const data: Array<{ date: string; label: string; minutes: number }> = [];

  for (let index = 0; index < days; index++) {
    const day = new Date(start.getTime() + index * DAY_IN_MS);
    const key = toDayKey(day);
    const minutes = Math.round((grouped.get(key) ?? 0) / 60);
    data.push({
      date: key,
      label: day.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      minutes,
    });
  }

  return data;
};

const ACHIEVEMENT_TARGETS: Record<string, { targetLessons: number }> = {
  "Primeira Aula": { targetLessons: 1 },
  "Estudante Dedicado": { targetLessons: 10 },
};

export type ProgressLessonSummary = {
  id: string;
  title: string;
  category?: string | null;
  categorySlug?: string | null;
  progressPercent: number;
  completed: boolean;
  updatedAt: Date;
};

export type ProgressDashboardData = {
  stats: {
    totalLessons: number;
    completedLessons: number;
    inProgressLessons: number;
    totalWatchedSeconds: number;
    currentStreak: number;
    bestStreak: number;
    lastUpdatedAt: Date | null;
  };
  timeline: Array<{ date: string; label: string; minutes: number }>;
  lessons: ProgressLessonSummary[];
  nextAchievement: {
    title: string;
    description?: string | null;
    icon?: string | null;
    progress: number;
    target: number | null;
  } | null;
};

export async function getUserProgressDashboard(
  userId: string,
): Promise<ProgressDashboardData> {
  const [progressRecords, totalLessons, achievements, userAchievements] =
    await Promise.all([
      db.lessonProgress.findMany({
        where: { userId },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              duration: true,
              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      db.lessons.count(),
      db.achievements.findMany({
        orderBy: { createdAt: "asc" },
      }),
      db.userAchievements.findMany({
        where: { userId },
        include: { achievement: true },
      }),
    ]);

  const completedLessons = progressRecords.filter(
    (record) => record.completed || record.progress >= LESSON_COMPLETE_RATIO,
  ).length;

  const inProgressLessons = progressRecords.filter(
    (record) => !record.completed && record.progress > 0,
  ).length;

  const dailyRecords: DailyStudyRecord[] = [];
  let totalWatchedSeconds = 0;

  for (const record of progressRecords) {
    const watchedSeconds = watchedSecondsFromProgress({
      lastPosition: record.lastPosition,
      totalDuration: record.totalDuration,
      lessonDuration: record.lesson?.duration,
      progress: record.progress,
    });

    totalWatchedSeconds += watchedSeconds;
    dailyRecords.push({ date: record.updatedAt, seconds: watchedSeconds });
  }

  const timeline = buildTimeline(dailyRecords, 14);
  const { currentStreak, bestStreak } = calculateStreaks(
    dailyRecords,
    MIN_SECONDS_FOR_STREAK,
  );

  const lessons: ProgressLessonSummary[] = progressRecords.map((record) => ({
    id: record.lessonId,
    title: record.lesson?.title ?? "Aula",
    category: record.lesson?.category?.name,
    categorySlug: record.lesson?.category?.slug,
    progressPercent: Math.round(clamp01(record.progress) * 100),
    completed: record.completed,
    updatedAt: record.updatedAt,
  }));

  const unlockedTitles = new Set(
    userAchievements.map((item) => item.achievement?.title).filter(Boolean),
  );

  const sortedAchievements = achievements.sort((first, second) => {
    const firstTarget = ACHIEVEMENT_TARGETS[first.title]?.targetLessons ?? 0;
    const secondTarget = ACHIEVEMENT_TARGETS[second.title]?.targetLessons ?? 0;
    return firstTarget - secondTarget;
  });

  const nextAchievement = sortedAchievements.find((achievement) => {
    if (unlockedTitles.has(achievement.title)) {
      return false;
    }

    const targetLessons = ACHIEVEMENT_TARGETS[achievement.title]?.targetLessons;
    if (!targetLessons) {
      return false;
    }

    return completedLessons < targetLessons;
  });

  const resolvedNextAchievement = nextAchievement
    ? {
        title: nextAchievement.title,
        description: nextAchievement.description,
        icon: nextAchievement.iconUrl,
        target:
          ACHIEVEMENT_TARGETS[nextAchievement.title]?.targetLessons ?? null,
        progress: (() => {
          const target =
            ACHIEVEMENT_TARGETS[nextAchievement.title]?.targetLessons ?? 0;
          if (!target) return 0;
          return clamp01(completedLessons / target);
        })(),
      }
    : null;

  return {
    stats: {
      totalLessons,
      completedLessons,
      inProgressLessons,
      totalWatchedSeconds,
      currentStreak,
      bestStreak,
      lastUpdatedAt: progressRecords[0]?.updatedAt ?? null,
    },
    timeline,
    lessons,
    nextAchievement: resolvedNextAchievement,
  } satisfies ProgressDashboardData;
}
