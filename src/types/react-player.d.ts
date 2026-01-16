declare module "react-player" {
  import { Component, CSSProperties, SyntheticEvent } from "react";

  export type OnProgressProps = {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  };

  export type PlayerConfig = {
    file?: {
      forceHLS?: boolean;
      hlsOptions?: Record<string, unknown>;
      attributes?: Record<string, string | boolean>;
    };
    [key: string]: unknown;
  };

  export type ReactPlayerProps = {
    url?: string | string[] | null;
    playing?: boolean;
    loop?: boolean;
    controls?: boolean;
    volume?: number;
    muted?: boolean;
    playbackRate?: number;
    width?: string | number;
    height?: string | number;
    style?: CSSProperties;
    progressInterval?: number;
    playsinline?: boolean;
    config?: PlayerConfig;
    onReady?: () => void;
    onStart?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onBuffer?: () => void;
    onBufferEnd?: () => void;
    onEnded?: () => void;
    onError?: (
      error: SyntheticEvent | Error,
      data?: unknown,
      hlsInstance?: unknown,
      hlsGlobal?: unknown,
    ) => void;
    onDuration?: (duration: number) => void;
    onSeek?: (seconds: number) => void;
    onProgress?: (state: OnProgressProps) => void;
  } & Record<string, unknown>;

  export default class ReactPlayer extends Component<ReactPlayerProps> {
    seekTo(amount: number, type?: "seconds" | "fraction"): void;
    getCurrentTime(): number;
    getDuration(): number;
    getInternalPlayer(key?: string): unknown;
  }
}
