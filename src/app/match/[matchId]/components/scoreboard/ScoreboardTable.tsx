/**
 * ScoreboardTable component - Minimalist Style
 * Flexbox-based scoreboard with sticky columns using TailwindCSS
 */

import PlayerRow from "./PlayerRow";
import type { Player } from "../../types/match.types";

interface ScoreboardTableProps {
  players: Player[];
  onPlayerClick: (name: string, tag: string) => void;
  calculatePlayerStats: (player: Player) => any;
  fkAndFD: Record<string, { fk: number; fd: number }>;
  mk: Record<string, number>;
  winnerTeamId: "Red" | "Blue";
  searchedPlayerPuuid?: string;
}

export default function ScoreboardTable({
  players,
  onPlayerClick,
  calculatePlayerStats,
  fkAndFD,
  mk,
  winnerTeamId,
  searchedPlayerPuuid,
}: ScoreboardTableProps) {
  return (
    <div className="w-full bg-zinc-950/40 rounded-xl overflow-hidden border border-zinc-800/50 shadow-2xl mb-8">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="flex flex-col min-w-full md:w-fit">
          {/* Header Row — desktop only */}
          <div className="hidden md:flex items-stretch bg-zinc-900/50 border-b border-zinc-800">
            <div className="flex items-center p-3 w-64 min-w-[16rem] sticky left-0 z-20 bg-zinc-900 backdrop-blur-md border-r border-zinc-800 font-bold text-[10px] uppercase tracking-wider text-zinc-500">
              Player
            </div>
            <div className="flex items-center justify-center p-3 w-24 min-w-[6rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">Rank</div>
            <div className="flex items-center justify-center p-3 w-24 min-w-[6rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">Score</div>
            <div className="flex items-center justify-center p-3 w-24 min-w-[6rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">ACS</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">K</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">D</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">A</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">+/-</div>
            <div className="flex items-center justify-center p-3 w-20 min-w-[5rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">K/D</div>
            <div className="flex items-center justify-center p-3 w-20 min-w-[5rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">ADR</div>
            <div className="flex items-center justify-center p-3 w-20 min-w-[5rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">HS%</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">FK</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">FD</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-bold text-[10px] uppercase tracking-wider text-zinc-500">MK</div>
          </div>

          {/* Player Rows */}
          <div className="flex flex-col">
            {players.map((player, index) => (
              <PlayerRow
                key={player.puuid}
                player={player}
                index={index}
                onPlayerClick={onPlayerClick}
                calculatePlayerStats={calculatePlayerStats}
                fkAndFD={fkAndFD}
                mk={mk}
                showAllColumns={true}
                winnerTeamId={winnerTeamId}
                isSearchedPlayer={player.puuid === searchedPlayerPuuid}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
