import { BaseHopfieldChatWithFunctions } from '../../chat.js';
import type {
  FunctionConfigsUnion,
  FunctionReturnTypesUnion,
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
import { ChoiceIndex, OpenAIChatBaseInput } from './shared.js';
import {
  OpenAIChatWithFunctionsStreaming,
  OpenAIChatWithFunctionsStreamingSchema,
} from './streaming-with-functions.js';
import OpenAI from 'openai';
import { z } from 'zod';

export type OpenAIChatWithFunctionsSchemaProps<
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatSchemaProps<ModelName> & {
  functions: Functions;
};

export class OpenAIChatWithFunctionsSchema<
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> extends BaseHopfieldChatWithFunctions<ModelName, false, Functions> {
  constructor(props: OpenAIChatWithFunctionsSchemaProps<ModelName, Functions>) {
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
    });

    return schema;
  }

  get functionCall(): FunctionConfigsUnion<Functions> {
    return z.union(this._functions.map((fn) => fn.functionConfigSchema) as any);
  }

  get functionSchemas(): FunctionSchemasArray<Functions> {
    return z
      .array(z.union(this._functions.map((fn) => fn.schema) as any))
      .default(this._functions.map((fn) => fn.jsonSchema));
  }

  get functionReturnTypes(): FunctionReturnTypesUnion<Functions> {
    return z.discriminatedUnion(
      'name',
      this._functions.map((fn) => fn.returnType) as any,
    );
  }

  get returnType() {
    const MessageAssistantFunctionCall = z.object({
      role: z
        .literal('assistant')
        .describe('The role of the author of this message.'),
      content: z.null(),
      function_call: this.functionReturnTypes,
    });

    const ChoiceWithFunctionCallStopReason = z
      .object({
        finish_reason: z.union([z.literal('stop'), z.literal('function_call')]),
        index: ChoiceIndex,
        message: MessageAssistantFunctionCall,
      })
      .describe(
        'API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter',
      );

    const Choice = z.union([
      ChoiceWithMessageStopReason,
      ChoiceWithFunctionCallStopReason,
      ChoiceWithLengthReason,
      ChoiceWithFunctionCallStopReason,
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
    return new OpenAIChatWithFunctionsStreamingSchema<ModelName, Functions>({
      model: this.model,
      functions: this._functions,
    });
  }

  functions<NewFunctions extends OpenAIFunctionsTuple,>(
    functions: NewFunctions,
  ) {
    return new OpenAIChatWithFunctionsSchema({
      model: this.model,
      functions: functions,
    });
  }
}

export type OpenAIChatWithFunctionsProps<
  Provider,
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> = OpenAIChatWithFunctionsSchemaProps<ModelName, Functions> & {
  provider: Provider;
};

export class OpenAIChatWithFunctions<
  Provider extends OpenAI,
  ModelName extends OpenAIChatModelName,
  Functions extends OpenAIFunctionsTuple,
> extends OpenAIChatWithFunctionsSchema<ModelName, Functions> {
  provider: Provider;

  constructor(
    props: OpenAIChatWithFunctionsProps<Provider, ModelName, Functions>,
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
      functions: this._functions,
    });
  }
}
