---
description: "A detailed guide on converting async iterables to readable streams with the readableFromAsyncIterable function."
title: "readableFromAsyncIterable"
---

# `readableFromAsyncIterable`

Creates a readable stream from an asynchronous iterable.

## Overview

The `readableFromAsyncIterable` function provides a mechanism to convert an async iterable into a readable stream.

The function also provides backpressure handling with a pull-based stream and features an optional callback to be invoked when the async iterable is exhausted.

::: info Backpressure

For a detailed explanation on backpressure, please see
[Vercel's `ai` docs](https://sdk.vercel.ai/docs/concepts/backpressure-and-cancellation).

:::

## Usage

Here's how to use it:

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat().streaming();

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the coolest way to count to ten?",
  },
];

// ---cut---
import { readableFromAsyncIterable } from "hopfield";

// Assuming you have a streaming chat provider
const response = await chat.get({ messages: messages });

const stream = readableFromAsyncIterable(response, {
  onDone: async (data) => {
    // Process and store data, e.g., in a cache
    // ...
  },
});

// Use the created ReadableStream in a React Server Component
//   e.g. return <Tokens stream={stream} />;
// Or an API response in Node.js
//   return new Response(stream, ...);
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
