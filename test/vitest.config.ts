import { join } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: process.env.CI ? ['json'] : ['verbose'],
    },
    coverage: {
      exclude: [
        '**/_cjs/**',
        '**/_esm/**',
        '**/_types/**',
        '**/*.test.ts',
        '**/*.integration.ts',
        '**/test/**',
      ],
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: [join(__dirname, './setup.ts')],
    typecheck: {
      exclude: ['examples/**', 'docs/**'],
    },
  },
});
