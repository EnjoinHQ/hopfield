import { expect, it, test } from 'vitest';

import { weatherFunction } from '../_test/function.js';
import { openai } from '../_test/openai.js';
import { type OpenAIChatMessage, hop } from '../index.js';
import * as Exports from './chat.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "OpenAIHopfieldChat",
    ]
  `);
});

test('should set a default model name', async () => {
  expect(hop.provider(openai).chat().model).toMatchInlineSnapshot(
    '"gpt-3.5-turbo-0613"',
  );
});

test('should parse a text embedding response', async () => {
  const chat = hop.chat({});

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content:
        "What's the better word: banana, or chicken? Choose one and only say it.",
    },
  ];

  const response = await openai.chat.completions.create(
    chat.parameters.parse({
      messages,
      temperature: 0,
    }),
  );

  const parsed = await chat.returnType.parseAsync(response);

  expect(parsed?.choices[0]).toMatchInlineSnapshot(
    `
    {
      "content": "Banana.",
      "role": "assistant",
    }
  `,
  );
}, 20_000);

test('should parse a text embedding response', async () => {
  const hopfieldChat = hop.provider(openai).chat({
    stream: 'streaming',
  });

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content:
        "What's the better word: banana, or chicken? Choose one and only say it.",
    },
  ];

  const parsed = await hopfieldChat.get({
    messages,
    temperature: 0,
  });

  const parts: Exports.OpenAIChatCompletionChunk[] = [];

  for await (const part of parsed) {
    parts.push(part);
  }

  expect(
    parts.map((part) => part.choices.map((choice) => choice.type)).join(', '),
  ).toMatchInlineSnapshot('"ROLE, CONTENT, CONTENT, CONTENT, STOP"');
  expect(
    parts
      .map((part) => part.choices.map((choice) => mapChoiceToString(choice)))
      .join(', '),
  ).toMatchInlineSnapshot('"assistant, Ban, ana, ., STOP"');
}, 20_000);

test('should parse a text embedding response', async () => {
  const hopfieldChat = hop.provider(openai).chat({});

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content:
        "What's the better word: banana, or chicken? Choose one and only say it.",
    },
  ];

  const parsed = await hopfieldChat.get({
    messages,
    temperature: 0,
  });

  expect(parsed?.choices[0]?.message).toMatchInlineSnapshot(
    `
    {
      "content": "Banana.",
      "role": "assistant",
    }
  `,
  );
}, 20_000);

test('should parse a text embedding response', async () => {
  const hopfieldFunction = hop.provider(openai).function({
    schema: weatherFunction.schema,
    name: weatherFunction.name,
  });

  const hopfieldChat = hop.provider(openai).chat({
    stream: 'streaming',
    functions: [hopfieldFunction],
  });

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content: "What's the weather in San Francisco?",
    },
  ];

  const parsed = await hopfieldChat.get({
    messages,
    temperature: 0,
  });

  const parts: Exports.OpenAIChatCompletionChunk[] = [];

  for await (const part of parsed) {
    parts.push(part);
  }

  expect(
    parts.map((part) => part.choices.map((choice) => choice.type)).join(', '),
  ).toMatchInlineSnapshot(
    '"ROLE, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_CALL"',
  );

  expect(
    parts
      .map((part) => part.choices.map((choice) => mapChoiceToString(choice)))
      .join(' '),
  ).toMatchInlineSnapshot(`
    "assistant {
        \\" location \\":  \\" San  Francisco ,  CA \\",
        \\" unit \\":  \\" c elsius \\"
     } function_call"
  `);
}, 20_000);

const mapChoiceToString = (choice: Exports.OpenAIChatCompletionChunkChoice) =>
  choice.type === 'CONTENT'
    ? choice.delta.content
    : choice.type === 'FUNCTION_CALL'
    ? choice.finish_reason
    : choice.type === 'ROLE'
    ? choice.delta.role
    : choice.type === 'FUNCTION_ARG'
    ? choice.delta.function_call.arguments
    : choice.type === 'FUNCTION_NAME'
    ? choice.delta.function_call.name
    : choice.type;
