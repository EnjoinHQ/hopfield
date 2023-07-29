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
const takeAction = (message: string) => {};
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

const response = await chat.get({
  messages,
});

// store all of the streaming chat chunks
const parts: hop.inferResult<typeof chat>[] = [];

for await (const part of response) {
  // if the streaming delta contains new text content
  if (part.choices[0].__type === "content") {
    //                  ^?
    // action based on the delta for the streaming message content
    takeAction(part.choices[0].delta.content);
    //                           ^?

    parts.push(part);
  }
}
```

### Learn more

See how to use streaming results combined with type-driven prompt templates in the
[next section](/chat/templates).
