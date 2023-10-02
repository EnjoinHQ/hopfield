import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: ['verbose'],
    },
    coverage: {
      exclude: [
        'src/_test/**',
        'src/**/*.test.ts',
        'src/**/*.integration.ts',
        'src/**/index.ts',
        'src/test.ts',
      ],
      reporter: ['text', 'json', 'html'],
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    typecheck: {
      exclude: ['examples/**', 'docs/**'],
    },
  },
});
