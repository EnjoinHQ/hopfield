import { expect, it, test } from 'vitest';

import * as Exports from './embedding.js';
import { OpenAIHopfieldEmbedding } from './embedding.js';
import OpenAI from 'openai';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "OpenAIHopfieldEmbedding",
    ]
  `);
});

test('should set a default model name', async () => {
  expect(
    new OpenAIHopfieldEmbedding({
      provider: new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY ?? '' }),
    }).modelName,
  ).toMatchInlineSnapshot('"text-embedding-ada-002"');
});

test('should create a text embedding', async () => {
  const embedding = await new OpenAIHopfieldEmbedding({
    provider: new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY ?? '' }),
  }).embedding('hopfield');
  expect(embedding[0]).toMatchInlineSnapshot('-0.0073666335');
  expect(embedding[1]).toMatchInlineSnapshot('0.012898559');
  expect(embedding[1535]).toMatchInlineSnapshot('-0.0013916683');
});
