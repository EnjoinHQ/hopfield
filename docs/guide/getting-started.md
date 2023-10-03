---
description: "Quickly add Hopfield to your TypeScript project."
title: "Getting Started"
---

# Getting Started

This section will help you start using Hopfield in your TypeScript project.

## Install

First, you will need to install Hopfield, and a peer dependency, [Zod](https://github.com/colinhacks/zod).

::: code-group

```bash [pnpm]
pnpm add hopfield zod
```

```bash [npm]
npm i hopfield zod
```

```bash [bun]
bun i hopfield zod
```

:::

### OpenAI

You'll also need to set up a Hopfield Provider, which is used to interact with the API.
We currently only support OpenAI (but are working on adding other providers).

To use Hopfield, you will need to install the latest 4+ version of `openai`.

::: code-group

```bash [pnpm]
pnpm add openai@4
```

```bash [npm]
npm i openai@4
```

```bash [yarn]
yarn add openai@4
```

:::

## Create a Provider

We create a Hopfield provider, which stores the provider client and uses it for API requests under
the hood.

```ts
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

// create an OpenAI client (must be prerelease version for latest features)
const openAIClient = new OpenAI({ apiKey: "{OPENAI_API_KEY}" }); // [!code focus]

// use the OpenAI client with Hopfield
// or, you can *not* pass a provider, and just use the runtime validations
const hopfield = hop.client(openai).provider(openAIClient); // [!code focus]
```

## Streaming Chat

We can now create a Streaming Chat instance of Hopfield. We use the provider we created above,
and create a new chat instance.

```ts
export const chat = hopfield.chat().streaming(); // [!code focus]
```

We can now use this chat instance for every chat interaction, with simplified streaming
and other features. Below, we show how to use `get` to interact with the Chat Completions
API, and utility types `inferMessageInput` and `inferResult`
to get the typing of the inputs/outputs for the chat instance.

```ts
import hop from "hopfield";
import { chat } from "./chat";
// [!code focus:12]
const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the coolest way to count to ten?",
  },
];

const response = await chat.get({
  messages,
});
```

We can then stream the response from the chat instance and store the chunks
in an array, as well as take any action for the incoming chunk.

```ts
// store all of the streaming chat chunks
const parts: hop.inferResult<typeof chat>[] = [];

for await (const part of response) {
  // if the streaming delta contains new text content
  if (part.choices[0].__type === "content") {
    // handle the new content
  }

  parts.push(part);
}
```

As you can see, it's super easy to add streaming to your application with minimal dependencies
and a simple async iterator for easy streaming with Zod validation and strict typing.

## What's next?

Now that you're all set up, you are ready to dive in to the docs further!
