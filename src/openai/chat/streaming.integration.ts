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

    let content = '';

    for await (const part of response) {
      content +=
        part.choices[0].__type === 'content'
          ? part.choices[0].delta.content
          : '';
    }

    expect(content).toMatchInlineSnapshot('"Fold and devour."');
  },
  TEST_TIMEOUT,
);

test(
  'should respond with multiple choices',
  async () => {
    const response = await chatMultiple.get(
      {
        messages,
        temperature: 0,
      },
      {
        onChunk(value) {
          console.log(value.choices[0].delta);
        },
      },
    );

    let content1 = '';
    let content2 = '';

    for await (const part of response) {
      if (part.choices[0].index === 0) {
        content1 +=
          part.choices[0].__type === 'content'
            ? part.choices[0].delta.content
            : '';
      } else {
        content2 +=
          part.choices[0].__type === 'content'
            ? part.choices[0].delta.content
            : '';
      }
    }

    expect(content1).toMatchInlineSnapshot('"Fold and devour."');

    expect(content2).toMatchInlineSnapshot('"Fold and devour."');
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

    let content = '';

    // use the readableStream
    const reader = response.readableStream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      content +=
        value.choices[0].__type === 'content'
          ? value.choices[0].delta.content
          : '';
    }

    expect(content).toMatchInlineSnapshot('"Fold and devour."');
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

    let content = '';

    // use the readableStream
    const reader = response.readableStream().getReader();

    let readCount = 0;
    const MAX_READS_BEFORE_CANCEL = 2; // Change this value based on when you want to cancel

    while (true) {
      const { done, value } = await reader.read();
      if (done || readCount >= MAX_READS_BEFORE_CANCEL) {
        reader.cancel(); // Cancel the reading after certain chunks are read
        break;
      }
      content +=
        value.choices[0].__type === 'content'
          ? value.choices[0].delta.content
          : '';
      readCount++;
    }

    expect(content).toMatchInlineSnapshot('"Fold"');

    const postCancelRead = await reader.read();
    expect(postCancelRead.done).toBe(true);
    expect(postCancelRead.value).toBeUndefined();
  },
  TEST_TIMEOUT,
);
