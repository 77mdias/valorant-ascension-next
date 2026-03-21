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
    <div className="mb-8 w-full overflow-hidden rounded-xl border border-border/60 bg-card/70 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-border/60 bg-background/50 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3 md:gap-4">
          <h3 className="text-base font-bold tracking-tight text-foreground md:text-xl">{teamName}</h3>
          <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase ${
            won
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}>
            {won ? "Winner" : "Loser"}
          </div>
        </div>
        <div className="text-xl font-black italic text-foreground md:text-2xl">
          {teamScore} <span className="ml-1 text-xs font-medium not-italic uppercase tracking-tighter text-muted-foreground">rounds</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex flex-col min-w-full md:w-fit">
          {/* Column Header Row — desktop only */}
          <div className="hidden items-stretch border-b border-border/60 bg-background/60 md:flex">
            <div className="sticky left-0 z-20 flex w-64 min-w-[16rem] items-center border-r border-border/60 bg-background/80 p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
              Player
            </div>
            <div className="flex w-24 min-w-[6rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rank</div>
            <div className="flex w-24 min-w-[6rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Score</div>
            <div className="flex w-24 min-w-[6rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ACS</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">K</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">D</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">A</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">+/-</div>
            <div className="flex w-20 min-w-[5rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">K/D</div>
            <div className="flex w-20 min-w-[5rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ADR</div>
            <div className="flex w-20 min-w-[5rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">HS%</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">FK</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">FD</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">MK</div>
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
