import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import type {
  StudyTimePeriod,
  StudyTimeStats,
} from "@/lib/studyTimeAggregation";
import StudyTimeChart from "../StudyTimeChart";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  AreaChart: () => <div data-testid="area-chart" />,
  BarChart: () => <div data-testid="bar-chart" />,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Area: () => null,
  Bar: () => null,
}));

const createStats = (
  period: StudyTimePeriod,
  totalMinutes: number,
): StudyTimeStats => ({
  period,
  granularity:
    period === "1y" ? "monthly" : period === "3m" ? "weekly" : "daily",
  points: [
    {
      key: "2026-03-20",
      label: "20/03",
      rangeLabel: "20/03/2026",
      minutes: totalMinutes,
    },
  ],
  totalMinutes,
  avgMinutes: totalMinutes,
  maxMinutes: totalMinutes,
  hasData: totalMinutes > 0,
  metric: "proxy_progress_updatedAt",
});

describe("StudyTimeChart", () => {
  it("troca o período e atualiza os indicadores", () => {
    render(
      <StudyTimeChart
        statsByPeriod={{
          "7d": createStats("7d", 90),
          "30d": createStats("30d", 200),
          "3m": createStats("3m", 320),
          "1y": createStats("1y", 540),
        }}
      />,
    );

    expect(screen.getAllByText("90 min")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "30 dias" }));

    expect(screen.getAllByText("200 min")).toHaveLength(3);
  });
});
