/**
 * TeamScoreboard component - Tracker.gg style
 * Flexbox-based team scoreboard with sticky columns
 */

import PlayerRow from "./PlayerRow";
import type { Player } from "../../types/match.types";
import styles from "./ScoreboardTable.module.scss";

interface TeamScoreboardProps {
  team: "Red" | "Blue";
  teamName: string;
  players: Player[];
  teamScore: number;
  won: boolean;
  onPlayerClick: (name: string, tag: string) => void;
  calculatePlayerStats: (player: Player) => any;
  fkAndFD: Record<string, { fk: number; fd: number }>;
  mk: Record<string, number>;
}

export default function TeamScoreboard({
  team,
  teamName,
  players,
  teamScore,
  won,
  onPlayerClick,
  calculatePlayerStats,
  fkAndFD,
  mk,
}: TeamScoreboardProps) {
  return (
    <div className={`${styles.scoreboardTable} ${won ? styles.winner : styles.loser}`}>
      <div className={styles.teamHeader}>
        <h3>{teamName}</h3>
        <div className={styles.teamScore}>
          <span className={styles.roundsWon}>{teamScore} rounds</span>
          <span className={`${styles.status} ${won ? styles.winner : styles.loser}`}>
            {won ? "VENCEDOR" : "PERDEDOR"}
          </span>
        </div>
      </div>

      <div className={styles.scrollWrapper}>
        <div className={styles.tableContainer}>
          {/* Header Row */}
          <div className={styles.headerRow}>
            <div className={`${styles.headerCell} ${styles.playerCol}`}>Player</div>
            <div className={`${styles.headerCell} ${styles.rankBadgeCol}`}>Rank</div>
            <div className={`${styles.headerCell} ${styles.trsCol}`}>TRS</div>
            <div className={`${styles.headerCell} ${styles.scoreCol}`}>Score</div>
            <div className={`${styles.headerCell} ${styles.statCol}`}>K</div>
            <div className={`${styles.headerCell} ${styles.statCol}`}>D</div>
            <div className={`${styles.headerCell} ${styles.statCol}`}>A</div>
            <div className={`${styles.headerCell} ${styles.statCol}`}>+/-</div>
            <div className={`${styles.headerCell} ${styles.kdCol}`}>K/D</div>
            <div className={`${styles.headerCell} ${styles.adrCol}`}>ADR</div>
            <div className={`${styles.headerCell} ${styles.hsCol}`}>HS%</div>
            <div className={`${styles.headerCell} ${styles.statCol}`}>FK</div>
            <div className={`${styles.headerCell} ${styles.statCol}`}>FD</div>
            <div className={`${styles.headerCell} ${styles.statCol}`}>MK</div>
          </div>

          {/* Player Rows */}
          {players.map((player, index) => (
            <PlayerRow
              key={player.puuid}
              player={player}
              index={index}
              onPlayerClick={onPlayerClick}
              calculatePlayerStats={calculatePlayerStats}
              fkAndFD={fkAndFD}
              mk={mk}
              showAllColumns={true}
              styles={styles}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
