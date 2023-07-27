import { expect, it, test } from 'vitest';

import { openai } from '../_test/openai.js';
import hop from '../index.js';
import * as Exports from './embedding.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "OpenAIHopfieldEmbeddingSchema",
      "OpenAIHopfieldEmbedding",
    ]
  `);
});

test('should set a default model name', async () => {
  expect(hop.provider(openai).embedding().model).toMatchInlineSnapshot(
    '"text-embedding-ada-002"',
  );
});

test('should parse a text embedding response', async () => {
  const embeddings = hop.embedding();

  const response = await openai.embeddings.create(
    embeddings.parameters.parse({
      input: 'hopfield',
    }),
  );

  const embedding = await embeddings.returnType.parseAsync(response);

  expect(embedding.data[0].embedding.length).toMatchInlineSnapshot('1536');
  expect(embedding.model).toMatchInlineSnapshot('"text-embedding-ada-002-v2"');
});

test('should parse a text embedding response', async () => {
  const embeddings = hop.provider(openai).embedding();

  const embedding = await embeddings.get({
    input: 'hopfield',
  });

  expect(embedding.data[0].embedding.length).toMatchInlineSnapshot('1536');
  expect(embedding.model).toMatchInlineSnapshot('"text-embedding-ada-002-v2"');
});
