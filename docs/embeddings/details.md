---
description: "Deep dive into how to work with embeddings in Hopfield."
title: "Embeddings Details"
---

# Embeddings

Hopfield allows developers to easily query and validate responses from embeddings providers.
You can use different APIs with type guarantees with Zod and composability.

## Usage

Create and use embeddings from OpenAI, directly with an API client:

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const embeddings = hopfield.embedding("text-embedding-ada-002", 3);

const response = await embeddings.get({ input: ["ready", "set", "hop"] });

const embeddingCount = response.data.length;
//       ^?

const embeddingLength = response.data[0].embedding.length;
//       ^?
```

Or if you prefer, you can only use Hopfield's Zod validations, and use the OpenAI
SDK directly:

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const openAIClient = new OpenAI();

const hopfield = hop.client(openai);

const embeddings = hopfield.embedding("text-embedding-ada-002", 3);

const response = await openAIClient.embeddings.create({
  model: embeddings.model,
  input: ["ready", "set", "hop"],
});

const parsed = embeddings.returnType.parse(response);

const embeddingCount = parsed.data.length;
//       ^?

const embeddingLength = parsed.data[0].embedding.length;
//       ^?
```

## Parameters

### Model Name

The model name to use for the embedding. This parameter depends on the `client` specified.
The embedding length will change based on this parameter, since different text embeddings
can have varying lengths.

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
