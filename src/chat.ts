import { BaseHopfieldSchema } from './base.js';
import type { AnyBaseHopfieldFunction } from './function.js';
import type { z } from 'zod';

export type BaseHopfieldFunctionTuple = [
  AnyBaseHopfieldFunction,
  ...AnyBaseHopfieldFunction[],
];

export type ChatStream = boolean;

export interface StreamingResult<T> {
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
  streaming: true;
}

export type InferStreamingResult<Chat extends BaseHopfieldChat<any, any>> =
  z.infer<Chat['returnType']>;

export type InferChatInput<Chat extends BaseHopfieldChat<any, any>> = z.input<
  Chat['parameters']
>;

export type BaseHopfieldChatProps<
  ModelName extends string,
  ModelStream extends ChatStream,
> = {
  model: ModelName;
  stream: ModelStream;
};

export abstract class BaseHopfieldChat<
  ModelName extends string,
  ModelStream extends ChatStream,
> extends BaseHopfieldSchema {
  model: ModelName;

  protected _stream: ModelStream;

  constructor({
    model,
    stream,
  }: BaseHopfieldChatProps<ModelName, ModelStream>) {
    super();

    this.model = model;
    this._stream = stream;
  }
}

export type BaseHopfieldChatWithFunctionsProps<
  ModelName extends string,
  ModelStream extends ChatStream,
  Functions extends BaseHopfieldFunctionTuple,
> = {
  model: ModelName;
  stream: ModelStream;
  functions: Functions;
};

export abstract class BaseHopfieldChatWithFunctions<
  ModelName extends string,
  ModelStream extends ChatStream,
  Functions extends BaseHopfieldFunctionTuple,
> extends BaseHopfieldChat<ModelName, ModelStream> {
  protected _functions: Functions;

  constructor({
    model,
    stream,
    functions,
  }: BaseHopfieldChatWithFunctionsProps<ModelName, ModelStream, Functions>) {
    super({ model, stream });

    this._functions = functions;
  }
}
