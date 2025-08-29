"use client";

import LoadingSpinner from "./LoadingSpinner";

const CourseDetailLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden pb-8 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl">
            {/* Title Skeleton */}
            <div className="mb-4 h-12 w-96 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>

            {/* Description Skeleton */}
            <div className="mb-6 space-y-2">
              <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
              <div className="h-6 w-3/4 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex flex-wrap gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto mt-8 px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-[400px,1fr]">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl bg-[#160e1b] p-6">
                <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                <div className="max-h-[calc(100vh-250px)] space-y-3 overflow-y-auto px-4 py-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-16 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                        <div className="h-4 w-12 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                      </div>
                      <div className="h-4 w-full animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Menu Skeleton */}
          <div className="mb-6 lg:hidden">
            <div className="flex w-full items-center justify-between rounded-xl border border-border p-4">
              <div className="h-6 w-48 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
              <div className="h-5 w-5 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
            </div>
          </div>

          {/* Video Player Section Skeleton */}
          <main>
            <div className="space-y-6">
              {/* Video Player Skeleton */}
              <div className="aspect-video w-full animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50"></div>

              {/* Title and Description Skeleton */}
              <div className="space-y-4">
                <div className="h-8 w-3/4 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gradient-to-r from-muted to-muted/50"></div>
                </div>
              </div>

              {/* Navigation Buttons Skeleton */}
              <div className="flex justify-between">
                <div className="h-10 w-24 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50"></div>
                <div className="h-10 w-24 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50"></div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex items-center gap-3 rounded-full bg-card/80 px-4 py-2 shadow-lg backdrop-blur-sm">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-muted-foreground">
            Carregando curso...
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailLoading;
