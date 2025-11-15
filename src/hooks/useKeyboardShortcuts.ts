"use client";

import { RefObject, useEffect } from "react";

export type KeyboardShortcutHandlers = {
  onTogglePlay?: () => void;
  onSeek?: (deltaSeconds: number) => void;
  onVolumeChange?: (delta: number) => void;
  onToggleFullscreen?: () => void;
};

export type KeyboardShortcutOptions = {
  enabled?: boolean;
  seekStep?: number;
  volumeStep?: number;
};

export const useKeyboardShortcuts = (
  targetRef: RefObject<HTMLElement | null>,
  handlers: KeyboardShortcutHandlers,
  options?: KeyboardShortcutOptions,
) => {
  const { onTogglePlay, onSeek, onVolumeChange, onToggleFullscreen } = handlers;
  const { enabled = true, seekStep = 5, volumeStep = 0.05 } = options ?? {};

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const target = targetRef.current;
    if (!target) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const focusedElement = document.activeElement;
      if (
        !focusedElement ||
        (focusedElement !== target && !target.contains(focusedElement))
      ) {
        return;
      }

      let handled = false;

      switch (event.key) {
        case " ":
        case "Spacebar":
          onTogglePlay?.();
          handled = true;
          break;
        case "ArrowRight":
          onSeek?.(seekStep);
          handled = true;
          break;
        case "ArrowLeft":
          onSeek?.(-seekStep);
          handled = true;
          break;
        case "ArrowUp":
          onVolumeChange?.(volumeStep);
          handled = true;
          break;
        case "ArrowDown":
          onVolumeChange?.(-volumeStep);
          handled = true;
          break;
        case "f":
        case "F":
          onToggleFullscreen?.();
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    target.addEventListener("keydown", handleKeyDown);

    return () => {
      target.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enabled,
    onTogglePlay,
    onSeek,
    onVolumeChange,
    onToggleFullscreen,
    seekStep,
    targetRef,
    volumeStep,
  ]);
};
