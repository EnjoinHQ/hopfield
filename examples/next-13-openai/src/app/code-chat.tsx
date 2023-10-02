import { Suspense } from 'react';

import hop from 'hopfield';
import openai from 'hopfield/openai';
import OpenAI from 'openai';
import { kv } from '@vercel/kv';
import { docs } from './docs';
import { hashString } from './hash';

// Create an OpenAI API client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Instantiate a new Hopfield client with the OpenAI API client
const hopfield = hop.client(openai).provider(openaiClient);

// Create the Hopfield streaming chat provider
const chat = hopfield.chat('gpt-3.5-turbo-16k-0613').streaming();

const prompt = `Provide a cool use of Hopfield from the context below, with a short paragraph introduction of what Hopfield does, and then a Typescript example in 20 lines of code or less: \n\n${docs}`;

export async function CodeChat() {
  const promptHash = await hashString(prompt);

  const cachedResponse = await getCachedResponse(promptHash);

  if (cachedResponse) {
    return cachedResponse;
  }

  // construct messages with hop.inferMessageInput
  const messages: hop.inferMessageInput<typeof chat>[] = [
    {
      role: 'system',
      content:
        'You are a developer evangelist for the Hopfield Typescript npm package. You ALWAYS respond using Markdown. The docs for Hopfield are located at https://hopfield.ai.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  // we add callbacks on chunk and when the stream is finished
  const callbacks: hop.StreamingCallbacks<
    hop.inferStreamingChunk<typeof chat>
  > = {
    onChunk: async (value) => {
      console.log(`Received chunk type: ${value.choices[0].__type}`);
    },
    onDone: async (chunks) => {
      console.log(`Total chunks received: ${chunks.length}`);
      // we map to a string to store in Redis, to save on costs :sweat:
      const storedResponse = chunks
        .map((chunk) =>
          chunk.choices[0].__type === 'content'
            ? chunk.choices[0].delta.content
            : '',
        )
        .join('');

      await kv.set(promptHash, storedResponse);
      // expire every ten minutes
      await kv.expire(promptHash, 60 * 10);
    },
  };

  // Get a streaming chat completion
  const response = await chat.get({ messages: messages }, { callbacks });

  return <Tokens stream={response.readableStream()} />;
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

type RecursiveTokensProps = {
  reader: ReadableStreamDefaultReader<hop.inferResult<typeof chat>>;
};

async function RecursiveTokens({ reader }: RecursiveTokensProps) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  return (
    <>
      {value.choices[0].__type === 'content' ? (
        value.choices[0].delta.content
      ) : (
        <></>
      )}
      <Suspense fallback={<LoadingDots />}>
        <RecursiveTokens reader={reader} />
      </Suspense>
    </>
  );
}

// This can be any loading indicator you want, which gets appended to the end
// of the tokens while waiting for the next token to be streamed
const LoadingDots = () => <span>...</span>;

const getCachedResponse = async (prompt: string) => {
  const cached = (await kv.get(prompt)) as string | undefined;

  if (cached) {
    const chunks = cached.split(' ');
    const stream = new ReadableStream<hop.inferResult<typeof chat>>({
      async start(controller) {
        let id = 0;
        for (const chunk of chunks) {
          const fakeChunk: hop.inferResult<typeof chat> = {
            model: 'gpt-3.5-turbo-16k-0613',
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

  return null;
};
