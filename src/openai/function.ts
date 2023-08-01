import {
  BaseHopfieldFunction,
  type DisabledTypes,
  type HopfieldFunctionOptions,
} from '../function.js';
import type { TypeTemplates } from '../template.js';

import {
  type DefaultOpenAITypeTemplates,
  OpenAIChatTemplate,
  defaultOpenAITypeTemplates,
} from './template.js';
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
> = {
  name: FName;
  description: FDescription;
  parameters: FParams;
  options?: HopfieldFunctionOptions<DTypes>;
};

export class OpenAIFunction<
  FName extends string,
  FDescription extends string,
  FParams extends AnyZodObject,
  DTypes extends DisabledTypes = typeof disallowedTypes,
> extends BaseHopfieldFunction<
  FName,
  FDescription,
  FParams,
  DTypes,
  DefaultOpenAITypeTemplates,
  OpenAIChatTemplate<DefaultOpenAITypeTemplates>
> {
  constructor(
    props: OpenAIFunctionProps<FName, FDescription, FParams, DTypes>,
  ) {
    super({
      ...props,
      template: new OpenAIChatTemplate({
        templates: defaultOpenAITypeTemplates,
      }),
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

  static function<
    FName extends string,
    FDescription extends string,
    FParams extends AnyZodObject,
    DTypes extends DisabledTypes,
  >(opts: OpenAIFunctionProps<FName, FDescription, FParams, DTypes>) {
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
