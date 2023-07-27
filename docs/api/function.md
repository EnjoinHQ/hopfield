---
description: "Hopfield types as Zod schemas via the `'hopfield/zod'` entrypoint."
title: "Zod"
---

# Zod

Hopfield exports the as [Zod](https://github.com/colinhacks/zod) schemas from the `'hopfield/zod'` entrypoint.

## Install

Install the Zod peer dependency:

::: code-group

```bash [pnpm]
pnpm add zod
```

```bash [npm]
npm i zod
```

```bash [yarn]
yarn add zod
```

:::

## Usage

Import and use schemas:

```ts twoslash
import hop from "hopfield";
import { z } from "zod";
import OpenAI from "openai";

const weatherFunction = hop.function({
  name: "getCurrentWeather",
  description: "Get the current weather in a given location",
  parameters: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
    unit: z
      .enum(["celsius", "fahrenheit"])
      .describe(hop.template.function.enum("The unit for the temperature.")),
  }),
});
const openai = new OpenAI({ apiKey: "{OPENAI_API_KEY}" });

const chat = hop.provider(openai).chat().functions([weatherFunction]);

const parsed = await chat.get({
  messages: [
    {
      role: "user",
      content: "What's the weather in Phoenix, AZ?",
    },
  ],
  temperature: 0,
});

const message = parsed.choices[0]?.message;
//      ^?
```
