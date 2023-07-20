---
description: "Quickly add Hopfield to your TypeScript project."
title: "Getting Started"
---

# Getting Started

This section will help you start using Hopfield in your TypeScript project.

## Install

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

<!-- ::: info TypeScript Version
Hopfield requires `typescript@>=5.0.4`.
::: -->

## Usage

Since ABIs can contain deeply nested arrays and objects, you must either assert ABIs to constants using [`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) or use the built-in `narrow` function (works with JavaScript). This allows TypeScript to take the most specific type for expressions and avoid type widening (e.g. no going from `"hello"` to `string`).

## What's next?

After setting up your project with Hopfield, you are ready to dive in further! Here are some places to start:

<!-- - [Learn about the types](/api/types) and [utilities](/api/utilities) available in Hopfield.
- Follow along with a [walkthrough](/guide/walkthrough) on building a type-safe `readContract` function.
- Check out comparisons between features in [Hopfield and TypeChain](/guide/comparisons#typechain) as well as [Hopfield and ethers.js](/guide/comparisons#ethers-js).
- Make reading and writing ABIs more human with [human-readable ABI support](/api/human). -->
