import { expect, test } from 'vitest';

import { SupportCategoryEnum } from '../_test/zod.js';
import { hop } from '../index.js';

import { openAIClient } from '../_test/openai-client.js';
import openai from './index.js';
import { z } from 'zod';

test('should classify a support request', async () => {
  const classifyMessage = hop.client(openai).function({
    name: 'classifyMessage',
    description: 'Triage an incoming support message.',
    parameters: z.object({
      summary: z.string().describe('The summary of the message.'),
      category: SupportCategoryEnum.describe('The category of the message.'),
    }),
  });

  const chat = hop
    .client(openai)
    .provider(openAIClient)
    .chat()
    .functions([classifyMessage]);

  // const response = await chat.get({
  //   messages: [],

  // })

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

  expect(
    parsed.choices[0].__type === 'function_call' && parsed.choices[0].message,
  ).toMatchInlineSnapshot(`
    {
      "arguments": {
        "category": "BILLING_AND_PAYMENTS",
        "summary": "Credit card charged twice",
      },
      "name": "classifyMessage",
    }
  `);
});
