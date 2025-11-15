/**
 * Custom hook for fetching and managing match data
 * Handles loading states, error handling, and API requests
 */

import { useState, useEffect } from "react";
import type { MatchDetails } from "../types/match.types";

interface UseMatchDataReturn {
  matchDetails: MatchDetails | null;
  loading: boolean;
  error: string | null;
}

export function useMatchData(matchId: string, region: string): UseMatchDataReturn {
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/valorant/match/${matchId}?region=${region}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Erro ao buscar detalhes da partida",
          );
        }

        const data = await response.json();
        setMatchDetails(data.match);
      } catch (err) {
        console.error("Erro ao buscar detalhes da partida:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId, region]);

  return { matchDetails, loading, error };
}
