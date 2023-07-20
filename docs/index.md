---
description: 'Minimal typescript library for easy, testable interactions with LLMs'
head:
  - - meta
    - name: keywords
      content: ai, openai, gpt, llm, ai-tools
title: 'Hopfield: Minimal typescript library for easy, testable interactions with LLMs'
titleTemplate: false
---

<p align="center" style="min-height:45px;width:100%;">
  <img img-dark alt="Hopfield" src="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-dark.svg" height="45" style="width:auto;">
  <img img-light alt="Hopfield" src="https://raw.githubusercontent.com/propology/hopfield/main/.github/logo-light.svg" height="45" style="width:auto;">
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

Minimal typescript library for easy, testable interactions with LLMs. Hopfield provides utilities and type definitions for ABI properties and values, covering the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html), as well as [EIP-712](https://eips.ethereum.org/EIPS/eip-712) Typed Data.

<!-- ```ts twoslash
import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'hopfield'
import { erc20Abi } from 'hopfield/test'

type TransferInputTypes = AbiParametersToPrimitiveTypes<
  // ^?
  ExtractAbiFunction<typeof erc20Abi, 'transfer'>['inputs']
>
``` -->

Works great for adding blazing fast [autocomplete](https://twitter.com/awkweb/status/1555678944770367493) and type checking to functions, variables, or your own types. No need to generate types with third-party tools – just use your ABI and let TypeScript do the rest!

## TL;DR

Hopfield might be a good option for your project if:

- You want to [typecheck](/api/types) your ABIs or EIP-712 Typed Data.
- You want to add type inference and autocomplete to your library based on user-provided ABIs or EIP-712 Typed Data, like [wagmi](https://wagmi.sh) and [viem](https://viem.sh).
- You need to [convert ABI types](/api/utilities#abiparameterstoprimitivetypes) (e.g. `'string'`) to TypeScript types (e.g. `string`) or other type transformations.
- You need to validate ABIs at [runtime](/api/zod) (e.g. after fetching from external resource).
- You don’t want to set up a build process to generate types (e.g. TypeChain).

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
