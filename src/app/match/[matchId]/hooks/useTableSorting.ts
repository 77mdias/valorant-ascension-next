/**
 * Custom hook for table sorting logic
 * Handles sorting by multiple fields and team separation
 */

import { useState, useMemo } from "react";
import type {
  Player,
  SortField,
  SortOrder,
  TableView,
  MatchDetails,
} from "../types/match.types";

interface UseTableSortingReturn {
  sortBy: SortField;
  setSortBy: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  tableView: TableView;
  setTableView: (view: TableView) => void;
  sortedPlayers: Player[];
  redTeam: Player[];
  blueTeam: Player[];
  redTeamScore: number;
  blueTeamScore: number;
  redTeamWon: boolean;
  toggleSortOrder: () => void;
}

export function useTableSorting(
  matchDetails: MatchDetails | null
): UseTableSortingReturn {
  const [sortBy, setSortBy] = useState<SortField>("score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [tableView, setTableView] = useState<TableView>("total");

  // Sort players based on selected field and order
  const sortPlayers = useMemo(() => {
    if (!matchDetails?.players) return [];

    return [...matchDetails.players].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case "score":
          aValue = a.stats.score;
          bValue = b.stats.score;
          break;
        case "kills":
          aValue = a.stats.kills;
          bValue = b.stats.kills;
          break;
        case "deaths":
          aValue = a.stats.deaths;
          bValue = b.stats.deaths;
          break;
        case "assists":
          aValue = a.stats.assists;
          bValue = b.stats.assists;
          break;
        case "kd":
          aValue =
            a.stats.deaths > 0 ? a.stats.kills / a.stats.deaths : a.stats.kills;
          bValue =
            b.stats.deaths > 0 ? b.stats.kills / b.stats.deaths : b.stats.kills;
          break;
        case "hs":
          const aTotalShots =
            a.stats.headshots + a.stats.bodyshots + a.stats.legshots;
          const bTotalShots =
            b.stats.headshots + b.stats.bodyshots + b.stats.legshots;
          aValue =
            aTotalShots > 0 ? (a.stats.headshots / aTotalShots) * 100 : 0;
          bValue =
            bTotalShots > 0 ? (b.stats.headshots / bTotalShots) * 100 : 0;
          break;
        case "adr":
          const roundsCount = matchDetails.rounds?.length || 1;
          aValue = Math.round(a.stats.damage.dealt / roundsCount);
          bValue = Math.round(b.stats.damage.dealt / roundsCount);
          break;
        default:
          aValue = a.stats.score;
          bValue = b.stats.score;
      }

      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });
  }, [matchDetails, sortBy, sortOrder]);

  // Separate teams
  const redTeam = useMemo(
    () => sortPlayers.filter((player) => player.team_id === "Red"),
    [sortPlayers]
  );

  const blueTeam = useMemo(
    () => sortPlayers.filter((player) => player.team_id === "Blue"),
    [sortPlayers]
  );

  // Get team scores
  const redTeamScore =
    matchDetails?.teams?.find((team) => team.team_id === "Red")?.rounds?.won ||
    0;
  const blueTeamScore =
    matchDetails?.teams?.find((team) => team.team_id === "Blue")?.rounds
      ?.won || 0;
  const redTeamWon =
    matchDetails?.teams?.find((team) => team.team_id === "Red")?.won || false;

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    tableView,
    setTableView,
    sortedPlayers: sortPlayers,
    redTeam,
    blueTeam,
    redTeamScore,
    blueTeamScore,
    redTeamWon,
    toggleSortOrder,
  };
}
