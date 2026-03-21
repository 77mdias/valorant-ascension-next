/**
 * PlayerRow component — mobile-first
 * Mobile: compact card with expandable stats. Desktop: full horizontal table row.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import type { Player } from "../../types/match.types";

interface PlayerRowProps {
  player: Player;
  index: number;
  onPlayerClick: (name: string, tag: string) => void;
  calculatePlayerStats: (player: Player) => {
    kd: string;
    kdDiff: number;
    hsPercentage: number;
    adr: number;
    acs: number;
  };
  fkAndFD: Record<string, { fk: number; fd: number }>;
  mk: Record<string, number>;
  showAllColumns?: boolean;
  winnerTeamId?: "Red" | "Blue";
  isSearchedPlayer?: boolean;
}

function getRankImageUrl(tierId: number): string {
  return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${tierId}/smallicon.png`;
}

function StatCell({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] uppercase tracking-wider leading-none text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold leading-none tabular-nums ${highlight ? "text-foreground" : "text-muted-foreground"}`}>{value}</span>
    </div>
  );
}

export default function PlayerRow({
  player,
  index,
  onPlayerClick,
  calculatePlayerStats,
  fkAndFD,
  mk,
  showAllColumns = true,
  winnerTeamId,
  isSearchedPlayer = false,
}: PlayerRowProps) {
  const [expanded, setExpanded] = useState(false);
  const stats = calculatePlayerStats(player);
  const playerFK = fkAndFD[player.puuid]?.fk || 0;
  const playerFD = fkAndFD[player.puuid]?.fd || 0;
  const playerMK = mk[player.puuid] || 0;

  const isWinner = winnerTeamId ? player.team_id === winnerTeamId : false;

  const winBg = "bg-emerald-500/5 hover:bg-emerald-500/10";
  const lossBg = "bg-rose-500/5 hover:bg-rose-500/10";
  const defaultBg = index % 2 === 0 ? "bg-background/40" : "bg-transparent";
  const hoverBg = "hover:bg-muted/40";

  const resultBg = winnerTeamId
    ? isWinner ? winBg : lossBg
    : `${defaultBg} ${hoverBg}`;

  const agentUrl = `https://media.valorant-api.com/agents/${player.agent.id}/displayicon.png`;
  const rankUrl = getRankImageUrl(player.tier.id);

  return (
    <>
      {/* ── MOBILE CARD (< md) ── */}
      <div className={`md:hidden border-b border-border/50 transition-colors duration-200 ${resultBg} ${isSearchedPlayer ? "border-l-[3px] border-l-primary bg-primary/10" : ""}`}>
        <div
          className="flex items-center gap-3 px-2 py-2 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Agent image */}
          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-border/60 bg-background/70">
            <Image
              src={agentUrl}
              alt={player.agent.name}
              width={44}
              height={44}
              className="object-cover"
            />
          </div>

          {/* Player info */}
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-semibold leading-tight text-foreground">
              {player.name}
              <span className="ml-0.5 text-xs font-normal text-muted-foreground">#{player.tag}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Image src={rankUrl} alt={player.tier.name} width={12} height={12} />
              <span className="truncate">{player.tier.name}</span>
              {player.account_level && (
                <>
                  <span className="text-border">·</span>
                  <span>LVL {player.account_level}</span>
                </>
              )}
            </div>
          </div>

          {/* Stats + Chevron */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center">
              <span className="text-emerald-400 text-xs font-bold w-6 text-center tabular-nums">{player.stats.kills}</span>
              <span className="text-[10px] text-border">/</span>
              <span className="text-rose-400 text-xs font-bold w-6 text-center tabular-nums">{player.stats.deaths}</span>
              <span className="text-[10px] text-border">/</span>
              <span className="w-6 text-center text-xs font-semibold tabular-nums text-muted-foreground">{player.stats.assists}</span>
            </div>
            <div className="flex flex-col items-center min-w-[32px]">
              <span className="text-[9px] leading-none text-muted-foreground">ACS</span>
              <span className={`text-xs font-bold leading-tight tabular-nums ${stats.acs >= 200 ? "text-primary" : "text-muted-foreground"}`}>{stats.acs}</span>
            </div>
            <svg
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Stats */}
        {expanded && (
          <div className="px-3 pb-3 pt-1">
            <div className="grid grid-cols-4 gap-x-2 gap-y-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2.5">
              <StatCell label="Score" value={player.stats.score} highlight />
              <StatCell label="K/D" value={stats.kd} highlight={parseFloat(stats.kd) >= 1} />
              <StatCell
                label="+/-"
                value={`${stats.kdDiff >= 0 ? "+" : ""}${stats.kdDiff}`}
              />
              <StatCell label="ADR" value={stats.adr} highlight={stats.adr >= 150} />
              <StatCell label="HS%" value={`${stats.hsPercentage}%`} />
              <StatCell label="FK" value={playerFK} />
              <StatCell label="FD" value={playerFD} />
              <StatCell label="MK" value={playerMK} />
            </div>
            <button
              className="mt-2 w-full py-1 text-center text-[11px] text-muted-foreground transition-colors hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onPlayerClick(player.name, player.tag);
              }}
            >
              Ver perfil do jogador →
            </button>
          </div>
        )}
      </div>

      {/* ── DESKTOP TABLE ROW (≥ md) ── */}
      <div
        className={`hidden items-stretch cursor-pointer border-b border-border/50 transition-colors duration-200 md:flex ${resultBg} ${isSearchedPlayer ? "border-l-[3px] border-l-primary bg-primary/10" : ""}`}
        onClick={() => onPlayerClick(player.name, player.tag)}
      >
        {/* Sticky Player Info Column */}
        <div className="sticky left-0 z-10 flex w-64 min-w-[16rem] items-center border-r border-border/50 bg-inherit p-3 backdrop-blur-md">
          <div className="flex items-center gap-3 w-full">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-background/70">
              <Image
                src={agentUrl}
                alt={player.agent.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">
                {player.name}
                <span className="ml-0.5 font-normal text-muted-foreground">#{player.tag}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Image src={rankUrl} alt={player.tier.name} width={12} height={12} />
                <span className="truncate">{player.tier.name}</span>
                {player.account_level && (
                  <>
                    <span className="text-border">•</span>
                    <span>LVL {player.account_level}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rank Badge */}
        <div className="flex items-center justify-center p-3 w-24 min-w-[6rem]">
          <Image src={rankUrl} alt={player.tier.name} width={28} height={28} className="opacity-80" />
        </div>

        {/* Score */}
        <div className="flex w-24 min-w-[6rem] items-center justify-center p-3 font-medium text-foreground">
          {player.stats.score}
        </div>

        {/* ACS */}
        <div className="flex w-24 min-w-[6rem] items-center justify-center p-3 text-muted-foreground">
          {stats.acs}
        </div>

        {/* Kills */}
        <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 font-semibold text-foreground">
          {player.stats.kills}
        </div>

        {/* Deaths */}
        <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-muted-foreground">
          {player.stats.deaths}
        </div>

        {/* Assists */}
        <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-muted-foreground">
          {player.stats.assists}
        </div>

        {/* K/D Diff */}
        <div className={`flex items-center justify-center p-3 w-16 min-w-[4rem] font-medium ${stats.kdDiff >= 0 ? "text-emerald-400/80" : "text-rose-400/80"}`}>
          {stats.kdDiff >= 0 ? "+" : ""}{stats.kdDiff}
        </div>

        {/* K/D Ratio */}
        <div className={`flex w-20 min-w-[5rem] items-center justify-center p-3 font-medium ${parseFloat(stats.kd) >= 1 ? "text-emerald-400/80" : "text-muted-foreground"}`}>
          {stats.kd}
        </div>

        {/* ADR */}
        <div className={`flex w-20 min-w-[5rem] items-center justify-center p-3 ${stats.adr >= 150 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
          {stats.adr}
        </div>

        {/* HS% */}
        <div className="flex w-20 min-w-[5rem] items-center justify-center p-3 text-sm text-muted-foreground">
          {stats.hsPercentage}%
        </div>

        {showAllColumns && (
          <>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-sm text-muted-foreground">{playerFK}</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-sm text-muted-foreground">{playerFD}</div>
            <div className="flex w-16 min-w-[4rem] items-center justify-center p-3 text-sm text-muted-foreground">{playerMK}</div>
          </>
        )}
      </div>
    </>
  );
}
