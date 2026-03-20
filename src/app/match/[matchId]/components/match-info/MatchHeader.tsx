/**
 * MatchHeader component — mobile-first
 * Mobile: compact 3-zone card (~150px). Desktop: full layout.
 */

import type { MatchDetails } from "../../types/match.types";

interface MatchHeaderProps {
  matchDetails: MatchDetails;
  redTeamScore: number;
  blueTeamScore: number;
  formatDate: (dateString: string) => string;
  formatDuration: (ms: number) => string;
  matchId: string;
}

export default function MatchHeader({
  matchDetails,
  redTeamScore,
  blueTeamScore,
  formatDate,
  formatDuration,
}: MatchHeaderProps) {
  const handleOpenNewTab = () => window.open(window.location.href, "_blank");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("Error copying link:", err);
    }
  };

  const handleClose = () => window.history.back();

  const mapName = matchDetails.metadata?.map?.name || "Unknown Map";
  const modeName = matchDetails.metadata?.queue?.name || "?";
  const dateStr = formatDate(matchDetails.metadata?.started_at || new Date().toISOString());
  const duration = formatDuration(matchDetails.metadata?.game_length_in_ms || 0);
  const patch = matchDetails.metadata?.game_version || "N/A";

  return (
    <div className="w-full bg-[#0d1117] border border-[#1a2030] rounded-xl overflow-hidden">

      {/* Top accent bar */}
      <div className="flex h-[3px]">
        <div className="flex-1 bg-emerald-400/70" />
        <div className="flex-1 bg-rose-400/70" />
      </div>

      {/* ── MOBILE (< md) ── */}
      <div className="md:hidden">
        {/* Top bar: Back | Map+Mode | Copy */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40">
          <button
            onClick={handleClose}
            className="h-8 px-3 flex items-center gap-1 border border-zinc-700 rounded-lg text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition-all"
          >
            ← Voltar
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white tracking-tight">{mapName}</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[9px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-800">
              {modeName}
            </span>
          </div>
          <button
            onClick={handleCopyLink}
            className="h-8 w-8 flex items-center justify-center bg-zinc-100 text-zinc-900 rounded-lg text-sm font-bold hover:bg-white transition-all"
            title="Copiar link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
        </div>

        {/* Score hero */}
        <div className="flex items-center justify-center gap-6 py-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Time A</span>
          <div className="text-6xl font-black tracking-tighter tabular-nums text-white leading-none">
            {redTeamScore}
            <span className="text-zinc-600 mx-2 text-4xl">:</span>
            {blueTeamScore}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Time B</span>
        </div>

        {/* Meta chips */}
        <div className="flex items-center justify-center gap-2 pb-4 px-4 flex-wrap">
          <span className="text-[11px] text-zinc-500 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/50">
            {dateStr}
          </span>
          <span className="text-[11px] text-zinc-500 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/50">
            Duração: {duration}
          </span>
          <button
            onClick={handleOpenNewTab}
            className="text-[11px] text-blue-400/70 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/50 hover:text-blue-400 transition-colors"
          >
            Raw ↗
          </button>
        </div>
      </div>

      {/* ── DESKTOP (≥ md) ── */}
      <div className="hidden md:block py-10 px-6 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Map & Mode</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black tracking-tighter text-white">{mapName}</h2>
              <span className="px-2 py-1 rounded bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-800">
                {modeName}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Final Score</p>
            <div className="flex items-center gap-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Team A</span>
              <span className="text-5xl font-black tracking-tighter tabular-nums text-white">
                {redTeamScore} <span className="text-zinc-600">:</span> {blueTeamScore}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Team B</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="h-10 px-4 rounded-lg text-xs font-bold uppercase tracking-widest border border-zinc-700 hover:bg-zinc-800 transition-all text-zinc-200"
              onClick={handleClose}
            >
              Back
            </button>
            <button
              className="h-10 px-4 rounded-lg text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-900 hover:bg-white transition-all shadow-sm"
              onClick={handleCopyLink}
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-8 border-t border-zinc-800/50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</p>
            <p className="font-bold text-sm text-zinc-200">{dateStr}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Duration</p>
            <p className="font-bold text-sm text-zinc-200">{duration}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Patch</p>
            <p className="font-bold text-sm text-zinc-200">{patch}</p>
          </div>
          <div className="space-y-1">
            <button
              onClick={handleOpenNewTab}
              className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:underline flex items-center gap-1"
            >
              View raw data ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
