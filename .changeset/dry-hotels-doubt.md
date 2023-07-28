---
"hopfield": minor
---

**Feature:** added the initial `oa` OpenAI validator to Hopfield, with Functions, Templates, and Embeddings.

## Functions and Templates

Hopfield provides OpenAI validators for the inputs/responses for [OpenAI's Chat Completion API](https://platform.openai.com/docs/api-reference/chat) function inputs. This encourages (and by default, enforces) best practices with typing and formatting for the JSON Schema function definition.

For instance, you can create an `oa.function` by passing in a Zod function definition (using [`z.function`](https://github.com/colinhacks/zod#functions)) with the args which the function expects, and an enum description with `oa.template`:

```ts
import { oa } from "hopfield";
import { z } from "zod";

const weatherFunction = z
  .function()
  .args(
    z.object({
      location: z
        .string()
        .describe("The city and state, e.g. San Francisco, CA"),
      unit: z
        .enum(["celsius", "fahrenheit"])
        .describe(oa.template.function.enum("The unit for the temperature.")),
    })
  )
  .describe("Get the current weather in a given location");

const hopfieldFunction = oa.function({
  schema: weatherFunction,
  name: "getCurrentWeather",
});
```

The input function definition will be validated to make sure that:

1. Descriptions are provided for every argument.
2. No error-prone types are used as args (this includes `ZodTuple`, `ZodBigInt`, and `ZodAny`).
3. If a type description performs better with a template, it is checked against the template (this currently checks any `ZodEnum`, since enums tend to perform better with a specific description ending).

All of these checks are entirely customizable and can be disabled with the `options` parameter.

You can then use the `HopfieldFunction` with OpenAI:

```ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "{OPENAI_API_KEY}" });

const messages = [
  {
    role: "user",
    content: "What's the weather in Phoenix, Arizona?",
  },
];

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo-16k-0613",
  messages,
  temperature: 0,
  functions: [hopfieldFunction.input],
});

const parsed = hopfieldFunction.output.parse(
  response.choices?.[0]?.message?.function_call
);

console.log(parsed);
//            ^?
// {
//   "arguments": {
//     "location": "San Francisco, CA",
//     "unit": "celsius",
//   },
//   "name": "getCurrentWeather",
// }
```

## Embeddings

Hopfield also provides OpenAI validators for the inputs/responses for [OpenAI's Embeddings API](https://platform.openai.com/docs/api-reference/embeddings). This provides stronger typings for the embeddings API and allows for checking the input to OpenAI's API.

For instance, you can create an `oa.embedding` with:

```ts
import { oa } from "hopfield";

// defaults to `text-embedding-ada-002`
const embedding = oa.embedding();

const response = await openai.embeddings.create(
  embedding.input.parse({
    input: "hopfield",
  })
);

const parsed = await embedding.output.parseAsync(response);
```

This is strongly typed with tuples which match the expected input length. In this case (and by default), the expected embeddings count is 1.

This allows for array access of the returned embeddings with validation of both the embedding count and each embedding vector length:

```ts
const parsed: {
    object: string;
    data: [{
        object: string;
        index: number;
        embedding: [number, number, ..., number]; // corresponds to the model's embedding length - `text-embedding-ada-002` is 1536
    }];
    model: string;
    usage: {
        ...;
    };
} = ...

console.log(parsed.data[0].embedding[0]);
// parsed.data[0].embedding[0] is not optional and strongly typed as a tuple
// Outputs: -0.0073666335
```
