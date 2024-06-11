import { BaseHopfieldChat, type InferInput } from '../../chat.js';
import type { LimitedTuple, LimitedTupleWithUnion } from '../../type-utils.js';
import type { OpenAIFunctionsTuple } from '../function.js';
import {
  type OpenAIChatModelName,
  defaultOpenAIChatModelName,
} from '../models.js';
import {
  OpenAIChatWithFunctions,
  OpenAIChatWithFunctionsSchema,
} from './non-streaming-with-functions.js';
import { MessageAssistant, OpenAIChatBaseInput } from './shared.js';
import { OpenAIChatStreamingSchema, OpenAIStreamingChat } from './streaming.js';
import type OpenAI from 'openai';
import { type ZodUnion, z } from 'zod';

/**
 * Omitted content due to a flag from our content filters.
 */
export const ChoiceWithContentFilterReason = z
  .object({
    /**
     * Omitted content due to a flag from our content filters.
     */
    __type: z.literal('content_filter').default('content_filter'),
    finish_reason: z.literal('content_filter'),
    message: MessageAssistant,
  })
  .describe('Omitted content due to a flag from our content filters.');

/**
 * API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter.
 */
export const ChoiceWithMessageStopReason = z
  .object({
    /**
     * API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter.
     */
    __type: z.literal('stop').default('stop'),
    finish_reason: z.literal('stop'),
    message: MessageAssistant,
  })
  .describe(
    'API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter.',
  );

/**
 * Incomplete model output due to max_tokens parameter or token limit
 */
export const ChoiceWithLengthReason = z
  .object({
    /**
     * Incomplete model output due to max_tokens parameter or token limit
     */
    __type: z.literal('length').default('length'),
    finish_reason: z.literal('length'),
    message: MessageAssistant,
  })
  .describe(
    'Incomplete model output due to max_tokens parameter or token limit.',
  );

export const Usage = z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  total_tokens: z.number(),
});

export type OpenAIChatSchemaProps<
  ModelName extends OpenAIChatModelName,
  N extends number,
> = {
  model: ModelName;
  n: N;
};

export class OpenAIChatSchema<
  ModelName extends OpenAIChatModelName,
  N extends number,
> extends BaseHopfieldChat<ModelName, N, false> {
  constructor(props: OpenAIChatSchemaProps<ModelName, N>) {
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

  get returnType() {
    const Choice = z
      .discriminatedUnion('finish_reason', [
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
    return new OpenAIChatStreamingSchema({
      model: this.model,
      n: this._n,
    });
  }

  functions<NewFunctions extends OpenAIFunctionsTuple>(
    functions: NewFunctions,
  ): OpenAIChatWithFunctionsSchema<ModelName, N, NewFunctions> {
    return new OpenAIChatWithFunctionsSchema({
      model: this.model,
      n: this._n,
      functions,
    });
  }
}

export type OpenAIChatProps<
  Provider,
  ModelName extends OpenAIChatModelName,
  N extends number,
> = OpenAIChatSchemaProps<ModelName, N> & {
  provider: Provider;
};

export class OpenAIChat<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
  N extends number,
> extends OpenAIChatSchema<ModelName, N> {
  provider: Provider;

  constructor(props: OpenAIChatProps<Provider, ModelName, N>) {
    super(props);

    this.provider = props.provider;
  }

  async get(input: InferInput<OpenAIChat<Provider, ModelName, N>>) {
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
    return new OpenAIStreamingChat({
      provider: this.provider,
      model: this.model,
      n: this._n,
    });
  }

  override functions<NewFunctions extends OpenAIFunctionsTuple>(
    functions: NewFunctions,
  ): OpenAIChatWithFunctions<Provider, ModelName, N, NewFunctions> {
    return new OpenAIChatWithFunctions({
      provider: this.provider,
      model: this.model,
      n: this._n,
      functions: functions,
    });
  }
}
