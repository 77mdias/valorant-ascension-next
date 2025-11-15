/**
 * RoundsTab component
 * Displays detailed information for each round
 */

import type { Round } from "../../types/match.types";
import styles from "./RoundsTab.module.scss";

interface RoundsTabProps {
  rounds: Round[];
}

export default function RoundsTab({ rounds }: RoundsTabProps) {
  return (
    <div className={styles.roundsTab}>
      <div className={styles.roundsList}>
        {rounds.map((round, index) => (
          <div key={index} className={styles.round}>
            <div className={styles.roundHeader}>
              <span className={styles.roundNumber}>Round {index + 1}</span>
              <span
                className={`${styles.roundWinner} ${
                  round.winning_team === "Red"
                    ? styles.redTeam
                    : styles.blueTeam
                }`}
              >
                {round.winning_team === "Red" ? "Vermelho" : "Azul"} venceu
              </span>
              <span className={styles.roundType}>{round.end_type}</span>
            </div>
            {round.bomb_planted &&
              round.plant_events?.planted_by?.display_name && (
                <div className={styles.bombInfo}>
                  <span>
                    💣 Bomba plantada por{" "}
                    {round.plant_events.planted_by.display_name}
                  </span>
                </div>
              )}
            {round.bomb_defused &&
              round.defuse_events?.defused_by?.display_name && (
                <div className={styles.bombInfo}>
                  <span>
                    ✂️ Bomba defusada por{" "}
                    {round.defuse_events.defused_by.display_name}
                  </span>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
