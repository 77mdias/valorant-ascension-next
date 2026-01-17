import { act, renderHook, waitFor } from "@testing-library/react";
import { useVideoProgress } from "../useVideoProgress";

const originalFetch = global.fetch;

const buildFetchResponse = (data: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ data }),
  }) as Response;

describe("useVideoProgress", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it("hidrata estado inicial quando há progresso pré-carregado", () => {
    const initialProgress = {
      id: "progress-1",
      lessonId: "lesson-1",
      userId: "user-1",
      progress: 0.5,
      lastPosition: 30,
      totalDuration: 120,
      completed: true,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { result } = renderHook(() =>
      useVideoProgress({ lessonId: "lesson-1", initialProgress }),
    );

    expect(result.current.resumeFrom).toBe(initialProgress.lastPosition);
    expect(result.current.isCompleted).toBe(true);
    expect(result.current.hasHydratedInitial).toBe(true);
  });

  it("carrega progresso remoto quando nenhum progresso inicial é fornecido", async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      buildFetchResponse({
        id: "progress-remote",
        lessonId: "lesson-remote",
        userId: "user-1",
        progress: 0.4,
        lastPosition: 24,
        totalDuration: 120,
        completed: false,
        completedAt: null,
        updatedAt: new Date().toISOString(),
      }),
    );

    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() =>
      useVideoProgress({ lessonId: "lesson-remote" }),
    );

    await waitFor(() => expect(result.current.hasHydratedInitial).toBe(true));
    expect(result.current.resumeFrom).toBe(24);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/lessons/lesson-remote/progress",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("persiste snapshots pendentes no intervalo e força flush quando concluído", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        buildFetchResponse({
          id: "progress-first",
          lessonId: "lesson-123",
          userId: "user-1",
          progress: 0.2,
          lastPosition: 20,
          totalDuration: 100,
          completed: false,
          completedAt: null,
          updatedAt: new Date().toISOString(),
        }),
      )
      .mockResolvedValueOnce(
        buildFetchResponse({
          id: "progress-complete",
          lessonId: "lesson-123",
          userId: "user-1",
          progress: 0.95,
          lastPosition: 95,
          totalDuration: 100,
          completed: true,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() =>
      useVideoProgress({
        lessonId: "lesson-123",
        initialProgress: {
          id: "existing",
          lessonId: "lesson-123",
          userId: "user-1",
          progress: 0,
          lastPosition: 0,
          totalDuration: 0,
          completed: false,
          completedAt: null,
          updatedAt: new Date().toISOString(),
        },
      }),
    );

    act(() => {
      result.current.handleProgressTick(20, 100, { immediate: true });
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/lessons/lesson-123/progress",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ lastPosition: 20, totalDuration: 100 }),
      }),
    );

    await act(async () => {
      result.current.handleProgressTick(95, 100, { immediate: true });
      await Promise.resolve();
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/lessons/lesson-123/progress",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ lastPosition: 95, totalDuration: 100 }),
      }),
    );
  });
});
