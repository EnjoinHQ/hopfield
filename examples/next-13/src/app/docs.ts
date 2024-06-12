export const docs = `---
description: "Quickly add Hopfield to your TypeScript project."
title: "Getting Started"
---

# Getting Started

This section will help you start using Hopfield in your TypeScript project.

## Install

First, you will need to install Hopfield.

::: code-group

bash [bun]
bun i hopfield


bash [pnpm]
pnpm add hopfield


bash [npm]
npm i hopfield


:::

### OpenAI

You'll also need to set up a Hopfield Provider, which is used to interact with the API.
We currently only support OpenAI (but are working on adding other providers).

To use Hopfield, you will need to install the latest 4+ version of openai.

::: code-group

bash [pnpm]
pnpm add openai@4


bash [npm]
npm i openai@4


bash [yarn]
yarn add openai@4


:::

## Create a Provider

We create a Hopfield provider, which stores the provider client and uses it for API requests under
the hood.

ts
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

// create an OpenAI client (must be prerelease version for latest features)
const openAIClient = new OpenAI({ apiKey: "{OPENAI_API_KEY}" }); // [!code focus]

// use the OpenAI client with Hopfield
// or, you can *not* pass a provider, and just use the runtime validations
const hopfield = hop.client(openai).provider(openAIClient); // [!code focus]


## Streaming Chat

We can now create a Streaming Chat instance of Hopfield. We use the provider we created above,
and create a new chat instance.

ts
export const chat = hopfield.chat().streaming(); // [!code focus]


We can now use this chat instance for every chat interaction, with simplified streaming
and other features. Below, we show how to use get to interact with the Chat Completions
API, and utility types inferMessageInput and inferResult
to get the typing of the inputs/outputs for the chat instance.

ts
import hop from "hopfield";
import { chat } from "./chat";
// [!code focus:12]
const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the coolest way to count to ten?",
  },
];

const response = await chat.get({
  messages,
});


We can then stream the response from the chat instance and store the chunks
in an array, as well as take any action for the incoming chunk.

ts
// store all of the streaming chat chunks
const parts: hop.inferResult<typeof chat>[] = [];

for await (const part of response) {
  // if the streaming delta contains new text content
  if (part.choices[0].__type === "content") {
    // handle the new content
  }

  parts.push(part);
}


As you can see, it's super easy to add streaming to your application with minimal dependencies
and a simple async iterator for easy streaming with Zod validation and strict typing.

## What's next?

Now that you're all set up, you are ready to dive in to the docs further!
'

'---
description: "Comparisons between Hopfield's features and features from similar libraries."
title: "Comparisons"
---

# Comparisons

No other library does what Hopfield does (inferring static LLM TypeScript types from Zod schemas), but there are some similarities with other libraries. This page compares Hopfield to other libraries.

Comparisons strive to be as accurate and as unbiased as possible. If you use any of these libraries and feel the information could be improved, feel free to suggest changes.

## vercel/ai

[**ai**](https://github.com/vercel/ai) is a framework for AI-powered applications with React, Svelte, Vue, and Solid. They provide hooks to easily integrate
with a streaming text response (StreamingTextResponse) and allow a callback for function calling, as well as simple, drop-in components for React and other
frameworks.

**Hopfield** provides a subset of these features, and focuses solely on the API interactions, and **not** on providing React components.

Below is a comparison of the library features:

|                        | **ai**                                  | **Hopfield**                                   |
| ---------------------- | ----------------------------------------- | ---------------------------------------------- |
| **React Components**   | Easy, inflexible UI components & hooks    | No UI components or hooks                      |
| **Typed Functions**    | Streaming function calls with loose types | Strict function call types with Zod validation |
| **Framework Examples** | Multiple                                  | Multiple                                       |
| **Chat Providers**     | Multiple                                  | OpenAI, with support for others coming         |

## Langchain.js

[**Langchain.js**](https://github.com/hwchase17/langchainjs) is a framework for developing applications powered by language models
with Javascript. Developers usually use Langchain to develop apps which connect to internal tools (like internal knowledge bases,
LLM demos, and generally in trusted environments).

**Hopfield** is a TypeScript library that provides a subset of Langchain's features,
prioritizing inferring static types from LLM input, alongside runtime response validation and static typing.

Below is a comparison of the library features:

|                      | **Langchain.js**                            | **Hopfield**                                                             |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| **Prompt Templates** | Opaque                                      | Use string template types for type inference                             |
| **Type Generation**  | Loose types with some Typescript helpers    | Static types with Zod validation                                         |
| **Function Calling** | Starter templates, with some Zod validation | Validation-driven, composable functions                                  |
| **Connectors/Tools** | Many, with various integrations             | Only a select few, with examples (actively being developed)              |
| **Dependencies**     | Many, with non-optional peer dependencies   | Few, with strict bundle splitting to avoid unnecessary peer dependencies |
'

'---
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

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const embeddings = hopfield.embedding();

const response = await hopfield.embedding().get({ input: ["hello"] });
const embedding = response.data[0].embedding;
//      ^?


You can guarantee that your response is constructed correctly (with no optional accessors)
and the embedding and outer array uses [the tuple type](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types),
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
'

'---
description: "Deep dive into how to work with embeddings in Hopfield."
title: "Embeddings Details"
---

# Embeddings

Hopfield allows developers to easily query and validate responses from embeddings providers.
You can use different APIs with type guarantees with Zod and composability.

## Usage

Create and use embeddings from OpenAI, directly with an API client:

ts twoslash
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


Or if you prefer, you can only use Hopfield's Zod validations, and use the OpenAI
SDK directly:

ts twoslash
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


## Parameters

### Model Name

The model name to use for the embedding. This parameter depends on the client specified.
The embedding length will change based on this parameter, since different text embeddings
can have varying lengths.

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());
// ---cut---
const embeddings = hopfield.embedding("text-embedding-ada-002");

const response = await embeddings.get({ input: ["hop"] });

const embedding = response.data[0].embedding;
//       ^?


#### OpenAI

The OpenAI model name defaults to the value shown below. This is currently the only supported model.

ts twoslash
import type { DefaultOpenAIEmbeddingModelName } from "hopfield/openai";
//                ^?


---

### Embedding Count

The count of text embeddings to be returned. For all providers, this defaults to 1.
This is capped at 20.

ts twoslash
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

'

'---
description: "An overview of working with chat models in Hopfield."
title: "Overview of Chat Models"
---

# Chat

Hopfield also provides simple APIs for interacting with chat models. It has different API providers with type
guarantees with Zod.

::: info API Providers

We currently only support OpenAI, but are
working on adding further providers. Reach out on
[Github Discussions](https://github.com/EnjoinHQ/hopfield/discussions) if you have any suggestions!

:::

## Usage

Check out how we type responses:

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat();

const parsed = await chat.get({
  messages: [
    {
      content: "What's the best pizza restaurant in NYC?",
      role: "user",
    },
  ],
});

const choiceType = parsed.choices[0].__type;
//                                     ^?


You can guarantee that your response is constructed correctly (with no optional accessors)
and the embedding and outer array uses [the tuple type](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types),
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
'

'---
description: "Learn how Hopfield uses string literal types for prompt templates."
title: "Chat - Prompt Templates"
---

# Prompt Templates

Hopfield always uses [string literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
for prompt templates, so developers have visibility into the tranformations performed on their inputs.

## Usage

Check out how our types look when you use a template:

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";

const template = hop.client(openai).template();

const description = template.enum("The category of the message.");
//      ^?


You can see above that the description has type hints to tell you exactly what the
transformation was. In this case, the template appended
This must always be a possible value from the enum array. to the input string.

This template is usually used with complex function calls. See the next section for
more information.

## Composability

We will be building on top of the Prompt Templating primitive with features which have more complex transformations.
Specifically, we will be shipping best practices for few-shot prompting and
[RAG](https://www.promptingguide.ai/techniques/rag), so chat messages are strongly typed and adhere
to emerging industry standards.

::: info

We are actively working on building this feature further - please reach out if you are interested
in influencing this!

:::
'

'---
description: "Hopfield makes streaming with LLM function calling seamless."
title: "Chat - Functions with Streaming"
---

# Functions with Streaming

Hopfield makes it easy to use streaming with function calling.
You define validation-driven functions which get passed to the LLM.

## Usage

Use streaming function calling like:

ts twoslash
const takeAction = async (
  name: string,
  args: {
    location: string;
    unit: "celsius" | "fahrenheit";
  }
) => {};
// ---cut---
import z from "zod";
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const weatherFunction = hopfield.function({
  name: "getCurrentWeather",
  description: "Get the current weather in a given location",
  parameters: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
    unit: z
      .enum(["celsius", "fahrenheit"])
      .describe(hopfield.template().enum("The unit for the temperature.")),
  }),
});

const chat = hopfield.chat().streaming().functions([weatherFunction]);

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the weather in San Jose?",
  },
];

const response = await chat.get(
  {
    messages,
  },
  {
    onChunk(chunk) {
      console.log(Received chunk type: \${chunk.choices[0].__type});
      // do something on the server with each individual chunk as it is
      // streamed in
    },
    onDone(chunks) {
      console.log(Total chunks received: \${chunks.length});
      // do something on the server when the chat completion is done
      // this can be caching the response, storing in a database, etc.
      //
      // chunks is an array of all the streamed responses, so you
      // can access the raw content and combine how you'd like
    },
    async onFunctionCall(fn) {
      // do something based on the function call result - this
      // is parsed by your function definition with zod, and
      // the arguments are coerced into the object shape you expect
      await takeAction(fn.name, fn.arguments);
      //                              ^?
    },
  }
);


::: info Feedback

To influence these features, reach out on
[Github Discussions](https://github.com/EnjoinHQ/hopfield/discussions).
We want your feedback!

:::
'

'---
description: "Deep dive into how to get streaming chat responses with Hopfield."
title: "Chat - Non-streaming"
---

# Streaming chat

Hopfield provides a simple way to interact with streaming chat models. You can use various
API providers with type guarantees with Zod.

## Usage

Use streaming chat models from OpenAI with a few lines of code:

ts twoslash
const takeAction = async (message: string) => {};
// ---cut---
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat().streaming();

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the coolest way to count to ten?",
  },
];

const response = await chat.get(
  {
    messages,
  },
  {
    onChunk: async (value) => {
      console.log(Received chunk type: \${value.choices[0].__type});
      // do something on the server with each individual chunk as it is
      // streamed in
    },
    onDone: async (chunks) => {
      console.log(Total chunks received: \${chunks.length});
      // do something on the server when the chat completion is done
      // this can be caching the response, storing in a database, etc.
      //
      // chunks is an array of all the streamed responses, so you
      // can access the raw content and combine how you'd like
    },
  }
);

// store all of the streaming chat chunks
const parts: hop.inferResult<typeof chat>[] = [];

for await (const part of response) {
  parts.push(part);

  // if the streaming delta contains new text content
  if (part.choices[0].__type === "content") {
    //                  ^?
    // action based on the delta for the streaming message content
    await takeAction(part.choices[0].delta.content);
    //                                  ^?
  }
}


### Learn more

See how to use streaming results combined with type-driven prompt templates in the
[next section](/chat/templates).
'

'---
description: "Hopfield makes LLM function calling seamless."
title: "Chat - Functions"
---

# Functions

Hopfield lets you define validation-driven functions which can be passed to the LLM.
This lets you clearly build functions, which get transformed to JSON schema with
[zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema), so
the LLM can use these as tools.

## Usage

Use chat models from OpenAI:

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";
import z from "zod";

const hopfield = hop.client(openai).provider(new OpenAI());

const weatherFunction = hopfield.function({
  name: "getCurrentWeather",
  description: "Get the current weather in a given location",
  parameters: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
    unit: z
      .enum(["celsius", "fahrenheit"])
      .describe(hopfield.template().enum("The unit for the temperature.")),
  }),
});

const chat = hopfield.chat().functions([weatherFunction]);

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the weather in Phoenix, AZ?",
  },
];

const response = await chat.get({
  messages,
  temperature: 0,
});

const choice = response.choices[0];

if (choice.__type === "function_call") {
  //         ^?
  const functionParams = choice.message.function_call;
  //        ^?
}


The input function definition will be validated to make sure that:

1. Descriptions are provided for every argument.
2. No error-prone types are used in parameters (for OpenAI, this includes ZodTuple, ZodBigInt, and ZodAny).
3. If a type in the JSON schema performs better with a templated description (like enum), it is checked against the template.

All of these checks are entirely customizable and can be overridden/disabled.

## Parameters

### Function Definition

The function takes a name, description, and a Zod schema
for the parameters which can be passed into it. These are all required fields to define a function,
and are used to construct the JSON schema definition for the function, to be passed to the LLM.

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";
import z from "zod";

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

const hopfield = hop.client(openai).provider(new OpenAI());
// ---cut---
const weather = hopfield.function({
  name: "getCurrentWeather",
  description: "Get the current weather in a given location",
  parameters: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
    unit: z
      .enum(["celsius", "fahrenheit"])
      .describe(hopfield.template().enum("The unit for the temperature.")),
  }),
});

const classifyMessage = hopfield.function({
  name: "classifyMessage",
  description: "Triage an incoming support message.",
  parameters: z.object({
    summary: z.string().describe("The summary of the message."),
    category: SupportCategoryEnum.describe(
      hopfield.template().enum("The category of the message.")
    ),
  }),
});

const chat = hopfield.chat().functions([weather, classifyMessage]);

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "How can I get a refund??",
  },
];

const response = await chat.get({
  messages,
  temperature: 0,
});

if (response.choices[0].__type === "function_call") {
  const functionName = response.choices[0].message.function_call.name;
  //      ^?
}

'

'---
description: "Deep dive into how to get non-streaming chat responses with Hopfield."
title: "Chat - Non-streaming"
---

# Non-streaming chat

Hopfield provides a simple way to interact with chat models. You can use different
API providers with type guarantees with Zod.

## Usage

Use chat models from OpenAI:

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat();

const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "How do you count to ten?",
  },
];

const response = await chat.get({
  messages,
});

const responseType = response.choices[0].__type;
//       ^?
if (responseType === "stop") {
  const message = response.choices[0].message;
  //       ^?
}


## Parameters

### Model Name

The model name to use for the embedding.

ts
const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat("gpt-4-0613"); // [!code focus]


#### OpenAI

The default model name is shown below. To override this, you must use
a model which is enabled on your OpenAI account.

ts twoslash
import type { DefaultOpenAIChatModelName } from "hopfield/openai";
//                ^?


All possible model names are shown below (reach out if we are missing one!)

ts twoslash
import type { OpenAIChatModelName } from "hopfield/openai";
//                 ^?


---

### Response Count

The number of chat responses to be returned (this is usually referred to as n).
For all providers, this defaults to 1.
This is capped at 20.

ts
const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat("gpt-4-0613", 10); // [!code focus]


The response can then be safely used:

ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

const hopfield = hop.client(openai).provider(new OpenAI());

const chat = hopfield.chat("gpt-4-0613", 10);
// ---cut---
const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "user",
    content: "What's the best way to get a bunch of chat responses?",
  },
];

const response = await chat.get({
  messages,
});

const chatCount = response.choices.length;
//       ^?

'

'---
description: "Typescript-first LLM framework with static type inference, testability, and composability."
head:
  - - meta
    - name: keywords
      content: ai, openai, zod, gpt, llm, ai-tools
title: "Hopfield: Typescript-first LLM framework with static type inference, testability, and composability."
titleTemplate: false
---

<script setup>
import {
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/32714304?v=4',
    name: 'Chase Adams',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/0xcadams' },
      { icon: 'twitter', link: 'https://twitter.com/0xcadams' }
    ]
  }
]
</script>

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
  <a href="https://github.com/EnjoinHQ/hopfield/blob/main/LICENSE">
    <picture>
      <img img-dark src="https://img.shields.io/npm/l/hopfield?colorA=2e2e33&colorB=2e2e33&style=flat" alt="MIT License">
      <img img-light src="https://img.shields.io/npm/l/hopfield?colorA=fafafa&colorB=fafafa&style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://github.com/EnjoinHQ/hopfield">
    <picture>
      <img img-dark src="https://img.shields.io/github/stars/EnjoinHQ/hopfield?colorA=2e2e33&colorB=2e2e33&style=flat" alt="GitHub Repo stars">
      <img img-light src="https://img.shields.io/github/stars/EnjoinHQ/hopfield?colorA=fafafa&colorB=fafafa&style=flat" alt="GitHub Repo stars">
    </picture>
  </a>
</div>

Hopfield is a Typescript-first large language model framework with static type inference, testability, and composability.
Easily validate LLM responses and inputs with strong types. Flexible abstractions
with best practices baked in.

Add it to your project, along with any peer dependencies:

::: code-group

bash [bun]
bun i hopfield


bash [pnpm]
pnpm add hopfield


bash [npm]
npm i hopfield


:::

### ready, set, hop

See how easy it is to add composable, type-safe LLM features with Hopfield:

::: code-group

ts twoslash [main.ts]
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


ts twoslash [openai.ts]
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

If you have questions or need help, reach out to the community in the [Hopfield GitHub Discussions](https://github.com/EnjoinHQ/hopfield/discussions).

<div align="center" style="width:100%;">
  <VPTeamMembers :members="members" />
</div>

## Learn more

Read the [Getting Started](/guide/getting-started) guide to learn more how to use Hopfield.

### Inspiration

Shoutout to these projects which inspired us:

- [Zod](https://github.com/colinhacks/zod)
- [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema)
- [Autochain](https://github.com/Forethought-Technologies/AutoChain)
- [Langchain.js](https://github.com/hwchase17/langchainjs)
- [simpleaichat](https://github.com/minimaxir/simpleaichat)
- [Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT)
- [abitype](https://github.com/wagmi-dev/abitype)

If you like Hopfield, go star them on Github too.
'

'---
description: "A detailed guide on seamlessly fetching and streaming data directly into React components."
title: "Next.js App Router with Hopfield"
---

# Next.js App Router

Hopfield empowers developers to seamlessly fetch and stream data directly into Next.js React Server Components.

## Overview

Hopfield streaming chat provides a readableStream() which can be used to build recursive React Server Components.

The readableStream() from Hopfield's streaming chat provider returns a [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) (available in Node 18+, or it can be polyfilled with a library like [web-streams-polyfill](https://www.npmjs.com/package/web-streams-polyfill).).

::: info Non-streaming

If you are not interested in using streaming, you can use the non-streaming chat provider easily with a simple RSC
that awaits the full response from chat.get(). This is not shown below, but is a much simpler integration that does not
include any custom code for streaming token by token.

:::

### Backpressure

The readable stream handles backpressure with a pull-based approach. See our [tests](https://github.com/EnjoinHQ/hopfield/blob/main/src/utils.test.ts) for how Hopfield handles backpressure. For a more detailed explanation on "backpressure" and how it factors into streaming LLM responses, please see the
[vercel/ai docs](https://sdk.vercel.ai/docs/concepts/backpressure-and-cancellation).

## Usage

Here's how to use Hopfield with a recursive React Server Component using Suspense:

tsx
import { Suspense } from "react";
import hop from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

// Set up the OpenAI client
const openaiClient = new OpenAI({ apiKey: "OPENAI_API_KEY" });
// Pass the OpenAI client into Hopfield
const hopfield = hop.client(openai).provider(openaiClient);
// Create a streaming chat provider
const chat = hopfield.chat("gpt-4o-2024-05-13").streaming();

export type ChatResponseProps = {
  prompt: string;
};

export async function ChatResponse({ prompt }: ChatResponseProps) {
  // construct messages with hop.inferMessageInput
  const messages: hop.inferMessageInput<typeof chat>[] = [
    {
      role: "system",
      content: "You are a helpful AI assistant.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await chat.get(
    { messages: messages },
    {
      onChunk: async (value) => {
        console.log(Received chunk type: \${value.choices[0].__type});
        // do something on the server with each individual chunk as it is
        // streamed in
      },
      onDone: async (chunks) => {
        console.log(Total chunks received: \${chunks.length});
        // do something on the server when the chat completion is done
        // this can be caching the response, storing in a database, etc.
        //
        // chunks is an array of all the streamed responses, so you
        // can access the raw content and combine how you'd like
      },
      // if you are using function calling, you can also add a onFunctionCall
      // here with zod-parsed arguments
    }
  );

  // pass the readableStream to the RSC
  return <Tokens stream={response.readableStream()} />;
}

type Props = {
  /**
   * A ReadableStream produced by Hopfield.
   */
  stream: ReadableStream<hop.inferResult<typeof chat>>;
};

/**
 * A React Server Component that recursively renders a stream of tokens.
 */
async function Tokens(props: Props) {
  const { stream } = props;
  const reader = stream.getReader();

  return (
    <Suspense>
      <RecursiveTokens reader={reader} />
    </Suspense>
  );
}

type RecursiveTokensProps = {
  reader: ReadableStreamDefaultReader<hop.inferResult<typeof chat>>;
};

async function RecursiveTokens({ reader }: RecursiveTokensProps) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  return (
    <>
      {value.choices[0].__type === "content" ? (
        value.choices[0].delta.content
      ) : (
        <></>
      )}
      <Suspense fallback={<LoadingDots />}>
        <RecursiveTokens reader={reader} />
      </Suspense>
    </>
  );
}

// This can be any loading indicator you want, which gets appended to the end
// of the tokens while waiting for the next token to be streamed
const LoadingDots = () => <span>...</span>;


We create a recursive React Server Component which uses Suspense boundaries to await each token,
and show a fallback loading indicator where the next token will be rendered.

See our [Next 13 RSC example](https://next-13.hopfield.ai) for a real-world integration
using Vercel, similar to this quick example.

### Dive Deeper

To deepen your understanding of how Streaming works, and how it can be further utilized within your application,
refer to the [Streaming Chat](/chat/streaming) section.
'

'`;
