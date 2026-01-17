const DAY_IN_MS = 86_400_000;

export type DailyStudyRecord = {
  date: Date | string;
  seconds: number;
};

const toDayKey = (value: Date | string): string | null => {
  const parsed = typeof value === "string" ? new Date(value) : value;
  if (!(parsed instanceof Date) || Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString().slice(0, 10);
};

export function calculateStreaks(
  records: DailyStudyRecord[],
  minSeconds = 300,
) {
  const qualifyingDays = records
    .map((record) => ({
      key: toDayKey(record.date),
      seconds: Number(record.seconds) || 0,
    }))
    .filter((record) => record.key && record.seconds >= minSeconds)
    .map((record) => record.key as string);

  if (!qualifyingDays.length) {
    return { currentStreak: 0, bestStreak: 0 } as const;
  }

  const uniqueSortedDays = Array.from(new Set(qualifyingDays)).sort();

  let bestStreak = 0;
  let currentRun = 0;
  let previousDayTime = 0;

  for (const dayKey of uniqueSortedDays) {
    const dayTime = new Date(`${dayKey}T00:00:00.000Z`).getTime();

    if (currentRun === 0) {
      currentRun = 1;
    } else {
      const diffMs = dayTime - previousDayTime;
      currentRun = diffMs === DAY_IN_MS ? currentRun + 1 : 1;
    }

    bestStreak = Math.max(bestStreak, currentRun);
    previousDayTime = dayTime;
  }

  const daySet = new Set(uniqueSortedDays);
  let currentStreak = 0;
  let cursor = new Date();

  while (true) {
    const key = toDayKey(cursor);
    if (!key || !daySet.has(key)) {
      break;
    }
    currentStreak += 1;
    cursor = new Date(cursor.getTime() - DAY_IN_MS);
  }

  return { currentStreak, bestStreak } as const;
}
