import { describe, test } from 'vitest';

import { openAIClient } from '../../_test/openai-client.js';
import hop from '../../index.js';
import { openai } from '../external.js';

const TEST_TIMEOUT = 8_000;

const hopfield = hop.client(openai).provider(openAIClient);

const chat = hopfield.chat('gpt-4o-2024-05-13');
const chatMultiple = hopfield.chat('gpt-4o-2024-05-13', 2);

describe.concurrent('non-streaming', () => {
  test(
    'should respond with no streaming',
    async ({ expect }) => {
      const messages: hop.inferMessageInput<typeof chat>[] = [
        {
          role: 'user',
          content:
            "What's the coolest way to eat a pizza? Respond in one sentence.",
        },
      ];

      const parsed = await chat.get({
        messages,
        temperature: 0,
      });

      expect(parsed.choices).toMatchInlineSnapshot(`
      [
        {
          "__type": "stop",
          "finish_reason": "stop",
          "index": 0,
          "message": {
            "content": "The coolest way to eat a pizza is by folding it in half and taking a big, satisfying bite.",
            "role": "assistant",
          },
        },
      ]
    `);
    },
    TEST_TIMEOUT,
  );

  test(
    'should respond with multiple choices',
    async ({ expect }) => {
      const messages: hop.inferMessageInput<typeof chatMultiple>[] = [
        {
          role: 'user',
          content:
            "What's the coolest way to eat a pizza? Respond in one sentence.",
        },
      ];

      const parsed = await chatMultiple.get({
        messages,
        temperature: 0,
      });

      expect(parsed.choices).toMatchInlineSnapshot(`
      [
        {
          "__type": "stop",
          "finish_reason": "stop",
          "index": 0,
          "message": {
            "content": "The coolest way to eat a pizza is by folding it in half and taking a big, satisfying bite.",
            "role": "assistant",
          },
        },
        {
          "__type": "stop",
          "finish_reason": "stop",
          "index": 1,
          "message": {
            "content": "The coolest way to eat a pizza is by folding it in half and taking a big, satisfying bite.",
            "role": "assistant",
          },
        },
      ]
    `);
    },
    TEST_TIMEOUT,
  );
});
