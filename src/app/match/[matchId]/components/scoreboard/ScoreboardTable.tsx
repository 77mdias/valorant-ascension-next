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
    <div className="mb-8 w-full overflow-hidden rounded-xl border border-border/60 bg-card/70 shadow-2xl">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex flex-col min-w-full md:w-fit">
          {/* Header Row — desktop only */}
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
