<br/>

<p align="center">
  <a href="https://hopfield.ai">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-dark.svg">
      <img alt="Hopfield logo" src="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-light.svg" width="auto" height="120">
    </picture>
  </a>
</p>

<h3 align="center">
  Hopfield
</h3>

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

<!-- 
```ts
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

Hopfield might be a good option for your project if:

- 🚀 **Lightweight and extensible**: Hopfield provides a streamlined pipeline for crafting generative agents.
- 🔗 **Versatile Functionality**: Our agents can utilize custom tools and support OpenAI function calls.
- 💾 **Efficient Memory Tracking**: Easily monitor conversation - history and tool outputs.
- 🤖 **Automated evaluation:** Conduct multi-turn conversation evaluations with simulated dialogues, all hands-free.


Our guiding principles:

- 🚀 **Lightweight and extensible**: Hopfield provides a streamlined pipeline for crafting generative agents.
- 🔗 **Versatile Functionality**: Our agents can utilize custom tools and support OpenAI function calls.
- 💾 **Efficient Memory Tracking**: Easily monitor conversation - history and tool outputs.
- 🤖 **Automated evaluation:** Conduct multi-turn conversation evaluations with simulated dialogues, all hands-free.

- You want to use text embeddings or OpenAI function calling with Typescript-first features (e.g. using [Zod](https://github.com/colinhacks/zod)).
- You want 
- You don’t want to use a bloated library for simple LLM interactions (e.g. Langchain.js).

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

## Contributing

If you're interested in contributing to Hopfield, please read our [contributing docs](https://github.com/propology/hopfield/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.
