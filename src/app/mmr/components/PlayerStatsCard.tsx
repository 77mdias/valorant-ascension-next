"use client";

import React from "react";
import Image from "next/image";
import { PlayerData } from "../types";

interface PlayerStatsCardProps {
  playerData: PlayerData;
  region: string;
}

export const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({
  playerData,
  region,
}) => {
  return (
    <div className="flex w-full flex-col items-start gap-8 rounded-2xl border border-border/60 bg-card/70 px-6 py-10 shadow-sm md:flex-row md:items-center">
      <div className="relative group shrink-0">
        <div className="absolute inset-0 z-10 rounded-xl bg-background/30 opacity-0 transition-opacity group-hover:opacity-100" />
        <Image
          src={playerData.cardImage}
          alt="Player Card"
          width={180}
          height={180}
          className="rounded-xl border border-border/70 object-cover shadow-lg"
        />
        <div className="absolute -bottom-3 -right-3 z-20 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md">
          LVL {playerData.level}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-4">
        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight break-words">
            <span className="text-foreground">{playerData.name}</span>
            <span className="ml-1 text-xl font-medium text-muted-foreground sm:text-2xl">#{playerData.tag}</span>
          </h2>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="uppercase tracking-wider">{region}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Updated {playerData.lastUpdate.toLocaleDateString("pt-BR")}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-10 border-t border-border/60 pt-2">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rank</p>
            <p className="text-xl font-bold">{playerData.rank}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Elo</p>
            <p className="text-xl font-bold">{playerData.elo}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Level</p>
            <p className="text-xl font-bold">{playerData.level}</p>
          </div>
        </div>
      </div>

      <div className="flex min-w-[160px] flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-8 py-6">
        <Image
          src={playerData.rankImage}
          alt={playerData.rank}
          width={80}
          height={80}
          className="drop-shadow-xl"
        />
        <p className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Current Rank</p>
      </div>
    </div>
  );
};
