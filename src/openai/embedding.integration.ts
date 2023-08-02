import { openAIClient } from '../_test/openai-client.js';
import hop from '../index.js';
import { openai } from './external.js';
import { expect, test } from 'vitest';

const hopfield = hop.client(openai).provider(openAIClient);

const embeddings = hopfield.embedding();
const multipleEmbeddings = hopfield.embedding('text-embedding-ada-002', 3);

test('should respond with embedding', async () => {
  const response = await embeddings.get({
    input: ['hopfield'],
  });

  expect(response.model).toMatchInlineSnapshot('"text-embedding-ada-002-v2"');
  expect(response.data[0].embedding[0]).toBeCloseTo(-0.0073666335, 3);
  expect(response.data[0].embedding[1535]).toBeCloseTo(-0.0013278616, 3);
});

test('should respond with multiple embeddings', async () => {
  const response = await multipleEmbeddings.get({
    input: ['ready', 'set', 'hopfield'],
  });

  expect(response.model).toMatchInlineSnapshot('"text-embedding-ada-002-v2"');
  expect(response.data[0].embedding[0]).toBeCloseTo(-0.009482461, 3);
  expect(response.data[2].embedding[0]).toBeCloseTo(-0.0073666335, 3);
});
