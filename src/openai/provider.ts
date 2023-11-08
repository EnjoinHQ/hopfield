import type OpenAI from 'openai';

import { OpenAIEmbedding, OpenAIEmbeddingSchema } from './embedding.js';

import type { ZodType } from 'zod';
import { defaultChatN, type DefaultChatN } from '../chat.js';
import {
  defaultEmbeddingCount,
  type DefaultEmbeddingCount,
} from '../embedding.js';
import type { DisabledTypes } from '../function.js';
import { BaseHopfield } from '../provider.js';
import type { TypeTemplates } from '../template.js';
import { OpenAIChat, OpenAIChatSchema } from './chat/non-streaming.js';
import { OpenAIFunction, type OpenAIFunctionProps } from './function.js';
import {
  defaultOpenAIChatModelName,
  defaultOpenAIEmbeddingModelName,
  type DefaultOpenAIChatModelName,
  type DefaultOpenAIEmbeddingModelName,
  type OpenAIChatModelName,
  type OpenAIEmbeddingModelName,
} from './models.js';
import {
  OpenAIChatTemplate,
  defaultOpenAITypeTemplates,
  type DefaultOpenAITypeTemplates,
} from './template.js';

export class OpenAIHopfield<
  Provider extends OpenAI,
> extends BaseHopfield<Provider> {
  override provider(openai: Provider) {
    return new OpenAIHopfieldWithProvider(openai);
  }

  override chat(): OpenAIChatSchema<DefaultOpenAIChatModelName, DefaultChatN>;
  override chat<ModelName extends OpenAIChatModelName>(
    model: ModelName,
  ): OpenAIChatSchema<ModelName, DefaultChatN>;
  override chat<ModelName extends OpenAIChatModelName, N extends number>(
    model: ModelName,
    n: N,
  ): OpenAIChatSchema<ModelName, N>;
  override chat<ModelName extends OpenAIChatModelName, N extends number>(
    model?: ModelName,
    n?: N,
  ) {
    return new OpenAIChatSchema({
      model: model ?? (defaultOpenAIChatModelName as ModelName),
      n: n ?? (defaultChatN as N),
    });
  }

  override embedding(): OpenAIEmbeddingSchema<
    DefaultOpenAIEmbeddingModelName,
    DefaultEmbeddingCount
  >;
  override embedding<ModelName extends OpenAIEmbeddingModelName>(
    model: ModelName,
  ): OpenAIEmbeddingSchema<ModelName, DefaultEmbeddingCount>;
  override embedding<
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(
    model: ModelName,
    count: EmbeddingCount,
  ): OpenAIEmbeddingSchema<ModelName, EmbeddingCount>;
  override embedding<
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(model?: ModelName, count?: EmbeddingCount) {
    return new OpenAIEmbeddingSchema({
      model: model ?? (defaultOpenAIEmbeddingModelName as ModelName),
      count: count ?? (defaultEmbeddingCount as EmbeddingCount),
    });
  }

  override function<
    FName extends string,
    FDescription extends string,
    FParams extends ZodType<any, any, any>,
    DTypes extends DisabledTypes, // = typeof disallowedTypes,
  >(opts: OpenAIFunctionProps<FName, FDescription, FParams, DTypes>) {
    return new OpenAIFunction<FName, FDescription, FParams, DTypes>(opts);
  }

  override template(): OpenAIChatTemplate<DefaultOpenAITypeTemplates>;
  override template<TTemplates extends TypeTemplates>(
    templates: TTemplates,
  ): OpenAIChatTemplate<TTemplates>;
  override template<TTemplates extends TypeTemplates>(templates?: TTemplates) {
    return new OpenAIChatTemplate({
      templates: templates ?? (defaultOpenAITypeTemplates as TTemplates),
    });
  }
}

export class OpenAIHopfieldWithProvider<
  Provider extends OpenAI,
> extends OpenAIHopfield<Provider> {
  protected _provider: Provider;

  constructor(openai: Provider) {
    super();

    this._provider = openai;
  }

  override chat(): OpenAIChat<
    Provider,
    DefaultOpenAIChatModelName,
    DefaultChatN
  >;
  override chat<ModelName extends OpenAIChatModelName>(
    model: ModelName,
  ): OpenAIChat<Provider, ModelName, DefaultChatN>;
  override chat<ModelName extends OpenAIChatModelName, N extends number>(
    model: ModelName,
    n: N,
  ): OpenAIChat<Provider, ModelName, N>;
  override chat<ModelName extends OpenAIChatModelName, N extends number>(
    model?: ModelName,
    n?: N,
  ) {
    return new OpenAIChat({
      provider: this._provider,
      model: model ?? (defaultOpenAIChatModelName as ModelName),
      n: n ?? (defaultChatN as N),
    });
  }

  override embedding(): OpenAIEmbedding<
    Provider,
    DefaultOpenAIEmbeddingModelName,
    DefaultEmbeddingCount
  >;
  override embedding<ModelName extends OpenAIEmbeddingModelName>(
    model: ModelName,
  ): OpenAIEmbedding<Provider, ModelName, DefaultEmbeddingCount>;
  override embedding<
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(
    model: ModelName,
    count: EmbeddingCount,
  ): OpenAIEmbedding<Provider, ModelName, EmbeddingCount>;
  override embedding<
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(model?: ModelName, count?: EmbeddingCount) {
    return new OpenAIEmbedding({
      provider: this._provider,
      model: model ?? (defaultOpenAIEmbeddingModelName as ModelName),
      count: count ?? (defaultEmbeddingCount as EmbeddingCount),
    });
  }
}
