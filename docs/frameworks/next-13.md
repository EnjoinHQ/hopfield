---
description: "A detailed guide on seamlessly fetching and streaming data directly into React components."
title: "Next.js App Router with Hopfield"
---

# Next.js App Router

Hopfield empowers developers to seamlessly fetch and stream data directly into Next.js React Server Components.

## Overview

Hopfield streaming chat provides a `readableStream()` which can be used to build recursive React Server Components.

The `readableStream()` from Hopfield's streaming chat provider returns a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) (available in Node 18+, or it can be polyfilled with a library like [web-streams-polyfill](https://www.npmjs.com/package/web-streams-polyfill).).

::: info Non-streaming

If you are not interested in using streaming, you can use the non-streaming chat provider easily with a simple RSC
that awaits the full response from `chat.get()`. This is not shown below, but is a much simpler integration that does not
include any custom code for streaming token by token.

:::

### Backpressure

The readable stream handles backpressure with a pull-based approach. See our [tests](https://github.com/propology/hopfield/blob/main/src/utils.test.ts) for how Hopfield handles backpressure. For a more detailed explanation on "backpressure" and how it factors into streaming LLM responses, please see the
[`vercel/ai` docs](https://sdk.vercel.ai/docs/concepts/backpressure-and-cancellation).

## Usage

Here's how to use Hopfield with a recursive React Server Component using Suspense:

```tsx
import { Suspense } from "react";
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

// Set up the OpenAI client
const openaiClient = new OpenAI({ apiKey: "OPENAI_API_KEY" });
// Pass the OpenAI client into Hopfield
const hopfield = hop.client(openai).provider(openaiClient);
// Create a streaming chat provider
const chat = hopfield.chat("gpt-3.5-turbo-16k-1106").streaming();

export type ChatResponseProps = {
  prompt: string;
};

export async function ChatResponse({ prompt }: ChatResponseProps) {
  // construct messages with hop.inferMessageInput
  const messages: hop.inferMessageInput<typeof chat>[] = [
    {
      role: "system",
      content: "You are a helpful AI assistant.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await chat.get(
    { messages: messages },
    {
      onChunk: async (value) => {
        console.log(`Received chunk type: ${value.choices[0].__type}`);
        // do something on the server with each individual chunk as it is
        // streamed in
      },
      onDone: async (chunks) => {
        console.log(`Total chunks received: ${chunks.length}`);
        // do something on the server when the chat completion is done
        // this can be caching the response, storing in a database, etc.
        //
        // `chunks` is an array of all the streamed responses, so you
        // can access the raw content and combine how you'd like
      },
      // if you are using function calling, you can also add a onFunctionCall
      // here with zod-parsed arguments
    }
  );

  // pass the `readableStream` to the RSC
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
      {value.choices[0].__type === "content" ? (
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
```

We create a recursive React Server Component which uses Suspense boundaries to `await` each token,
and show a fallback loading indicator where the next token will be rendered.

See our [Next 13 RSC example](https://next-13.hopfield.ai) for a real-world integration
using Vercel, similar to this quick example.

### Dive Deeper

To deepen your understanding of how Streaming works, and how it can be further utilized within your application,
refer to the [Streaming Chat](/chat/streaming) section.
