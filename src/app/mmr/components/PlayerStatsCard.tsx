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
    <div className="w-full flex flex-col md:flex-row gap-8 items-start md:items-center py-10 px-6 bg-zinc-950/40 border border-zinc-800/50 rounded-2xl shadow-sm">
      <div className="relative group shrink-0">
        <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <Image
          src={playerData.cardImage}
          alt="Player Card"
          width={180}
          height={180}
          className="rounded-xl object-cover shadow-lg border border-zinc-700"
        />
        <div className="absolute -bottom-3 -right-3 bg-zinc-100 text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-20">
          LVL {playerData.level}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-4">
        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight break-words">
            <span className="text-white">{playerData.name}</span>
            <span className="text-zinc-500 font-medium ml-1 text-xl sm:text-2xl">#{playerData.tag}</span>
          </h2>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
            <span className="uppercase tracking-wider">{region}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>Updated {playerData.lastUpdate.toLocaleDateString("pt-BR")}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-10 pt-2 border-t border-zinc-800/50">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Rank</p>
            <p className="text-xl font-bold">{playerData.rank}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Elo</p>
            <p className="text-xl font-bold">{playerData.elo}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Level</p>
            <p className="text-xl font-bold">{playerData.level}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 px-8 py-6 bg-zinc-900 rounded-2xl border border-zinc-800/50 min-w-[160px]">
        <Image
          src={playerData.rankImage}
          alt={playerData.rank}
          width={80}
          height={80}
          className="drop-shadow-xl"
        />
        <p className="text-xs font-bold uppercase text-gray-400 tracking-tighter">Current Rank</p>
      </div>
    </div>
  );
};
