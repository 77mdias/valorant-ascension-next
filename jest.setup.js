// Jest setup executado antes de cada teste

// Extend expect matchers
import "@testing-library/jest-dom";

// Mock do Next.js Router
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  })),
}));

// Mock do Next.js Navigation (App Router)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Mock de environment variables
process.env = {
  ...process.env,
  NEXTAUTH_URL: "http://localhost:3000",
  NEXTAUTH_SECRET: "test-secret",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/test_db",
  DIRECT_URL: "postgresql://user:pass@localhost:5432/test_db",
  STRIPE_SECRET_KEY: "sk_test_fake_key",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_fake_key",
  NODE_ENV: "test",
};

// Mock do Prisma Client
jest.mock("./src/lib/prisma", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    lessons: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    lessonCategory: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    // Adicione outros modelos conforme necessário
  },
}));

// Mock do NextAuth
jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Mock do Stripe
jest.mock("./src/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
    },
    subscriptions: {
      retrieve: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
    },
    customers: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
}));

// Global test utilities
global.testUtils = {
  // Função helper para criar mock de sessão autenticada
  createMockSession: (overrides = {}) => ({
    user: {
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User",
      role: "CUSTOMER",
      ...overrides.user,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    ...overrides,
  }),

  // Função helper para criar mock de usuário
  createMockUser: (overrides = {}) => ({
    id: "test-user-id",
    email: "test@example.com",
    nickname: "testuser",
    name: "Test User",
    role: "CUSTOMER",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};

// Suppress console errors/warnings durante testes (opcional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warning: jest.fn(),
// }

// Setup/Teardown global
beforeAll(() => {
  // Setup global antes de todos os testes
});

afterAll(() => {
  // Cleanup global após todos os testes
});

beforeEach(() => {
  // Reset antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup após cada teste
});
