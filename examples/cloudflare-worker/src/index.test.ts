import { UnstableDevWorker, unstable_dev } from 'wrangler';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

describe('Worker', () => {
  let worker: UnstableDevWorker | null = null;

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker?.stop();
  });

  it('should return a chat response', async () => {
    const resp = await worker?.fetch();
    if (resp) {
      const text = await resp.text();

      expect(text).toMatchInlineSnapshot(`"Finger snapping rhythm."`);
    }
  });
});
