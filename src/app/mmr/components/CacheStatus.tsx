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
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all"
        >
          <span>↻</span> Atualizar
        </button>
      ) : (
        <button
          onClick={onClearCache}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 transition-all"
        >
          Limpar cache
        </button>
      )}
    </div>
  );
};
