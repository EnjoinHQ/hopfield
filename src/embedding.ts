import type { Tuple } from './type-utils.js';
import type { ZodNumber } from 'zod';

export type BaseHopfieldEmbeddingProps<
  ModelName extends string,
  EmbeddingCount extends number,
  EmbeddingLength extends number,
> = {
  model: ModelName;
  length: EmbeddingLength;
  count: EmbeddingCount;
};

export abstract class BaseHopfieldEmbedding<
  ModelName extends string,
  EmbeddingCount extends number,
  EmbeddingLength extends number,
> {
  model: ModelName;
  protected length: EmbeddingLength;
  protected count: EmbeddingCount;

  constructor({
    model,
    length,
    count,
  }: BaseHopfieldEmbeddingProps<ModelName, EmbeddingCount, EmbeddingLength>) {
    this.model = model;
    this.length = length;
    this.count = count;
  }
}

export type Tuple256 = Tuple<256, ZodNumber>;
