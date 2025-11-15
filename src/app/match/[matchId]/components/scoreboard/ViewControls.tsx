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
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewButton} ${tableView === "total" ? styles.active : ""}`}
          onClick={() => onViewChange("total")}
        >
          <span className={styles.viewIcon}>📊</span>
          Scoreboard Geral
        </button>
        <button
          className={`${styles.viewButton} ${tableView === "teams" ? styles.active : ""}`}
          onClick={() => onViewChange("teams")}
        >
          <span className={styles.viewIcon}>🏆</span>
          Por Times
        </button>
      </div>
    </div>
  );
}
