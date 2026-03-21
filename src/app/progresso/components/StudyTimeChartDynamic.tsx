"use client";

import dynamic from "next/dynamic";
import type {
  StudyTimePeriod,
  StudyTimeStats,
} from "@/lib/studyTimeAggregation";

const StudyTimeChart = dynamic(() => import("./StudyTimeChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
      Carregando gráfico de estudo...
    </div>
  ),
});

type StudyTimeChartDynamicProps = {
  statsByPeriod: Record<StudyTimePeriod, StudyTimeStats>;
  defaultPeriod?: StudyTimePeriod;
};

export function StudyTimeChartDynamic({
  statsByPeriod,
  defaultPeriod,
}: StudyTimeChartDynamicProps) {
  return (
    <StudyTimeChart statsByPeriod={statsByPeriod} defaultPeriod={defaultPeriod} />
  );
}
