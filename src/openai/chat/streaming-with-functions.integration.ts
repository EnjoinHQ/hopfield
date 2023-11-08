import { describe, test } from 'vitest';

import { SupportCategoryEnum } from '../../_test/zod.js';
import { hop } from '../../index.js';

import { openAIClient } from '../../_test/openai-client.js';
import openai from '../index.js';
import { z } from 'zod';

const TEST_TIMEOUT = 8_000;

const hopfield = hop.client(openai).provider(openAIClient);

const classifyMessage = hopfield.function({
  name: 'classifyMessage',
  description: 'Triage an incoming support message.',
  parameters: z.object({
    summary: z.string().describe('A brief summary of the message.'),
    category: SupportCategoryEnum.describe(
      hopfield.template().enum('The category of the message.'),
    ),
  }),
});

const streamingChat = hopfield
  .chat('gpt-4-0613')
  .functions([classifyMessage])
  .streaming();

describe.concurrent('streaming with functions', () => {
  test(
    'should classify a support request',
    async ({ expect }) => {
      const messages: hop.inferMessageInput<typeof streamingChat>[] = [
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

      let functionNameCalled: string | null = null;

      const response = await streamingChat.get(
        {
          messages,
          temperature: 0,
        },
        {
          onFunctionCall(value) {
            functionNameCalled = value.name;

            expect(value.arguments.category).toMatchInlineSnapshot(
              '"BILLING_AND_PAYMENTS"',
            );
            expect(value.arguments.summary).toMatchInlineSnapshot(
              '"Urgent problem with credit card being charged twice"',
            );
          },
        },
      );

      const parts: hop.inferResult<typeof streamingChat>['choices'][number][] =
        [];

      for await (const part of response) {
        parts.push(...part.choices);
      }

      expect(functionNameCalled).toMatchInlineSnapshot('"classifyMessage"');

      expect(parts).toMatchInlineSnapshot(`
        [
          {
            "__type": "function_name",
            "delta": {
              "content": null,
              "function_call": {
                "name": "classifyMessage",
              },
              "role": "assistant",
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": "{
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
                "arguments": "U",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": "rg",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": "ent",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": " problem",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": " with",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": " credit",
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
                "arguments": " being",
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
    async ({ expect }) => {
      const messages: hop.inferMessageInput<typeof streamingChat>[] = [
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

      let functionNameCalled: string | null = null;

      const response = await streamingChat.get(
        {
          messages,
          temperature: 0,
          function_call: { name: classifyMessage.name },
        },
        {
          onFunctionCall(value) {
            functionNameCalled = value.name;

            expect(value.arguments.category).toMatchInlineSnapshot(
              '"BILLING_AND_PAYMENTS"',
            );
            expect(value.arguments.summary).toMatchInlineSnapshot(
              '"Urgent problem with credit card being charged twice"',
            );
          },
        },
      );

      const parts: hop.inferResult<typeof streamingChat>['choices'][number][] =
        [];

      for await (const part of response) {
        parts.push(...part.choices);
      }

      expect(functionNameCalled).toMatchInlineSnapshot('"classifyMessage"');

      expect(parts).toMatchInlineSnapshot(`
        [
          {
            "__type": "function_name",
            "delta": {
              "content": null,
              "function_call": {
                "name": "classifyMessage",
              },
              "role": "assistant",
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": "{
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
                "arguments": "U",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": "rg",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": "ent",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": " problem",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": " with",
              },
            },
            "finish_reason": null,
            "index": 0,
          },
          {
            "__type": "function_arguments",
            "delta": {
              "function_call": {
                "arguments": " credit",
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
                "arguments": " being",
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
});
