import {
  BaseHopfieldChatWithFunctions,
  type InferChatInput,
  type InferStreamingResult,
  type StreamingResult,
} from '../../chat.js';
import type {
  FunctionConfigsUnion,
  FunctionSchemasArray,
  OpenAIFunctionsTuple,
} from '../function.js';
import {
  type OpenAIChatModelName,
  defaultOpenAIChatModelName,
} from '../models.js';
import { ChoiceIndex, OpenAIChatBaseInput } from './shared.js';
import {
  ChoiceWithContentDelta,
  ChoiceWithContentFilterDelta,
  ChoiceWithLengthReasonDelta,
  ChoiceWithRoleDelta,
  ChoiceWithStopReasonDelta,
  EmptyDelta,
  type OpenAIChatStreamingSchemaProps,
} from './streaming.js';
import OpenAI from 'openai';
import { z } from 'zod';

const FunctionNameDelta = z.object({
  function_call: z.object({ name: z.string() }),
});

const FunctionArgsDelta = z.object({
  function_call: z.object({ arguments: z.string() }),
});

const ChoiceWithFunctionNameDelta = z.object({
  _type: z.literal('FUNCTION_NAME').default('FUNCTION_NAME'),
  delta: FunctionNameDelta,
  finish_reason: z.null(),
  index: ChoiceIndex,
});

const ChoiceWithFunctionArgsDelta = z.object({
  _type: z.literal('FUNCTION_ARG').default('FUNCTION_ARG'),
  delta: FunctionArgsDelta,
  finish_reason: z.null(),
  index: ChoiceIndex,
});

const ChoiceWithFunctionCallReasonDelta = z
  .object({
    _type: z.literal('FUNCTION_CALL').default('FUNCTION_CALL'),
    delta: EmptyDelta,
    finish_reason: z.literal('function_call'),
    index: ChoiceIndex,
  })
  .describe('The model decided to call a function');

export type OpenAIChatWithFunctionsStreamingSchemaProps<
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatStreamingSchemaProps<ModelName> & {
  functions: Functions;
};

export class OpenAIChatWithFunctionsStreamingSchema<
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> extends BaseHopfieldChatWithFunctions<ModelName, true, Functions> {
  constructor(
    props: OpenAIChatWithFunctionsStreamingSchemaProps<ModelName, Functions>,
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
    });
  }

  get functionCall(): FunctionConfigsUnion<Functions> {
    return z.union(this._functions.map((fn) => fn.functionConfigSchema) as any);
  }

  get functionSchemas(): FunctionSchemasArray<Functions> {
    return z
      .array(z.union(this._functions.map((fn) => fn.schema) as any))
      .default(this._functions.map((fn) => fn.jsonSchema));
  }

  get functionReturnTypes(): FunctionSchemasArray<Functions> {
    return z
      .array(z.union(this._functions.map((fn) => fn.schema) as any))
      .default(this._functions.map((fn) => fn.jsonSchema));
  }

  get returnType() {
    const Choice = z.union([
      // role must come before content delta
      ChoiceWithRoleDelta,
      ChoiceWithContentDelta,
      ChoiceWithContentFilterDelta,
      ChoiceWithStopReasonDelta,
      ChoiceWithLengthReasonDelta,
      ChoiceWithFunctionNameDelta,
      ChoiceWithFunctionArgsDelta,
      ChoiceWithFunctionCallReasonDelta,
    ]);

    return z.object({
      id: z.string(),
      choices: z.array(Choice),
      created: z.number(),
      model: z.string(),
      object: z.literal('chat.completion.chunk'),
    });
  }

  functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctionsStreamingSchema({
      model: this.model,
      functions: functions,
    });
  }
}

export type OpenAIChatWithFunctionsStreamingProps<
  Provider,
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatWithFunctionsStreamingSchemaProps<ModelName, Functions> & {
  provider: Provider;
};

export class OpenAIChatWithFunctionsStreaming<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> extends OpenAIChatWithFunctionsStreamingSchema<ModelName, Functions> {
  provider: Provider;

  constructor(
    props: OpenAIChatWithFunctionsStreamingProps<
      Provider,
      ModelName,
      Functions
    >,
  ) {
    super(props);

    this.provider = props.provider;
  }

  async get(input: InferChatInput<typeof this>) {
    const parsedInput = await this.parameters.parseAsync(input);

    const response = await this.provider.chat.completions.create({
      model: defaultOpenAIChatModelName,
      ...parsedInput,
    });

    const outputSchema = this.returnType;

    const result: StreamingResult<InferStreamingResult<this>> = {
      [Symbol.asyncIterator]: async function* () {
        for await (const part of response) {
          console.log(JSON.stringify(part, null, 2));
          yield outputSchema.parseAsync(part);
        }
      },
      streaming: true,
    };

    return result;
  }
}
