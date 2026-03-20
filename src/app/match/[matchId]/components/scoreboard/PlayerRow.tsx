/**
 * PlayerRow component — mobile-first
 * Mobile: compact card. Desktop: full horizontal table row.
 */

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
  const stats = calculatePlayerStats(player);
  const playerFK = fkAndFD[player.puuid]?.fk || 0;
  const playerFD = fkAndFD[player.puuid]?.fd || 0;
  const playerMK = mk[player.puuid] || 0;

  const isWinner = winnerTeamId ? player.team_id === winnerTeamId : false;

  const winBg = "bg-emerald-500/5 hover:bg-emerald-500/10";
  const lossBg = "bg-rose-500/5 hover:bg-rose-500/10";
  const defaultBg = index % 2 === 0 ? "bg-zinc-900/20" : "bg-transparent";
  const hoverBg = "hover:bg-zinc-800/40";

  const resultBg = winnerTeamId
    ? isWinner ? winBg : lossBg
    : `${defaultBg} ${hoverBg}`;

  const agentUrl = `https://media.valorant-api.com/agents/${player.agent.id}/displayicon.png`;
  const rankUrl = getRankImageUrl(player.tier.id);

  return (
    <>
      {/* ── MOBILE CARD (< md) ── */}
      <div
        className={`md:hidden flex items-center gap-3 px-2 py-2 cursor-pointer border-b border-zinc-800/50 transition-colors duration-200 ${resultBg} ${isSearchedPlayer ? "border-l-[3px] border-l-[#ec176b] bg-[rgba(236,23,107,0.04)]" : ""}`}
        onClick={() => onPlayerClick(player.name, player.tag)}
      >
        {/* Agent image */}
        <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700/40">
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
          <div className="font-semibold text-zinc-100 text-sm truncate leading-tight">
            {player.name}
            <span className="text-zinc-500 font-normal text-xs ml-0.5">#{player.tag}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
            <Image src={rankUrl} alt={player.tier.name} width={12} height={12} />
            <span className="truncate">{player.tier.name}</span>
            {player.account_level && (
              <>
                <span className="text-zinc-700">·</span>
                <span>LVL {player.account_level}</span>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center">
            <span className="text-emerald-400 text-xs font-bold w-6 text-center tabular-nums">{player.stats.kills}</span>
            <span className="text-zinc-700 text-[10px]">/</span>
            <span className="text-rose-400 text-xs font-bold w-6 text-center tabular-nums">{player.stats.deaths}</span>
            <span className="text-zinc-700 text-[10px]">/</span>
            <span className="text-zinc-400 text-xs font-semibold w-6 text-center tabular-nums">{player.stats.assists}</span>
          </div>
          <div className="flex flex-col items-center min-w-[32px]">
            <span className="text-[9px] text-zinc-600 leading-none">ACS</span>
            <span className={`text-xs font-bold leading-tight tabular-nums ${stats.acs >= 200 ? "text-[#ec176b]" : "text-zinc-400"}`}>{stats.acs}</span>
          </div>
        </div>
      </div>

      {/* ── DESKTOP TABLE ROW (≥ md) ── */}
      <div
        className={`hidden md:flex items-stretch cursor-pointer transition-colors duration-200 border-b border-zinc-800/50 ${resultBg} ${isSearchedPlayer ? "border-l-[3px] border-l-[#ec176b] bg-[rgba(236,23,107,0.04)]" : ""}`}
        onClick={() => onPlayerClick(player.name, player.tag)}
      >
        {/* Sticky Player Info Column */}
        <div className="flex items-center p-3 w-64 min-w-[16rem] sticky left-0 z-10 bg-inherit backdrop-blur-md border-r border-zinc-800/50">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-zinc-800">
              <Image
                src={agentUrl}
                alt={player.agent.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-semibold text-zinc-100 text-sm truncate">
                {player.name}
                <span className="text-zinc-500 font-normal ml-0.5">#{player.tag}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <Image src={rankUrl} alt={player.tier.name} width={12} height={12} />
                <span className="truncate">{player.tier.name}</span>
                {player.account_level && (
                  <>
                    <span className="text-zinc-600">•</span>
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
        <div className="flex items-center justify-center p-3 w-24 min-w-[6rem] font-medium text-zinc-300">
          {player.stats.score}
        </div>

        {/* ACS */}
        <div className="flex items-center justify-center p-3 w-24 min-w-[6rem] text-zinc-400">
          {stats.acs}
        </div>

        {/* Kills */}
        <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] font-semibold text-zinc-200">
          {player.stats.kills}
        </div>

        {/* Deaths */}
        <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] text-zinc-400">
          {player.stats.deaths}
        </div>

        {/* Assists */}
        <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] text-zinc-400">
          {player.stats.assists}
        </div>

        {/* K/D Diff */}
        <div className={`flex items-center justify-center p-3 w-16 min-w-[4rem] font-medium ${stats.kdDiff >= 0 ? "text-emerald-400/80" : "text-rose-400/80"}`}>
          {stats.kdDiff >= 0 ? "+" : ""}{stats.kdDiff}
        </div>

        {/* K/D Ratio */}
        <div className={`flex items-center justify-center p-3 w-20 min-w-[5rem] font-medium ${parseFloat(stats.kd) >= 1 ? "text-emerald-400/80" : "text-zinc-400"}`}>
          {stats.kd}
        </div>

        {/* ADR */}
        <div className={`flex items-center justify-center p-3 w-20 min-w-[5rem] ${stats.adr >= 150 ? "text-zinc-200 font-medium" : "text-zinc-400"}`}>
          {stats.adr}
        </div>

        {/* HS% */}
        <div className="flex items-center justify-center p-3 w-20 min-w-[5rem] text-zinc-400 text-sm">
          {stats.hsPercentage}%
        </div>

        {showAllColumns && (
          <>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] text-zinc-400 text-sm">{playerFK}</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] text-zinc-400 text-sm">{playerFD}</div>
            <div className="flex items-center justify-center p-3 w-16 min-w-[4rem] text-zinc-400 text-sm">{playerMK}</div>
          </>
        )}
      </div>
    </>
  );
}
