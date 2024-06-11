<br/>

<p align="center">
  <a href="https://hopfield.ai">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/EnjoinHQ/hopfield/main/.github/hopfield-w-text.png">
      <img alt="Hopfield logo" src="https://raw.githubusercontent.com/EnjoinHQ/hopfield/main/.github/hopfield-white-w-text.png" width="auto" height="120">
    </picture>
  </a>
</p>

<div align="center">
  <a href="https://www.npmjs.com/package/hopfield">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/hopfield?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/v/hopfield?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://www.npmjs.com/package/hopfield">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/dm/hopfield?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/dm/hopfield?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Downloads per month">
    </picture>
  </a>
  <a href="https://github.com/EnjoinHQ/hopfield/blob/main/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/l/hopfield?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/l/hopfield?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="MIT License">
    </picture>
  </a>
</div>

---

Typescript-first LLM framework with static type inference, testability, and composability.

```ts
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";
import z from "zod";

// create an OpenAI hopfield client
const hopfield = hop.client(openai).provider(new OpenAI());

// use description templates with Typescript string literal types
const categoryDescription = hopfield
  .template()
  .enum("The category of the message.");

// define functions for LLMs to call, with Zod validations
const classifyMessage = hopfield.function({
  name: "classifyMessage",
  description: "Triage an incoming support message.",
  parameters: z.object({
    summary: z.string().describe("The summary of the message."),
    category: z
      .enum([
        "ACCOUNT_ISSUES",
        "BILLING_AND_PAYMENTS",
        "TECHNICAL_SUPPORT",
        "OTHERS",
      ])
      .describe(categoryDescription),
  }),
});

// create a client with function calling
const chat = hopfield.chat().functions([classifyMessage]);

const incomingUserMessage = "How do I reset my password?";

// use utility types to infer inputs for a simple devex
const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    content: incomingUserMessage,
    role: "user",
  },
];

// use the built-in LLM API calls (or just use the input/output Zod validations)
const parsed = await chat.get({
  messages,
});

// get type-strong responses with `__type` helpers
if (parsed.choices[0].__type === "function_call") {
  // automatically validate the arguments returned from the LLM
  // we use the Zod schema you passed, for maximum flexibility in validation
  const category = parsed.choices[0].message.function_call.arguments.category;
  await handleMessageWithCategory(category, incomingUserMessage);
}
```

## TL;DR

Hopfield might be a good fit for your project if:

- 🏗️ You build with Typescript/Javascript, and have your database schemas in these languages (e.g. [Prisma](https://www.prisma.io/) and/or [Next.js](https://nextjs.org/)).
- 🪨 You don't need a heavyweight LLM orchestration framework that ships with a ton of dependencies you'll never use.
- 🤙 You're using OpenAI function calling and/or custom tools, and want Typescript-native features for them (e.g. validations w/ [Zod](https://github.com/colinhacks/zod)).
- 💬 You're building complex LLM interactions which use memory & [RAG](https://www.promptingguide.ai/techniques/rag), evaluation, and orchestration (_Coming Soon™_).
- 📝 You want best-practice, extensible templates, which use [string literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
  under the hood for transparency.

Oh, and liking Typescript is a nice-to-have.

## Guiding principles

- 🌀 We are Typescript-first, and only support TS (or JS) - with services like [Replicate](https://replicate.com/) or [OpenAI](https://platform.openai.com/docs/introduction), why do you need Python?
- 🤏 We provide a simple, ejectable interface with common LLM use-cases. This is aligned 1-1 with LLM provider abstractions, like OpenAI's.
- 🪢 We explicitly _don't_ provide a ton of custom tools (please don't ask for too many 😅) outside of the building blocks and simple examples provided. Other frameworks provide these, but when you use them, you soon realize the tool you want is very use-case specific.
- 🧪 We (will) provide evaluation frameworks which let you simulate user scenarios and backend interactions with the LLM, including multi-turn conversations and function calling.
- 🐶 We support Node.js, Vercel Edge Functions, Cloudflare Workers, and more (oh and even web, if you like giving away API keys).

## Install

```bash
npm i hopfield
```

## Documentation

For full documentation, visit [hopfield.ai](https://hopfield.ai).

## Community

If you have questions or need help, reach out to the community in the [Hopfield GitHub Discussions](https://github.com/EnjoinHQ/hopfield/discussions).

## Inspiration

Shoutout to these projects which inspired us:

- [Zod](https://github.com/colinhacks/zod)
- [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema)
- [Autochain](https://github.com/Forethought-Technologies/AutoChain)
- [Langchain.js](https://github.com/hwchase17/langchainjs)
- [simpleaichat](https://github.com/minimaxir/simpleaichat)
- [Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT)
- [abitype](https://github.com/wagmi-dev/abitype)

If you like Hopfield, go star them on Github too.

## Contributing

If you're interested in contributing to Hopfield, please read our [contributing docs](https://github.com/EnjoinHQ/hopfield/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.
