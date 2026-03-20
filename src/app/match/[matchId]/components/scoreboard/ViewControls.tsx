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
    <div className="flex flex-col gap-3 p-3 sm:p-5 rounded-xl bg-zinc-950/40 border border-zinc-800/50 backdrop-blur-sm">
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Visualização</p>
        <p className="text-xs text-zinc-400 mt-1 hidden sm:block">Altere entre visão geral ou por times.</p>
      </div>

      <div className="flex gap-0 border-b border-[#1a2030]">
        <button
          className={`flex-1 flex items-center justify-center px-4 py-2 border-b-2 transition-all duration-200 text-xs font-medium ${
            tableView === "total"
              ? "border-[#ec176b] -mb-px text-white font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
          onClick={() => onViewChange("total")}
        >
          <span>Geral</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-4 py-2 border-b-2 transition-all duration-200 text-xs font-medium ${
            tableView === "teams"
              ? "border-[#ec176b] -mb-px text-white font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
          onClick={() => onViewChange("teams")}
        >
          <span>Times</span>
        </button>
      </div>
    </div>
  );
}
