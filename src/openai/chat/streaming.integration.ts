import { expect, test } from 'vitest';

import { openAIClient } from '../../_test/openai-client.js';
import hop from '../../index.js';
import { openai } from '../external.js';

const TEST_TIMEOUT = 8_000;

const hopfield = hop.client(openai).provider(openAIClient);

const chat = hopfield.chat('gpt-3.5-turbo-16k-0613').streaming();
const chatMultiple = hopfield.chat('gpt-3.5-turbo-16k-0613', 2).streaming();

test(
  'should respond with streaming',
  async () => {
    const messages: hop.inferMessageInput<typeof chat>[] = [
      {
        role: 'user',
        content:
          "What's the coolest way to eat a pizza? Respond in three words or less.",
      },
    ];

    const response = await chat.get({
      messages,
      temperature: 0,
    });

    const parts: hop.inferResult<typeof chat>['choices'][number][] = [];

    for await (const part of response) {
      parts.push(...part.choices);
    }

    expect(parts).toMatchInlineSnapshot(`
      [
        {
          "__type": "content",
          "delta": {
            "content": "",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": "Fold",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": " and",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": " devour",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": ".",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "stop",
          "delta": {},
          "finish_reason": "stop",
          "index": 0,
        },
      ]
    `);
  },
  TEST_TIMEOUT,
);

test(
  'should respond with multiple choices',
  async () => {
    const messages: hop.inferMessageInput<typeof chatMultiple>[] = [
      {
        role: 'user',
        content:
          "What's the coolest way to eat a pizza? Respond in three words or less.",
      },
    ];

    const response = await chatMultiple.get({
      messages,
      temperature: 0,
    });

    const parts: hop.inferResult<typeof chatMultiple>['choices'][number][] = [];

    for await (const part of response) {
      parts.push(...part.choices);
    }

    expect(parts).toMatchInlineSnapshot(`
      [
        {
          "__type": "content",
          "delta": {
            "content": "",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": "Fold",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": "",
          },
          "finish_reason": null,
          "index": 1,
        },
        {
          "__type": "content",
          "delta": {
            "content": "Fold",
          },
          "finish_reason": null,
          "index": 1,
        },
        {
          "__type": "content",
          "delta": {
            "content": " and",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": " and",
          },
          "finish_reason": null,
          "index": 1,
        },
        {
          "__type": "content",
          "delta": {
            "content": " devour",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": " devour",
          },
          "finish_reason": null,
          "index": 1,
        },
        {
          "__type": "content",
          "delta": {
            "content": ".",
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "content",
          "delta": {
            "content": ".",
          },
          "finish_reason": null,
          "index": 1,
        },
        {
          "__type": "stop",
          "delta": {},
          "finish_reason": "stop",
          "index": 0,
        },
        {
          "__type": "stop",
          "delta": {},
          "finish_reason": "stop",
          "index": 1,
        },
      ]
    `);
  },
  TEST_TIMEOUT,
);
