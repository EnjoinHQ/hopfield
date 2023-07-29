---
description: "Typescript-first LLM framework with static type inference, testability, and composability."
head:
  - - meta
    - name: keywords
      content: ai, openai, zod, gpt, llm, ai-tools
title: "Hopfield: a Typescript-first LLM framework with static type inference, testability, and composability."
titleTemplate: false
---

<p align="center" style="min-height:60px;width:100%;">
  <img img-dark alt="Hopfield" src="/hopfield-w-text.png" height="60" style="width:auto;">
  <img img-light alt="Hopfield" src="/hopfield-white-w-text.png" height="60" style="width:auto;">
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

Hopfield is a Typescript-first large language model framework with static type inference, testability, and composability.
Easily validate LLM responses and inputs with strong types. Flexible abstractions
with best practices baked in.

Add it to your project, along with the `zod` peer dependency:

::: code-group

```bash [pnpm]
pnpm add hopfield zod
```

```bash [npm]
npm i hopfield zod
```

```bash [yarn]
yarn add hopfield zod
```

:::

### ready, set, `hop`

See how easy it is to add composable, type-safe LLM features with Hopfield:

::: code-group

```ts twoslash [main.ts]
// @filename: openai.ts
export const SupportCategoryEnum = z.enum([
  "ACCOUNT_ISSUES",
  "BILLING_AND_PAYMENTS",
  "TECHNICAL_SUPPORT",
  "FEATURE_REQUESTS",
  "BUG_REPORTS",
  "PRODUCT_INQUIRIES",
  "PASSWORD_RESET",
  "SECURITY_ISSUES",
  "SERVICE_OUTAGES",
  "SETUP_AND_INSTALLATION",
  "TROUBLESHOOTING",
  "USER_GUIDES_AND_MANUALS",
  "WARRANTY_AND_REPAIRS",
  "ORDER_TRACKING",
  "DELIVERY_ISSUES",
  "RETURN_AND_REFUND",
  "ACCOUNT_DELETION",
  "PRIVACY_CONCERNS",
  "COMPLIANCE_QUERY",
  "TRAINING_AND_CERTIFICATIONS",
  "PARTNER_SUPPORT",
  "DEVELOPER_TOOLS",
  "API_SUPPORT",
  "PERFORMANCE_ISSUES",
  "DATA_ISSUES",
  "UPGRADE_ISSUES",
  "MIGRATION_ASSISTANCE",
  "SYSTEM_COMPATIBILITY",
  "PAYMENT_GATEWAY_SUPPORT",
  "SYSTEM_MAINTENANCE",
  "RELEASE_NOTES",
  "OTHERS",
]);

import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";
import z from "zod";

const hopfield = hop.client(openai).provider(new OpenAI());

const categoryDescription = hopfield
  .template()
  .enum("The category of the message.");

const classifyMessage = hopfield.function({
  name: "classifyMessage",
  description: "Triage an incoming support message.",
  parameters: z.object({
    summary: z.string().describe("The summary of the message."),
    category: SupportCategoryEnum.describe(categoryDescription),
  }),
});

export const chat = hopfield.chat().functions([classifyMessage]);

// @filename: main.ts
import z from "zod";
import { SupportCategoryEnum } from "./openai";
const handleMessageWithCategory = async (
  category: z.infer<typeof SupportCategoryEnum>,
  message: string
) => {};

// ---cut---
import hop from "hopfield";
import { chat } from "./openai";

const incomingUserMessage = "How do I reset my password?";

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    content: incomingUserMessage,
    role: "user",
  },
];

const parsed = await chat.get({
  messages,
});

if (parsed.choices[0].__type === "function_call") {
  //                    ^?
  const category = parsed.choices[0].message.function_call.arguments.category;
  await handleMessageWithCategory(category, incomingUserMessage);
  //                                 ^?
}
```

