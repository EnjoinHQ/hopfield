---
description: "Let's use Hopfield to create a type-safe function that calls \"read\" contract methods. We'll infer function names, argument types, and return types from a user-provided ABI, and make sure it works for function overloads."
title: 'Walkthrough'
---

# Walkthrough

Let's use Hopfield to create a type-safe function that calls "read" contract methods. We'll infer function names, argument types, and return types from a user-provided ABI, and make sure it works for function overloads.

You can spin up a [TypeScript Playground](https://www.typescriptlang.org/play) to code along.

## 1. Scaffolding `readContract`

First, we start off by declaring[^1] the function `readContract` with some basic types:

```ts twoslash
import { test } from 'hopfield'


```
