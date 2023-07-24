import { expect, test } from 'vitest';

import { weatherFunction } from '../_test/function.js';
import { openai } from '../_test/openai.js';
import { oa } from '../openai/index.js';
import { SupportCategoryEnum } from './test.js';
import OpenAI from 'openai';
import { z } from 'zod';

// const embeddingsModelName = 'text-embedding-ada-002';
const chatModelName = 'gpt-3.5-turbo-16k-0613';

test('should classify a support request', async () => {
  const classificationFunction = z
    .function()
    .args(
      z.object({
        summary: z.string().describe('The summary of the message.'),
        category: SupportCategoryEnum.describe('The category of the message.'),
      }),
    )
    .describe('Triage a message.');

  const hopfieldFunction = oa.function({
    schema: classificationFunction,
    name: 'classifyMessage',
    options: {
      templates: false,
    },
  });

  const messages: OpenAI.Chat.CompletionCreateParams.CreateChatCompletionRequestStreaming.Message[] =
    [
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

  const response = await openai.chat.completions.create({
    model: chatModelName,
    messages,
    temperature: 0,
    functions: [hopfieldFunction.input],
    function_call: { name: hopfieldFunction.name },
  });

  const parsed = hopfieldFunction.output.parse(
    response.choices?.[0]?.message?.function_call,
  );

  expect(parsed).toMatchInlineSnapshot(`
    {
      "arguments": {
        "category": "BILLING_AND_PAYMENTS",
        "summary": "Credit card charged twice",
      },
      "name": "classifyMessage",
    }
  `);
});

test('should request the weather', async () => {
  const hopfieldFunction = oa.function({
    schema: weatherFunction.schema,
    name: weatherFunction.name,
  });

  const messages: OpenAI.Chat.CompletionCreateParams.CreateChatCompletionRequestStreaming.Message[] =
    [
      {
        role: 'user',
        content: "What's the weather in San Francisco?",
      },
    ];

  const response = await openai.chat.completions.create({
    model: chatModelName,
    messages,
    temperature: 0,
    functions: [hopfieldFunction.input],
  });

  const parsed = hopfieldFunction.output.parse(
    response.choices?.[0]?.message?.function_call,
  );

  expect(parsed).toMatchInlineSnapshot(`
    {
      "arguments": {
        "location": "San Francisco, CA",
        "unit": "celsius",
      },
      "name": "getCurrentWeather",
    }
  `);
});