```ts twoslash [openai.ts]
export const SupportCategoryEnum = z.enum([
  "ACCOUNT_ISSUES",
  "BILLING_AND_PAYMENTS",
  "TECHNICAL_SUPPORT",
  "FEATURE_REQUESTS",
  "BUG_REPORTS",
  "PRODUCT_INQUIRIES",
  "PASSWORD_RESET",
  "SECURITY_ISSUES",
  "SERVICE_OUTAGES",
  "SETUP_AND_INSTALLATION",
  "TROUBLESHOOTING",
  "USER_GUIDES_AND_MANUALS",
  "WARRANTY_AND_REPAIRS",
  "ORDER_TRACKING",
  "DELIVERY_ISSUES",
  "RETURN_AND_REFUND",
  "ACCOUNT_DELETION",
  "PRIVACY_CONCERNS",
  "COMPLIANCE_QUERY",
  "TRAINING_AND_CERTIFICATIONS",
  "PARTNER_SUPPORT",
  "DEVELOPER_TOOLS",
  "API_SUPPORT",
  "PERFORMANCE_ISSUES",
  "DATA_ISSUES",
  "UPGRADE_ISSUES",
  "MIGRATION_ASSISTANCE",
  "SYSTEM_COMPATIBILITY",
  "PAYMENT_GATEWAY_SUPPORT",
  "SYSTEM_MAINTENANCE",
  "RELEASE_NOTES",
  "OTHERS",
]);

// ---cut---
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";
import z from "zod";

const hopfield = hop.client(openai).provider(new OpenAI());

const categoryDescription = hopfield
  .template()
  .enum("The category of the message.");

const classifyMessage = hopfield.function({
  name: "classifyMessage",
  description: "Triage an incoming support message.",
  parameters: z.object({
    summary: z.string().describe("The summary of the message."),
    category: SupportCategoryEnum.describe(categoryDescription),
    //                                        ^?
  }),
});

export const chat = hopfield.chat().functions([classifyMessage]);
```

:::

## TL;DR

Hopfield might be a good fit for your project if:

- 🏗️ You build with Typescript/Javascript, and have your database schemas in these languages (e.g. [Prisma](https://www.prisma.io/) and/or [Next.js](https://nextjs.org/)).
- 🪨 You don't need a heavyweight LLM orchestration framework that ships with a ton of dependencies you'll never use.
- 🤙 You're using OpenAI function calling and/or custom tools, and want Typescript-native features for them (e.g. validations w/ [Zod](https://github.com/colinhacks/zod)).
- 💬 You're building complex LLM interactions which use memory & [RAG](https://www.promptingguide.ai/techniques/rag), evaluation, and orchestration (_coming soon™_).
- 📝 You want best-practice, extensible templates, which use [string literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
  under the hood for transparency.

Oh, and liking Typescript is a nice-to-have.

## Guiding principles

- 🌀 We are Typescript-first, and only support TS (or JS) - with services like [Replicate](https://replicate.com/) or [OpenAI](https://platform.openai.com/docs/introduction), why do you need Python?
- 🤏 We provide a simple, ejectable interface with common LLM use-cases. This is aligned 1-1 with LLM provider abstractions, like OpenAI's.
- 🪢 We explicitly _don't_ provide a ton of custom tools (please don't ask for too many 😅) outside of the building blocks and simple examples provided. Other frameworks provide these, but when you use them, you soon realize the tool you want is very use-case specific.
- 🧪 We (will) provide evaluation frameworks which let you simulate user scenarios and backend interactions with the LLM, including multi-turn conversations and function calling.
- 🐶 We support Node.js, Vercel Edge Functions, Cloudflare Workers, and more (oh and even web, if you like giving away API keys).

## Community

If you have questions or need help, reach out to the community at the [Hopfield GitHub Discussions](https://github.com/propology/hopfield/discussions)
or join the [Propology Discord](https://discord.gg/2hag5fc6) and check out the `🐇-hopfield` channel.

## Learn More

Read the [Getting Started](/guide/getting-started) guide to learn more how to use Hopfield.

Shoutout to these projects which inspired us:

- [Zod](https://github.com/colinhacks/zod)
- [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema)
- [Autochain](https://github.com/Forethought-Technologies/AutoChain)
- [Langchain.js](https://github.com/hwchase17/langchainjs)
- [simpleaichat](https://github.com/minimaxir/simpleaichat)
- [Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT)
- [abitype](https://github.com/wagmi-dev/abitype)

If you like Hopfield, go star them on Github too.
