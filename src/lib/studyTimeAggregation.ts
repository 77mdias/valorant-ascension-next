export type StudyTimePeriod = "7d" | "30d" | "3m" | "1y";

export type StudyTimeGranularity = "daily" | "weekly" | "monthly";

export type StudyTimePoint = {
  key: string;
  label: string;
  rangeLabel: string;
  minutes: number;
};

export type StudyTimeStats = {
  period: StudyTimePeriod;
  granularity: StudyTimeGranularity;
  points: StudyTimePoint[];
  totalMinutes: number;
  avgMinutes: number;
  maxMinutes: number;
  hasData: boolean;
  metric: "proxy_progress_updatedAt";
};

export type StudyTimeRecord = {
  date: Date | string;
  seconds: number;
};

const DAY_IN_MS = 86_400_000;

const PERIOD_CONFIG: Record<
  StudyTimePeriod,
  { buckets: number; granularity: StudyTimeGranularity }
> = {
  "7d": { buckets: 7, granularity: "daily" },
  "30d": { buckets: 30, granularity: "daily" },
  "3m": { buckets: 12, granularity: "weekly" },
  "1y": { buckets: 12, granularity: "monthly" },
};

const toUtcDateStart = (value: Date) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));

const toDayKey = (value: Date) =>
  `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}-${String(value.getUTCDate()).padStart(2, "0")}`;

const toMonthKey = (value: Date) =>
  `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}`;

const addUtcDays = (value: Date, amount: number) =>
  new Date(value.getTime() + amount * DAY_IN_MS);

const addUtcMonths = (value: Date, amount: number) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + amount, 1));

const startOfUtcWeek = (value: Date) => {
  const dayOfWeek = value.getUTCDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  return addUtcDays(toUtcDateStart(value), -daysFromMonday);
};

const startOfUtcMonth = (value: Date) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));

const formatDate = (value: Date) =>
  value.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

const formatShortDate = (value: Date) =>
  value.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });

const formatMonthLabel = (value: Date) =>
  value
    .toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    })
    .replace(".", "")
    .replace(" ", "/")
    .toUpperCase();

const resolveBucketKey = (value: Date, granularity: StudyTimeGranularity) => {
  if (granularity === "daily") {
    return toDayKey(toUtcDateStart(value));
  }

  if (granularity === "weekly") {
    return toDayKey(startOfUtcWeek(value));
  }

  return toMonthKey(startOfUtcMonth(value));
};

const createDailyBuckets = (count: number, referenceDate: Date): StudyTimePoint[] => {
  const today = toUtcDateStart(referenceDate);
  const start = addUtcDays(today, -(count - 1));

  return Array.from({ length: count }, (_, index) => {
    const day = addUtcDays(start, index);

    return {
      key: toDayKey(day),
      label: formatShortDate(day),
      rangeLabel: formatDate(day),
      minutes: 0,
    };
  });
};

const createWeeklyBuckets = (count: number, referenceDate: Date): StudyTimePoint[] => {
  const currentWeekStart = startOfUtcWeek(referenceDate);
  const start = addUtcDays(currentWeekStart, -(count - 1) * 7);

  return Array.from({ length: count }, (_, index) => {
    const weekStart = addUtcDays(start, index * 7);
    const weekEnd = addUtcDays(weekStart, 6);

    return {
      key: toDayKey(weekStart),
      label: formatShortDate(weekStart),
      rangeLabel: `${formatDate(weekStart)} - ${formatDate(weekEnd)}`,
      minutes: 0,
    };
  });
};

const createMonthlyBuckets = (count: number, referenceDate: Date): StudyTimePoint[] => {
  const currentMonthStart = startOfUtcMonth(referenceDate);
  const start = addUtcMonths(currentMonthStart, -(count - 1));

  return Array.from({ length: count }, (_, index) => {
    const monthStart = addUtcMonths(start, index);

    return {
      key: toMonthKey(monthStart),
      label: formatMonthLabel(monthStart),
      rangeLabel: monthStart.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      minutes: 0,
    };
  });
};

const createBuckets = (
  granularity: StudyTimeGranularity,
  count: number,
  referenceDate: Date,
): StudyTimePoint[] => {
  if (granularity === "daily") {
    return createDailyBuckets(count, referenceDate);
  }

  if (granularity === "weekly") {
    return createWeeklyBuckets(count, referenceDate);
  }

  return createMonthlyBuckets(count, referenceDate);
};

const roundToMinutes = (seconds: number) => Math.round(Math.max(seconds, 0) / 60);

export function buildStudyTimeStats(
  records: StudyTimeRecord[],
  period: StudyTimePeriod,
  referenceDate = new Date(),
): StudyTimeStats {
  const config = PERIOD_CONFIG[period];
  const points = createBuckets(config.granularity, config.buckets, referenceDate);
  const pointByKey = new Map(points.map((point) => [point.key, point]));

  for (const record of records) {
    const recordDate =
      record.date instanceof Date ? record.date : new Date(record.date);

    if (Number.isNaN(recordDate.getTime())) continue;

    const key = resolveBucketKey(recordDate, config.granularity);
    const point = pointByKey.get(key);
    if (!point) continue;

    point.minutes += roundToMinutes(record.seconds);
  }

  const totals = points.reduce(
    (acc, point) => {
      const safeMinutes = Math.max(point.minutes, 0);
      acc.total += safeMinutes;
      acc.max = Math.max(acc.max, safeMinutes);
      if (safeMinutes > 0) {
        acc.activeBuckets += 1;
      }
      return acc;
    },
    { total: 0, max: 0, activeBuckets: 0 },
  );

  return {
    period,
    granularity: config.granularity,
    points,
    totalMinutes: totals.total,
    avgMinutes:
      totals.activeBuckets > 0
        ? Math.round(totals.total / totals.activeBuckets)
        : 0,
    maxMinutes: totals.max,
    hasData: totals.total > 0,
    metric: "proxy_progress_updatedAt",
  };
}

export const STUDY_TIME_PERIODS: StudyTimePeriod[] = ["7d", "30d", "3m", "1y"];
