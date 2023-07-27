import type OpenAI from 'openai';

import type { InferChatInput, InferStreamingResult } from './chat.js';
import {
  type DefaultEmbeddingCount,
  defaultEmbeddingCount,
} from './embedding.js';
import { OpenAIChat, OpenAIChatSchema } from './openai/chat/non-streaming.js';
import { OpenAIEmbedding, OpenAIEmbeddingSchema } from './openai/embedding.js';
import { OpenAIFunction } from './openai/function.js';
import {
  type DefaultOpenAIChatModelName,
  type DefaultOpenAIEmbeddingModelName,
  type OpenAIChatModelName,
  type OpenAIEmbeddingModelName,
  defaultOpenAIChatModelName,
  defaultOpenAIEmbeddingModelName,
} from './openai/models.js';

const template = {
  function: OpenAIFunction.templates,
} as const;

function providerFunction<Provider extends OpenAI>(provider: Provider) {
  function chat(): OpenAIChat<Provider, DefaultOpenAIChatModelName>;
  function chat<ModelName extends OpenAIChatModelName>(
    model: ModelName,
  ): OpenAIChat<Provider, ModelName>;
  function chat<ModelName extends OpenAIChatModelName,>(model?: ModelName) {
    return new OpenAIChat({
      provider,
      model: model ?? (defaultOpenAIChatModelName as ModelName),
    });
  }

  function embedding(): OpenAIEmbedding<
    Provider,
    DefaultOpenAIEmbeddingModelName,
    DefaultEmbeddingCount
  >;
  function embedding<ModelName extends OpenAIEmbeddingModelName>(
    model: ModelName,
  ): OpenAIEmbedding<Provider, ModelName, DefaultEmbeddingCount>;
  function embedding<
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(
    model: ModelName,
    count: EmbeddingCount,
  ): OpenAIEmbedding<Provider, ModelName, EmbeddingCount>;
  function embedding<
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(model?: ModelName, count?: EmbeddingCount) {
    return new OpenAIEmbedding({
      provider,
      model: model ?? (defaultOpenAIEmbeddingModelName as ModelName),
      count: count ?? (defaultEmbeddingCount as EmbeddingCount),
    });
  }

  return {
    chat,
    embedding,
    function: OpenAIFunction.function,

    template,
  };
}

function chat(): OpenAIChatSchema<DefaultOpenAIChatModelName>;
function chat<ModelName extends OpenAIChatModelName>(
  model: ModelName,
): OpenAIChatSchema<ModelName>;
function chat<ModelName extends OpenAIChatModelName,>(model?: ModelName) {
  return new OpenAIChatSchema({
    model: model ?? (defaultOpenAIChatModelName as ModelName),
  });
}

function embedding(): OpenAIEmbeddingSchema<
  DefaultOpenAIEmbeddingModelName,
  DefaultEmbeddingCount
>;
function embedding<ModelName extends OpenAIEmbeddingModelName>(
  model: ModelName,
): OpenAIEmbeddingSchema<ModelName, DefaultEmbeddingCount>;
function embedding<
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
>(
  model: ModelName,
  count: EmbeddingCount,
): OpenAIEmbeddingSchema<ModelName, EmbeddingCount>;
function embedding<
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
>(model?: ModelName, count?: EmbeddingCount) {
  return new OpenAIEmbeddingSchema({
    model: model ?? (defaultOpenAIEmbeddingModelName as ModelName),
    count: count ?? (defaultEmbeddingCount as EmbeddingCount),
  });
}

const fn = OpenAIFunction.function;

export {
  chat,
  embedding,
  fn as function,
  providerFunction as provider,
  template,
};

export type {
  InferChatInput as inferChatInput,
  InferStreamingResult as inferStreamingResult,
};

export type * from './openai/chat/non-streaming.js';
export type * from './openai/chat/shared.js';
export type * from './openai/chat/streaming.js';

export * from './errors.js';
export * from './types.js';
