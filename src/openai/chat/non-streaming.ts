import { BaseHopfieldChat, type InferChatInput } from '../../chat.js';
import type { OpenAIFunctionsTuple } from '../function.js';
import {
  type OpenAIChatModelName,
  defaultOpenAIChatModelName,
} from '../models.js';
import {
  OpenAIChatWithFunctions,
  OpenAIChatWithFunctionsSchema,
} from './non-streaming-with-functions.js';
import {
  ChoiceIndex,
  MessageAssistant,
  OpenAIChatBaseInput,
} from './shared.js';
import { OpenAIChatStreamingSchema, OpenAIStreamingChat } from './streaming.js';
import OpenAI from 'openai';
import { z } from 'zod';

export const ChoiceWithContentFilterReason = z
  .object({
    finish_reason: z.literal('content_filter'),
    index: ChoiceIndex,
    message: MessageAssistant,
  })
  .describe('Omitted content due to a flag from our content filters');

export const ChoiceWithMessageStopReason = z
  .object({
    finish_reason: z.literal('stop'),
    index: ChoiceIndex,
    message: MessageAssistant,
  })
  .describe(
    'API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter',
  );

export const ChoiceWithLengthReason = z
  .object({
    finish_reason: z.literal('length'),
    index: ChoiceIndex,
    message: MessageAssistant,
  })
  .describe(
    'Incomplete model output due to max_tokens parameter or token limit',
  );

export const Usage = z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  total_tokens: z.number(),
});

export type OpenAIChatSchemaProps<ModelName extends OpenAIChatModelName,> = {
  model: ModelName;
};

export class OpenAIChatSchema<
  ModelName extends OpenAIChatModelName,
> extends BaseHopfieldChat<ModelName, false> {
  constructor(props: OpenAIChatSchemaProps<ModelName>) {
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
    });

    return schema;
  }

  get returnType() {
    const Choice = z.union([
      ChoiceWithMessageStopReason,
      ChoiceWithLengthReason,
      ChoiceWithContentFilterReason,
    ]);

    return z.object({
      id: z.string(),
      choices: z.array(Choice),
      created: z.number(),
      model: z.string(),
      object: z.literal('chat.completion'),
      usage: Usage.optional(),
    });
  }

  streaming() {
    return new OpenAIChatStreamingSchema<ModelName>({
      model: this.model,
    });
  }

  functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctionsSchema({
      model: this.model,
      functions,
    });
  }
}

export type OpenAIChatProps<
  Provider,
  ModelName extends OpenAIChatModelName,
> = OpenAIChatSchemaProps<ModelName> & {
  provider: Provider;
};

export class OpenAIChat<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
> extends OpenAIChatSchema<ModelName> {
  provider: Provider;

  constructor(props: OpenAIChatProps<Provider, ModelName>) {
    super(props);

    this.provider = props.provider;
  }

  async get(input: InferChatInput<typeof this>) {
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

  override streaming(): OpenAIStreamingChat<Provider, ModelName> {
    return new OpenAIStreamingChat({
      provider: this.provider,
      model: this.model,
    });
  }

  override functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctions({
      provider: this.provider,
      model: this.model,
      functions: functions,
    });
  }
}
