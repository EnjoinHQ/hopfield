<br/>

<p align="center">
  <a href="https://hopfield.ai">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-dark.svg">
      <img alt="Hopfield logo" src="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-light.svg" width="auto" height="120">
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
  <a href="https://github.com/propology/hopfield/blob/main/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/l/hopfield?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/l/hopfield?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="MIT License">
    </picture>
  </a>
</div>

---

Minimal typescript library for easy, testable interactions with LLMs.

<!-- ```ts
import type { AbiParametersToPrimitiveTypes, ExtractAbiFunctions, ExtractAbiFunctionNames } from 'hopfield'
import { erc20Abi } from 'hopfield/test'

type FunctionNames = ExtractAbiFunctionNames<typeof erc20Abi, 'view'>
//   ^? type FunctionNames = "symbol" | "name" | "allowance" | "balanceOf" | "decimals" | "totalSupply"

type TransferInputTypes = AbiParametersToPrimitiveTypes<
  // ^? type TransferInputTypes = readonly [`0x${string}`, bigint]
  ExtractAbiFunction<typeof erc20Abi, 'transfer'>['inputs']
>
``` -->

## TL;DR

Hopfield might be a good fit for your project if:

- 🏗️ You build with Typescript/Javascript, and have your database schemas in these languages (e.g. [Prisma](https://www.prisma.io/) and/or [Next.js](https://nextjs.org/)).
- 🪨 You don't need a heavyweight LLM orchestration framework (that ships with a ton of dependencies you'll never use).
- 💬 You're building complex LLM interactions which need evaluation.
- 🤙 You're using OpenAI function calling and/or custom tools, and want Typescript-native features for them (e.g. [Zod](https://github.com/colinhacks/zod) as a first-class citizen).
- 📝 You want simple and extensible conversational memory.
- 📝 You want simple and extensible conversational memory.

### Our guiding principles

- 🌀 We are Typescript-first, and only support TS (or JS) - with services like [Replicate](https://replicate.com/) or [OpenAI](https://platform.openai.com/docs/introduction), why do you need Python?
- 🤏 We provide a simple interface with common LLM use-cases. This is aligned 1-1 with OpenAI's abstractions.
- 🪢 We explicitly _don't_ provide tons of custom tools (please don't ask for too many 😅) outside of the building blocks and simple examples provided. Other orchestration frameworks provide many, but when you use them, you soon realize the tool you want is very use-case specific.
- 🧪 We provide evaluation frameworks which let you simulate user scenarios and backend interactions with the LLM, including multi-turn conversations and function calling.
- 🐶 We support Node.js, Vercel Edge Functions, Cloudflare Workers, and more (we expect `fetch` to be in the global namespace, as it is in web, edge and modern Node environments, but support also custom `fetch`).

## Install

```bash
pnpm add hopfield
```

```bash
npm i hopfield
```

```bash
yarn add hopfield
```

## Documentation

For full documentation, visit [hopfield.ai](https://hopfield.ai).

## Community

If you have questions or need help, reach out to the community at the [Hopfield GitHub Discussions](https://github.com/propology/hopfield/discussions).

## Roadmap

- Temp

<!-- PaLM Chat (Bard) and Anthropic Claude support
More fun/feature-filled CLI chat app based on Textual
Simple example of using simpleaichat in a webapp
Simple of example of using simpleaichat in a stateless manner (e.g. AWS Lambda functions) -->

## Inspiration

Shoutout to these projects which inspired Hopfield:

- [Zod](https://github.com/colinhacks/zod)
- [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema) (we had to fork to be able to introspect the zod schema)
- [Autochain](https://github.com/Forethought-Technologies/AutoChain)
- [Langchain.js](https://github.com/hwchase17/langchainjs)
- [simpleaichat](https://github.com/minimaxir/simpleaichat)
- [Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT)

And many others.

## Contributing

If you're interested in contributing to Hopfield, please read our [contributing docs](https://github.com/propology/hopfield/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.
