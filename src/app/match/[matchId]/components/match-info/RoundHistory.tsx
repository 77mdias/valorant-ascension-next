/**
 * RoundHistory component
 * Displays round-by-round win/loss history for both teams
 */

import type { Round } from "../../types/match.types";
import styles from "./RoundHistory.module.scss";

interface RoundHistoryProps {
  rounds: Round[];
}

export default function RoundHistory({ rounds }: RoundHistoryProps) {
  const totalRounds = rounds.length;

  return (
    <section
      className={styles.roundHistory}
      aria-label="Histórico de rounds entre os times"
    >
      <div className={styles.roundHistoryHeader}>
        <div>
          <p className={styles.eyebrow}>Progressão</p>
          <div className={styles.titleRow}>
            <h4>Histórico de Rounds</h4>
            <span className={styles.roundCount}>{totalRounds} rounds</span>
          </div>
        </div>
        <div className={styles.legend} aria-hidden="true">
          <span className={`${styles.legendDot} ${styles.win}`} />
          <span>Vitória</span>
          <span className={`${styles.legendDot} ${styles.loss}`} />
          <span>Derrota</span>
        </div>
      </div>

      <div className={styles.roundHistoryGrid}>
        {/* Team A Row */}
        <div className={styles.roundHistoryRow}>
          <div className={styles.teamLabel}>Time A</div>
          <div className={styles.roundIconsContainer}>
            {rounds.map((round, i) => {
              const isWin = round?.winning_team === "Red";
              return (
                <div
                  key={i}
                  className={`${styles.roundIcon} ${isWin ? styles.win : styles.loss}`}
                  aria-label={`Round ${i + 1}: ${isWin ? "Vitória" : "Derrota"}`}
                >
                  {isWin ? "✓" : "✗"}
                </div>
              );
            })}
          </div>
        </div>

        {/* Round Numbers Row */}
        <div className={styles.roundHistoryRow} aria-hidden="true">
          <div className={styles.teamLabel}></div>
          <div className={styles.roundNumbersContainer}>
            {rounds.map((_, i) => (
              <span key={i} className={styles.roundNumber}>
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Team B Row */}
        <div className={styles.roundHistoryRow}>
          <div className={styles.teamLabel}>Time B</div>
          <div className={styles.roundIconsContainer}>
            {rounds.map((round, i) => {
              const isWin = round?.winning_team === "Blue";
              return (
                <div
                  key={i}
                  className={`${styles.roundIcon} ${isWin ? styles.win : styles.loss}`}
                  aria-label={`Round ${i + 1}: ${isWin ? "Vitória" : "Derrota"}`}
                >
                  {isWin ? "✓" : "✗"}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
