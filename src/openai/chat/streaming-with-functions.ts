import {
  BaseHopfieldChatWithFunctions,
  type InferInput,
  type InferResult,
  type StreamingOptions,
  type StreamingResult,
} from '../../chat.js';
import type { LimitedTupleWithUnion } from '../../type-utils.js';

import OpenAI from 'openai';
import { ZodUnion, z } from 'zod';
import { readableFromAsyncIterable } from '../../utils.js';
import type {
  FunctionConfigsUnion,
  FunctionProperties,
  FunctionSchemasArray,
  OpenAIFunctionsTuple,
} from '../function.js';
import {
  defaultOpenAIChatModelName,
  type OpenAIChatModelName,
} from '../models.js';
import { OpenAIChatBaseInput } from './shared.js';
import {
  AssistantRole,
  ChoiceWithContentDelta,
  ChoiceWithContentFilterDelta,
  ChoiceWithLengthReasonDelta,
  ChoiceWithRoleDelta,
  ChoiceWithStopReasonDelta,
  type OpenAIChatStreamingSchemaProps,
} from './streaming.js';

type FunctionReturnTypeNamesUnion<T extends OpenAIFunctionsTuple> = ZodUnion<
  [
    FunctionProperties<T, 'returnTypeName'>[number],
    ...FunctionProperties<T, 'returnTypeName'>,
  ]
>;

/**
 * `function_completed`: Function call data has completed streaming.
 */
const ChoiceWithFunctionCallDelta = z
  .object({
    /**
     * `function_completed`: Function call data has completed streaming.
     */
    __type: z.literal('function_completed').default('function_completed'),
    delta: z.object({}),
    finish_reason: z.literal('function_call'),
  })
  .describe('Function call data has completed streaming.');

/**
 * `function_arguments`: Streaming function arguments data.
 */
const ChoiceWithFunctionArgumentsDelta = z
  .object({
    /**
     * `function_arguments`: Streaming function arguments data.
     */
    __type: z.literal('function_arguments').default('function_arguments'),
    delta: z.object({
      function_call: z.object({ arguments: z.string() }).strict(),
    }),
    finish_reason: z.null(),
  })
  .describe('Streaming function arguments data.');

export type OpenAIChatWithFunctionsStreamingSchemaProps<
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatStreamingSchemaProps<ModelName, N> & {
  functions: Functions;
};

export class OpenAIChatWithFunctionsStreamingSchema<
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> extends BaseHopfieldChatWithFunctions<ModelName, N, true, Functions> {
  constructor(
    props: OpenAIChatWithFunctionsStreamingSchemaProps<ModelName, N, Functions>,
  ) {
    super({
      ...props,
      stream: true,
    });
  }

  get parameters() {
    return OpenAIChatBaseInput.extend({
      /** ID of the model to use. This cannot be overridden here - use `hop.chat("model-name")`. */
      model: z
        .literal(this.model)
        .default(this.model as ModelName extends undefined ? never : ModelName)
        .describe('ID of the model to use.'),
      /** Indicates partial message deltas will be returned. Always `true` for `.streaming()`. */
      stream: z
        .literal(true)
        .default(true)
        .describe('If set, partial message deltas will be returned.'),
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
  }

  protected get functionCall(): FunctionConfigsUnion<Functions> {
    return z.union(this._functions.map((fn) => fn.functionConfigSchema) as any);
  }

  protected get functionSchemas(): FunctionSchemasArray<Functions> {
    return z
      .array(z.union(this._functions.map((fn) => fn.schema) as any))
      .default(this._functions.map((fn) => fn.jsonSchema));
  }

  protected get functionReturnTypeNames(): FunctionReturnTypeNamesUnion<Functions> {
    return z.union(this._functions.map((fn) => fn.returnTypeName) as any);
  }

  get returnType() {
    /**
     * `function_name`: The model is calling a function, and the name has been streamed.
     */
    const ChoiceWithFunctionNameAndRoleDelta = z
      .object({
        /**
         * `function_name`: The model is calling a function, and the name has been streamed.
         */
        __type: z.literal('function_name').default('function_name'),
        delta: z.object({
          role: AssistantRole,
          content: z.null(),
          function_call: this.functionReturnTypeNames,
        }),
        finish_reason: z.literal(null),
      })
      .describe(
        'The model is calling a function, and the name has been streamed.',
      );

    const Choice = z
      .union([
        ChoiceWithFunctionNameAndRoleDelta,
        ChoiceWithFunctionArgumentsDelta,
        ChoiceWithFunctionCallDelta,
        ChoiceWithRoleDelta,
        ChoiceWithContentDelta,
        ChoiceWithContentFilterDelta,
        ChoiceWithStopReasonDelta,
        ChoiceWithLengthReasonDelta,
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

    return z.object({
      id: z.string(),
      /** The streamed choice returned from the model. */
      choices: z.tuple([Choice]),
      created: z.number(),
      model: z.literal(this.model),
    });
  }
}

export type OpenAIChatWithFunctionsStreamingProps<
  Provider,
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatWithFunctionsStreamingSchemaProps<ModelName, N, Functions> & {
  provider: Provider;
};

export class OpenAIChatWithFunctionsStreaming<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
  N extends number,
  Functions extends OpenAIFunctionsTuple,
> extends OpenAIChatWithFunctionsStreamingSchema<ModelName, N, Functions> {
  provider: Provider;

  constructor(
    props: OpenAIChatWithFunctionsStreamingProps<
      Provider,
      ModelName,
      N,
      Functions
    >,
  ) {
    super(props);

    this.provider = props.provider;
  }

  async get(
    input: InferInput<
      OpenAIChatWithFunctionsStreaming<Provider, ModelName, N, Functions>
    >,
    opts?: StreamingOptions<
      InferResult<
        OpenAIChatWithFunctionsStreaming<Provider, ModelName, N, Functions>
      >
    >,
  ): Promise<
    StreamingResult<
      InferResult<
        OpenAIChatWithFunctionsStreaming<Provider, ModelName, N, Functions>
      >
    >
  > {
    const parsedInput = await this.parameters.parseAsync(input);

    const response = await this.provider.chat.completions.create({
      model: defaultOpenAIChatModelName,
      ...parsedInput,
    });

    const outputSchema = this.returnType;

    const asyncIterator = {
      /**
       * Includes an `onDone` callback which is called when the async iterator has completed, as
       * well as a `onChunk` callback which is called on each value in the stream.
       */
      [Symbol.asyncIterator]: async function* () {
        const iteratedValues: InferResult<
          OpenAIChatWithFunctionsStreaming<Provider, ModelName, N, Functions>
        >[] = [];

        for await (const part of response) {
          const chunk = outputSchema.parseAsync(part);
          yield chunk;

          await opts?.onChunk?.(await chunk);
          iteratedValues.push(await chunk);
        }

        await opts?.onDone?.(iteratedValues);
      },
    };

    const result: StreamingResult<
      InferResult<
        OpenAIChatWithFunctionsStreaming<Provider, ModelName, N, Functions>
      >
    > = {
      ...asyncIterator,
      readableStream: () => readableFromAsyncIterable(asyncIterator),
      streaming: true,
    };

    return result;
  }
}
