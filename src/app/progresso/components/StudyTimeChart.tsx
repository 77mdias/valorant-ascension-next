"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Flame, Gauge } from "lucide-react";
import type {
  StudyTimePeriod,
  StudyTimeStats,
} from "@/lib/studyTimeAggregation";
import { cn } from "@/lib/utils";

const PERIOD_LABELS: Record<StudyTimePeriod, string> = {
  "7d": "7 dias",
  "30d": "30 dias",
  "3m": "3 meses",
  "1y": "1 ano",
};

type StudyTimeChartProps = {
  statsByPeriod: Record<StudyTimePeriod, StudyTimeStats>;
  defaultPeriod?: StudyTimePeriod;
};

type TooltipEntry = {
  value?: number;
};

type StudyTimeTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
};

function StudyTimeTooltip({
  active,
  payload,
  label,
}: StudyTimeTooltipProps) {
  const minutes = payload?.[0]?.value;

  if (!active || typeof minutes !== "number") {
    return null;
  }

  return (
    <div className="min-w-40 rounded-xl border border-orange-100/30 bg-slate-950/95 p-3 text-xs shadow-xl backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.16em] text-orange-200/90">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">
        {minutes.toLocaleString("pt-BR")} min
      </p>
    </div>
  );
}

const formatMinutes = (minutes: number) =>
  `${Math.round(minutes).toLocaleString("pt-BR")} min`;

export default function StudyTimeChart({
  statsByPeriod,
  defaultPeriod = "7d",
}: StudyTimeChartProps) {
  const [period, setPeriod] = useState<StudyTimePeriod>(defaultPeriod);
  const stats = statsByPeriod[period];

  const subtitle = useMemo(() => {
    if (stats.granularity === "daily") {
      return "Recorte diário para leitura de ritmo";
    }

    if (stats.granularity === "weekly") {
      return "Agrupamento semanal para tendência";
    }

    return "Agrupamento mensal para visão de longo prazo";
  }, [stats.granularity]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="relative pl-4">
          <span className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-gradient-to-b from-orange-400 via-red-400 to-cyan-300" />
          <p className="text-[11px] uppercase tracking-[0.18em] text-orange-300/85">
            Painel tático
          </p>
          <h3 className="mt-1 text-xl font-semibold leading-tight text-foreground">
            Tempo de estudo por período
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4">
          {(Object.keys(PERIOD_LABELS) as StudyTimePeriod[]).map((option) => {
            const active = option === period;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                aria-pressed={active}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition",
                  active
                    ? "border-orange-300/70 bg-gradient-to-r from-orange-500/25 to-cyan-400/20 text-orange-100 shadow-[0_8px_24px_-12px_rgba(249,115,22,0.8)]"
                    : "border-border/50 bg-background/60 text-muted-foreground hover:border-orange-200/50 hover:text-foreground",
                )}
              >
                {PERIOD_LABELS[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-72 rounded-xl border border-border/40 bg-slate-950/40 p-3">
        <ResponsiveContainer width="100%" height="100%">
          {stats.granularity === "daily" ? (
            <AreaChart
              data={stats.points}
              margin={{ left: 8, right: 8, top: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="studyTimeArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(148,163,184,0.22)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value}m`}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                width={48}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<StudyTimeTooltip />} />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#fb923c"
                fill="url(#studyTimeArea)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "#22d3ee" }}
                isAnimationActive={stats.hasData}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={stats.points}
              margin={{ left: 8, right: 8, top: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="studyTimeBars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.75} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(148,163,184,0.22)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value}m`}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                width={48}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<StudyTimeTooltip />} />
              <Bar
                dataKey="minutes"
                fill="url(#studyTimeBars)"
                radius={[6, 6, 2, 2]}
                isAnimationActive={stats.hasData}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-background/70 p-3">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-orange-400" />
            Total no período
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatMinutes(stats.totalMinutes)}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-background/70 p-3">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <Gauge className="h-3.5 w-3.5 text-cyan-400" />
            Média ativa
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatMinutes(stats.avgMinutes)}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-background/70 p-3">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-red-400" />
            Pico do período
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatMinutes(stats.maxMinutes)}
          </p>
        </div>
      </div>

      {stats.metric === "proxy_progress_updatedAt" ? (
        <p className="text-xs text-muted-foreground">
          Métrica atual: proxy por progresso consolidado da aula (baseado em
          `lastPosition`/`progress`) agrupado por data de atualização do
          registro.
        </p>
      ) : null}
    </div>
  );
}
