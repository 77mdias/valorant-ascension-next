// Testes para o sistema de cache
// Este arquivo pode ser executado com Jest ou similar

import {
  valorantCache,
  CacheItem,
  PlayerCacheData,
  MatchCacheData,
} from "./cache";

// Mock do localStorage para testes
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("ValorantCache", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("Player Cache", () => {
    const mockPlayerData: PlayerCacheData = {
      player: { name: "TenZ", tag: "1337" },
      mmr: { rank: "Immortal" },
      matches: [{ id: "1", map: "Ascent" }],
      region: "na",
    };

    it("should save player data to cache", () => {
      valorantCache.setPlayerData("TenZ", "1337", "na", mockPlayerData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "valorant_player_cache_TenZ_1337_na",
        expect.stringContaining("TenZ"),
      );
    });

    it("should retrieve valid player data from cache", () => {
      const cacheItem: CacheItem<PlayerCacheData> = {
        data: mockPlayerData,
        timestamp: Date.now(),
        ttl: 60 * 60 * 1000, // 1 hora
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheItem));

      const result = valorantCache.getPlayerData("TenZ", "1337", "na");

      expect(result).toEqual(mockPlayerData);
    });

    it("should return null for expired cache", () => {
      const expiredCacheItem: CacheItem<PlayerCacheData> = {
        data: mockPlayerData,
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 horas atrás
        ttl: 60 * 60 * 1000, // 1 hora
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(expiredCacheItem),
      );

      const result = valorantCache.getPlayerData("TenZ", "1337", "na");

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });
  });

  describe("Match Cache", () => {
    const mockMatchData: MatchCacheData = {
      match: { id: "123", map: "Ascent" },
      region: "na",
    };

    it("should save match data to cache", () => {
      valorantCache.setMatchData("123", "na", mockMatchData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "valorant_match_cache_123_na",
        expect.stringContaining("123"),
      );
    });

    it("should retrieve valid match data from cache", () => {
      const cacheItem: CacheItem<MatchCacheData> = {
        data: mockMatchData,
        timestamp: Date.now(),
        ttl: 30 * 60 * 1000, // 30 minutos
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheItem));

      const result = valorantCache.getMatchData("123", "na");

      expect(result).toEqual(mockMatchData);
    });
  });

  describe("Cache Management", () => {
    it("should clear all cache", () => {
      localStorageMock.key.mockReturnValueOnce("valorant_player_cache_test");
      localStorageMock.key.mockReturnValueOnce("valorant_match_cache_test");
      localStorageMock.key.mockReturnValueOnce(null);

      valorantCache.clearAllCache();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "valorant_player_cache_test",
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "valorant_match_cache_test",
      );
    });

    it("should get cache statistics", () => {
      localStorageMock.key.mockReturnValueOnce("valorant_player_cache_test1");
      localStorageMock.key.mockReturnValueOnce("valorant_player_cache_test2");
      localStorageMock.key.mockReturnValueOnce("valorant_match_cache_test");
      localStorageMock.key.mockReturnValueOnce(null);

      localStorageMock.getItem
        .mockReturnValueOnce('{"data": "test1", "timestamp": 123, "ttl": 1000}')
        .mockReturnValueOnce('{"data": "test2", "timestamp": 123, "ttl": 1000}')
        .mockReturnValueOnce(
          '{"data": "test3", "timestamp": 123, "ttl": 1000}',
        );

      const stats = valorantCache.getCacheStats();

      expect(stats.playerCount).toBe(2);
      expect(stats.matchCount).toBe(1);
      expect(stats.totalSize).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {
    it("should handle localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      // Não deve quebrar a aplicação
      expect(() => {
        valorantCache.setPlayerData("TenZ", "1337", "na", {
          player: {},
          mmr: {},
          matches: [],
          region: "na",
        });
      }).not.toThrow();
    });

    it("should handle corrupted cache data", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const result = valorantCache.getPlayerData("TenZ", "1337", "na");

      expect(result).toBeNull();
    });
  });
});

// Testes de integração (executar apenas em ambiente de desenvolvimento)
if (process.env.NODE_ENV === "development") {
  describe("Cache Integration Tests", () => {
    it("should work with real localStorage", () => {
      // Limpar cache antes do teste
      valorantCache.clearAllCache();

      const testData: PlayerCacheData = {
        player: { name: "TestPlayer", tag: "123" },
        mmr: { rank: "Gold" },
        matches: [],
        region: "na",
      };

      // Salvar dados
      valorantCache.setPlayerData("TestPlayer", "123", "na", testData);

      // Recuperar dados
      const result = valorantCache.getPlayerData("TestPlayer", "123", "na");

      expect(result).toEqual(testData);

      // Limpar após o teste
      valorantCache.clearAllCache();
    });
  });
}
