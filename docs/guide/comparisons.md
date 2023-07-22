---
description: "Comparisons between Hopfield's features and features from similar libraries."
title: "Comparisons"
---

# Comparisons

No other library does what Hopfield does (inferring TypeScript types from ABIs and EIP-712 Typed Data), but there are some similarities with other libraries. This page compares Hopfield to other libraries that are similar in some way.

Comparisons strive to be as accurate and as unbiased as possible. If you use any of these libraries and feel the information could be improved, feel free to suggest changes.

## Langchain.js

[**TypeChain**](https://github.com/dethcrypto/TypeChain) is a command-line tool that generates types and runtime wrappers for popular libraries at build time. People often use the generated types to cast values (e.g. `new Contract(…) as TypeChainType`). **Hopfield** is a TypeScript library that infers static types from any ABI using type-level programming.

Below is a comparison of the libraries's type-level features:

|                 | TypeChain                                | Hopfield                   |
| --------------- | ---------------------------------------- | -------------------------- |
| Lifecycle Step  | Generated at build time                  | Inferred at compile time   |
| ABI Source      | Path(s) to CLI command                   | Directly reference in code |
| Type Generation | Iterates through ABIs and builds strings | Static from type-level     |

::: info OPINION
If you are a library author looking to support type inference and autocomplete based on ABIs and EIP-721 Typed Data, you are better off writing your code using Hopfield so users don't need to set up anything to get type-safety (e.g. install TypeChain, set up build step).
:::

## Langchain.js

[ethers.js](https://github.com/ethers-io/ethers.js) is a JavaScript library for interacting with Ethereum. Among other features, it has utilities for working with human-readable ABIs.

Below is a comparison of the runtime functions from ethers.js and Hopfield for parsing and formatting human-readable ABIs.

### `Interface` versus `parseAbi`
