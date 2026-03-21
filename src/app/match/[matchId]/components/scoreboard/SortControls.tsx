/**
 * SortControls component - Minimalist Style
 * Controls for sorting scoreboard using TailwindCSS
 */

import { ArrowDown } from "lucide-react";
import type { SortField, SortOrder } from "../../types/match.types";

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
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/70 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ordenação</p>
        <p className="mt-1 hidden text-xs text-muted-foreground sm:block">Reordene sem perder o foco.</p>
      </div>

      <div className="flex gap-2">
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortField)}
          className="flex-1 cursor-pointer appearance-none rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs text-foreground outline-none transition-all focus:ring-1 focus:ring-primary/30"
        >
          <option value="score">Score (ACS)</option>
          <option value="kills">Kills</option>
          <option value="deaths">Deaths</option>
          <option value="assists">Assists</option>
          <option value="kd">K/D Ratio</option>
          <option value="hs">HS%</option>
          <option value="adr">ADR</option>
        </select>
        
        <button
          onClick={onToggleSortOrder}
          className="flex h-9 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted text-foreground shadow-lg transition-all hover:bg-muted/80"
          aria-label={sortOrder === "desc" ? "Ordenar crescente" : "Ordenar decrescente"}
        >
          <ArrowDown
            className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "" : "rotate-180"}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
