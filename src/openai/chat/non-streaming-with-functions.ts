import { BaseHopfieldChatWithFunctions } from '../../chat.js';
import type { LimitedTuple, LimitedTupleWithUnion } from '../../type-utils.js';
import type {
  FunctionConfigsUnion,
  FunctionProperties,
  FunctionSchemasArray,
  OpenAIFunctionsTuple,
} from '../function.js';
import {
  type OpenAIChatModelName,
  defaultOpenAIChatModelName,
} from '../models.js';
import {
  ChoiceWithContentFilterReason,
  ChoiceWithLengthReason,
  ChoiceWithMessageStopReason,
  type OpenAIChatSchemaProps,
  Usage,
} from './non-streaming.js';
import { OpenAIChatBaseInput } from './shared.js';
import {
  OpenAIChatWithFunctionsStreaming,
  OpenAIChatWithFunctionsStreamingSchema,
} from './streaming-with-functions.js';
import { AssistantRole } from './streaming.js';
import OpenAI from 'openai';
import { ZodDiscriminatedUnion, ZodUnion, z } from 'zod';

type FunctionReturnTypesUnion<T extends OpenAIFunctionsTuple> =
  ZodDiscriminatedUnion<
    'name',
    [
      FunctionProperties<T, 'returnType'>[number],
      ...FunctionProperties<T, 'returnType'>,
    ]
  >;

export type OpenAIChatWithFunctionsSchemaProps<
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatSchemaProps<ModelName, N> & {
  functions: Functions;
};

export class OpenAIChatWithFunctionsSchema<
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> extends BaseHopfieldChatWithFunctions<ModelName, N, false, Functions> {
  constructor(
    props: OpenAIChatWithFunctionsSchemaProps<ModelName, N, Functions>,
  ) {
    super({
      ...props,
      stream: false,
    });
  }

  get parameters() {
    const schema = OpenAIChatBaseInput.extend({
      /** ID of the model to use. This cannot be overridden here - use `hop.chat("model-name")`. */
      model: z
        .literal(this.model)
        .default(this.model as ModelName extends undefined ? never : ModelName)
        .describe('ID of the model to use.'),
      /** Controls how the model responds to function calls. */
      function_call: this.functionCall
        .optional()
        .describe('Controls how the model responds to function calls.'),
      /** A list of functions the model may generate JSON inputs for. This should not be overridden - use `hop.chat().functions([...])`. */
      functions: this.functionSchemas.describe(
        'A list of functions the model may generate JSON inputs for.',
      ),
      /**
       * How many chat completion choices to generate for each input message. Defaults to 1.
       * This cannot be overridden here - use `hop.chat("model-name", 2)`.
       */
      n: z
        .literal(this._n)
        .default(this._n as N extends undefined ? never : N)
        .describe(
          'How many chat completion choices to generate for each input message.',
        ),
    });

    return schema;
  }

  protected get functionCall(): FunctionConfigsUnion<Functions> {
    return z.union(this._functions.map((fn) => fn.functionConfigSchema) as any);
  }

  protected get functionSchemas(): FunctionSchemasArray<Functions> {
    return z
      .array(z.union(this._functions.map((fn) => fn.schema) as any))
      .default(this._functions.map((fn) => fn.jsonSchema));
  }

  protected get functionReturnTypes(): FunctionReturnTypesUnion<Functions> {
    return z.discriminatedUnion(
      'name',
      this._functions.map((fn) => fn.returnType) as any,
    );
  }

  get returnType() {
    /**
     * The model decided to call a function provided.
     */
    const ChoiceWithFunctionCallStopReason = z
      .object({
        /**
         * The model decided to call a function provided.
         */
        __type: z.literal('function_call').default('function_call'),
        finish_reason: z.enum(['stop', 'function_call']),

        message: z.object({
          role: AssistantRole,
          content: z.null(),
          function_call: this.functionReturnTypes,
        }),
      })
      .describe('The model decided to call a function provided.');

    const Choice = z
      .union([
        ChoiceWithFunctionCallStopReason,
        ChoiceWithMessageStopReason,
        ChoiceWithLengthReason,
        ChoiceWithContentFilterReason,
      ])
      .and(
        z.object({
          /** The index of the choice which is being streamed. */
          index: z.union(
            Array.from(Array(this._n).keys()).map((value) =>
              z.literal(value),
            ) as any,
          ) as unknown as ZodUnion<LimitedTupleWithUnion<N>>,
        }),
      );

    const ChoicesTuple = z.tuple(
      Array(this._n).fill(Choice) as LimitedTuple<N, typeof Choice>,
    );

    return z.object({
      id: z.string(),
      choices: ChoicesTuple,
      created: z.number(),
      model: z.literal(this.model),
      usage: Usage.optional(),
    });
  }

  streaming() {
    return new OpenAIChatWithFunctionsStreamingSchema<ModelName, N, Functions>({
      model: this.model,
      n: this._n,
      functions: this._functions,
    });
  }

  functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctionsSchema({
      model: this.model,
      n: this._n,
      functions: functions,
    });
  }
}

export type OpenAIChatWithFunctionsProps<
  Provider,
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatWithFunctionsSchemaProps<ModelName, N, Functions> & {
  provider: Provider;
};

export class OpenAIChatWithFunctions<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> extends OpenAIChatWithFunctionsSchema<ModelName, N, Functions> {
  provider: Provider;

  constructor(
    props: OpenAIChatWithFunctionsProps<Provider, ModelName, N, Functions>,
  ) {
    super(props);

    this.provider = props.provider;
  }

  async get(input: z.input<typeof this.parameters>) {
    const parsedInput = await this.parameters.parseAsync(input);

    const response = await this.provider.chat.completions.create({
      model: defaultOpenAIChatModelName,
      ...parsedInput,
    });

    const parsed = await this.returnType.parseAsync(response);

    return {
      ...parsed,
      streaming: false,
    } as const;
  }

  override streaming() {
    return new OpenAIChatWithFunctionsStreaming({
      provider: this.provider,
      model: this.model,
      n: this._n,
      functions: this._functions,
    });
  }
}
