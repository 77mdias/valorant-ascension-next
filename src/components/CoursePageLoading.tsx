"use client";

import LoadingSpinner from "./LoadingSpinner";
import CourseCardSkeleton from "./CourseCardSkeleton";

const CoursePageLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="h-8 w-32 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-20 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50"></div>
            <div className="h-10 w-10 animate-pulse rounded-full bg-gradient-to-r from-muted to-muted/50"></div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            {/* Title Skeleton */}
            <div className="space-y-4">
              <div className="mx-auto h-12 w-96 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
              <div className="mx-auto h-8 w-80 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
            </div>

            {/* Description Skeleton */}
            <div className="mx-auto max-w-2xl space-y-2">
              <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
              <div className="h-6 w-3/4 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <div className="h-12 w-32 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50"></div>
              <div className="h-12 w-24 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Skeleton */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          {/* Section Title Skeleton */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
            <div className="mx-auto h-6 w-80 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
          </div>

          {/* Course Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex items-center gap-3 rounded-full bg-card/80 px-4 py-2 shadow-lg backdrop-blur-sm">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-muted-foreground">
            Carregando cursos...
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoursePageLoading;
