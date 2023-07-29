---
description: "Deep dive into how to get non-streaming chat responses with Hopfield."
title: "Chat - Non-streaming"
---

# Non-streaming chat

Hopfield provides a simple way to interact with chat models. You can use different
API providers with type guarantees with Zod.

## Usage

Use chat models from OpenAI:

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat();

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the coolest way to count to ten?",
  },
];

const response = await chat.get({
  messages,
});

const responseType = response.choices[0].__type;
//       ^?
if (responseType === "stop") {
  const message = response.choices[0].message;
  //       ^?
}
```

## Parameters

### Model Name

The model name to use for the embedding.

```ts
const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat("gpt-4-0613"); // [!code focus]
```

#### OpenAI

The default model name is shown below. To override this, you must use
a model which is enabled on your OpenAI account.

```ts twoslash
import type { DefaultOpenAIChatModelName } from "hopfield/openai";
//                ^?
```

All possible model names are shown below (reach out if we are missing one!)

```ts twoslash
import type { OpenAIChatModelName } from "hopfield/openai";
//                 ^?
```

---

### Response Count

The count of chat responses to be returned. For all providers, this defaults to `1`.
This is capped at `20`.

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());
// ---cut---
const chat = hopfield.chat("gpt-4-0613", 10);

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the coolest way to get a bunch of chat responses?",
  },
];

const response = await chat.get({
  messages,
});

const chatCount = response.choices.length;
//       ^?
```
