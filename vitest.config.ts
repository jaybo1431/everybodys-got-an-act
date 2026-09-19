import { defineConfig } from 'vitest/config';

// Domain logic is pure TypeScript with no DOM dependency, so a plain
// node environment is enough — no jsdom needed for this suite.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
