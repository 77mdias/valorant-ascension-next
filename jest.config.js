const nextJest = require('next/jest')

// Criar configuração base do Next.js para Jest
const createJestConfig = nextJest({
  // Caminho para o diretório do Next.js
  dir: './',
})

// Configuração customizada do Jest
const customJestConfig = {
  // Setup files executados antes de cada teste
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Ambiente de teste
  testEnvironment: 'jest-environment-jsdom',

  // Diretórios de teste
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Arquivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/build/',
    '/dist/',
    '/coverage/',
  ],

  // Module paths (path aliases)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Coletar coverage de arquivos
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/app/**/layout.tsx', // Layouts geralmente não precisam de teste
    '!src/app/**/loading.tsx', // Loading states
    '!src/app/**/error.tsx', // Error boundaries
    '!src/app/**/not-found.tsx', // 404 pages
  ],

  // Thresholds de coverage (ajuste conforme necessário)
  coverageThresholds: {
    global: {
      statements: 0, // Começar com 0%, aumentar gradualmente
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },

  // Diretório de saída do coverage
  coverageDirectory: 'coverage',

  // Reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Transformações de arquivos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Verbose output
  verbose: true,

  // Número máximo de workers (melhor performance em CI)
  maxWorkers: process.env.CI ? 2 : '50%',

  // Timeout para testes (ms)
  testTimeout: 10000,

  // Resetar mocks entre testes
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,

  // Globals
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
}

// Export config criado pelo Next.js
module.exports = createJestConfig(customJestConfig)
