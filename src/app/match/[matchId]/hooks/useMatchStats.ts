/**
 * Custom hook for calculating match statistics
 * Provides FK/FD, MK, and player stats calculations
 */

import { useMemo } from "react";
import { calculateFKandFD, calculateMK } from "@/utils/matchCalculations";
import type { MatchDetails, Player } from "../types/match.types";

interface PlayerStatsCalculated {
  kd: string;
  kdDiff: number;
  hsPercentage: number;
  adr: number;
  totalShots: number;
}

interface UseMatchStatsReturn {
  fkAndFD: Record<string, { fk: number; fd: number }>;
  mk: Record<string, number>;
  calculatePlayerStats: (player: Player) => PlayerStatsCalculated;
  formatDuration: (ms: number) => string;
  formatDate: (dateString: string) => string;
}

export function useMatchStats(matchDetails: MatchDetails | null): UseMatchStatsReturn {
  // Calculate FK/FD and MK using memoization
  const rawFKandFD = useMemo(
    () => calculateFKandFD(matchDetails?.kills || []),
    [matchDetails?.kills]
  );

  // Transform to the format expected by components
  const fkAndFD = useMemo(() => {
    const result: Record<string, { fk: number; fd: number }> = {};

    // Merge fkCount and fdCount into single structure
    Object.keys(rawFKandFD.fkCount).forEach((puuid) => {
      if (!result[puuid]) result[puuid] = { fk: 0, fd: 0 };
      result[puuid].fk = rawFKandFD.fkCount[puuid] || 0;
    });

    Object.keys(rawFKandFD.fdCount).forEach((puuid) => {
      if (!result[puuid]) result[puuid] = { fk: 0, fd: 0 };
      result[puuid].fd = rawFKandFD.fdCount[puuid] || 0;
    });

    return result;
  }, [rawFKandFD]);

  const mk = useMemo(
    () => calculateMK(matchDetails?.kills || []),
    [matchDetails?.kills]
  );

  // Calculate player statistics
  const calculatePlayerStats = (player: Player): PlayerStatsCalculated => {
    const kd =
      player.stats.deaths > 0
        ? player.stats.kills / player.stats.deaths
        : player.stats.kills;
    const kdDiff = player.stats.kills - player.stats.deaths;
    const totalShots =
      player.stats.headshots + player.stats.bodyshots + player.stats.legshots;
    const hsPercentage =
      totalShots > 0
        ? Math.round((player.stats.headshots / totalShots) * 100)
        : 0;
    const adr = matchDetails?.rounds?.length
      ? Math.round(player.stats.damage.dealt / matchDetails.rounds.length)
      : 0;

    return {
      kd: kd.toFixed(1),
      kdDiff,
      hsPercentage,
      adr,
      totalShots,
    };
  };

  // Format duration to mm:ss
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format date to Brazilian locale
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return {
    fkAndFD,
    mk,
    calculatePlayerStats,
    formatDuration,
    formatDate,
  };
}
