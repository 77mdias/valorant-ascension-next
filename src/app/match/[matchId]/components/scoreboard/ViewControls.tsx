/**
 * ViewControls component - Minimalist Style
 * Toggle between total scoreboard and team-separated view using TailwindCSS
 */

import type { TableView } from "../../types/match.types";

interface ViewControlsProps {
  tableView: TableView;
  onViewChange: (view: TableView) => void;
}

export default function ViewControls({
  tableView,
  onViewChange,
}: ViewControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/70 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Visualização</p>
        <p className="mt-1 hidden text-xs text-muted-foreground sm:block">Altere entre visão geral ou por times.</p>
      </div>

      <div className="flex gap-0 border-b border-border/60">
        <button
          className={`flex-1 flex items-center justify-center px-4 py-2 border-b-2 transition-all duration-200 text-xs font-medium ${
            tableView === "total"
              ? "-mb-px border-primary text-foreground font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onViewChange("total")}
        >
          <span>Geral</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-4 py-2 border-b-2 transition-all duration-200 text-xs font-medium ${
            tableView === "teams"
              ? "-mb-px border-primary text-foreground font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onViewChange("teams")}
        >
          <span>Times</span>
        </button>
      </div>
    </div>
  );
}
