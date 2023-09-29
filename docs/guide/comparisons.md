---
description: "Comparisons between Hopfield's features and features from similar libraries."
title: "Comparisons"
---

# Comparisons

No other library does what Hopfield does (inferring static LLM TypeScript types from Zod schemas), but there are some similarities with other libraries. This page compares Hopfield to other libraries.

Comparisons strive to be as accurate and as unbiased as possible. If you use any of these libraries and feel the information could be improved, feel free to suggest changes.

## `ai`

[**`ai`**](https://github.com/vercel/ai) is a framework for AI-powered applications with React, Svelte, Vue, and Solid. They provide hooks to easily integrate
with a streaming text response (`StreamingTextResponse`) and allow a callback for function calling, as well as simple, drop-in components for React and other
frameworks.

**Hopfield** provides a subset of these features, and focuses solely on the API interactions, and **not** on providing React components.

Below is a comparison of the library features:

|                        | **`ai`**                                  | **Hopfield**                                   |
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
