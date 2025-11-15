// Sistema de cache para dados de Valorant
// Suporta localStorage atual e preparado para futura migração para banco

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

export interface PlayerCacheData {
  player: any;
  mmr: any;
  matches: any[];
  region: string;
}

export interface MatchCacheData {
  match: any;
  region: string;
}

class ValorantCache {
  private readonly PLAYER_CACHE_KEY = "valorant_player_cache";
  private readonly MATCH_CACHE_KEY = "valorant_match_cache";

  // TTL padrão: 1 hora para player, 30 min para matches
  private readonly PLAYER_TTL = 60 * 60 * 1000; // 1 hora
  private readonly MATCH_TTL = 30 * 60 * 1000; // 30 minutos

  // Cache de player
  setPlayerData(
    playerName: string,
    playerTag: string,
    region: string,
    data: PlayerCacheData,
  ): void {
    try {
      const cacheKey = this.getPlayerCacheKey(playerName, playerTag, region);
      const cacheItem: CacheItem<PlayerCacheData> = {
        data,
        timestamp: Date.now(),
        ttl: this.PLAYER_TTL,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      console.log("💾 Dados do player salvos no cache:", playerName, playerTag);
    } catch (error) {
      console.warn("⚠️ Erro ao salvar no cache:", error);
    }
  }

  getPlayerData(
    playerName: string,
    playerTag: string,
    region: string,
  ): PlayerCacheData | null {
    try {
      const cacheKey = this.getPlayerCacheKey(playerName, playerTag, region);
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const cacheItem: CacheItem<PlayerCacheData> = JSON.parse(cached);
      const now = Date.now();

      // Verificar se o cache expirou
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        console.log("⏰ Cache do player expirado:", playerName, playerTag);
        localStorage.removeItem(cacheKey);
        return null;
      }

      console.log(
        "📖 Dados do player carregados do cache:",
        playerName,
        playerTag,
      );
      return cacheItem.data;
    } catch (error) {
      console.warn("⚠️ Erro ao ler do cache:", error);
      return null;
    }
  }

  // Cache de match
  setMatchData(matchId: string, region: string, data: MatchCacheData): void {
    try {
      const cacheKey = this.getMatchCacheKey(matchId, region);
      const cacheItem: CacheItem<MatchCacheData> = {
        data,
        timestamp: Date.now(),
        ttl: this.MATCH_TTL,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      console.log("💾 Dados da partida salvos no cache:", matchId);
    } catch (error) {
      console.warn("⚠️ Erro ao salvar no cache:", error);
    }
  }

  getMatchData(matchId: string, region: string): MatchCacheData | null {
    try {
      const cacheKey = this.getMatchCacheKey(matchId, region);
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const cacheItem: CacheItem<MatchCacheData> = JSON.parse(cached);
      const now = Date.now();

      // Verificar se o cache expirou
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        console.log("⏰ Cache da partida expirado:", matchId);
        localStorage.removeItem(cacheKey);
        return null;
      }

      console.log("📖 Dados da partida carregados do cache:", matchId);
      return cacheItem.data;
    } catch (error) {
      console.warn("⚠️ Erro ao ler do cache:", error);
      return null;
    }
  }

  // Limpar cache expirado
  cleanupExpiredCache(): void {
    try {
      const keys = this.getCacheKeys();
      const now = Date.now();

      keys.forEach((key) => {
        if (key.startsWith("valorant_")) {
          try {
            const cached = localStorage.getItem(key);
            if (cached) {
              const cacheItem: CacheItem<any> = JSON.parse(cached);
              if (now - cacheItem.timestamp > cacheItem.ttl) {
                localStorage.removeItem(key);
                console.log("🧹 Cache expirado removido:", key);
              }
            }
          } catch (error) {
            // Se não conseguir parsear, remove o item corrompido
            localStorage.removeItem(key);
            console.log("🧹 Item de cache corrompido removido:", key);
          }
        }
      });
    } catch (error) {
      console.warn("⚠️ Erro ao limpar cache:", error);
    }
  }

  // Limpar todo o cache
  clearAllCache(): void {
    try {
      const keys = this.getCacheKeys();
      keys.forEach((key) => {
        if (key.startsWith("valorant_")) {
          localStorage.removeItem(key);
        }
      });
      console.log("🧹 Todo o cache foi limpo");
    } catch (error) {
      console.warn("⚠️ Erro ao limpar cache:", error);
    }
  }

  // Obter estatísticas do cache
  getCacheStats(): {
    playerCount: number;
    matchCount: number;
    totalSize: number;
  } {
    try {
      const keys = this.getCacheKeys();
      let playerCount = 0;
      let matchCount = 0;
      let totalSize = 0;

      keys.forEach((key) => {
        if (key.startsWith("valorant_")) {
          const cached = localStorage.getItem(key);
          if (cached) {
            totalSize += cached.length;
            if (key.includes("player")) playerCount++;
            if (key.includes("match")) matchCount++;
          }
        }
      });

      return { playerCount, matchCount, totalSize };
    } catch (error) {
      console.warn("⚠️ Erro ao obter estatísticas do cache:", error);
      return { playerCount: 0, matchCount: 0, totalSize: 0 };
    }
  }

  // Chaves privadas para cache
  private getPlayerCacheKey(
    playerName: string,
    playerTag: string,
    region: string,
  ): string {
    return `${this.PLAYER_CACHE_KEY}_${playerName}_${playerTag}_${region}`;
  }

  private getMatchCacheKey(matchId: string, region: string): string {
    return `${this.MATCH_CACHE_KEY}_${matchId}_${region}`;
  }

  private getCacheKeys(): string[] {
    if (typeof localStorage === "undefined") {
      return [];
    }

    const keys: string[] = [];
    let index = 0;
    while (true) {
      const key = localStorage.key(index);
      if (!key) {
        break;
      }
      keys.push(key);
      index += 1;
    }
    return keys;
  }
}

// Instância singleton do cache
export const valorantCache = new ValorantCache();

// Limpar cache expirado a cada 5 minutos (ignorar durante testes)
if (
  typeof window !== "undefined" &&
  (typeof process === "undefined" || process.env.NODE_ENV !== "test")
) {
  setInterval(
    () => {
      valorantCache.cleanupExpiredCache();
    },
    5 * 60 * 1000,
  );
}

export default valorantCache;
