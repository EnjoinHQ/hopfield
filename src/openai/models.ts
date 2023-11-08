export const openAIChatModelNames = [
  'gpt-4-0314' /** @deprecated Legacy model, to be discontinued Jun 13, 2024 */,
  'gpt-4-0613',
  'gpt-4-32k-0314' /** @deprecated Legacy model, to be discontinued Jun 13, 2024 */,
  'gpt-4-32k-0613',
  'gpt-3.5-turbo-0301' /** @deprecated Legacy model, to be discontinued Jun 13, 2024 */,
  'gpt-3.5-turbo-0613' /** @deprecated Legacy model, will be replaced by gpt-3.5-turbo-1106 on Dec 11, 2023 */,
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-16k-0613' /** @deprecated Will be replaced by gpt-3.5-turbo-1106 on Dec 11, 2023 */,
  'gpt-4-1106-preview',
] as const;

/**
 * ID of the chat model to use. See the
 * [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table
 * for details on which models work with the Chat API.
 */
export type OpenAIChatModelName = typeof openAIChatModelNames[number];

export const openAIChatModelNamesWithFunctionCalling = [
  'gpt-4-0613',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo-1106',
] as const;

export const defaultOpenAIChatModelName =
  openAIChatModelNamesWithFunctionCalling[0];
export type DefaultOpenAIChatModelName = typeof defaultOpenAIChatModelName;

/**
 * IDs of the chat models which support function calling. See the
 * [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table
 * for details on which models work with function calling.
 */
export type OpenAIModelNameWithFunctionCalling =
  typeof openAIChatModelNamesWithFunctionCalling[number];

export const openAIEmbeddingModelNames = ['text-embedding-ada-002'] as const;

/**
 * IDs of the embedding models which support function calling. See the
 * [embeddings](https://platform.openai.com/docs/models/embeddings) docs for more details.
 */
export type OpenAIEmbeddingModelName = typeof openAIEmbeddingModelNames[number];

export const defaultOpenAIEmbeddingModelName = openAIEmbeddingModelNames[0];
export type DefaultOpenAIEmbeddingModelName =
  typeof defaultOpenAIEmbeddingModelName;
