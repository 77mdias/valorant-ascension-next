const nextJest = require("next/jest");

// Criar configuração base do Next.js para Jest
const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/out/",
    "/build/",
    "/dist/",
    "/coverage/",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/app/**/layout.tsx",
    "!src/app/**/loading.tsx",
    "!src/app/**/error.tsx",
    "!src/app/**/not-found.tsx",
  ],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  verbose: true,
  maxWorkers: process.env.CI ? 2 : "50%",
  testTimeout: 10000,
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react",
      },
    },
  },
};

module.exports = createJestConfig(customJestConfig);
