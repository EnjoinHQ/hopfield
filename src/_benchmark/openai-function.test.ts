import { expect, test } from 'vitest';

import { openai } from '../_test/openai.js';
import { type OpenAIChatMessage, hop } from '../index.js';
import { SupportCategoryEnum } from './test.js';

import { z } from 'zod';

test('should classify a support request', async () => {
  const classifyMessage = hop.provider(openai).function({
    name: 'classifyMessage',
    description: 'Triage an incoming support message.',
    parameters: z.object({
      summary: z.string().describe('The summary of the message.'),
      category: SupportCategoryEnum.describe('The category of the message.'),
    }),
    options: {
      templates: false,
    },
  });

  const chat = hop.provider(openai).chat().functions([classifyMessage]);

  const messages: OpenAIChatMessage[] = [
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
    parsed.choices[0]?.finish_reason === 'stop' &&
      parsed.choices[0]?.message.content === null &&
      parsed.choices[0].message.function_call,
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
