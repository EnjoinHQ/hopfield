---
description: "Deep dive into how to get embeddings with Hopfield."
title: "Embeddings - Details"
---

# Embeddings

Hopfield provides an easy way to get type-safe embeddings. You can use different API providers with type
guarantees with Zod, and composability across providers.

## Usage

Create and use embeddings with OpenAI:

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const embeddings = hopfield.embedding();

const response = await embeddings.get({ input: ["hop"] });

const embeddingCount = response.data.length;
//       ^?

const embeddingLength = response.data[0].embedding.length;
//       ^?
```

## Parameters

### Model Name

The model name to use for the embedding.

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());
// ---cut---
const embeddings = hopfield.embedding("text-embedding-ada-002");

const response = await embeddings.get({ input: ["hop"] });

const embedding = response.data[0].embedding;
//       ^?
```

#### OpenAI

The OpenAI model name defaults to the value shown below. This is currently the only supported model.

```ts twoslash
import type { DefaultOpenAIEmbeddingModelName } from "hopfield/openai";
//                ^?
```

---

### Embedding Count

The count of text embeddings to be returned. For all providers, this defaults to `1`.
This is capped at `20`.

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());
// ---cut---
const embeddings = hopfield.embedding("text-embedding-ada-002", 3);

const response = await embeddings.get({ input: ["ready", "set", "hop"] });

const embeddingLength = response.data.length;
//       ^?

const thirdEmbeddingLength = response.data[2].embedding.length;
//       ^?
```
