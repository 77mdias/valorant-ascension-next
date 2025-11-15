"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Velocidades de reprodução disponíveis
 */
export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

/**
 * Chave do localStorage para persistir a velocidade
 */
const STORAGE_KEY = "videoPlayerSpeed";

/**
 * Velocidade padrão (normal)
 */
const DEFAULT_SPEED: PlaybackSpeed = 1;

/**
 * Hook para gerenciar a velocidade de reprodução do vídeo
 *
 * Features:
 * - Gerencia estado da velocidade de reprodução
 * - Persiste preferência no localStorage
 * - Valida valores para garantir velocidades suportadas
 * - Fornece funções auxiliares para manipulação
 *
 * @returns {Object} Estado e funções de controle da velocidade
 *
 * @example
 * ```tsx
 * const { speed, setSpeed, isNormalSpeed } = usePlaybackSpeed();
 *
 * // Mudar velocidade
 * setSpeed(1.5);
 *
 * // Verificar se está na velocidade normal
 * if (!isNormalSpeed) {
 *   // Mostrar indicador visual
 * }
 * ```
 */
export function usePlaybackSpeed() {
  const [speed, setSpeedState] = useState<PlaybackSpeed>(DEFAULT_SPEED);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar velocidade do localStorage na montagem
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSpeed = parseFloat(stored);
        // Validar se a velocidade está na lista de velocidades suportadas
        if (PLAYBACK_SPEEDS.includes(parsedSpeed as PlaybackSpeed)) {
          setSpeedState(parsedSpeed as PlaybackSpeed);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar velocidade do localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Função para atualizar velocidade e persistir
  const setSpeed = useCallback((newSpeed: PlaybackSpeed) => {
    if (!PLAYBACK_SPEEDS.includes(newSpeed)) {
      console.warn(
        `Velocidade ${newSpeed} não suportada. Use uma das velocidades: ${PLAYBACK_SPEEDS.join(", ")}`,
      );
      return;
    }

    setSpeedState(newSpeed);

    // Persistir no localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, newSpeed.toString());
      } catch (error) {
        console.error("Erro ao salvar velocidade no localStorage:", error);
      }
    }
  }, []);

  // Resetar para velocidade normal
  const resetSpeed = useCallback(() => {
    setSpeed(DEFAULT_SPEED);
  }, [setSpeed]);

  // Próxima velocidade na lista (circular)
  const nextSpeed = useCallback(() => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(speed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    setSpeed(PLAYBACK_SPEEDS[nextIndex]);
  }, [speed, setSpeed]);

  // Velocidade anterior na lista (circular)
  const previousSpeed = useCallback(() => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(speed);
    const prevIndex =
      (currentIndex - 1 + PLAYBACK_SPEEDS.length) % PLAYBACK_SPEEDS.length;
    setSpeed(PLAYBACK_SPEEDS[prevIndex]);
  }, [speed, setSpeed]);

  // Verificar se está na velocidade normal
  const isNormalSpeed = speed === DEFAULT_SPEED;

  // Formatar velocidade para exibição (ex: "1.5x")
  const formatSpeed = useCallback((value: PlaybackSpeed) => {
    return `${value}x`;
  }, []);

  return {
    speed,
    setSpeed,
    resetSpeed,
    nextSpeed,
    previousSpeed,
    isNormalSpeed,
    isLoaded,
    formatSpeed,
    availableSpeeds: PLAYBACK_SPEEDS,
  };
}
