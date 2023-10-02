import { expect, test } from 'vitest';

import { SupportCategoryEnum } from '../_test/zod.js';
import { hop } from '../index.js';

import { openAIClient } from '../_test/openai-client.js';
import openai from './index.js';
import { z } from 'zod';

const TEST_TIMEOUT = 8_000;

const hopfield = hop.client(openai).provider(openAIClient);

const classifyMessage = hopfield.function({
  name: 'classifyMessage',
  description: 'Triage an incoming support message.',
  parameters: z.object({
    summary: z.string().describe('The summary of the message.'),
    category: SupportCategoryEnum.describe(
      hopfield.template().enum('The category of the message.'),
    ),
  }),
});

const chat = hopfield.chat().functions([classifyMessage]);

const streamingChat = chat.streaming();

test(
  'should classify a support request',
  async () => {
    const messages: hop.inferMessageInput<typeof chat>[] = [
      {
        role: 'system',
        content: 'You are a helpful classification assistant.',
      },
      {
        role: 'user',
        content:
          'I have an urgent problem with my credit card being charged twice and need help.',
      },
    ];

    const parsed = await chat.get({
      messages,
      temperature: 0,
    });

    expect(parsed.choices[0]).toMatchInlineSnapshot(`
      {
        "__type": "function_call",
        "finish_reason": "function_call",
        "index": 0,
        "message": {
          "content": null,
          "function_call": {
            "arguments": {
              "category": "BILLING_AND_PAYMENTS",
              "summary": "Credit card charged twice",
            },
            "name": "classifyMessage",
          },
          "role": "assistant",
        },
      }
    `);
  },
  TEST_TIMEOUT,
);

test(
  'should classify a support request w/ forced function call',
  async () => {
    const messages: hop.inferMessageInput<typeof chat>[] = [
      {
        role: 'system',
        content: 'You are a helpful classification assistant.',
      },
      {
        role: 'user',
        content:
          'I have an urgent problem with my credit card being charged twice and need help.',
      },
    ];

    const parsed = await chat.get({
      messages,
      temperature: 0,
      function_call: { name: classifyMessage.name },
    });

    expect(parsed.choices[0]).toMatchInlineSnapshot(`
      {
        "__type": "function_call",
        "finish_reason": "stop",
        "index": 0,
        "message": {
          "content": null,
          "function_call": {
            "arguments": {
              "category": "BILLING_AND_PAYMENTS",
              "summary": "Credit card charged twice",
            },
            "name": "classifyMessage",
          },
          "role": "assistant",
        },
      }
    `);
  },
  TEST_TIMEOUT,
);

test(
  'should classify a support request with no required descriptions',
  async () => {
    const classifyMessage = hopfield.function({
      name: 'classifyMessage',
      description: 'Triage an incoming support message.',
      parameters: z.object({
        summary: z.string().describe('The summary of the message.'),
        category: SupportCategoryEnum,
      }),
      options: {
        requireDescriptions: false,
      },
    });

    const chat = hopfield.chat().functions([classifyMessage]);

    const messages: hop.inferMessageInput<typeof chat>[] = [
      {
        role: 'system',
        content: 'You are a helpful classification assistant.',
      },
      {
        role: 'user',
        content:
          'I have an urgent problem with my credit card being charged twice and need help.',
      },
    ];

    const parsed = await chat.get({
      messages,
      temperature: 0,
      function_call: { name: classifyMessage.name },
    });

    expect(parsed.choices[0]).toMatchInlineSnapshot(`
      {
        "__type": "function_call",
        "finish_reason": "stop",
        "index": 0,
        "message": {
          "content": null,
          "function_call": {
            "arguments": {
              "category": "BILLING_AND_PAYMENTS",
              "summary": "Credit card charged twice",
            },
            "name": "classifyMessage",
          },
          "role": "assistant",
        },
      }
    `);
  },
  TEST_TIMEOUT,
);

test(
  'should classify a support request (streaming)',
  async () => {
    const messages: hop.inferMessageInput<typeof chat>[] = [
      {
        role: 'system',
        content: 'You are a helpful classification assistant.',
      },
      {
        role: 'user',
        content:
          'I have an urgent problem with my credit card being charged twice and need help.',
      },
    ];

    const response = await streamingChat.get({
      messages,
      temperature: 0,
    });

    const parts: hop.inferResult<typeof streamingChat>['choices'][number][] =
      [];

    for await (const part of response) {
      parts.push(...part.choices);
    }

    expect(parts).toMatchInlineSnapshot(`
      [
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "summary",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\":",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "Credit",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " card",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " charged",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " twice",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\",
      ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "category",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\":",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "BILL",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "ING",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "_AND",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "_PAY",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "MENTS",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\"
      ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "}",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_completed",
          "delta": {},
          "finish_reason": "function_call",
          "index": 0,
        },
      ]
    `);
  },
  TEST_TIMEOUT,
);

test(
  'should classify a support request w/ forced function call (streaming)',
  async () => {
    const messages: hop.inferMessageInput<typeof chat>[] = [
      {
        role: 'system',
        content: 'You are a helpful classification assistant.',
      },
      {
        role: 'user',
        content:
          'I have an urgent problem with my credit card being charged twice and need help.',
      },
    ];

    const response = await streamingChat.get({
      messages,
      temperature: 0,
      function_call: { name: classifyMessage.name },
    });

    const parts: hop.inferResult<typeof streamingChat>['choices'][number][] =
      [];

    for await (const part of response) {
      parts.push(...part.choices);
    }

    expect(parts).toMatchInlineSnapshot(`
      [
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "summary",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\":",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "Credit",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " card",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " charged",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " twice",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\",
      ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "category",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\":",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": " \\"",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "BILL",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "ING",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "_AND",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "_PAY",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "MENTS",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "\\"
      ",
            },
          },
          "finish_reason": null,
          "index": 0,
        },
        {
          "__type": "function_arguments",
          "delta": {
            "function_call": {
              "arguments": "}",
            },
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
