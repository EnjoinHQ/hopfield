import { BaseHopfieldEmbedding } from '../embedding.js';
import type { Tuple } from '../type-utils.js';
import type { Tuple256 } from '../types.js';
import {
  type DefaultOpenAIEmbeddingModelName,
  type OpenAIEmbeddingModelName,
  defaultOpenAIEmbeddingModelName,
} from './models.js';
import OpenAI from 'openai';
import { ZodNumber, ZodString, z } from 'zod';

type Tuple1536 = [
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
];

export interface EmbeddingLengths
  extends Record<OpenAIEmbeddingModelName, ZodNumber[]> {
  'text-embedding-ada-002': Tuple1536;
}

export type OpenAIHopfieldEmbeddingSchemaProps<
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
> = {
  model?: ModelName;
  count?: EmbeddingCount;
};

export class OpenAIHopfieldEmbeddingSchema<
  ModelName extends OpenAIEmbeddingModelName = DefaultOpenAIEmbeddingModelName,
  EmbeddingCount extends number = 1,
  EmbeddingTuple extends [
    ZodNumber,
    ...ZodNumber[],
  ] = EmbeddingLengths[ModelName],
> extends BaseHopfieldEmbedding<ModelName, EmbeddingCount, 1536> {
  constructor({
    model = defaultOpenAIEmbeddingModelName as ModelName,
    count = 1 as EmbeddingCount,
  }: OpenAIHopfieldEmbeddingSchemaProps<ModelName, EmbeddingCount>) {
    super({
      model,
      length: model === 'text-embedding-ada-002' ? 1536 : 1536,
      count,
    });
  }

  get parameters() {
    return z.object({
      input: z
        .union([
          z.string(),
          z.tuple(
            Array(this.count).fill(z.string()) as Tuple<
              EmbeddingCount,
              ZodString
            >,
          ),
          z.array(z.number()),
          z.tuple(
            Array(this.count).fill(z.array(z.number())) as Tuple<
              EmbeddingCount,
              ZodNumber
            >,
          ),
        ])
        .describe(
          'Input text to embed, encoded as a string or array of tokens. To embed multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed the max input tokens for the model (8191 tokens for text-embedding-ada-002).',
        ),
      model: z
        .literal(this.model)
        .default(this.model as any)
        .describe(
          'ID of the model to use. You can use the OpenAI List models API to see all of your available models, or see the OpenAI Model overview for descriptions of them.',
        ),
      user: z
        .string()
        .optional()
        .describe(
          'A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.',
        ),
    });
  }

  get returnType() {
    const DataItem = z.object({
      index: z.number().nonnegative(),
      object: z.string(),
      embedding: z.tuple(Array(this.length).fill(z.number()) as EmbeddingTuple),
    });

    const Usage = z.object({
      prompt_tokens: z.number().nonnegative(),
      total_tokens: z.number().nonnegative(),
    });

    return z.object({
      object: z.string(),
      model: z.string(),
      data: z.tuple(
        Array(this.count).fill(DataItem) as Tuple<
          EmbeddingCount,
          typeof DataItem
        >,
      ),
      usage: Usage,
    });
  }

  static schema<
    ModelName extends OpenAIEmbeddingModelName = DefaultOpenAIEmbeddingModelName,
    EmbeddingCount extends number = 1,
  >(opts: OpenAIHopfieldEmbeddingSchemaProps<ModelName, EmbeddingCount>) {
    return new OpenAIHopfieldEmbeddingSchema(opts);
  }
}

export type OpenAIHopfieldEmbeddingProps<
  Provider extends OpenAI,
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
> = {
  provider: Provider;
  model?: ModelName;
  count?: EmbeddingCount;
};

export class OpenAIHopfieldEmbedding<
  Provider extends OpenAI,
  ModelName extends OpenAIEmbeddingModelName = DefaultOpenAIEmbeddingModelName,
  EmbeddingCount extends number = 1,
> extends OpenAIHopfieldEmbeddingSchema<ModelName, EmbeddingCount> {
  provider: Provider;

  constructor({
    provider,
    model = defaultOpenAIEmbeddingModelName as ModelName,
    count = 1 as EmbeddingCount,
  }: OpenAIHopfieldEmbeddingProps<Provider, ModelName, EmbeddingCount>) {
    super({
      model,
      count,
    });

    this.provider = provider;
  }

  async get(
    input: Omit<z.input<typeof this.parameters>, 'model'>,
  ): Promise<z.infer<typeof this.returnType>> {
    const parsedInput = await this.parameters.parseAsync(input);

    const response = await this.provider.embeddings.create(
      parsedInput as OpenAI.Embeddings.EmbeddingCreateParams,
    );

    return this.returnType.parseAsync(response);
  }

  static create<
    Provider extends OpenAI,
    ModelName extends OpenAIEmbeddingModelName = DefaultOpenAIEmbeddingModelName,
    EmbeddingCount extends number = 1,
  >(opts: OpenAIHopfieldEmbeddingProps<Provider, ModelName, EmbeddingCount>) {
    return new OpenAIHopfieldEmbedding(opts);
  }
}
