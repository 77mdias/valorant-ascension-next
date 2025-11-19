"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Qualidades de vídeo disponíveis
 */
export const VIDEO_QUALITIES = ["auto", "1080p", "720p", "480p", "360p"] as const;
export type VideoQuality = (typeof VIDEO_QUALITIES)[number];

/**
 * Tipos de conexão baseados em velocidade
 */
export type ConnectionSpeed = "slow" | "medium" | "fast" | "unknown";

/**
 * Interface para informações de rede (Network Information API)
 */
interface NetworkInformation extends EventTarget {
  downlink?: number; // Mbps
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  rtt?: number; // Round-trip time em ms
  saveData?: boolean;
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}

/**
 * Estende Navigator para incluir Network Information API
 */
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

/**
 * Hook para detectar velocidade de conexão e sugerir qualidade de vídeo
 *
 * Features:
 * - Detecta velocidade usando Network Information API
 * - Fallback gracioso para navegadores sem suporte
 * - Sugere qualidade baseada em bandwidth
 * - Monitora mudanças na conexão em tempo real
 * - Categoriza conexão: slow, medium, fast, unknown
 *
 * @returns {Object} Informações de rede e qualidade sugerida
 *
 * @example
 * ```tsx
 * const { connectionSpeed, suggestedQuality, isSupported } = useNetworkSpeed();
 *
 * if (connectionSpeed === 'slow') {
 *   console.log('Conexão lenta detectada');
 * }
 * ```
 */
export function useNetworkSpeed() {
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionSpeed>("unknown");
  const [downlink, setDownlink] = useState<number | null>(null);
  const [effectiveType, setEffectiveType] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  /**
   * Determina a velocidade da conexão baseada em downlink (Mbps)
   */
  const categorizeSpeed = useCallback((mbps: number | null): ConnectionSpeed => {
    if (mbps === null) {
      return "unknown";
    }
    if (mbps < 1) {
      return "slow";
    }
    if (mbps < 5) {
      return "medium";
    }
    return "fast";
  }, []);

  /**
   * Sugere qualidade de vídeo baseada na velocidade da conexão
   */
  const getSuggestedQuality = useCallback((speed: ConnectionSpeed): VideoQuality => {
    switch (speed) {
      case "slow":
        return "480p";
      case "medium":
        return "720p";
      case "fast":
        return "1080p";
      case "unknown":
      default:
        return "auto";
    }
  }, []);

  /**
   * Atualiza informações de rede
   */
  const updateNetworkInfo = useCallback(
    (connection: NetworkInformation) => {
      const dl = connection.downlink ?? null;
      const et = connection.effectiveType ?? null;

      setDownlink(dl);
      setEffectiveType(et);
      setConnectionSpeed(categorizeSpeed(dl));
    },
    [categorizeSpeed],
  );

  // Detectar e monitorar Network Information API
  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!connection) {
      // AIDEV-NOTE: Network Information API não suportada
      // Fallback: assume conexão média e sugere qualidade auto
      setIsSupported(false);
      setConnectionSpeed("unknown");
      return;
    }

    setIsSupported(true);
    updateNetworkInfo(connection);

    // Listener para mudanças na conexão
    const handleConnectionChange = () => {
      updateNetworkInfo(connection);
    };

    connection.addEventListener("change", handleConnectionChange);

    return () => {
      connection.removeEventListener("change", handleConnectionChange);
    };
  }, [updateNetworkInfo]);

  const suggestedQuality = getSuggestedQuality(connectionSpeed);

  return {
    /** Velocidade categorizada da conexão */
    connectionSpeed,
    /** Downlink em Mbps (null se não disponível) */
    downlink,
    /** Tipo efetivo da conexão (2g, 3g, 4g, etc.) */
    effectiveType,
    /** Se a Network Information API é suportada */
    isSupported,
    /** Qualidade de vídeo sugerida baseada na conexão */
    suggestedQuality,
    /** Função para obter qualidade sugerida de uma velocidade específica */
    getSuggestedQuality,
  };
}
