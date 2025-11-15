/**
 * ViewControls component
 * Toggle between total scoreboard and team-separated view
 */

import type { TableView } from "../../types/match.types";
import styles from "./ViewControls.module.scss";

interface ViewControlsProps {
  tableView: TableView;
  onViewChange: (view: TableView) => void;
}

export default function ViewControls({
  tableView,
  onViewChange,
}: ViewControlsProps) {
  return (
    <div className={styles.viewControls}>
      <div className={styles.labelBlock}>
        <p className={styles.eyebrow}>Visualização</p>
        <p className={styles.helper}>
          Altere entre a visão geral consolidada ou separe por times.
        </p>
      </div>
      <div
        className={styles.viewToggle}
        role="group"
        aria-label="Seleção de visualização do placar"
      >
        <button
          className={`${styles.viewButton} ${tableView === "total" ? styles.active : ""}`}
          onClick={() => onViewChange("total")}
          aria-pressed={tableView === "total"}
        >
          <span className={styles.viewIcon}>📊</span>
          <span className={styles.buttonLabel}>
            Scoreboard Geral
            <small>Todos os jogadores juntos</small>
          </span>
        </button>
        <button
          className={`${styles.viewButton} ${tableView === "teams" ? styles.active : ""}`}
          onClick={() => onViewChange("teams")}
          aria-pressed={tableView === "teams"}
        >
          <span className={styles.viewIcon}>🏆</span>
          <span className={styles.buttonLabel}>
            Por Times
            <small>Comparação lado a lado</small>
          </span>
        </button>
      </div>
    </div>
  );
}
