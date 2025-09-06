"use client";

import { cn } from "@/lib/utils";

const CourseCardSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:scale-[1.02]">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-4">
        {/* CONTEÚDO SUPERIOR */}
        <div className="flex flex-col gap-2">
          {/* Icon Skeleton */}
          <div className="h-12 w-12 animate-pulse rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20"></div>

          {/* Title and Level Skeleton */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-gradient-to-r from-muted to-muted/50"></div>
            </div>
          </div>
        </div>

        {/* CONTEÚDO CENTRAL - Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
        </div>

        {/* CONTEÚDO INFERIOR - Button Skeleton */}
        <div className="h-10 w-full animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50"></div>
      </div>

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="bg-gradient-radial absolute inset-0 rounded-2xl opacity-20"></div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
