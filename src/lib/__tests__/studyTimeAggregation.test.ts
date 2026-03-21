import { buildStudyTimeStats } from "@/lib/studyTimeAggregation";

describe("buildStudyTimeStats", () => {
  const referenceDate = new Date("2026-03-20T12:00:00.000Z");

  it("gera buckets diários com preenchimento e totais corretos para 7d", () => {
    const stats = buildStudyTimeStats(
      [
        { date: "2026-03-20T10:00:00.000Z", seconds: 3600 },
        { date: "2026-03-18T10:00:00.000Z", seconds: 1800 },
      ],
      "7d",
      referenceDate,
    );

    expect(stats.period).toBe("7d");
    expect(stats.granularity).toBe("daily");
    expect(stats.points).toHaveLength(7);
    expect(stats.totalMinutes).toBe(90);
    expect(stats.avgMinutes).toBe(45);
    expect(stats.maxMinutes).toBe(60);
    expect(stats.hasData).toBe(true);

    const mar18 = stats.points.find((point) => point.key === "2026-03-18");
    const mar20 = stats.points.find((point) => point.key === "2026-03-20");

    expect(mar18?.minutes).toBe(30);
    expect(mar20?.minutes).toBe(60);
  });

  it("agrega no bucket semanal para 3m", () => {
    const stats = buildStudyTimeStats(
      [
        { date: "2026-03-19T10:00:00.000Z", seconds: 900 },
        { date: "2026-03-17T12:00:00.000Z", seconds: 300 },
      ],
      "3m",
      referenceDate,
    );

    expect(stats.period).toBe("3m");
    expect(stats.granularity).toBe("weekly");
    expect(stats.points).toHaveLength(12);
    expect(stats.totalMinutes).toBe(20);

    const currentWeek = stats.points.find((point) => point.key === "2026-03-16");
    expect(currentWeek?.minutes).toBe(20);
  });

  it("limita em 12 meses no período de 1 ano", () => {
    const stats = buildStudyTimeStats(
      [
        { date: "2025-04-10T10:00:00.000Z", seconds: 1200 },
        { date: "2026-03-02T10:00:00.000Z", seconds: 600 },
        { date: "2025-02-20T10:00:00.000Z", seconds: 5400 },
      ],
      "1y",
      referenceDate,
    );

    expect(stats.period).toBe("1y");
    expect(stats.granularity).toBe("monthly");
    expect(stats.points).toHaveLength(12);
    expect(stats.totalMinutes).toBe(30);
    expect(stats.avgMinutes).toBe(15);
    expect(stats.maxMinutes).toBe(20);

    const outOfRange = stats.points.find((point) => point.key === "2025-02");
    expect(outOfRange).toBeUndefined();
  });
});
