---
description: "Hopfield makes streaming with LLM function calling seamless."
title: "Chat - Functions with Streaming"
---

# Functions with Streaming

Hopfield makes it easy to use streaming with function calling.
You define validation-driven functions which get passed to the LLM.

## Usage

Use streaming function calling like:

```ts twoslash
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
      console.log(`Received chunk type: ${chunk.choices[0].__type}`);
      // do something on the server with each individual chunk as it is
      // streamed in
    },
    onDone(chunks) {
      console.log(`Total chunks received: ${chunks.length}`);
      // do something on the server when the chat completion is done
      // this can be caching the response, storing in a database, etc.
      //
      // `chunks` is an array of all the streamed responses, so you
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
```

::: info Feedback

To influence these features, reach out on
[Github Discussions](https://github.com/EnjoinHQ/hopfield/discussions).
We want your feedback!

:::
