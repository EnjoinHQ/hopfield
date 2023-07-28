import {
  BaseHopfieldFunction,
  type DisabledTypes,
  type HopfieldFunctionOptions,
  type TypeTemplates,
} from '../function.js';
import type { SentenceOrError } from '../types.js';

import {
  type AnyZodObject,
  ZodArray,
  ZodDefault,
  ZodFirstPartyTypeKind,
  ZodUnion,
  z,
} from 'zod';

export type OpenAIFunctionsTuple = [
  OpenAIFunctionSchema,
  ...OpenAIFunctionSchema[],
];

const disallowedTypes = [
  ZodFirstPartyTypeKind.ZodAny,
  ZodFirstPartyTypeKind.ZodBigInt,
  ZodFirstPartyTypeKind.ZodTuple,
] as const satisfies readonly ZodFirstPartyTypeKind[];

const openAITypeTemplates = {
  ZodEnum: <D extends string>(description: D) =>
    `${description} This must always be a possible value from the \`enum\` array.` as const,
} as const satisfies TypeTemplates;

const openAITemplates = {
  enum: <D extends string>(description: SentenceOrError<D>) =>
    openAITypeTemplates.ZodEnum(description),
} as const;

export type FunctionProperties<
  T extends OpenAIFunctionsTuple,
  Key extends keyof OpenAIFunctionSchema,
> = {
  [K in keyof T]: T[K] extends OpenAIFunctionSchema ? T[K][Key] : never;
};

export type FunctionConfigsUnion<T extends OpenAIFunctionsTuple> = ZodUnion<
  FunctionProperties<T, 'functionConfigSchema'>
>;

export type FunctionSchemasArray<T extends OpenAIFunctionsTuple> = ZodDefault<
  ZodArray<
    ZodUnion<
      [
        FunctionProperties<T, 'schema'>[number],
        ...FunctionProperties<T, 'schema'>,
      ]
    >
  >
>;

export type OpenAIFunctionProps<
  FName extends string,
  FDescription extends string,
  FParams extends AnyZodObject,
  DTypes extends DisabledTypes,
  TTemplates extends TypeTemplates,
> = {
  name: FName;
  description: FDescription;
  parameters: FParams;
  options?: HopfieldFunctionOptions<DTypes, TTemplates>;
};

export class OpenAIFunction<
  FName extends string,
  FDescription extends string,
  FParams extends AnyZodObject,
  DTypes extends DisabledTypes = typeof disallowedTypes,
  TTemplates extends TypeTemplates = typeof openAITypeTemplates,
> extends BaseHopfieldFunction<
  FName,
  FDescription,
  FParams,
  DTypes,
  TTemplates
> {
  constructor({
    name,
    description,
    parameters,
    options,
  }: OpenAIFunctionProps<FName, FDescription, FParams, DTypes, TTemplates>) {
    super({
      name,
      description,
      parameters,
      options,
    });
  }

  get functionConfigSchema() {
    return z.union([
      z.literal('none'),
      z.literal('auto'),
      z.object({
        name: z.literal(this.name),
      }),
    ]);
  }

  get returnTypeName() {
    return z.object({
      name: z.literal(this.name).describe('The name of the function to call.'),
    });
  }

  protected get _defaultTypeTemplates() {
    return openAITypeTemplates;
  }

  protected get _defaultDisabledTypes() {
    return disallowedTypes;
  }

  static templates = openAITemplates;

  static function<
    FName extends string,
    FDescription extends string,
    FParams extends AnyZodObject,
    DTypes extends DisabledTypes,
    TTemplates extends TypeTemplates,
  >(
    opts: OpenAIFunctionProps<FName, FDescription, FParams, DTypes, TTemplates>,
  ) {
    return new OpenAIFunction(opts);
  }
}

export type OpenAIFunctionSchema = ReturnType<typeof OpenAIFunction.function>;

export type FunctionAttributes<
  Key extends keyof OpenAIFunctionSchema,
  Fns extends OpenAIFunctionSchema[],
> = {
  [K in keyof Fns]: Fns[K] extends OpenAIFunctionSchema ? Fns[K][Key] : never;
};
