import { expect, test } from 'vitest';

import { openAIClient } from '../../_test/openai-client.js';
import hop from '../../index.js';
import { openai } from '../external.js';

const TEST_TIMEOUT = 8_000;

const hopfield = hop.client(openai).provider(openAIClient);

const chat = hopfield.chat('gpt-3.5-turbo-16k-0613').streaming();
const chatMultiple = hopfield.chat('gpt-3.5-turbo-16k-0613', 2).streaming();

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: 'user',
    content:
      "What's the coolest way to eat a pizza? Respond in three words or less.",
  },
];

test(
  'should respond with streaming',
  async () => {
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

test(
  'should respond with streaming using readableStream',
  async () => {
    const response = await chat.get({
      messages,
      temperature: 0,
    });

    const parts: hop.inferResult<typeof chat>['choices'][number][] = [];

    // use the readableStream
    const reader = response.readableStream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      parts.push(...value.choices);
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
  'should handle cancellation of readableStream mid-stream',
  async () => {
    const response = await chat.get({
      messages,
      temperature: 0,
    });

    const parts: hop.inferResult<typeof chat>['choices'][number][] = [];
    const reader = response.readableStream.getReader();

    let readCount = 0;
    const MAX_READS_BEFORE_CANCEL = 2; // Change this value based on when you want to cancel

    while (true) {
      const { done, value } = await reader.read();
      if (done || readCount >= MAX_READS_BEFORE_CANCEL) {
        reader.cancel(); // Cancel the reading after certain chunks are read
        break;
      }
      parts.push(...value.choices);
      readCount++;
    }

    // Assert the partial results. This will depend on where you cancel.
    expect(parts.length).toBe(MAX_READS_BEFORE_CANCEL);
    // Add more specific checks if necessary.

    // Check the result of further reads post cancellation.
    const postCancelRead = await reader.read();
    expect(postCancelRead.done).toBe(true);
    expect(postCancelRead.value).toBeUndefined();
  },
  TEST_TIMEOUT,
);
