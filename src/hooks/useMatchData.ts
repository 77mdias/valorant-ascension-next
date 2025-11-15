// src/hooks/useMatchStats.ts
import { useMemo } from "react";
import { Kill, MatchResponse, PlayerExtendedStats } from "../types/matchTypes";

export const useMatchStats = (matchData: MatchResponse | null) => {
  return useMemo(() => {
    if (!matchData || !matchData.data) {
      return null; // ou retornar um estado padrão
    }

    const { data } = matchData;
    const { kills, players, metadata } = data;

    const totalRounds = metadata.is_completed
      ? (Object.values(data.teams) as Array<{ rounds: { won: number; lost: number } }>).reduce(
          (sum, team) => sum + team.rounds.won + team.rounds.lost,
          0,
        ) / 2
      : Math.max(...kills.map((k: any) => k.kill_time_in_round), 0);

    // Agrupar kills por round
    const killsByRound = kills.reduce(
      (acc: Record<number, Kill[]>, kill: any) => {
        if (!acc[kill.kill_time_in_round]) acc[kill.kill_time_in_round] = [];
        acc[kill.kill_time_in_round].push(kill as unknown as Kill);
        return acc;
      },
      {} as Record<number, Kill[]>,
    );

    // Encontrar primeira kill de cada round
    const firstKillPerRound: Record<number, string> = {};
    const firstDeathPerRound: Record<number, string> = {};

    for (const round in killsByRound) {
      const roundNum = Number(round);
      const roundKills = killsByRound[roundNum];
      const firstKill = roundKills.sort(
        (a: Kill, b: Kill) => a.time_in_round_in_ms - b.time_in_round_in_ms,
      )[0];

      firstKillPerRound[roundNum] = firstKill.killer.puuid;
      firstDeathPerRound[roundNum] = firstKill.victim.puuid;
    }

    // Calcular FK e FD por jogador
    const fkCount: Record<string, number> = {};
    const fdCount: Record<string, number> = {};

    Object.values(firstKillPerRound).forEach((puuid) => {
      fkCount[puuid] = (fkCount[puuid] || 0) + 1;
    });
    Object.values(firstDeathPerRound).forEach((puuid) => {
      fdCount[puuid] = (fdCount[puuid] || 0) + 1;
    });

    // Processar estatísticas extendidas
    const extendedStats: PlayerExtendedStats[] = players.map((player: any) => {
      const totalShots =
        player.stats.headshots +
        player.stats.bodyshots +
        player.stats.legshots +
        player.stats.bodyshots +
        player.stats.legshots;
      const adr = totalRounds > 0 ? player.stats.damage.dealt / totalRounds : 0;
      const acs = totalRounds > 0 ? player.stats.score / totalRounds : 0;

      return {
        puuid: player.puuid,
        name: player.name,
        tag: player.tag,
        agent: player.agent.name,
        team_id: player.team_id,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        score: player.stats.score,
        damage_dealt: player.stats.damage.dealt,
        damage_received: player.stats.damage.received,
        headshots: player.stats.headshots,
        bodyshots: player.stats.bodyshots,
        legshots: player.stats.legshots,
        total_shots: totalShots,
        adr: parseFloat(adr.toFixed(1)),
        acs: parseFloat(acs.toFixed(1)),
        kdr:
          player.stats.deaths === 0
            ? player.stats.kills
            : parseFloat((player.stats.kills / player.stats.deaths).toFixed(2)),
        hsRate:
          totalShots > 0
            ? parseFloat(
                ((player.stats.headshots / totalShots) * 100).toFixed(1),
              )
            : 0,
        fk: fkCount[player.puuid] || 0,
        fd: fdCount[player.puuid] || 0,
      };
    });

    return {
      players: extendedStats,
      metadata: {
        match_id: metadata.match_id,
        map: metadata.map.name,
        mode: metadata.queue.name,
        duration: metadata.game_length_in_ms,
        started_at: metadata.started_at,
        totalRounds,
      },
      teams: data.teams,
    };
  }, [matchData]);
};
