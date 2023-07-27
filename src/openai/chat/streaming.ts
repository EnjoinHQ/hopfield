import {
  BaseHopfieldChat,
  type InferStreamingResult,
  type StreamingResult,
} from '../../chat.js';
import type { OpenAIFunctionsTuple } from '../function.js';
import {
  type OpenAIChatModelName,
  defaultOpenAIChatModelName,
} from '../models.js';
import type { OpenAIChatSchemaProps } from './non-streaming.js';
import { ChoiceIndex, OpenAIChatBaseInput } from './shared.js';
import {
  OpenAIChatWithFunctionsStreaming,
  OpenAIChatWithFunctionsStreamingSchema,
} from './streaming-with-functions.js';
import OpenAI from 'openai';
import { z } from 'zod';

const RoleDelta = z.object({
  role: z.enum(['assistant']),
});

const ContentDelta = z.object({
  content: z.string(),
});

export const EmptyDelta = z.object({});

export const ChoiceWithContentDelta = z.object({
  _type: z.literal('CONTENT').default('CONTENT'),
  delta: ContentDelta,
  finish_reason: z.null(),
  index: ChoiceIndex,
});

export const ChoiceWithContentFilterDelta = z
  .object({
    _type: z.literal('CONTENT_FILTER').default('CONTENT_FILTER'),
    delta: ContentDelta,
    finish_reason: z.literal('content_filter'),
    index: ChoiceIndex,
  })
  .describe('Omitted content due to a flag from our content filters');

export const ChoiceWithRoleDelta = z.object({
  _type: z.literal('ROLE').default('ROLE'),
  delta: RoleDelta,
  finish_reason: z.null(),
  index: ChoiceIndex,
});

export const ChoiceWithStopReasonDelta = z
  .object({
    _type: z.literal('STOP').default('STOP'),
    delta: EmptyDelta,
    finish_reason: z.literal('stop'),
    index: ChoiceIndex,
  })
  .describe(
    'API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter',
  );

export const ChoiceWithLengthReasonDelta = z
  .object({
    _type: z.literal('LENGTH_STOP').default('LENGTH_STOP'),
    delta: ContentDelta,
    finish_reason: z.literal('length'),
    index: ChoiceIndex,
  })
  .describe(
    'Incomplete model output due to max_tokens parameter or token limit',
  );

export type OpenAIChatStreamingSchemaProps<
  ModelName extends OpenAIChatModelName,
> = OpenAIChatSchemaProps<ModelName>;

export class OpenAIChatStreamingSchema<
  ModelName extends OpenAIChatModelName,
> extends BaseHopfieldChat<ModelName, true> {
  constructor(props: OpenAIChatStreamingSchemaProps<ModelName>) {
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
    });
  }

  get returnType() {
    const Choice = z.union([
      // role must come before content delta
      ChoiceWithRoleDelta,
      ChoiceWithContentDelta,
      ChoiceWithContentFilterDelta,
      ChoiceWithStopReasonDelta,
      ChoiceWithLengthReasonDelta,
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

export type OpenAIStreamingChatProps<
  Provider,
  ModelName extends OpenAIChatModelName,
> = OpenAIChatStreamingSchemaProps<ModelName> & {
  provider: Provider;
};

export class OpenAIStreamingChat<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
> extends OpenAIChatStreamingSchema<ModelName> {
  provider: Provider;

  constructor(props: OpenAIStreamingChatProps<Provider, ModelName>) {
    super(props);

    this.provider = props.provider;
  }

  async get(input: z.input<typeof this.parameters>) {
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

  override functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctionsStreaming({
      provider: this.provider,
      model: this.model,
      functions,
    });
  }
}
