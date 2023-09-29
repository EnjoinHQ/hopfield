import {
  BaseHopfieldChat,
  type InferResult,
  type StreamingResult,
} from '../../chat.js';
import type { LimitedTupleWithUnion } from '../../type-utils.js';
import type { OpenAIFunctionsTuple } from '../function.js';
import {
  type OpenAIChatModelName,
  defaultOpenAIChatModelName,
} from '../models.js';
import type { OpenAIChatSchemaProps } from './non-streaming.js';
import { OpenAIChatBaseInput } from './shared.js';
import {
  OpenAIChatWithFunctionsStreaming,
  OpenAIChatWithFunctionsStreamingSchema,
} from './streaming-with-functions.js';
import OpenAI from 'openai';
import { ZodUnion, z } from 'zod';

/** `assistant`: The role of the message. */
export const AssistantRole = z.literal('assistant');

/**
 * `role`: The role for the content being streamed.
 */
export const ChoiceWithRoleDelta = z
  .object({
    /**
     * `role`: The role for the content being streamed.
     */
    __type: z.literal('role').default('role'),
    delta: z
      .object({
        role: AssistantRole,
      })
      .strict(),
    finish_reason: z.null(),
  })
  .describe('The role for the content being streamed.');

/**
 * `content`: The content being streamed.
 */
export const ChoiceWithContentDelta = z
  .object({
    /**
     * `content`: The content being streamed.
     */
    __type: z.literal('content').default('content'),
    delta: z.object({
      content: z.string(),
    }),
    finish_reason: z.null(),
  })
  .describe('The content being streamed.');

/**
 * `content_filter`: Omitted streaming content due to a flag from our content filters.
 */
export const ChoiceWithContentFilterDelta = z
  .object({
    /**
     * `content_filter`: Omitted streaming content due to a flag from our content filters.
     */
    __type: z.literal('content_filter').default('content_filter'),
    delta: z.object({
      content: z.string(),
    }),
    finish_reason: z.literal('content_filter'),
  })
  .describe(
    'Omitted streaming content due to a flag from our content filters.',
  );

/**
 * `stop`: API has streamed a complete message, or a message terminated by one of the stop sequences provided via the stop parameter.
 */
export const ChoiceWithStopReasonDelta = z
  .object({
    /**
     * `stop`: API has streamed a complete message, or a message terminated by one of the stop sequences provided via the stop parameter.
     */
    __type: z.literal('stop').default('stop'),
    delta: z.object({}),
    finish_reason: z.literal('stop'),
  })
  .describe(
    'API has streamed a complete message, or a message terminated by one of the stop sequences provided via the stop parameter.',
  );

/**
 * `length`: Incomplete streaming output due to max_tokens parameter or token limit.
 */
export const ChoiceWithLengthReasonDelta = z
  .object({
    /**
     * `length`: Incomplete streaming output due to max_tokens parameter or token limit.
     */
    __type: z.literal('length').default('length'),
    delta: z.object({}),
    finish_reason: z.literal('length'),
  })
  .describe(
    'Incomplete streaming output due to max_tokens parameter or token limit.',
  );

export type OpenAIChatStreamingSchemaProps<
  ModelName extends OpenAIChatModelName,
  N extends number,
> = OpenAIChatSchemaProps<ModelName, N>;

export class OpenAIChatStreamingSchema<
  ModelName extends OpenAIChatModelName,
  N extends number,
> extends BaseHopfieldChat<ModelName, N, true> {
  constructor(props: OpenAIChatStreamingSchemaProps<ModelName, N>) {
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

  get returnType() {
    const Choice = z
      .union([
        // role must come before content delta
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

  functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctionsStreamingSchema({
      model: this.model,
      n: this._n,
      functions: functions,
    });
  }
}

export type OpenAIStreamingChatProps<
  Provider,
  ModelName extends OpenAIChatModelName,
  N extends number,
> = OpenAIChatStreamingSchemaProps<ModelName, N> & {
  provider: Provider;
};

export class OpenAIStreamingChat<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
  N extends number,
> extends OpenAIChatStreamingSchema<ModelName, N> {
  provider: Provider;

  constructor(props: OpenAIStreamingChatProps<Provider, ModelName, N>) {
    super(props);

    this.provider = props.provider;
  }

  async get(
    input: z.input<typeof this.parameters>,
  ): Promise<
    StreamingResult<InferResult<OpenAIStreamingChat<Provider, ModelName, N>>>
  > {
    const parsedInput = await this.parameters.parseAsync(input);

    const response = await this.provider.chat.completions.create({
      model: defaultOpenAIChatModelName,
      ...parsedInput,
    });

    const outputSchema = this.returnType;

    const result: StreamingResult<
      InferResult<OpenAIStreamingChat<Provider, ModelName, N>>
    > = {
      [Symbol.asyncIterator]: async function* () {
        for await (const part of response) {
          yield outputSchema.parseAsync(part);
        }
      },
      streaming: true,
    };

    return result;
  }

  override functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctionsStreaming({
      provider: this.provider,
      model: this.model,
      n: this._n,
      functions,
    });
  }
}
