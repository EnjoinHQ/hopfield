---
description: "Hopfield makes LLM function calling seamless."
title: "Chat - Functions"
---

# Functions

Hopfield lets you define validation-driven functions which can be passed to the LLM.
This lets you clearly build functions, which get transformed to JSON schema with
[`zod-to-json-schema`](https://github.com/StefanTerdell/zod-to-json-schema), so
the LLM can use these as tools.

## Usage

Use chat models from OpenAI:

```ts twoslash
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
```

The input function definition will be validated to make sure that:

1. Descriptions are provided for every argument.
2. No error-prone types are used in `parameters` (for OpenAI, this includes `ZodTuple`, `ZodBigInt`, and `ZodAny`).
3. If a type in the JSON schema performs better with a templated description (like `enum`), it is checked against the template.

All of these checks are entirely customizable and can be overridden/disabled.

## Parameters

### Function Definition

The `function` takes a `name`, `description`, and a Zod schema
for the `parameters` which can be passed into it. These are all required fields to define a function,
and are used to construct the JSON schema definition for the function, to be passed to the LLM.

```ts twoslash
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
```

### Options

The `function` also allows an optional `options` parameter, which lets you override the runtime checks for the
schema. This includes the checks for requiring descriptions on Zod schema parameters, as well as overriding the
list of "disabled types", which are Zod types which typically produce unreliable results from an LLM.

```ts
type HopfieldFunctionOptions = {
  /**
   * Allows descriptions to not be checked on the function parameters. This defaults to `true`.
   */
  requireDescriptions?: boolean;
  /**
   * Allows you override or disable "unstable" types, which are types that do not typically
   * produce good results with a given model. These are defined on a per-model basis.
   *
   * Set to false to allow all "unstable" types.
   */
  disabledTypes?: ZodFirstPartyTypeKind[] | false;
};
```
