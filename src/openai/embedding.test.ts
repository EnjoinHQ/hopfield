import { expect, it, test } from 'vitest';

import { openai } from '../_test/openai.js';
import * as Exports from './embedding.js';
import { oa } from './index.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "OpenAIHopfieldEmbedding",
    ]
  `);
});

test('should set a default model name', async () => {
  expect(oa.embedding().model).toMatchInlineSnapshot(
    '"text-embedding-ada-002"',
  );
});

test('should parse a text embedding response', async () => {
  const hopfieldEmbedding = oa.embedding();

  const response = await openai.embeddings.create(
    hopfieldEmbedding.input.parse({
      input: 'hopfield',
    }),
  );

  const embedding = await hopfieldEmbedding.output.parseAsync(response);

  expect(embedding.data[0].embedding[0]).toMatchInlineSnapshot('-0.0073666335');
  expect(embedding.model).toMatchInlineSnapshot('"text-embedding-ada-002-v2"');
});
