import { formatSeconds } from "@/lib/time";
import { cn } from "@/lib/utils";

interface TimestampListProps {
  timestamps: Array<{ id: string; time: number; label: string }>;
  activeId?: string | null;
  onSeek?: (time: number) => void;
}

const TimestampList = ({ timestamps, activeId, onSeek }: TimestampListProps) => {
  if (!timestamps.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-card/60 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Timestamps
          </p>
          <h3 className="text-xl font-bold text-foreground">
            Pontos importantes do vídeo
          </h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
          {timestamps.length} ponto{timestamps.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {timestamps.map((timestamp) => {
          const isActive = timestamp.id === activeId;
          return (
            <button
              key={timestamp.id}
              type="button"
              onClick={() => onSeek?.(timestamp.time)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                isActive
                  ? "border-primary/80 bg-primary/10 text-foreground"
                  : "border-white/5 bg-background/40 text-muted-foreground hover:border-primary/60 hover:text-foreground",
              )}
            >
              <span className="font-mono text-base text-primary">
                {formatSeconds(timestamp.time)}
              </span>
              <span className="font-medium">{timestamp.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimestampList;
