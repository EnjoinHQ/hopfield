import {
  BaseHopfieldFunction,
  type HopfieldFunctionOptions,
} from '../function.js';
import { type TypeTemplates } from '../templates.js';
import type { SentenceOrError } from '../types.js';

import { ZodFunction, ZodTuple, type ZodTypeAny } from 'zod';

const _openAITypeTemplates = {
  ZodEnum: (description: string) =>
    `${description} This must always be a possible value from the \`enum\` array.` as const,
} as const satisfies TypeTemplates;

const openAITemplates = {
  enum: <D extends string>(description: SentenceOrError<D>) =>
    _openAITypeTemplates.ZodEnum(description),
} as const;

export class OpenAIHopfieldFunction<
  ZFunction extends ZodFunction<Args, Returns>,
  Args extends ZodTuple<any, any>,
  Returns extends ZodTypeAny,
  FName extends string,
> extends BaseHopfieldFunction<
  ZFunction,
  Args,
  Returns,
  FName,
  typeof _openAITypeTemplates
> {
  constructor({
    schema,
    functionName,
    options,
  }: {
    schema: ZFunction;
    functionName: FName;
    options?: HopfieldFunctionOptions;
  }) {
    super({
      schema,
      functionName,
      options,
    });
  }

  protected _defaultTypeTemplates() {
    return _openAITypeTemplates;
  }

  static templates = openAITemplates;
}
