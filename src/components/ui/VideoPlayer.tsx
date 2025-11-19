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
import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import styles from "./VideoPlayer.module.scss";
import { cn } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePlaybackSpeed } from "@/hooks/usePlaybackSpeed";
import { useNetworkSpeed, VideoQuality } from "@/hooks/useNetworkSpeed";
import TimestampList from "@/components/VideoPlayer/TimestampList";
import SpeedControl from "@/components/VideoPlayer/SpeedControl";
import QualitySelector from "@/components/VideoPlayer/QualitySelector";
import { formatSeconds } from "@/lib/time";

interface VideoPlayerProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  title: string;
  description: string;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  className?: string;
  timestamps?: Array<{ id: string; time: number; label: string }>;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const VideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  title,
  description,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  className,
  timestamps,
}: VideoPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  // Hook de controle de velocidade de reprodução
  const { speed, setSpeed, isNormalSpeed } = usePlaybackSpeed();

  // AIDEV-NOTE: Hook de detecção de velocidade de rede
  // Detecta conexão e sugere qualidade apropriada
  const { suggestedQuality, connectionSpeed, isSupported } = useNetworkSpeed();

  // Estado de qualidade de vídeo com persistência
  const [quality, setQualityState] = useState<VideoQuality>("auto");
  const [isQualityLoaded, setIsQualityLoaded] = useState(false);

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

  // Atualizar qualidade quando modo auto e sugestão mudar
  useEffect(() => {
    if (quality === "auto" && isQualityLoaded) {
      // Em modo auto, a qualidade efetiva é a sugerida pela rede
      // AIDEV-NOTE: react-player não suporta controle direto de qualidade
      // para vídeos MP4. Esta lógica está preparada para futuras integrações
      // com HLS/DASH ou para vídeos do YouTube/Vimeo que já possuem
      // múltiplas qualidades embutidas
    }
  }, [quality, suggestedQuality, isQualityLoaded]);

  // Função para atualizar qualidade e persistir
  const setQuality = useCallback((newQuality: VideoQuality) => {
    setQualityState(newQuality);

    // Persistir no localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("videoPlayerQuality", newQuality);
      } catch (error) {
        console.error("Erro ao salvar qualidade no localStorage:", error);
      }
    }
  }, []);

  // Determinar qualidade efetiva (auto usa sugestão da rede)
  const effectiveQuality = quality === "auto" ? suggestedQuality : quality;

  const hasVideo = Boolean(videoUrl);

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
        duration || instance.duration || Math.max(nextTime, 0);
      const safeTime = clamp(nextTime, 0, effectiveDuration || 0);
      instance.currentTime = safeTime;
      setPlayedSeconds(safeTime);
    },
    [duration],
  );

  const handleSeekBy = useCallback(
    (deltaSeconds: number) => {
      const current = playerRef.current?.currentTime ?? playedSeconds;
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

  const handleTimeUpdate = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const current = event.currentTarget.currentTime ?? 0;
      setPlayedSeconds(current);
    },
    [],
  );

  const handleDurationChange = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const mediaDuration = event.currentTarget.duration ?? 0;
      setDuration(mediaDuration);
    },
    [],
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
                src={videoUrl ?? undefined}
                className={styles.playerInstance}
                width="100%"
                height="100%"
                playing={isPlaying}
                muted={isMuted}
                volume={volume}
                playbackRate={speed}
                playsInline
                onReady={() => setIsBuffering(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
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
                  <span className="font-mono">
                    {formatSeconds(duration)}
                  </span>
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

                  <QualitySelector
                    currentQuality={quality}
                    onQualityChange={setQuality}
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
