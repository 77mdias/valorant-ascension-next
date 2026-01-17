import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React, { forwardRef, useImperativeHandle } from "react";
import * as playbackModule from "@/hooks/usePlaybackSpeed";

const mockSeekTo = jest.fn();
const mockGetCurrentTime = jest.fn();
const mockGetDuration = jest.fn();
const mockGetInternalPlayer = jest.fn();

let latestPlayerProps: any = null;

jest.mock("react-player", () => {
  const MockReactPlayer = forwardRef<unknown, { onReady?: () => void }>(
    (props, ref) => {
      latestPlayerProps = props;

      useImperativeHandle(ref, () => ({
        seekTo: mockSeekTo,
        getCurrentTime: mockGetCurrentTime,
        getDuration: mockGetDuration,
        getInternalPlayer: mockGetInternalPlayer,
      }));

      return (
        <div
          data-testid="react-player-mock"
          onClick={() => props.onReady?.()}
        />
      );
    },
  );

  MockReactPlayer.displayName = "MockReactPlayer";

  return MockReactPlayer;
});

const mockHandleProgressTick = jest.fn();
const mockHandleDurationChange = jest.fn();
const mockFlushProgress = jest.fn();

jest.mock("@/hooks/useVideoProgress", () => ({
  __esModule: true,
  useVideoProgress: jest.fn(() => ({
    resumeFrom: null,
    isCompleted: false,
    handleProgressTick: mockHandleProgressTick,
    handleDurationChange: mockHandleDurationChange,
    flushProgress: mockFlushProgress,
    hasHydratedInitial: true,
  })),
}));

const mockSetSpeed = jest.fn();

jest.mock("@/hooks/usePlaybackSpeed", () => ({
  __esModule: true,
  usePlaybackSpeed: jest.fn(() => ({
    speed: 1,
    setSpeed: mockSetSpeed,
    isNormalSpeed: true,
  })),
  PLAYBACK_SPEEDS: [0.5, 1, 1.5, 2],
}));
if (typeof playbackModule.usePlaybackSpeed !== "function") {
  throw new Error("Mock de usePlaybackSpeed não carregado");
}

jest.mock("@/hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: jest.fn(),
}));

jest.mock("@/hooks/useNetworkSpeed", () => ({
  useNetworkSpeed: jest.fn(() => ({
    suggestedQuality: "720p",
    isSupported: true,
  })),
}));

jest.mock("@/components/VideoPlayer/SpeedControl", () => {
  function MockSpeedControl(props: { onSpeedChange: (speed: number) => void }) {
    return (
      <button
        data-testid="speed-control"
        type="button"
        onClick={() => props.onSpeedChange(1.5)}
      >
        Speed
      </button>
    );
  }

  MockSpeedControl.displayName = "MockSpeedControl";

  return MockSpeedControl;
});

jest.mock(
  "@/components/VideoPlayer/QualitySelector",
  () =>
    function QualitySelector(props: any) {
      return (
        <button
          data-testid="quality-selector"
          type="button"
          onClick={() => props.onQualityChange("auto")}
        >
          Quality
        </button>
      );
    },
);

jest.mock(
  "@/components/VideoPlayer/SubtitleSelector",
  () =>
    function SubtitleSelector(props: any) {
      return (
        <button
          data-testid="subtitle-selector"
          type="button"
          onClick={() => props.onChange("pt-BR")}
        >
          Subtitle
        </button>
      );
    },
);

jest.mock(
  "@/components/VideoPlayer/TimestampList",
  () =>
    function TimestampList(props: any) {
      return (
        <div data-testid="timestamp-list">
          {props.timestamps.map((timestamp: any) => (
            <button
              key={timestamp.id}
              type="button"
              onClick={() => props.onSeek(timestamp.time)}
            >
              {timestamp.label}
            </button>
          ))}
        </div>
      );
    },
);

const { useVideoProgress } = jest.requireMock("@/hooks/useVideoProgress") as {
  useVideoProgress: jest.Mock;
};

// Import after mocks so the component consumes mocked hooks/dependencies
import VideoPlayer from "../VideoPlayer";

describe("VideoPlayer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    latestPlayerProps = null;
    mockGetCurrentTime.mockReturnValue(0);
    mockGetDuration.mockReturnValue(0);
    useVideoProgress.mockReturnValue({
      resumeFrom: null,
      isCompleted: false,
      handleProgressTick: mockHandleProgressTick,
      handleDurationChange: mockHandleDurationChange,
      flushProgress: mockFlushProgress,
      hasHydratedInitial: true,
    });
  });

  it("renderiza fallback quando não há vídeo", () => {
    render(
      <VideoPlayer
        title="Aula teste"
        description="Descrição da aula"
        videoUrl={undefined}
      />,
    );

    expect(screen.getByText("Vídeo indisponível")).toBeInTheDocument();
    expect(screen.getByText(/preparando o conteúdo/i)).toBeInTheDocument();
  });

  it("alterna play/pause pelo controle principal", () => {
    render(
      <VideoPlayer
        title="Aula teste"
        description="Descrição da aula"
        videoUrl="https://cdn.test/video.m3u8"
      />,
    );

    const playButton = screen.getByTitle("Reproduzir");
    fireEvent.click(playButton);
    expect(screen.getByTitle("Pausar")).toBeInTheDocument();

    const pauseButton = screen.getByTitle("Pausar");
    fireEvent.click(pauseButton);
    expect(screen.getByTitle("Reproduzir")).toBeInTheDocument();
  });

  it("busca duração e permite seek via slider", async () => {
    render(
      <VideoPlayer
        title="Aula teste"
        description="Descrição da aula"
        videoUrl="https://cdn.test/video.m3u8"
      />,
    );

    await act(async () => {
      latestPlayerProps?.onReady?.();
      latestPlayerProps?.onDuration?.(120);
    });

    const slider = screen.getByLabelText("Linha do tempo do vídeo");
    fireEvent.change(slider, { target: { value: "60" } });

    await waitFor(() => expect(mockSeekTo).toHaveBeenCalledTimes(1));
    expect(mockSeekTo).toHaveBeenCalledWith(60, "seconds");
  });

  it("força flush de progresso ao finalizar o vídeo", async () => {
    mockGetDuration.mockReturnValue(180);

    render(
      <VideoPlayer
        title="Aula teste"
        description="Descrição da aula"
        videoUrl="https://cdn.test/video.m3u8"
      />,
    );

    await act(async () => {
      latestPlayerProps?.onReady?.();
      latestPlayerProps?.onEnded?.();
    });

    await waitFor(() => expect(mockHandleProgressTick).toHaveBeenCalled());
    expect(mockHandleProgressTick).toHaveBeenCalledWith(180, 180, {
      immediate: true,
    });
  });
});
