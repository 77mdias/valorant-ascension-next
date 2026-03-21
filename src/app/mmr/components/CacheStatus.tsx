"use client";

import React from "react";

interface CacheStatusProps {
  dataFromCache: boolean;
  onRefresh: () => void;
  onClearCache: () => void;
}

export const CacheStatus: React.FC<CacheStatusProps> = ({
  dataFromCache,
  onRefresh,
  onClearCache,
}) => {
  return (
    <div className="flex items-center gap-2">
      {dataFromCache ? (
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/25"
        >
          <span>↻</span> Atualizar
        </button>
      ) : (
        <button
          onClick={onClearCache}
          className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
        >
          Limpar cache
        </button>
      )}
    </div>
  );
};
