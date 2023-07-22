import { BaseError } from './errors.js';
import type { TypeTemplates } from './templates.js';
import type { Targets } from './zod-to-json-schema/Options.js';

import {
  type JsonSchema,
  zodToJsonSchema,
} from './zod-to-json-schema/zodToJsonSchema.js';
import { ZodFunction, ZodTuple, type ZodTypeAny } from 'zod';

export interface JsonSchemaFunction<
  Name extends string,
  Description extends string = string,
  Target extends Targets = 'jsonSchema7',
> {
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
   * underscores and dashes, with a maximum length of 64.
   */
  name: Name;
  /**
   * The parameters the functions accepts, described as a JSON Schema object. See the
   * [guide](/docs/guides/gpt/function-calling) for examples, and the
   * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
   * documentation about the format.
   *
   * To describe a function that accepts no parameters, provide the value
   * `{"type": "object", "properties": {}}`.
   */
  parameters: JsonSchema<Target>;
  /**
   * A description of what the function does, used by the model to choose when and
   * how to call the function.
   */
  description: Description;
}

export type HopfieldFunctionOptions = {
  enableUnstableTypes?: boolean;
  requireDescriptions?: boolean;
  templates?: TypeTemplates | false;
};

function isValidFunctionName(name: string) {
  const regex = /^[a-zA-Z0-9_-]{1,64}$/;
  return regex.test(name);
}

export abstract class BaseHopfieldFunction<
  ZFunction extends ZodFunction<Args, Returns>,
  Args extends ZodTuple<any, any>,
  Returns extends ZodTypeAny,
  FName extends string,
  Templates extends TypeTemplates | false,
> {
  schema: ZFunction;
  functionName: FName;
  protected options: HopfieldFunctionOptions;

  constructor({
    schema,
    functionName,
    options = {},
  }: {
    schema: ZFunction;
    functionName: FName;
    options?: HopfieldFunctionOptions | undefined;
  }) {
    this.schema = schema;
    this.functionName = functionName;
    this.options = options;
  }

  protected abstract _defaultTypeTemplates(): Templates;

  /**
   * A JSON schema function definition for LLM function calling.
   *
   * @interface JsonSchemaFunction
   */
  format(): JsonSchemaFunction<FName> {
    if (!isValidFunctionName(this.functionName)) {
      throw new BaseError('The function name is invalid.', {
        docsPath: '/api/function',
        details:
          'The function name must be comprised of a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.',
      });
    }

    if (!this.schema.description) {
      throw new BaseError(
        'You must define a description for the function schema',
        {
          docsPath: '/api/function',
          details:
            'There must be a function description provided, to describe what the function does. This is especially important with interacting with tools - the more specificity, the better.',
        },
      );
    }

    const params = this.schema.parameters?.();
    const items = params?.items ?? [];

    return {
      name: this.functionName,
      description: this.schema.description,
      parameters: zodToJsonSchema(
        (items?.length ?? 0) === 1 ? items[0] : params,
        {
          $refStrategy: 'none',
          templates:
            this.options.templates === false
              ? false
              : {
                  ...this._defaultTypeTemplates(),
                  ...this.options.templates,
                },
          requireDescriptions: this.options.requireDescriptions ?? true,
          enableUnstableTypes: this.options.enableUnstableTypes ?? false,
        },
      ),
    };
  }
}
