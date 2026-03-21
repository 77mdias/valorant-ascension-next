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
    <div className="w-full overflow-hidden rounded-xl border border-border/60 bg-card/80 text-foreground">

      {/* Top accent bar */}
      <div className="flex h-[3px]">
        <div className="flex-1 bg-emerald-400/70" />
        <div className="flex-1 bg-rose-400/70" />
      </div>

      {/* ── MOBILE (< md) ── */}
      <div className="md:hidden">
        {/* Top bar: Back | Map+Mode | Copy */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <button
            onClick={handleClose}
            className="flex h-8 items-center gap-1 rounded-lg border border-border/60 px-3 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            ← Voltar
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-foreground">{mapName}</span>
            <span className="rounded border border-border/60 bg-background/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              {modeName}
            </span>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-all hover:opacity-90"
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
          <div className="text-6xl font-black leading-none tracking-tighter tabular-nums text-foreground">
            {redTeamScore}
            <span className="mx-2 text-4xl text-muted-foreground">:</span>
            {blueTeamScore}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Time B</span>
        </div>

        {/* Meta chips */}
        <div className="flex items-center justify-center gap-2 pb-4 px-4 flex-wrap">
          <span className="rounded-lg border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
            {dateStr}
          </span>
          <span className="rounded-lg border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
            Duração: {duration}
          </span>
          <button
            onClick={handleOpenNewTab}
            className="rounded-lg border border-primary/30 bg-background/70 px-2.5 py-1 text-[11px] text-primary/80 transition-colors hover:text-primary"
          >
            Raw ↗
          </button>
        </div>
      </div>

      {/* ── DESKTOP (≥ md) ── */}
      <div className="hidden md:block py-10 px-6 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Map & Mode</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black tracking-tighter text-foreground">{mapName}</h2>
              <span className="rounded border border-border/60 bg-background/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {modeName}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Final Score</p>
            <div className="flex items-center gap-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Team A</span>
              <span className="text-5xl font-black tracking-tighter tabular-nums text-foreground">
                {redTeamScore} <span className="text-muted-foreground">:</span> {blueTeamScore}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Team B</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="h-10 rounded-lg border border-border/60 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              onClick={handleClose}
            >
              Back
            </button>
            <button
              className="h-10 rounded-lg bg-primary px-4 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-sm transition-all hover:opacity-90"
              onClick={handleCopyLink}
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 border-t border-border/60 pt-8 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</p>
            <p className="text-sm font-bold text-foreground">{dateStr}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration</p>
            <p className="text-sm font-bold text-foreground">{duration}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Patch</p>
            <p className="text-sm font-bold text-foreground">{patch}</p>
          </div>
          <div className="space-y-1">
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
            >
              View raw data ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
