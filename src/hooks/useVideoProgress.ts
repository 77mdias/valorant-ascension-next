"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LESSON_COMPLETE_RATIO } from "@/schemas/lessonProgress";

type LessonProgressState = {
  id: string;
  lessonId: string;
  userId: string;
  progress: number;
  lastPosition: number;
  totalDuration: number;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
};

type Snapshot = {
  position: number;
  duration: number;
};

const SYNC_INTERVAL_MS = 5000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

interface UseVideoProgressOptions {
  lessonId?: string | null;
  initialProgress?: LessonProgressState | null;
}

export const useVideoProgress = ({
  lessonId,
  initialProgress,
}: UseVideoProgressOptions) => {
  const [resumeFrom, setResumeFrom] = useState<number | null>(
    initialProgress?.lastPosition ?? null,
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    Boolean(initialProgress?.completed),
  );
  const [trackingEnabled, setTrackingEnabled] = useState<boolean>(
    Boolean(lessonId),
  );
  const [hasHydratedInitial, setHasHydratedInitial] = useState<boolean>(
    Boolean(initialProgress),
  );

  const durationRef = useRef<number>(initialProgress?.totalDuration ?? 0);
  const pendingRef = useRef<Snapshot | null>(null);
  const queuedRef = useRef<Snapshot | null>(null);
  const syncingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const resetState = useCallback(() => {
    pendingRef.current = null;
    queuedRef.current = null;
    syncingRef.current = false;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  useEffect(() => {
    resetState();
    setResumeFrom(initialProgress?.lastPosition ?? null);
    setIsCompleted(Boolean(initialProgress?.completed));
    setTrackingEnabled(Boolean(lessonId));
    durationRef.current = initialProgress?.totalDuration ?? 0;
    setHasHydratedInitial(Boolean(initialProgress));

    if (!lessonId) {
      return undefined;
    }

    if (initialProgress) {
      return undefined;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/lessons/${lessonId}/progress`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401) {
            setTrackingEnabled(false);
          }
          return;
        }

        const payload = (await response.json()) as {
          data: LessonProgressState | null;
        };
        if (payload?.data) {
          setResumeFrom(payload.data.lastPosition ?? null);
          setIsCompleted(Boolean(payload.data.completed));
          durationRef.current = payload.data.totalDuration ?? 0;
          setHasHydratedInitial(true);
        } else {
          setHasHydratedInitial(true);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Erro ao carregar progresso da aula", error);
        }
      } finally {
        setHasHydratedInitial(true);
      }
    };

    void fetchProgress();

    return () => {
      controller.abort();
    };
  }, [initialProgress, lessonId, resetState]);

  const persist = useCallback(
    async (snapshot: Snapshot) => {
      if (!lessonId || !trackingEnabled) {
        return;
      }

      if (syncingRef.current) {
        queuedRef.current = snapshot;
        return;
      }

      syncingRef.current = true;
      let current: Snapshot | null = snapshot;

      while (current) {
        try {
          const response = await fetch(`/api/lessons/${lessonId}/progress`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lastPosition: current.position,
              totalDuration: current.duration,
            }),
          });

          if (response.status === 401) {
            setTrackingEnabled(false);
            syncingRef.current = false;
            return;
          }

          if (response.ok) {
            const payload = (await response.json()) as {
              data: LessonProgressState | null;
            };
            if (payload?.data) {
              setIsCompleted(Boolean(payload.data.completed));
              setResumeFrom(payload.data.lastPosition ?? resumeFrom);
              durationRef.current = Math.max(
                durationRef.current,
                payload.data.totalDuration ?? 0,
              );
            }
          }
        } catch (error) {
          console.error("Erro ao salvar progresso da aula", error);
        }

        current = queuedRef.current;
        queuedRef.current = null;
      }

      syncingRef.current = false;
    },
    [lessonId, resumeFrom, trackingEnabled],
  );

  const scheduleSync = useCallback(
    (snapshot: Snapshot, options?: { immediate?: boolean }) => {
      if (!lessonId || !trackingEnabled) {
        return;
      }

      pendingRef.current = snapshot;

      if (options?.immediate) {
        void persist(snapshot);
        pendingRef.current = null;
        return;
      }

      if (
        snapshot.duration > 0 &&
        snapshot.position / snapshot.duration >= LESSON_COMPLETE_RATIO
      ) {
        void persist(snapshot);
        pendingRef.current = null;
      }
    },
    [lessonId, persist, trackingEnabled],
  );

  const handleProgressTick = useCallback(
    (position: number, duration: number, options?: { immediate?: boolean }) => {
      if (!lessonId || !trackingEnabled) {
        return;
      }

      const normalizedDuration = Math.max(
        durationRef.current,
        Math.round(duration),
      );
      durationRef.current = normalizedDuration;

      const safePosition = clamp(
        Math.round(position),
        0,
        normalizedDuration || Math.round(position),
      );

      scheduleSync(
        { position: safePosition, duration: normalizedDuration },
        options,
      );
    },
    [lessonId, scheduleSync, trackingEnabled],
  );

  const handleDurationChange = useCallback((duration: number) => {
    durationRef.current = Math.max(durationRef.current, Math.round(duration));
  }, []);

  useEffect(() => {
    if (!lessonId || !trackingEnabled) {
      return undefined;
    }

    const syncInterval = window.setInterval(() => {
      if (pendingRef.current) {
        void persist(pendingRef.current);
        pendingRef.current = null;
      }
    }, SYNC_INTERVAL_MS);

    return () => {
      window.clearInterval(syncInterval);
    };
  }, [lessonId, persist, trackingEnabled]);

  useEffect(
    () => () => {
      if (pendingRef.current) {
        void persist(pendingRef.current);
        pendingRef.current = null;
      }
      resetState();
    },
    [persist, resetState],
  );

  const flushProgress = useCallback(() => {
    if (pendingRef.current) {
      void persist(pendingRef.current);
      pendingRef.current = null;
    }
  }, [persist]);

  return useMemo(
    () => ({
      resumeFrom,
      isCompleted,
      trackingEnabled,
      handleProgressTick,
      handleDurationChange,
      flushProgress,
      hasHydratedInitial,
    }),
    [
      flushProgress,
      handleDurationChange,
      handleProgressTick,
      hasHydratedInitial,
      isCompleted,
      resumeFrom,
      trackingEnabled,
    ],
  );
};
