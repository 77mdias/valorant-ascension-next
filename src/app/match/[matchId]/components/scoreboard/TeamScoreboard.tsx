/**
 * TeamScoreboard component - Minimalist Style
 * Flexbox-based team scoreboard using TailwindCSS
 */

import PlayerRow from "./PlayerRow";
import type { Player } from "../../types/match.types";

interface TeamScoreboardProps {
  team: "Red" | "Blue";
  teamName: string;
  players: Player[];
  teamScore: number;
  won: boolean;
  onPlayerClick: (name: string, tag: string) => void;
  calculatePlayerStats: (player: Player) => any;
  fkAndFD: Record<string, { fk: number; fd: number }>;
  mk: Record<string, number>;
  searchedPlayerPuuid?: string;
}

export default function TeamScoreboard({
  team,
  teamName,
  players,
  teamScore,
  won,
  onPlayerClick,
  calculatePlayerStats,
  fkAndFD,
  mk,
  searchedPlayerPuuid,
}: TeamScoreboardProps) {
  const winnerTeamId: "Red" | "Blue" = won ? team : (team === "Red" ? "Blue" : "Red");

  return (
    <div className="w-full bg-zinc-950/40 rounded-xl overflow-hidden border border-zinc-800/50 shadow-2xl mb-8 transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-zinc-900/30 border-b border-zinc-800/50">
        <div className="flex items-center gap-3 md:gap-4">
          <h3 className="text-base md:text-xl font-bold text-zinc-100 tracking-tight">{teamName}</h3>
          <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase ${
            won
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}>
            {won ? "Winner" : "Loser"}
          </div>
        </div>
        <div className="text-xl md:text-2xl font-black text-zinc-100 italic">
          {teamScore} <span className="text-xs not-italic font-medium text-zinc-500 ml-1 uppercase tracking-tighter">rounds</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="flex flex-col min-w-full md:w-fit">
          {/* Column Header Row — desktop only */}
          <div className="hidden md:flex items-stretch bg-zinc-900/50 border-b border-zinc-800/50">
            <div className="flex items-center p-3 w-64 min-w-[16rem] sticky left-0 z-20 bg-zinc-900 backdrop-blur-md border-r border-zinc-800/50 font-bold text-[10px] uppercase tracking-wider text-zinc-500">
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
