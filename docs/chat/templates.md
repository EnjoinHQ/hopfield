---
description: "Learn how Hopfield uses string literal types for prompt templates."
title: "Chat - Prompt Templates"
---

# Prompt Templates

Hopfield always uses [string literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
for prompt templates, so developers have visibility into the tranformations performed on their inputs.

## Usage

Check out how our types look when you use a template:

```ts twoslash
import hop from "hopfield";
import openai from "hopfield/openai";

const template = hop.client(openai).template();

const description = template.enum("The category of the message.");
//      ^?
```

You can see above that the description has type hints to tell you exactly what the
transformation was. In this case, the template appended
`This must always be a possible value from the enum array.` to the input string.

This template is usually used with complex function calls. See the next section for
more information.

## Composability

We will be building on top of the Prompt Templating primitive with features which have more complex transformations.
Specifically, we will be shipping best practices for few-shot prompting and
[RAG](https://www.promptingguide.ai/techniques/rag), so chat `messages` are strongly typed and adhere
to emerging industry standards.

::: info

We are actively working on building this feature further - please reach out if you are interested
in influencing this!

:::
