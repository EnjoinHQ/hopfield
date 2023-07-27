import { BaseHopfieldEmbedding } from '../embedding.js';
import type { LimitedTuple, Tuple } from '../type-utils.js';
import type { Tuple256 } from '../types.js';
import {
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

export type OpenAIEmbeddingSchemaProps<
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
> = {
  model: ModelName;
  count: EmbeddingCount;
};

export class OpenAIEmbeddingSchema<
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
> extends BaseHopfieldEmbedding<ModelName, EmbeddingCount, 1536> {
  constructor(props: OpenAIEmbeddingSchemaProps<ModelName, EmbeddingCount>) {
    super({
      ...props,
      length: props.model === 'text-embedding-ada-002' ? 1536 : 1536,
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
              ZodString
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
      embedding: z.tuple(
        Array(this.length).fill(z.number()) as EmbeddingLengths[ModelName],
      ),
    });

    const Usage = z.object({
      prompt_tokens: z.number().nonnegative(),
      total_tokens: z.number().nonnegative(),
    });

    return z.object({
      object: z.string(),
      model: z.string(),
      data: z.tuple(
        Array(this.count).fill(DataItem) as LimitedTuple<
          EmbeddingCount,
          typeof DataItem
        >,
      ),

      // data: z.array(DataItem),
      usage: Usage,
    });
  }

  static schema<
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(opts: OpenAIEmbeddingSchemaProps<ModelName, EmbeddingCount>) {
    return new OpenAIEmbeddingSchema(opts);
  }
}

export type OpenAIEmbeddingProps<
  Provider extends OpenAI,
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
> = {
  provider: Provider;
  model?: ModelName;
  count?: EmbeddingCount;
};

export class OpenAIEmbedding<
  Provider extends OpenAI,
  ModelName extends OpenAIEmbeddingModelName,
  EmbeddingCount extends number,
> extends OpenAIEmbeddingSchema<ModelName, EmbeddingCount> {
  provider: Provider;

  constructor({
    provider,
    model = defaultOpenAIEmbeddingModelName as ModelName,
    count = 1 as EmbeddingCount,
  }: OpenAIEmbeddingProps<Provider, ModelName, EmbeddingCount>) {
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
    ModelName extends OpenAIEmbeddingModelName,
    EmbeddingCount extends number,
  >(opts: OpenAIEmbeddingProps<Provider, ModelName, EmbeddingCount>) {
    return new OpenAIEmbedding(opts);
  }
}
