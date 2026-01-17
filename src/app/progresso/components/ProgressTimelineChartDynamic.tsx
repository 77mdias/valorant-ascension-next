"use client";

import dynamic from "next/dynamic";
import type { TimelinePoint } from "./ProgressTimelineChart";

const ProgressTimelineChart = dynamic(() => import("./ProgressTimelineChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
      Carregando gráfico...
    </div>
  ),
});

type ProgressTimelineChartDynamicProps = {
  data: TimelinePoint[];
};

export function ProgressTimelineChartDynamic({
  data,
}: ProgressTimelineChartDynamicProps) {
  return <ProgressTimelineChart data={data} />;
}
