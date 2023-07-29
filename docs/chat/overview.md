---
description: "Hopfield handles function calling easily."
title: "Templates"
---

# Embeddings

Hopfield handles function calling easily.

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

The input function definition will be validated to make sure that:

1. Descriptions are provided for every argument.
2. No error-prone types are used as args (this includes `ZodTuple`, `ZodBigInt`, and `ZodAny`).
3. If a type description performs better with a template, it is checked against the template (this currently checks any `ZodEnum`, since enums tend to perform better with a specific description ending).

All of these checks are entirely customizable and can be disabled with the `options` parameter.

You can then use the `HopfieldFunction` with OpenAI:

::: info
This is under construction.
:::
