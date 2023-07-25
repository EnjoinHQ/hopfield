import type { ChatStream } from './chat.js';
import type { DisabledTypes, TypeTemplates } from './function.js';
import {
  OpenAIHopfieldChat,
  OpenAIHopfieldChatSchema,
  type OpenAIHopfieldChatSchemaProps,
} from './openai/chat.js';
import {
  OpenAIHopfieldEmbedding,
  OpenAIHopfieldEmbeddingSchema,
  type OpenAIHopfieldEmbeddingSchemaProps,
} from './openai/embedding.js';
import {
  type OpenAIFunctionSchema,
  OpenAIHopfieldFunction,
  type OpenAIHopfieldFunctionProps,
} from './openai/function.js';
import type {
  DefaultOpenAIEmbeddingModelName,
  OpenAIChatModelName,
  OpenAIEmbeddingModelName,
} from './openai/models.js';
import type OpenAI from 'openai';
import type { ZodFunction, ZodTuple, ZodTypeAny } from 'zod';

const template = {
  function: OpenAIHopfieldFunction.templates,
} as const;

function providerFunction<Provider extends OpenAI>(provider: Provider) {
  return {
    chat: <
      ModelName extends OpenAIChatModelName,
      ModelStream extends ChatStream = 'non-streaming',
      Functions extends
        | [OpenAIFunctionSchema, ...OpenAIFunctionSchema[]]
        | [] = [],
    >(
      props?: OpenAIHopfieldChatSchemaProps<ModelName, ModelStream, Functions>,
    ) =>
      OpenAIHopfieldChat.create({
        ...props,
        provider,
      }),
    function: <
      ZFunctionArgs extends ZodTuple<any, any>,
      ZFunctionReturns extends ZodTypeAny,
      ZFunction extends ZodFunction<ZFunctionArgs, ZFunctionReturns>,
      FName extends string,
      DTypes extends DisabledTypes,
      TTemplates extends TypeTemplates,
    >(
      props: OpenAIHopfieldFunctionProps<
        ZFunctionArgs,
        ZFunctionReturns,
        ZFunction,
        FName,
        DTypes,
        TTemplates
      >,
    ) => OpenAIHopfieldFunction.schema(props),
    embedding: <
      ModelName extends OpenAIEmbeddingModelName = DefaultOpenAIEmbeddingModelName,
      EmbeddingCount extends number = 1,
    >(
      props?: OpenAIHopfieldEmbeddingSchemaProps<ModelName, EmbeddingCount>,
    ) =>
      OpenAIHopfieldEmbedding.create({
        ...props,
        provider,
      }),

    template,
  };
}

const schema = {
  chat: <
    ModelName extends OpenAIChatModelName,
    ModelStream extends ChatStream = 'non-streaming',
    Functions extends readonly OpenAIFunctionSchema[] = [],
  >(
    props?: OpenAIHopfieldChatSchemaProps<ModelName, ModelStream, Functions>,
  ) => OpenAIHopfieldChatSchema.schema({ ...props }),
  embedding: <
    ModelName extends OpenAIEmbeddingModelName = DefaultOpenAIEmbeddingModelName,
    EmbeddingCount extends number = 1,
  >(
    props?: OpenAIHopfieldEmbeddingSchemaProps<ModelName, EmbeddingCount>,
  ) =>
    OpenAIHopfieldEmbeddingSchema.schema({
      ...props,
    }),

  template,
} as const;

export const hop = {
  provider: providerFunction,
  ...schema,
} as const;

export default hop;

export type * from './openai/chat.js';

export * from './errors.js';
export * from './types.js';
