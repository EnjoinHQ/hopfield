import { BaseHopfieldSchema } from './base.js';

export const defaultEmbeddingCount = 1;
export type DefaultEmbeddingCount = typeof defaultEmbeddingCount;

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
> extends BaseHopfieldSchema {
  model: ModelName;
  protected length: EmbeddingLength;
  protected count: EmbeddingCount;

  constructor({
    model,
    length,
    count,
  }: BaseHopfieldEmbeddingProps<ModelName, EmbeddingCount, EmbeddingLength>) {
    super();

    this.model = model;
    this.length = length;
    this.count = count;
  }
}
