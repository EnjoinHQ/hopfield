---
description: "Deep dive into how to get streaming chat responses with Hopfield."
title: "Chat - Non-streaming"
---

# Streaming chat

Hopfield provides a simple way to interact with streaming chat models. You can use various
API providers with type guarantees with Zod.

## Usage

Use streaming chat models from OpenAI with a few lines of code:

```ts twoslash
const takeAction = async (message: string) => {};
// ---cut---
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

const response = await chat.get(
  {
    messages,
  },
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
  }
);

// store all of the streaming chat chunks
const parts: hop.inferResult<typeof chat>[] = [];

for await (const part of response) {
  parts.push(part);

  // if the streaming delta contains new text content
  if (part.choices[0].__type === "content") {
    //                  ^?
    // action based on the delta for the streaming message content
    await takeAction(part.choices[0].delta.content);
    //                                  ^?
  }
}
```

### Learn more

See how to use streaming results combined with type-driven prompt templates in the
[next section](/chat/templates).
