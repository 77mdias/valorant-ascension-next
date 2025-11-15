/**
 * ScoreboardTable component - Tracker.gg style
 * Flexbox-based scoreboard with sticky columns
 */

import PlayerRow from "./PlayerRow";
import type { Player } from "../../types/match.types";
import styles from "./ScoreboardTable.module.scss";

interface ScoreboardTableProps {
  players: Player[];
  onPlayerClick: (name: string, tag: string) => void;
  calculatePlayerStats: (player: Player) => any;
  fkAndFD: Record<string, { fk: number; fd: number }>;
  mk: Record<string, number>;
  winnerTeamId: "Red" | "Blue";
}

export default function ScoreboardTable({
  players,
  onPlayerClick,
  calculatePlayerStats,
  fkAndFD,
  mk,
  winnerTeamId,
}: ScoreboardTableProps) {
  return (
    <div className={styles.scoreboardTable}>
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
              winnerTeamId={winnerTeamId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
