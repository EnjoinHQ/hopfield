import { expect, it } from 'vitest';

import * as Exports from './streaming.js';
import { test } from 'vitest';

import { weatherFunction } from '../../_test/function.js';
import { openai } from '../../_test/openai.js';
import hop, { type OpenAIChatMessage } from '../../index.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "EmptyDelta",
      "ChoiceWithContentDelta",
      "ChoiceWithContentFilterDelta",
      "ChoiceWithRoleDelta",
      "ChoiceWithStopReasonDelta",
      "ChoiceWithLengthReasonDelta",
      "OpenAIChatStreamingSchema",
      "OpenAIStreamingChat",
    ]
  `);
});

test('should set a default model name with no provider', async () => {
  expect(hop.chat('gpt-3.5-turbo-16k').streaming().model).toMatchInlineSnapshot(
    '"gpt-3.5-turbo-16k"',
  );
});

test('should set a default model name', async () => {
  expect(hop.provider(openai).chat().streaming().model).toMatchInlineSnapshot(
    '"gpt-3.5-turbo-0613"',
  );
});

test('should get a streaming chat response', async () => {
  const chat = hop.provider(openai).chat().streaming();

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

  const parts: hop.inferStreamingResult<typeof chat>[] = [];

  for await (const part of parsed) {
    parts.push(part);
  }

  expect(
    parts.map((part) => part.choices.map((choice) => choice._type)).join(', '),
  ).toMatchInlineSnapshot('"ROLE, CONTENT, CONTENT, CONTENT, STOP"');
  expect(
    parts
      .map((part) => part.choices.map((choice) => mapChoiceToString(choice)))
      .join(', '),
  ).toMatchInlineSnapshot('"assistant, Ban, ana, ., STOP"');
}, 5000);

test('should get a streaming chat function call', async () => {
  const chat = hop
    .provider(openai)
    .chat()
    .streaming()
    .functions([weatherFunction]);

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content: "What's the weather in Phoenix, Arizona?",
    },
  ];

  const result = await chat.get({
    messages,
    temperature: 0,
  });

  const parts: hop.inferStreamingResult<typeof chat>[] = [];

  for await (const part of result) {
    parts.push(part);
  }

  expect(
    parts.map((part) => part.choices.map((choice) => choice._type)).join(', '),
  ).toMatchInlineSnapshot(
    '"ROLE, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_ARG, FUNCTION_CALL"',
  );

  expect(
    parts
      .map((part) => part.choices.map((choice) => mapChoiceToString(choice)))
      .join(' '),
  ).toMatchInlineSnapshot(`
    "assistant {
        \\" location \\":  \\" Phoenix ,  Arizona \\",
        \\" unit \\":  \\" c elsius \\"
     } function_call"
  `);
}, 5000);

test('should parse a chat completions response', async () => {
  const chat = hop.chat();

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content:
        "What's the better word: banana, or aardvark? Choose one and only say it.",
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

test('should parse a chat completions streaming response', async () => {
  const chat = hop.chat().streaming();

  const messages: OpenAIChatMessage[] = [
    {
      role: 'user',
      content:
        "What's the better word: banana, or aardvark? Choose one and only say it.",
    },
  ];

  const response = await openai.chat.completions.create(
    chat.parameters.parse({
      messages,
      temperature: 0,
    }),
  );

  const parts: hop.inferStreamingResult<typeof chat>[] = [];

  for await (const part of response) {
    const parsed = await chat.returnType.parseAsync(part);
    parts.push(parsed);
  }

  expect(
    parts
      .map((part) => part.choices.map((choice) => mapChoiceToString(choice)))
      .join(', '),
  ).toMatchInlineSnapshot('"assistant, Ban, ana, ., STOP"');
}, 5000);

const streaming = hop
  .chat()
  .streaming()
  .functions([hop.function(weatherFunction)]);

const mapChoiceToString = (
  choice: hop.inferStreamingResult<typeof streaming>['choices'][number],
) =>
  choice._type === 'CONTENT'
    ? choice.delta.content
    : choice._type === 'FUNCTION_CALL'
    ? choice.finish_reason
    : choice._type === 'ROLE'
    ? choice.delta.role
    : choice._type === 'FUNCTION_ARG'
    ? choice.delta.function_call.arguments
    : choice._type === 'FUNCTION_NAME'
    ? choice.delta.function_call.name
    : choice._type === 'CONTENT_FILTER'
    ? choice.delta.content
    : choice._type === 'LENGTH_STOP'
    ? choice.delta.content
    : choice._type;
