/**
 * ScoreboardTab component
 * Main container for scoreboard tab content
 * Orchestrates RoundHistory, ViewControls, SortControls, and ScoreboardTable/TeamScoreboard
 */

"use client";

import RoundHistory from "../match-info/RoundHistory";
import ViewControls from "./ViewControls";
import SortControls from "./SortControls";
import ScoreboardTable from "./ScoreboardTable";
import TeamScoreboard from "./TeamScoreboard";
import type { MatchDetails, Player } from "../../types/match.types";
import { useTableSorting } from "../../hooks";
import { useMatchStats } from "../../hooks";

interface ScoreboardTabProps {
  matchDetails: MatchDetails;
  region: string;
  winnerTeamId: "Red" | "Blue";
}

export default function ScoreboardTab({
  matchDetails,
  region,
  winnerTeamId,
}: ScoreboardTabProps) {
  const {
    sortBy,
    setSortBy,
    sortOrder,
    tableView,
    setTableView,
    sortedPlayers,
    redTeam,
    blueTeam,
    redTeamScore,
    blueTeamScore,
    redTeamWon,
    toggleSortOrder,
  } = useTableSorting(matchDetails);

  const { fkAndFD, mk, calculatePlayerStats } = useMatchStats(matchDetails);

  const handlePlayerClick = (playerName: string, playerTag: string) => {
    const encodedName = encodeURIComponent(playerName);
    const encodedTag = encodeURIComponent(playerTag);
    window.location.href = `/mmr?name=${encodedName}&tag=${encodedTag}&region=${region}`;
  };

  return (
    <div>
      <RoundHistory rounds={matchDetails.rounds || []} />

      <ViewControls tableView={tableView} onViewChange={setTableView} />

      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onToggleSortOrder={toggleSortOrder}
      />

      {tableView === "total" ? (
        <ScoreboardTable
          players={sortedPlayers}
          onPlayerClick={handlePlayerClick}
          calculatePlayerStats={calculatePlayerStats}
          fkAndFD={fkAndFD}
          mk={mk}
          winnerTeamId={winnerTeamId}
        />
      ) : (
        <>
          <TeamScoreboard
            team="Red"
            teamName="Time A"
            players={redTeam}
            teamScore={redTeamScore}
            won={redTeamWon}
            onPlayerClick={handlePlayerClick}
            calculatePlayerStats={calculatePlayerStats}
            fkAndFD={fkAndFD}
            mk={mk}
          />
          <TeamScoreboard
            team="Blue"
            teamName="Time B"
            players={blueTeam}
            teamScore={blueTeamScore}
            won={!redTeamWon}
            onPlayerClick={handlePlayerClick}
            calculatePlayerStats={calculatePlayerStats}
            fkAndFD={fkAndFD}
            mk={mk}
          />
        </>
      )}
    </div>
  );
}
