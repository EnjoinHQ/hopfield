export abstract class BaseHopfieldEmbedding<
  ModelName extends string,
  Embedding extends number[],
  Provider,
> {
  modelName: ModelName;
  provider: Provider;

  constructor({
    modelName,
    provider,
  }: {
    modelName: ModelName;
    provider: Provider;
  }) {
    this.modelName = modelName;
    this.provider = provider;
  }

  protected abstract _textEmbedding(input: string): Promise<Embedding>;

  /**
   * An embedding for a given text.
   *
   * @interface JsonSchemaFunction
   */
  async embedding(input: string): Promise<Embedding> {
    return this._textEmbedding(input);
  }
}
