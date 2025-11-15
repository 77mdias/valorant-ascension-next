/**
 * Match Details Page - REFACTORED
 * Displays detailed information about a Valorant match
 *
 * This file has been refactored from 979 lines to ~100 lines
 * by extracting components and hooks into separate modules
 */

"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useMatchData } from "./hooks";
import { useMatchStats } from "./hooks";
import {
  LoadingState,
  ErrorState,
  MatchPageHeader,
  MatchHeader,
  TabNavigation,
  ScoreboardTab,
  RoundsTab,
  ComingSoonTab,
} from "./components";
import type { TabType } from "./types/match.types";
import styles from "./page.module.scss";

export default function MatchDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("scoreboard");

  const matchId = params.matchId as string;
  const region = searchParams.get("region") || "na";
  const playerContext = searchParams.get("player");

  // Fetch match data using custom hook
  const { matchDetails, loading, error } = useMatchData(matchId, region);

  // Get match stats utilities
  const { formatDate, formatDuration } = useMatchStats(matchDetails);

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingState />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState message={error} />
      </div>
    );
  }

  // Not found state
  if (!matchDetails) {
    return (
      <div className={styles.container}>
        <ErrorState
          title="❌ Partida não encontrada"
          message="Não foi possível encontrar os detalhes desta partida."
        />
      </div>
    );
  }

  // Get team scores for MatchHeader
  const redTeamScore =
    matchDetails.teams?.find((team) => team.team_id === "Red")?.rounds?.won || 0;
  const blueTeamScore =
    matchDetails.teams?.find((team) => team.team_id === "Blue")?.rounds?.won || 0;

  return (
    <div className={styles.container}>
      <MatchPageHeader playerContext={playerContext} region={region} />

      <MatchHeader
        matchDetails={matchDetails}
        redTeamScore={redTeamScore}
        blueTeamScore={blueTeamScore}
        formatDate={formatDate}
        formatDuration={formatDuration}
        matchId={matchId}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.tabContent}>
        {activeTab === "scoreboard" && (
          <ScoreboardTab matchDetails={matchDetails} region={region} />
        )}

        {activeTab === "rounds" && (
          <RoundsTab rounds={matchDetails.rounds || []} />
        )}

        {(activeTab === "performance" ||
          activeTab === "economy" ||
          activeTab === "duels") && <ComingSoonTab />}
      </div>
    </div>
  );
}
