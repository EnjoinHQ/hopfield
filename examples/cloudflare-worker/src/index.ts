export type Env = {
  OPENAI_API_KEY: string;
};

import hop from 'hopfield';
import openai from 'hopfield/openai';
import OpenAI from 'openai';

export default {
  async fetch(
    _request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const openaiClient = new OpenAI({
      apiKey: env.OPENAI_API_KEY || '',
    });

    const hopfield = hop.client(openai).provider(openaiClient);

    const chat = hopfield.chat('gpt-4o-2024-05-13').streaming();

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

    // Using our readable and writable to handle streaming data
    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();
    const textEncoder = new TextEncoder();

    // loop over the data as it is streamed from OpenAI and write it using our writeable
    for await (const part of result) {
      if (part.choices[0]?.__type === 'content') {
        writer.write(textEncoder.encode(part.choices[0].delta.content));
      }
    }

    writer.close();

    // Send readable back to the browser so it can read the stream content
    return new Response(readable);
  },
};
