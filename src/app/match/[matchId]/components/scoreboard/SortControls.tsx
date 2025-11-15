/**
 * SortControls component
 * Controls for sorting scoreboard by different fields
 */

import type { SortField, SortOrder } from "../../types/match.types";
import styles from "./SortControls.module.scss";

interface SortControlsProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortByChange: (field: SortField) => void;
  onToggleSortOrder: () => void;
}

export default function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onToggleSortOrder,
}: SortControlsProps) {
  return (
    <div className={styles.sortControls}>
      <div className={styles.sortGroup}>
        <label>Ordenar por:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortField)}
          className={styles.sortSelect}
        >
          <option value="score">Score</option>
          <option value="kills">Kills</option>
          <option value="deaths">Deaths</option>
          <option value="assists">Assists</option>
          <option value="kd">K/D</option>
          <option value="hs">HS%</option>
          <option value="adr">ADR</option>
        </select>
        <button onClick={onToggleSortOrder} className={styles.sortButton}>
          {sortOrder === "desc" ? "↓" : "↑"}
        </button>
      </div>
    </div>
  );
}
