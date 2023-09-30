import { Suspense } from 'react';

import hop, { readableFromAsyncIterable } from 'hopfield';
import openai from 'hopfield/openai';
import OpenAI from 'openai';
import { kv } from '@vercel/kv';

// Create an OpenAI API client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Instantiate a new Hopfield client with the OpenAI API client
const hopfield = hop.client(openai).provider(openaiClient);

// Create the Hopfield streaming chat provider
const chat = hopfield.chat('gpt-4-0613').streaming();

export type CityRecsProps = {
  city: string;
  timezone: string;
};

export async function CityRecs({ city, timezone }: CityRecsProps) {
  const prompt = `${city}-${timezone}-1`;

  // See https://sdk.vercel.ai/docs/concepts/caching
  const cached = (await kv.get(prompt)) as string | undefined;

  if (cached) {
    const chunks = cached.split(' ');
    const stream = new ReadableStream<hop.inferResult<typeof chat>>({
      async start(controller) {
        let id = 0;
        for (const chunk of chunks) {
          const fakeChunk: hop.inferResult<typeof chat> = {
            model: 'gpt-4-0613',
            id: String(id++),
            created: Date.now(),
            choices: [
              {
                __type: 'content',
                delta: {
                  content: `${chunk} `,
                },
                finish_reason: null,
                index: 0,
              },
            ],
          };
          controller.enqueue(fakeChunk);
          await new Promise((r) =>
            setTimeout(
              r,
              // get a random number between 10ms and 50ms to simulate a random delay
              Math.floor(Math.random() * 40) + 10,
            ),
          );
        }
        controller.close();
      },
    });

    return <Tokens stream={stream} />;
  }

  const messages: hop.inferMessageInput<typeof chat>[] = [
    {
      role: 'system',
      content:
        "Act like as if you are an expert on the streets. ALWAYS start with 'don't...'. Do NOT mention the timezone in your response. Make your responses funny and a little sassy.",
    },
    {
      role: 'user',
      content: `Provide a list of 5 things you should never do in ${city} in the ${timezone} timezone.`,
    },
  ];

  // Ask OpenAI for a streaming chat completion
  const response = await chat.get({
    messages: messages,
  });

  const stream = readableFromAsyncIterable(response, {
    onDone: async (data) => {
      const storedResponse = data
        .map((chunk) =>
          chunk.choices[0].__type === 'content'
            ? chunk.choices[0].delta.content
            : '',
        )
        .join('');

      await kv.set(prompt, storedResponse);
      await kv.expire(prompt, 60 * 10);
    },
  });

  return <Tokens stream={stream} />;
}

type Props = {
  /**
   * A ReadableStream produced by Hopfield.
   */
  stream: ReadableStream<hop.inferResult<typeof chat>>;
};

/**
 * A React Server Component that recursively renders a stream of tokens.
 * Can only be used inside of server components.
 */
async function Tokens(props: Props) {
  const { stream } = props;
  const reader = stream.getReader();

  return (
    <Suspense>
      <RecursiveTokens reader={reader} />
    </Suspense>
  );
}

type InternalProps = {
  reader: ReadableStreamDefaultReader<hop.inferResult<typeof chat>>;
};

async function RecursiveTokens({ reader }: InternalProps) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <>
      {value.choices[0].__type === 'content' ? (
        value.choices[0].delta.content
      ) : (
        <></>
      )}
      <Suspense fallback={null}>
        <RecursiveTokens reader={reader} />
      </Suspense>
    </>
  );
}
