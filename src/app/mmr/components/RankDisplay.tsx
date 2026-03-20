"use client";

import React from "react";
import Image from "next/image";

interface RankDisplayProps {
  rank: string;
  elo: number;
  rankImage: string;
}

export const RankDisplay: React.FC<RankDisplayProps> = ({
  rank,
  elo,
  rankImage,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-neutral-900 shadow-sm">
      <div className="relative w-24 h-24 mb-4">
        <Image
          src={rankImage}
          alt={rank}
          fill
          className="object-contain drop-shadow-xl"
        />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-center">{rank}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Elo</span>
        <span className="text-lg font-black">{elo}</span>
      </div>
    </div>
  );
};
