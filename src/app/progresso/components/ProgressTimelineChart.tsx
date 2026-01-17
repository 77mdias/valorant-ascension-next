"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  type TooltipProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TimelinePoint = {
  date: string;
  label: string;
  minutes: number;
};

type ProgressTimelineChartProps = {
  data: TimelinePoint[];
};

const tooltipFormatter: TooltipProps<
  TimelinePoint["minutes"],
  TimelinePoint["label"]
>["formatter"] = (value) =>
  typeof value === "number" ? `${value} min` : String(value ?? "");

export default function ProgressTimelineChart({
  data,
}: ProgressTimelineChartProps) {
  const hasData = data.some((item) => item.minutes > 0);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: 4, right: 4, top: 12, bottom: 0 }}>
        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E7517B" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `${value}m`}
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          width={44}
        />
        <Tooltip
          formatter={tooltipFormatter}
          contentStyle={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <Area
          type="monotone"
          dataKey="minutes"
          stroke={hasData ? "#E7517B" : "#94a3b8"}
          fill="url(#progressGradient)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={hasData}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
