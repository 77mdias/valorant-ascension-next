"use client";

import {
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import type { OnProgressProps, PlayerConfig } from "react-player";
import type Hls from "hls.js";
import styles from "./VideoPlayer.module.scss";
import { cn } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePlaybackSpeed } from "@/hooks/usePlaybackSpeed";
import { useNetworkSpeed, VideoQuality } from "@/hooks/useNetworkSpeed";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import TimestampList from "@/components/VideoPlayer/TimestampList";
import SpeedControl from "@/components/VideoPlayer/SpeedControl";
import QualitySelector from "@/components/VideoPlayer/QualitySelector";
import SubtitleSelector from "@/components/VideoPlayer/SubtitleSelector";
import { formatSeconds } from "@/lib/time";

type LessonProgressState = {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  progress: number;
  lastPosition: number;
  totalDuration: number;
  updatedAt: string;
};

interface VideoPlayerProps {
  videoUrl?: string | null;
  qualitySources?: Partial<Record<Exclude<VideoQuality, "auto">, string>>;
  thumbnailUrl?: string | null;
  title: string;
  description: string;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  className?: string;
  timestamps?: Array<{ id: string; time: number; label: string }>;
  subtitles?: Array<{
    id: string;
    language: string;
    label: string;
    fileUrl: string;
    isDefault?: boolean;
  }>;
  lessonId?: string;
  lessonProgress?: LessonProgressState | null;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const ORDERED_QUALITIES: Array<Exclude<VideoQuality, "auto">> = [
  "1080p",
  "720p",
  "480p",
  "360p",
];

const mapHeightToQuality = (
  height?: number,
): Exclude<VideoQuality, "auto"> | null => {
  if (!height) return null;
  if (height >= 1080) return "1080p";
  if (height >= 720) return "720p";
  if (height >= 480) return "480p";
  return "360p";
};

const dedupeQualities = (values: VideoQuality[]) => {
  const seen = new Set<VideoQuality>();
  const ordered = ["auto", ...ORDERED_QUALITIES] as VideoQuality[];
  for (const quality of ordered) {
    if (values.includes(quality)) {
      seen.add(quality);
    }
  }
  return Array.from(seen);
};

const SUBTITLE_STORAGE_KEY = "videoPlayerSubtitle";
const SUBTITLE_OFF = "off";

const resolveBestQuality = (
  available: VideoQuality[],
  target: Exclude<VideoQuality, "auto">,
): VideoQuality => {
  const filtered = available.filter((quality) => quality !== "auto");
  if (!filtered.length) return "auto";

  const targetIndex = ORDERED_QUALITIES.indexOf(target);
  for (let index = targetIndex; index < ORDERED_QUALITIES.length; index++) {
    const candidate = ORDERED_QUALITIES[index];
    if (filtered.includes(candidate)) {
      return candidate;
    }
  }

  return filtered[filtered.length - 1];
};

const VideoPlayer = ({
  videoUrl,
  qualitySources,
  thumbnailUrl,
  title,
  description,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  className,
  timestamps,
  subtitles,
  lessonId,
  lessonProgress,
}: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [hasAppliedResume, setHasAppliedResume] = useState(false);
  const [currentSourceUrl, setCurrentSourceUrl] = useState<string | undefined>(
    videoUrl ?? undefined,
  );
  const [availableQualities, setAvailableQualities] = useState<VideoQuality[]>([
    "auto",
  ]);
  const [subtitleSelection, setSubtitleSelection] =
    useState<string>(SUBTITLE_OFF);
  const [subtitlePreferenceLoaded, setSubtitlePreferenceLoaded] =
    useState(false);
  const [subtitlePreferenceWasStored, setSubtitlePreferenceWasStored] =
    useState(false);

  // Hook de controle de velocidade de reprodução
  const { speed, setSpeed, isNormalSpeed } = usePlaybackSpeed();

  // AIDEV-NOTE: Hook de detecção de velocidade de rede
  // Detecta conexão e sugere qualidade apropriada
  const { suggestedQuality, isSupported } = useNetworkSpeed();

  // Estado de qualidade de vídeo com persistência
  const [quality, setQualityState] = useState<VideoQuality>("auto");
  const [effectiveQuality, setEffectiveQuality] =
    useState<VideoQuality>("auto");
  const [isQualityLoaded, setIsQualityLoaded] = useState(false);

  const manualQualities = useMemo(
    () =>
      ORDERED_QUALITIES.filter(
        (qualityKey) => qualitySources && qualitySources[qualityKey],
      ),
    [qualitySources],
  );

  const {
    resumeFrom,
    isCompleted: isLessonCompleted,
    handleProgressTick,
    handleDurationChange,
    flushProgress,
    hasHydratedInitial,
  } = useVideoProgress({
    lessonId,
    initialProgress: lessonProgress,
  });

  useEffect(() => {
    setAvailableQualities(dedupeQualities(["auto", ...manualQualities]));
  }, [manualQualities]);

  useEffect(() => {
    if (!subtitlePreferenceLoaded) return;

    if (!subtitles?.length) {
      if (subtitleSelection !== SUBTITLE_OFF) {
        setSubtitleSelection(SUBTITLE_OFF);
      }
      return;
    }

    if (
      subtitleSelection !== SUBTITLE_OFF &&
      subtitles.some((subtitle) => subtitle.language === subtitleSelection)
    ) {
      return;
    }

    if (subtitleSelection === SUBTITLE_OFF && subtitlePreferenceWasStored) {
      return;
    }

    const fallbackSubtitle =
      subtitles.find((subtitle) => subtitle.isDefault) ?? subtitles[0];

    if (fallbackSubtitle) {
      setSubtitleSelection(fallbackSubtitle.language);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(SUBTITLE_STORAGE_KEY, fallbackSubtitle.language);
        } catch (error) {
          console.error("Erro ao salvar legenda no localStorage:", error);
        }
      }
    } else {
      setSubtitleSelection(SUBTITLE_OFF);
    }
  }, [
    subtitlePreferenceLoaded,
    subtitles,
    subtitleSelection,
    subtitlePreferenceWasStored,
  ]);

  useEffect(() => {
    setIsPlaying(false);
    setIsBuffering(false);
    setDuration(0);
    setPlayedSeconds(0);
    setHasAppliedResume(false);
  }, [lessonId, videoUrl]);

  useEffect(() => {
    flushProgress();
  }, [flushProgress, lessonId]);

  useEffect(() => {
    setCurrentSourceUrl(videoUrl ?? undefined);
    setPlayerReady(false);
  }, [videoUrl]);

  useEffect(() => {
    setPlayerReady(false);
  }, [currentSourceUrl]);

  // Carregar qualidade do localStorage na montagem
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem("videoPlayerQuality");
      if (stored) {
        setQualityState(stored as VideoQuality);
      }
    } catch (error) {
      console.error("Erro ao carregar qualidade do localStorage:", error);
    } finally {
      setIsQualityLoaded(true);
    }
  }, []);

  // Carregar preferência de legendas (on/off ou idioma) do localStorage na montagem
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(SUBTITLE_STORAGE_KEY);
      if (stored) {
        setSubtitleSelection(stored);
        setSubtitlePreferenceWasStored(true);
      } else {
        setSubtitlePreferenceWasStored(false);
      }
    } catch (error) {
      console.error("Erro ao carregar legenda do localStorage:", error);
    } finally {
      setSubtitlePreferenceLoaded(true);
    }
  }, []);

  const resolveAutoQuality = useCallback((): VideoQuality => {
    if (!availableQualities.length) {
      return "auto";
    }

    if (suggestedQuality === "auto") {
      const highestAvailable = availableQualities.find(
        (qualityValue) => qualityValue !== "auto",
      );
      return highestAvailable ?? "auto";
    }

    return resolveBestQuality(
      availableQualities,
      suggestedQuality as Exclude<VideoQuality, "auto">,
    );
  }, [availableQualities, suggestedQuality]);

  useEffect(() => {
    if (!isQualityLoaded) return;

    if (quality === "auto") {
      setEffectiveQuality(resolveAutoQuality());
      return;
    }

    setEffectiveQuality(quality);
  }, [quality, resolveAutoQuality, isQualityLoaded]);

  const setQuality = useCallback((newQuality: VideoQuality) => {
    setQualityState(newQuality);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("videoPlayerQuality", newQuality);
      } catch (error) {
        console.error("Erro ao salvar qualidade no localStorage:", error);
      }
    }
  }, []);

  const updateHlsQualities = useCallback(() => {
    const hls = playerRef.current?.getInternalPlayer?.("hls") as Hls | null;

    if (!hls || !hls.levels?.length) {
      return;
    }

    const detected = hls.levels
      .map((level) => mapHeightToQuality(level.height))
      .filter(Boolean) as Array<Exclude<VideoQuality, "auto">>;

    if (!detected.length) {
      return;
    }

    setAvailableQualities((previous) =>
      dedupeQualities(["auto", ...manualQualities, ...detected, ...previous]),
    );
  }, [manualQualities]);

  useEffect(() => {
    if (!playerReady) return;
    updateHlsQualities();
  }, [playerReady, currentSourceUrl, updateHlsQualities]);

  const applyQualityToPlayer = useCallback(
    (nextQuality: VideoQuality) => {
      const hls = playerRef.current?.getInternalPlayer?.("hls") as Hls | null;
      const internalPlayer =
        playerRef.current?.getInternalPlayer?.() as HTMLVideoElement | null;

      const currentTime =
        playerRef.current?.getCurrentTime?.() ??
        internalPlayer?.currentTime ??
        playedSeconds;

      if (hls && hls.levels?.length) {
        pendingSeekRef.current = null;

        if (nextQuality === "auto") {
          hls.currentLevel = -1;
          hls.loadLevel = -1;
          return;
        }

        const targetLevelIndex = hls.levels.findIndex((level) => {
          const mapped = mapHeightToQuality(level.height);
          return mapped === nextQuality;
        });

        if (targetLevelIndex >= 0) {
          hls.currentLevel = targetLevelIndex;
          hls.loadLevel = targetLevelIndex;
        } else {
          hls.currentLevel = -1;
          hls.loadLevel = -1;
        }
        return;
      }

      if (qualitySources && nextQuality !== "auto") {
        const manualSource =
          qualitySources[nextQuality as Exclude<VideoQuality, "auto">];
        if (manualSource && manualSource !== currentSourceUrl) {
          pendingSeekRef.current = currentTime;
          setCurrentSourceUrl(manualSource);
        }
        return;
      }

      const fallbackUrl = videoUrl ?? undefined;
      if (fallbackUrl !== currentSourceUrl) {
        pendingSeekRef.current = currentTime;
        setCurrentSourceUrl(fallbackUrl);
      } else {
        pendingSeekRef.current = null;
      }
    },
    [currentSourceUrl, playedSeconds, qualitySources, videoUrl],
  );

  useEffect(() => {
    if (!playerReady || !isQualityLoaded) return;
    applyQualityToPlayer(effectiveQuality);
  }, [applyQualityToPlayer, effectiveQuality, isQualityLoaded, playerReady]);

  useEffect(() => {
    if (!playerReady) return;
    if (pendingSeekRef.current === null) return;

    const target = pendingSeekRef.current;
    pendingSeekRef.current = null;
    playerRef.current?.seekTo?.(target, "seconds");
    setPlayedSeconds(target);
  }, [currentSourceUrl, playerReady]);

  const hasVideo = Boolean(currentSourceUrl);

  const subtitleOptions = useMemo(() => subtitles ?? [], [subtitles]);

  const activeSubtitle = useMemo(() => {
    if (!subtitleOptions.length || subtitleSelection === SUBTITLE_OFF) {
      return null;
    }

    return (
      subtitleOptions.find(
        (subtitle) => subtitle.language === subtitleSelection,
      ) ||
      subtitleOptions.find((subtitle) => subtitle.isDefault) ||
      null
    );
  }, [subtitleOptions, subtitleSelection]);

  const subtitleTracks = useMemo(
    () =>
      activeSubtitle
        ? [
            {
              kind: "subtitles",
              src: activeSubtitle.fileUrl,
              srcLang: activeSubtitle.language,
              label: activeSubtitle.label,
              default: true,
            },
          ]
        : [],
    [activeSubtitle],
  );

  const handleSubtitleChange = useCallback((nextSubtitle: string) => {
    setSubtitleSelection(nextSubtitle);
    setSubtitlePreferenceWasStored(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SUBTITLE_STORAGE_KEY, nextSubtitle);
      } catch (error) {
        console.error("Erro ao salvar legenda no localStorage:", error);
      }
    }
  }, []);

  const sortedTimestamps = useMemo(
    () => [...(timestamps ?? [])].sort((a, b) => a.time - b.time),
    [timestamps],
  );

  const activeTimestampId = useMemo(() => {
    if (!sortedTimestamps.length) {
      return null;
    }
    let currentId: string | null = null;
    for (const timestamp of sortedTimestamps) {
      if (playedSeconds + 0.5 >= timestamp.time) {
        currentId = timestamp.id;
      } else {
        break;
      }
    }
    return currentId;
  }, [sortedTimestamps, playedSeconds]);

  const handleSeekTo = useCallback(
    (nextTime: number) => {
      const instance = playerRef.current;
      if (!instance) {
        return;
      }

      const effectiveDuration =
        duration || instance.getDuration?.() || Math.max(nextTime, 0);
      const safeTime = clamp(nextTime, 0, effectiveDuration || 0);

      instance.seekTo?.(safeTime, "seconds");
      setPlayedSeconds(safeTime);
    },
    [duration],
  );

  useEffect(() => {
    if (!playerReady || hasAppliedResume) {
      return;
    }

    if (!hasHydratedInitial && resumeFrom === null) {
      return;
    }

    if (resumeFrom !== null && resumeFrom > 0) {
      handleSeekTo(resumeFrom);
      setPlayedSeconds(resumeFrom);
    }

    setHasAppliedResume(true);
  }, [
    handleSeekTo,
    hasAppliedResume,
    hasHydratedInitial,
    playerReady,
    resumeFrom,
  ]);

  const handleSeekBy = useCallback(
    (deltaSeconds: number) => {
      const current = playerRef.current?.getCurrentTime?.() ?? playedSeconds;
      handleSeekTo(current + deltaSeconds);
    },
    [handleSeekTo, playedSeconds],
  );

  const handleTogglePlay = useCallback(() => {
    if (!hasVideo) {
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [hasVideo]);

  const handleProgress = useCallback(
    (progress: OnProgressProps) => {
      setPlayedSeconds(progress.playedSeconds);
      handleProgressTick(
        progress.playedSeconds,
        duration || progress.loadedSeconds || progress.playedSeconds,
      );
    },
    [duration, handleProgressTick],
  );

  const handleDuration = useCallback(
    (mediaDuration: number) => {
      setDuration(mediaDuration);
      handleDurationChange(mediaDuration);
    },
    [handleDurationChange],
  );

  const handleVolumeChange = useCallback((value: number) => {
    const newVolume = clamp(value, 0, 1);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      setPreviousVolume(newVolume);
    }
  }, []);

  const handleVolumeDelta = useCallback(
    (delta: number) => {
      const base = isMuted ? 0 : volume;
      const next = clamp(base + delta, 0, 1);
      setVolume(next);
      if (next === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
        setPreviousVolume(next);
      }
    },
    [isMuted, volume],
  );

  const handleToggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restored = previousVolume > 0 ? previousVolume : 0.5;
      setVolume(restored);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  }, [isMuted, previousVolume, volume]);

  const handleToggleFullscreen = useCallback(async () => {
    if (typeof document === "undefined") {
      return;
    }
    const target = containerRef.current;
    if (!target) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await target.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Não foi possível alternar fullscreen:", error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (typeof document === "undefined") {
        return;
      }
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useKeyboardShortcuts(
    containerRef,
    {
      onTogglePlay: handleTogglePlay,
      onSeek: handleSeekBy,
      onVolumeChange: handleVolumeDelta,
      onToggleFullscreen: handleToggleFullscreen,
    },
    { enabled: hasVideo },
  );

  useEffect(
    () => () => {
      flushProgress();
    },
    [flushProgress],
  );

  return (
    <section className={cn("space-y-6", className)}>
      <div
        ref={containerRef}
        className={styles.playerContainer}
        tabIndex={hasVideo ? 0 : -1}
        aria-label={`Player de vídeo da aula ${title}`}
      >
        {hasVideo ? (
          <>
            <div
              className={styles.playerSurface}
              style={
                thumbnailUrl
                  ? {
                      backgroundImage: `url(${thumbnailUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <ReactPlayer
                ref={playerRef}
                url={currentSourceUrl}
                className={styles.playerInstance}
                width="100%"
                height="100%"
                playing={isPlaying}
                muted={isMuted}
                volume={volume}
                playbackRate={speed}
                playsinline
                config={
                  {
                    file: {
                      forceHLS: Boolean(currentSourceUrl?.endsWith(".m3u8")),
                      hlsOptions: {
                        startLevel: -1,
                        autoStartLoad: true,
                        capLevelToPlayerSize: true,
                      },
                      tracks: subtitleTracks,
                      attributes: {
                        controlsList: "nodownload",
                        playsInline: true,
                        crossOrigin: "anonymous",
                      },
                    },
                  } satisfies PlayerConfig
                }
                onReady={() => {
                  setIsBuffering(false);
                  setPlayerReady(true);
                  updateHlsQualities();
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => {
                  setIsPlaying(false);
                  const currentTime =
                    playerRef.current?.getCurrentTime?.() ?? playedSeconds;
                  const total =
                    playerRef.current?.getDuration?.() ?? duration ?? 0;

                  handleProgressTick(currentTime, total, { immediate: true });
                }}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onBuffer={() => setIsBuffering(true)}
                onBufferEnd={() => setIsBuffering(false)}
                onEnded={() => {
                  const total =
                    playerRef.current?.getDuration?.() ?? duration ?? 0;
                  const finalPosition = total || playedSeconds;

                  handleProgressTick(finalPosition, total, { immediate: true });
                  setIsPlaying(false);
                  setPlayedSeconds(finalPosition);
                }}
                onError={(error) => {
                  console.error("Erro ao reproduzir vídeo", error);
                  setIsPlaying(false);
                  setIsBuffering(false);
                }}
              />
            </div>

            <div className={styles.controlsOverlay}>
              <div className={styles.controlsPanel}>
                <div className="flex items-center gap-3 text-xs text-white/70">
                  <span className="font-mono">
                    {formatSeconds(playedSeconds)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={playedSeconds}
                    onChange={(event) =>
                      handleSeekTo(Number(event.target.value))
                    }
                    aria-label="Linha do tempo do vídeo"
                    className={styles.range}
                    disabled={!duration}
                  />
                  <span className="font-mono">{formatSeconds(duration)}</span>
                </div>

                <div className={styles.controlRow}>
                  <button
                    type="button"
                    className={styles.controlButton}
                    onClick={() => handleSeekBy(-10)}
                    title="Retroceder 10 segundos"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className={styles.controlButton}
                    onClick={handleTogglePlay}
                    title={isPlaying ? "Pausar" : "Reproduzir"}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.controlButton}
                    onClick={() => handleSeekBy(10)}
                    title="Avançar 10 segundos"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={handleToggleMute}
                      title={isMuted ? "Ativar áudio" : "Silenciar"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={(event) =>
                        handleVolumeChange(Number(event.target.value))
                      }
                      aria-label="Controle de volume"
                      className={styles.range}
                    />
                  </div>

                  <SpeedControl currentSpeed={speed} onSpeedChange={setSpeed} />

                  <SubtitleSelector
                    currentSelection={subtitleSelection}
                    options={subtitleOptions}
                    onChange={handleSubtitleChange}
                  />

                  <QualitySelector
                    currentQuality={quality}
                    onQualityChange={setQuality}
                    availableQualities={availableQualities}
                    effectiveQuality={effectiveQuality}
                    suggestedQuality={suggestedQuality}
                    isNetworkSupported={isSupported}
                    isAutoMode={quality === "auto"}
                  />

                  <div className="flex flex-1 items-center justify-end gap-2 text-xs text-white/60">
                    <span className="hidden md:inline">
                      Atalhos: espaço, ←/→, ↑/↓, F
                    </span>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={handleToggleFullscreen}
                      title={
                        isFullscreen
                          ? "Sair do modo tela cheia"
                          : "Modo tela cheia"
                      }
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-5 w-5" />
                      ) : (
                        <Maximize2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {isBuffering && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="rounded-full border border-primary/30 p-6">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Vídeo indisponível
              </p>
              <p className="text-sm text-muted-foreground">
                Estamos preparando o conteúdo desta aula. Volte em breve!
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Aula ativa
          </p>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {lessonId && (
            <span
              className={cn(
                "rounded-full px-3 py-1 font-semibold",
                isLessonCompleted
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-white/5 text-white/70",
              )}
            >
              {isLessonCompleted ? "Assistido" : "Em andamento"}
            </span>
          )}
          {resumeFrom !== null && resumeFrom > 0 && (
            <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              Retomando em {formatSeconds(resumeFrom)}
            </span>
          )}
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="rounded-xl border border-white/5 bg-card/40 p-4 text-sm text-muted-foreground">
          Dica: utilize os atalhos do teclado para controlar a reprodução sem
          tirar as mãos do mouse.
        </div>
        {sortedTimestamps.length > 0 && (
          <TimestampList
            timestamps={sortedTimestamps}
            activeId={activeTimestampId}
            onSeek={handleSeekTo}
          />
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={cn(
            styles.gamingButton,
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          Aula anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={cn(
            styles.gamingButton,
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          Próxima aula
        </button>
      </div>
    </section>
  );
};

export default VideoPlayer;
