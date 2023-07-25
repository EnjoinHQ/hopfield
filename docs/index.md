---
description: "Minimal typescript library for type-safe, testable interactions with LLMs"
head:
  - - meta
    - name: keywords
      content: ai, openai, gpt, llm, ai-tools
title: "Hopfield: Minimal typescript library for type-safe, testable interactions with LLMs"
titleTemplate: false
---

<p align="center" style="min-height:60px;width:100%;">
  <img img-dark alt="Hopfield" src="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-dark.svg" height="60" style="width:auto;">
  <img img-light alt="Hopfield" src="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-light.svg" height="60" style="width:auto;">
</p>

<div style="margin-top:1rem;display:flex;gap:0.5rem;min-height:48px;max-width:350px;flex-wrap:wrap;margin-right:auto;margin-left:auto;justify-content:center;margin-bottom:3rem;">
  <a href="https://www.npmjs.com/package/hopfield">
    <img img-dark src="https://img.shields.io/npm/v/hopfield?colorA=2e2e33&colorB=2e2e33&style=flat" alt="Version">
    <img img-light src="https://img.shields.io/npm/v/hopfield?colorA=fafafa&colorB=fafafa&style=flat" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/hopfield">
    <picture>
      <img img-dark src="https://img.shields.io/npm/dm/hopfield?colorA=2e2e33&colorB=2e2e33&style=flat" alt="Downloads per month">
      <img img-light src="https://img.shields.io/npm/dm/hopfield?colorA=fafafa&colorB=fafafa&style=flat" alt="Downloads per month">
    </picture>
  </a>
  <a href="https://github.com/propology/hopfield/blob/main/LICENSE">
    <picture>
      <img img-dark src="https://img.shields.io/npm/l/hopfield?colorA=2e2e33&colorB=2e2e33&style=flat" alt="MIT License">
      <img img-light src="https://img.shields.io/npm/l/hopfield?colorA=fafafa&colorB=fafafa&style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://github.com/propology/hopfield">
    <picture>
      <img img-dark src="https://img.shields.io/github/stars/propology/hopfield?colorA=2e2e33&colorB=2e2e33&style=flat" alt="GitHub Repo stars">
      <img img-light src="https://img.shields.io/github/stars/propology/hopfield?colorA=fafafa&colorB=fafafa&style=flat" alt="GitHub Repo stars">
    </picture>
  </a>
</div>

Minimal typescript library for type-safe, testable interactions with LLMs.

Easily validate input/output with extremely strong types. No confusing abstractions, with best practices baked in.

```tsx
import { oa } from "hopfield";
import { z } from "zod";
import OpenAI from "openai";

const weatherFunction = z
  .function()
  .args(
    z.object({
      location: z
        .string()
        .describe("The city and state, e.g. San Francisco, CA"),
      unit: z
        .enum(["celsius", "fahrenheit"])
        .describe(oa.template.function.enum("The unit for the temperature.")),
    })
  )
  .describe("Get the current weather in a given location");

const hopfieldFunction = oa.function({
  schema: weatherFunction,
  name: "getCurrentWeather",
});

const openai = new OpenAI({ apiKey: "{OPENAI_API_KEY}" });

const messages = [
  {
    role: "user",
    content: "What's the weather in San Francisco?",
  },
];

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo-16k-0613",
  messages,
  temperature: 0,
  functions: [hopfieldFunction.input],
});

const parsed = hopfieldFunction.output.parse(
  response.choices?.[0]?.message?.function_call
);

console.log(parsed);
// {
//   "arguments": {
//     "location": "San Francisco, CA",
//     "unit": "celsius",
//   },
//   "name": "getCurrentWeather",
// }
```

The input function definition will be validated to make sure that:

1. Descriptions are provided for every argument.
2. No error-prone types are used as args (this includes `ZodTuple`, `ZodBigInt`, and `ZodAny`).
3. If a type description performs better with a template, it is checked against the template (this currently checks any `ZodEnum`, since enums tend to perform better with a specific description ending).

All of these checks are entirely customizable and can be disabled with the `options` parameter.

You can then use the `HopfieldFunction` with OpenAI:

```tsx
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "{OPENAI_API_KEY}" });

const messages = [
  {
    role: "user",
    content: "What's the weather in San Francisco?",
  },
];

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo-16k-0613",
  messages,
  temperature: 0,
  functions: [hopfieldFunction.input],
});

const parsed = hopfieldFunction.output.parse(
  response.choices?.[0]?.message?.function_call
);

console.log(parsed);
// {
//   "arguments": {
//     "location": "San Francisco, CA",
//     "unit": "celsius",
//   },
//   "name": "getCurrentWeather",
// }
```

## TL;DR

Hopfield might be a good fit for your project if:

- 🏗️ You build with Typescript/Javascript, and have your database schemas in these languages (e.g. [Prisma](https://www.prisma.io/) and/or [Next.js](https://nextjs.org/)).
- 🪨 You don't need a heavyweight LLM orchestration framework (that ships with a ton of dependencies you'll never use).
- 💬 You're building complex LLM interactions which need evaluation.
- 🤙 You're using OpenAI function calling and/or custom tools, and want Typescript-native features for them (e.g. using [Zod](https://github.com/colinhacks/zod)).
- 📝 You want simple and extensible conversational memory.

### Our guiding principles

- 🌀 We are Typescript-first, and only support TS (or JS) - with services like [Replicate](https://replicate.com/) or [OpenAI](https://platform.openai.com/docs/introduction), why do you need Python?
- 🤏 We provide a simple interface with common LLM use-cases. This is aligned 1-1 with OpenAI's abstractions.
- 🪢 We explicitly _don't_ provide tons of custom tools (please don't ask for too many 😅) outside of the building blocks and simple examples provided. Other orchestration frameworks provide many, but when you use them, you soon realize the tool you want is very use-case specific.
- 🧪 We provide evaluation frameworks which let you simulate user scenarios and backend interactions with the LLM, including multi-turn conversations and function calling.
- 🐶 We support Node.js, Vercel Edge Functions, Cloudflare Workers, and more (we expect `fetch` to be in the global namespace, as it is in web, edge and modern Node environments, but support also custom `fetch`).

## Install

Read the [Getting Started](/guide/getting-started) guide to learn more how to use Hopfield.

::: code-group

```bash [pnpm]
pnpm add hopfield
```

```bash [npm]
npm i hopfield
```

```bash [yarn]
yarn add hopfield
```

:::

## Community

If you have questions or need help, reach out to the community at the [Hopfield GitHub Discussions](https://github.com/propology/hopfield/discussions).
