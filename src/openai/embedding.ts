import { BaseHopfieldEmbedding, type Tuple256 } from '../embedding.js';
import type { Tuple } from '../type-utils.js';
import { ZodNumber, ZodString, z } from 'zod';

export type OpenAIModelName = 'text-embedding-ada-002';

export type OpenAIHopfieldEmbeddingProps<
  ModelName extends OpenAIModelName,
  EmbeddingCount extends number,
> = {
  model?: ModelName;
  count?: EmbeddingCount;
};

type Tuple1536 = [
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
];

export class OpenAIHopfieldEmbedding<
  ModelName extends OpenAIModelName = 'text-embedding-ada-002',
  EmbeddingCount extends number = 1,
  EmbeddingTuple extends [
    ZodNumber,
    ...ZodNumber[],
  ] = ModelName extends 'text-embedding-ada-002' ? Tuple1536 : never,
> extends BaseHopfieldEmbedding<ModelName, EmbeddingCount, 1536> {
  constructor({
    model = 'text-embedding-ada-002' as ModelName,
    count = 1 as EmbeddingCount,
  }: OpenAIHopfieldEmbeddingProps<ModelName, EmbeddingCount> = {}) {
    super({
      model,
      length: model === 'text-embedding-ada-002' ? 1536 : 1536,
      count,
    });
  }

  get input() {
    return z
      .object({
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
          .describe(
            'A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.',
          ),
      })
      .partial({
        user: true,
      });
  }

  get output() {
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

  /**
   *
   */
  static create<
    ModelName extends OpenAIModelName = 'text-embedding-ada-002',
    EmbeddingCount extends number = 1,
  >(opts: OpenAIHopfieldEmbeddingProps<ModelName, EmbeddingCount> = {}) {
    return new OpenAIHopfieldEmbedding(opts);
  }
}
