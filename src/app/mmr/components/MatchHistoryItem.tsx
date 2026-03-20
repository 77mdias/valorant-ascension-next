"use client";

import React from "react";
import Image from "next/image";
import { MatchData, PlayerData } from "../types";

interface MatchHistoryItemProps {
  match: MatchData;
  playerData: PlayerData;
  region: string;
}

export const MatchHistoryItem: React.FC<MatchHistoryItemProps> = ({
  match,
  playerData,
  region,
}) => {
  const isWin = match.result === "win";
  const isLoss = match.result === "loss";

  const calculateADR = (damage: number, rounds: number): number => {
    return Math.round(damage / Math.max(rounds, 1));
  };

  const calculateACS = (damage: number, kills: number, rounds: number): number => {
    const damagePerRound = damage / Math.max(rounds, 1);
    const killScore = (50 * kills) / Math.max(rounds, 1);
    return Math.round(damagePerRound + killScore);
  };

  const handleMatchClick = () => {
    const playerName = `${playerData.name}#${playerData.tag}`;
    window.location.href = `/match/${match.id}?region=${region}&player=${encodeURIComponent(playerName)}`;
  };

  return (
    <div
      onClick={handleMatchClick}
      className={`group relative flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
        isWin
          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
          : isLoss
            ? "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
            : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
      }`}
    >
      {/* Result indicator side-bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-all ${
          isWin ? "bg-emerald-500" : isLoss ? "bg-rose-500" : "bg-gray-400"
        }`}
      />

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative shrink-0">
          <Image
            src={`/agents/${match.agent.toLowerCase().replace(" ", "-").replace("/", "-")}.png`}
            alt={match.agent}
            width={48}
            height={48}
            className="rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
        <div className="flex flex-col min-w-[100px]">
          <span className="font-bold text-lg leading-tight text-zinc-100">{match.map}</span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {match.mode}
          </span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between md:justify-around w-full gap-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Score</span>
          <span className={`text-lg font-black tracking-tighter ${isWin ? "text-emerald-400" : isLoss ? "text-rose-400" : "text-zinc-500"}`}>
            {match.score}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">K/D/A</span>
          <span className="font-bold whitespace-nowrap">
            {match.kills} / <span className="text-zinc-500">{match.deaths}</span> / {match.assists}
          </span>
        </div>

        <div className="hidden sm:flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">HS%</span>
          <span className="font-bold">
            {((match.headshots / Math.max(match.kills, 1)) * 100).toFixed(0)}%
          </span>
        </div>

        <div className="hidden lg:flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">ADR</span>
          <span className="font-bold">
            {calculateADR(match.damage, match.rounds_played)}
          </span>
        </div>

        <div className="hidden lg:flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">ACS</span>
          <span className="font-bold">
            {calculateACS(match.damage, match.kills, match.rounds_played)}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Date</span>
          <span className="text-sm font-medium text-zinc-500">
            {match.date.toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
};
