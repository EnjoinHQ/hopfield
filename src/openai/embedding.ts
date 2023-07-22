import { BaseHopfieldEmbedding } from '../embedding.js';
import type { Tuple256 } from '../types.js';
import type OpenAI from 'openai';

export type OpenAIModelName = 'text-embedding-ada-002';

export type Tuple1536 = [
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
  ...Tuple256,
];

export class OpenAIHopfieldEmbedding<
  ModelName extends OpenAIModelName = 'text-embedding-ada-002',
  Embedding extends number[] = ModelName extends 'text-embedding-ada-002'
    ? Tuple1536
    : never,
> extends BaseHopfieldEmbedding<ModelName, Embedding, OpenAI> {
  constructor({
    modelName = 'text-embedding-ada-002' as ModelName,
    provider,
  }: {
    modelName?: ModelName;
    provider: OpenAI;
  }) {
    super({ modelName, provider });
  }

  protected async _textEmbedding(input: string) {
    const response = await this.provider.embeddings.create({
      input,
      model: this.modelName,
    });

    return response.data?.[0]?.embedding as Embedding;
  }
}
