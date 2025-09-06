// src/utils/matchCalculations.ts

interface Kill {
  round: number;
  time_in_round_in_ms: number;
  killer: {
    puuid: string;
  };
  victim: {
    puuid: string;
  };
}

export const calculateFKandFD = (kills: Kill[]) => {
  // Agrupa as kills por round
  // RECORD é necessário porque o typescript não permite que o objeto seja vazio
  const killsByRound = kills.reduce(
    (acc, kill) => {
      if (!acc[kill.round]) acc[kill.round] = [];
      acc[kill.round].push(kill);
      return acc;
    },
    {} as Record<number, Kill[]>,
  );

  // Armazena quem fez a primeira kill e quem morreu primeiro em cada round
  // RECORD é necessário porque o typescript não permite que o objeto seja vazio
  const fkPerRound: Record<number, string> = {};
  const fdPerRound: Record<number, string> = {};

  for (const round in killsByRound) {
    const roundKills = killsByRound[round];
    // Ordena pela ordem cronológica
    const firstKill = roundKills.sort(
      (a, b) => a.time_in_round_in_ms - b.time_in_round_in_ms,
    )[0];

    fkPerRound[round] = firstKill.killer.puuid;
    fdPerRound[round] = firstKill.victim.puuid;
  }

  // Conta FK e FD por jogador // RECORD é necessário porque o typescript não permite que o objeto seja vazio
  const fkCount: Record<string, number> = {};
  const fdCount: Record<string, number> = {};

  Object.values(fkPerRound).forEach((puuid) => {
    fkCount[puuid] = (fkCount[puuid] || 0) + 1;
  });

  Object.values(fdPerRound).forEach((puuid) => {
    fdCount[puuid] = (fdCount[puuid] || 0) + 1;
  });

  return { fkCount, fdCount, fkPerRound, fdPerRound };
};

// MULTIKILLS = 2 OU MAIS DURANTE 3 SEGUNDOS
export const calculateMK = (kills: Kill[]) => {
  const killsByPlayerAndRound = kills.reduce(
    (acc, kill) => {
      const key = `${kill.killer.puuid}-${kill.round}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(kill);
      return acc;
    },
    {} as Record<string, Kill[]>,
  );

  const MULTI_KILL_WINDOW_MS = 3000; // 3 segundos

  const multiKills: Record<string, number> = {};

  for (const key in killsByPlayerAndRound) {
    const playerKills = killsByPlayerAndRound[key].sort(
      (a, b) => a.time_in_round_in_ms - b.time_in_round_in_ms,
    );

    let currentStreak = 1;
    let lastTime = playerKills[0].time_in_round_in_ms;

    for (let i = 1; i < playerKills.length; i++) {
      const currentTime = playerKills[i].time_in_round_in_ms;
      if (currentTime - lastTime <= MULTI_KILL_WINDOW_MS) {
        currentStreak++;
      } else {
        // Reinicia a sequência
        if (currentStreak >= 2) {
          multiKills[playerKills[i - 1].killer.puuid] =
            (multiKills[playerKills[i - 1].killer.puuid] || 0) + 1;
        }
        currentStreak = 1;
      }
      lastTime = currentTime;
    }

    // Verifica no final
    if (currentStreak >= 2) {
      const puuid = playerKills[0].killer.puuid;
      multiKills[puuid] = (multiKills[puuid] || 0) + 1;
    }
  }

  return multiKills;
};
