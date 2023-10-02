---
description: "A detailed guide on seamlessly fetching and streaming data directly into React components."
title: "Next.js App Router with Hopfield"
---

# Next.js App Router

Hopfield empowers developers to seamlessly fetch and stream data directly into Next.js React Server Components.

## Overview

The `readableStream` from Hopfield's streaming chat provider uses [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
(available in Node 18+) to easily work with streams. The `ReadableStream` handles backpressure with a pull-based approach.

::: info Backpressure

See our [tests](https://github.com/propology/hopfield/blob/main/src/utils.test.ts) for how Hopfield handles backpressure correctly.

For a detailed explanation on "backpressure" and how it factors into streaming LLM responses, please see the
[`vercel/ai` docs](https://sdk.vercel.ai/docs/concepts/backpressure-and-cancellation).

:::

## Usage

Here's how to use Hopfield within a React Server Component:

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
const chat = hopfield.chat("gpt-3.5-turbo-16k-0613").streaming();

export async function ChatResponse() {
  // construct messages with hop.inferMessageInput
  const messages: hop.inferMessageInput<typeof chat>[] = [
    {
      role: "system",
      content: "You are a helpful AI assistant.",
    },
    {
      role: "user",
      content: "How do you make pumpkin pie?",
    },
  ];

  const response = await chat.get(
    { messages: messages },
    {
      callbacks: {
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
      },
    }
  );

  // pass the `readableStream` to the RSC
  return <Tokens stream={response.readableStream} />;
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

::: info

See our [Next 13 RSC example](https://next-13.hopfield.ai) for a real-world integration
using Vercel.

:::

## Parameters

### Iterable

This is the asynchronous iterable you aim to convert - the response from a chat provider.

### onDone

An optional callback triggered upon the exhaustion of the async iterable. It receives a
compilation of all values extracted from the iterable.

### Dive Deeper

To gain a more profound understanding of working with readable streams and async iterables, consider perusing the Streams & Async Iterables section.

## Integration with React

::: info

The above code demonstrates the integration of Hopfield within a Next.js React component. The `CodeChat` function fetches data using Hopfield and streams the response to the `Tokens` component for rendering.

:::

## Important Note

Remember to install necessary packages, set environment variables, and understand the underlying Hopfield package to ensure smooth integration within your Next.js app. Ensure you handle potential errors and edge cases to maintain a robust application.

### Dive Deeper

To deepen your understanding of how Hopfield works, and how it can be further utilized within your application, refer to the [Hopfield documentation](https://hopfield.ai).

```tsx
// we add callbacks on chunk and when the stream is finished
const callbacks: hop.StreamingCallbacks<hop.inferStreamingChunk<typeof chat>> =
  {
    onChunk(value) {
      console.log(`Received chunk type: ${value.choices[0].__type}`);
    },
    onDone: async (data) => {
      // we map to a string to store in Redis, to save on costs :sweat:
      const storedResponse = data
        .map((chunk) =>
          chunk.choices[0].__type === "content"
            ? chunk.choices[0].delta.content
            : ""
        )
        .join("");

      await kv.set(promptHash, storedResponse);
      // expire every ten minutes
      await kv.expire(promptHash, 60 * 10);
    },
  };
```
