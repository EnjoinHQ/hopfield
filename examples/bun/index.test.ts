import { expect, test } from 'vitest';

import hop from 'hopfield';
import openai from 'hopfield/openai';
import OpenAI from 'openai';

const openaiClient = new OpenAI({
  apiKey: Bun.env.OPENAI_API_KEY || '',
});

const hopfield = hop.client(openai).provider(openaiClient);

const chat = hopfield.chat('gpt-3.5-turbo-1106');

test('test non-streaming chat', async () => {
  const result = await chat.get({
    temperature: 0,
    messages: [
      {
        role: 'user',
        content:
          "What's the coolest way to count to ten? Respond in three words or less.",
      },
    ],
  });

  expect(result.choices[0].message.content).toEqual('Finger snapping rhythm.');
});
