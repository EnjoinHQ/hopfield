---
description: "An overview of working with embeddings in Hopfield."
title: "Overview of Embeddings"
---

# Embeddings

Hopfield provides an easy way to get type-safe embeddings. You can use different API providers with type
guarantees with Zod, and composability across providers.

::: info API Providers

We currently only support OpenAI, but are
working on adding further providers. Reach out on
[Github Discussions](https://github.com/EnjoinHQ/hopfield/discussions) if you have any suggestions!

:::

## Usage

Check out how we type responses:

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const embeddings = hopfield.embedding();

const response = await hopfield.embedding().get({ input: ["hello"] });
const embedding = response.data[0].embedding;
//      ^?
```

You can guarantee that your response is constructed correctly (with no optional accessors)
and the embedding and outer array uses [the `tuple` type](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types),
based on the inputs you requested.

## Composability

The big unlock is not only that types are guaranteed to be safe - we provide composability to
allow building complex apps with [RAG](https://www.promptingguide.ai/techniques/rag) and embedding-driven search.

::: info

We are actively working on building a RAG solution - please reach out if you are interested
in influencing the API for this!

:::

## Learn More

Learn more about the intricacies embeddings in the [Embeddings](/embeddings/details) page.
