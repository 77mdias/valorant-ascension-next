/**
 * PlayerRow component - Tracker.gg style
 * Flexbox-based player statistics row
 * Note: Styles should be passed from parent table component
 */

import Image from "next/image";
import type { Player } from "../../types/match.types";

interface PlayerRowProps {
  player: Player;
  index: number;
  onPlayerClick: (name: string, tag: string) => void;
  calculatePlayerStats: (player: Player) => {
    kd: string;
    kdDiff: number;
    hsPercentage: number;
    adr: number;
  };
  fkAndFD: Record<string, { fk: number; fd: number }>;
  mk: Record<string, number>;
  showAllColumns?: boolean;
  styles: any; // SCSS module from parent
}

// Helper para obter URL da imagem do rank
function getRankImageUrl(tierId: number): string {
  // IDs dos tiers do Valorant (0-27)
  // 0-2: Unranked/Iron, 3-5: Bronze, 6-8: Silver, 9-11: Gold, 12-14: Platinum
  // 15-17: Diamond, 18-20: Ascendant, 21-23: Immortal, 24-27: Radiant
  return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${tierId}/smallicon.png`;
}

export default function PlayerRow({
  player,
  index,
  onPlayerClick,
  calculatePlayerStats,
  fkAndFD,
  mk,
  showAllColumns = true,
  styles,
}: PlayerRowProps) {
  const stats = calculatePlayerStats(player);
  const playerFK = fkAndFD[player.puuid]?.fk || 0;
  const playerFD = fkAndFD[player.puuid]?.fd || 0;
  const playerMK = mk[player.puuid] || 0;

  return (
    <div
      className={styles.playerRow}
      onClick={() => onPlayerClick(player.name, player.tag)}
    >
      {/* Sticky Player Info Column */}
      <div className={`${styles.cell} ${styles.stickyCell} ${styles.playerInfoCell}`}>
        <div className={styles.playerInfo}>
          <div className={styles.playerAvatar}>
            <Image
              src={`https://media.valorant-api.com/agents/${player.agent.id}/displayicon.png`}
              alt={player.agent.name}
              width={40}
              height={40}
            />
          </div>
          <div className={styles.playerDetails}>
            <div className={styles.playerName}>
              {player.name}
              <span className={styles.playerTag}>#{player.tag}</span>
            </div>
            <div className={styles.playerRankInfo}>
              <Image
                src={getRankImageUrl(player.tier.id)}
                alt={player.tier.name}
                width={12}
                height={12}
                className={styles.rankIcon}
              />
              <span className={styles.playerRank}>{player.tier.name}</span>
              {player.account_level && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={styles.accountLevel}>{player.account_level} RR</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rank Badge */}
      <div className={`${styles.cell} ${styles.rankBadgeCell} ${styles.centerAlign}`}>
        <Image
          src={getRankImageUrl(player.tier.id)}
          alt={player.tier.name}
          width={32}
          height={32}
        />
      </div>

      {/* TRS (Score) */}
      <div className={`${styles.cell} ${styles.trsCell} ${styles.centerAlign}`}>
        <div className={styles.trsValue}>{player.stats.score}</div>
      </div>

      {/* Score (ACS) */}
      <div className={`${styles.cell} ${styles.scoreCell} ${styles.centerAlign}`}>
        {player.stats.score}
      </div>

      {/* Kills */}
      <div className={`${styles.cell} ${styles.statCell} ${styles.centerAlign}`}>
        {player.stats.kills}
      </div>

      {/* Deaths */}
      <div className={`${styles.cell} ${styles.statCell} ${styles.centerAlign}`}>
        {player.stats.deaths}
      </div>

      {/* Assists */}
      <div className={`${styles.cell} ${styles.statCell} ${styles.centerAlign}`}>
        {player.stats.assists}
      </div>

      {/* K/D Diff (+/-) */}
      <div className={`${styles.cell} ${styles.statCell} ${styles.centerAlign} ${stats.kdDiff >= 0 ? styles.positive : styles.negative}`}>
        {stats.kdDiff >= 0 ? "+" : ""}
        {stats.kdDiff}
      </div>

      {/* K/D Ratio */}
      <div className={`${styles.cell} ${styles.kdCell} ${styles.centerAlign} ${parseFloat(stats.kd) >= 1 ? styles.positive : ''}`}>
        {stats.kd}
      </div>

      {/* ADR */}
      <div className={`${styles.cell} ${styles.adrCell} ${styles.centerAlign} ${stats.adr >= 150 ? styles.positive : ''}`}>
        {stats.adr}
      </div>

      {/* HS% */}
      <div className={`${styles.cell} ${styles.hsCell} ${styles.centerAlign}`}>
        {stats.hsPercentage}%
      </div>

      {showAllColumns && (
        <>
          {/* FK */}
          <div className={`${styles.cell} ${styles.statCell} ${styles.centerAlign}`}>
            {playerFK}
          </div>

          {/* FD */}
          <div className={`${styles.cell} ${styles.statCell} ${styles.centerAlign}`}>
            {playerFD}
          </div>

          {/* MK */}
          <div className={`${styles.cell} ${styles.statCell} ${styles.centerAlign}`}>
            {playerMK}
          </div>
        </>
      )}
    </div>
  );
}
