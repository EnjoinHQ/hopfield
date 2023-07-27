import { expect, it } from 'vitest';

import { test } from 'vitest';

import { weatherFunction } from '../../_test/function.js';
import { openai } from '../../_test/openai.js';
import hop, { type OpenAIChatMessage } from '../../index.js';
import * as Exports from './non-streaming.js';
import { z } from 'zod';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "ChoiceWithContentFilterReason",
      "ChoiceWithMessageStopReason",
      "ChoiceWithLengthReason",
      "Usage",
      "OpenAIChatSchema",
      "OpenAIChat",
    ]
  `);
});

test('should set a default model name with no provider', async () => {
  expect(hop.chat('gpt-3.5-turbo-16k').model).toMatchInlineSnapshot(
    '"gpt-3.5-turbo-16k"',
  );
});

test('should set a default model name', async () => {
  expect(hop.provider(openai).chat().model).toMatchInlineSnapshot(
    '"gpt-3.5-turbo-0613"',
  );
});

test('should get a chat response', async () => {
  const chat = hop
    .provider(openai)
    .chat()
    .functions([hop.function(weatherFunction)]);

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content:
        "What's the better word: banana, or aardvark? Choose one and only say it.",
    },
  ];

  const parsed = await chat.get({
    messages,
    temperature: 0,
  });

  expect(parsed?.choices[0]).toMatchInlineSnapshot(
    `
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Banana.",
        "role": "assistant",
      },
    }
  `,
  );
}, 5000);

test('should get a function call response', async () => {
  const chat = hop
    .provider(openai)
    .chat('gpt-3.5-turbo-16k-0613')
    .functions([weatherFunction]);

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content: "What's the weather in Phoenix, AZ?",
    },
  ];

  const parsed = await chat.get({
    messages,
    temperature: 0,
  });

  expect(parsed.choices[0]).toMatchInlineSnapshot(
    `
    {
      "finish_reason": "function_call",
      "index": 0,
      "message": {
        "content": null,
        "function_call": {
          "arguments": {
            "location": "Phoenix, AZ",
            "unit": "celsius",
          },
          "name": "getCurrentWeather",
        },
        "role": "assistant",
      },
    }
  `,
  );
}, 5000);

test('should parse a function call response', async () => {
  const chat = hop.chat().functions([weatherFunction]);

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content: "What's the weather in Phoenix, Arizona?",
    },
  ];

  const input = chat.parameters.parse({
    messages,
    temperature: 0,
  });

  const response = await openai.chat.completions.create(input);

  const parsed = await chat.returnType.parseAsync(response);

  expect(parsed?.choices[0]).toMatchInlineSnapshot(
    `
    {
      "finish_reason": "function_call",
      "index": 0,
      "message": {
        "content": null,
        "function_call": {
          "arguments": {
            "location": "Phoenix, Arizona",
            "unit": "celsius",
          },
          "name": "getCurrentWeather",
        },
        "role": "assistant",
      },
    }
  `,
  );
}, 5000);

test('should handle two functions correctly', async () => {
  const otherFunction = hop.provider(openai).function({
    name: 'otherFunction',
    description: 'Another description',
    parameters: z.object({
      driverName: z.string().describe('The driver'),
    }),
  });

  const chat = hop
    .provider(openai)
    .chat()
    .functions([otherFunction, weatherFunction]);

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content: "What's the weather in Phoenix, AZ?",
    },
  ];

  const response = await chat.get({
    messages,
    temperature: 0,
  });

  expect(
    response?.choices[0]?.message.content === null &&
      response.choices[0].message.function_call,
  ).toMatchInlineSnapshot(
    `
    {
      "arguments": {
        "location": "Phoenix, AZ",
        "unit": "celsius",
      },
      "name": "getCurrentWeather",
    }
  `,
  );
}, 5000);
