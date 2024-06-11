import { BaseHopfieldFunction } from '../function.js';
import type { TypeTemplates } from '../template.js';

import {
  type ZodArray,
  type ZodDefault,
  type ZodType,
  type ZodUnion,
  z,
} from 'zod';
import {
  OpenAIChatTemplate,
  defaultOpenAITypeTemplates,
  type DefaultOpenAITypeTemplates,
} from './template.js';

export type OpenAIFunctionsTuple = [
  OpenAIFunctionSchema,
  ...OpenAIFunctionSchema[],
];

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
  FParams extends ZodType<any, any, any>,
> = {
  name: FName;
  description: FDescription;
  parameters: FParams;
};

export class OpenAIFunction<
  FName extends string,
  FDescription extends string,
  FParams extends ZodType<any, any, any>,
> extends BaseHopfieldFunction<
  FName,
  FDescription,
  FParams,
  DefaultOpenAITypeTemplates,
  OpenAIChatTemplate<DefaultOpenAITypeTemplates>
> {
  constructor(props: OpenAIFunctionProps<FName, FDescription, FParams>) {
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

  static function<
    FName extends string,
    FDescription extends string,
    FParams extends ZodType<any, any, any>,
  >(opts: OpenAIFunctionProps<FName, FDescription, FParams>) {
    return new OpenAIFunction<FName, FDescription, FParams>(opts);
  }
}

export type OpenAIFunctionSchema = ReturnType<typeof OpenAIFunction.function>;

export type FunctionAttributes<
  Key extends keyof OpenAIFunctionSchema,
  Fns extends OpenAIFunctionSchema[],
> = {
  [K in keyof Fns]: Fns[K] extends OpenAIFunctionSchema ? Fns[K][Key] : never;
};
