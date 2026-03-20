/**
 * SortControls component - Minimalist Style
 * Controls for sorting scoreboard using TailwindCSS
 */

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
    <div className="flex flex-col gap-3 p-3 sm:p-5 rounded-xl bg-zinc-950/40 border border-zinc-800/50 backdrop-blur-sm">
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Ordenação</p>
        <p className="text-xs text-zinc-400 mt-1 hidden sm:block">Reordene sem perder o foco.</p>
      </div>

      <div className="flex gap-2">
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortField)}
          className="flex-1 bg-zinc-900/60 border border-zinc-800/50 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-700/50 transition-all cursor-pointer appearance-none"
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
          className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700/50 transition-all text-sm shadow-lg"
          aria-label={sortOrder === "desc" ? "Ordenar crescente" : "Ordenar decrescente"}
        >
          {sortOrder === "desc" ? "↓" : "↑"}
        </button>
      </div>
    </div>
  );
}
