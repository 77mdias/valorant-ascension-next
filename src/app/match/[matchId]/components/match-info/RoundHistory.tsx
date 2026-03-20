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
  const firstHalf = rounds.slice(0, 12);
  const secondHalf = rounds.slice(12, 24);
  const overtime = rounds.slice(24);

  const countWins = (halfRounds: Round[], team: "Red" | "Blue") =>
    halfRounds.filter((r) => r?.winning_team === team).length;

  const renderHalf = (halfRounds: Round[], startIndex: number, label: string) => {
    const redWins = countWins(halfRounds, "Red");
    const blueWins = countWins(halfRounds, "Blue");

    return (
      <div className={styles.half} key={label}>
        <div className={styles.halfHeader}>
          <span className={styles.halfLabel}>{label}</span>
          <span className={styles.halfScore}>
            <span className={styles.teamA}>TA: {redWins}</span>
            <span className={styles.divider}> · </span>
            <span className={styles.teamB}>TB: {blueWins}</span>
          </span>
        </div>
        <div className={styles.circles}>
          {halfRounds.map((round, i) => {
            const roundNum = startIndex + i + 1;
            const isRedWin = round?.winning_team === "Red";
            return (
              <div
                key={i}
                className={`${styles.circle} ${isRedWin ? styles.win : styles.loss}`}
                aria-label={`Round ${roundNum}: ${isRedWin ? "Time A venceu" : "Time B venceu"}`}
              >
                {roundNum}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className={styles.roundHistory} aria-label="Histórico de rounds">
      <div className={styles.roundHistoryHeader}>
        <p className={styles.eyebrow}>Progressão</p>
        <div className={styles.titleRow}>
          <h4>Histórico de Rounds</h4>
          <span className={styles.roundCount}>{rounds.length} rounds</span>
        </div>
      </div>

      <div className={styles.legend} aria-hidden="true">
        <span className={`${styles.legendDot} ${styles.win}`} />
        <span>Time A</span>
        <span className={`${styles.legendDot} ${styles.loss}`} />
        <span>Time B</span>
      </div>

      {firstHalf.length > 0 && renderHalf(firstHalf, 0, "1ª Metade")}
      {secondHalf.length > 0 && renderHalf(secondHalf, 12, "2ª Metade")}
      {overtime.length > 0 && renderHalf(overtime, 24, "OT")}
    </section>
  );
}
