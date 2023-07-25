import { BaseHopfieldSchema } from './base.js';
import { BaseError } from './errors.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

import type { JsonSchema } from './zod-to-json-schema/zodToJsonSchema.js';
import {
  ZodFirstPartyTypeKind,
  type ZodFunction,
  type ZodTuple,
  type ZodTypeAny,
  type ZodTypeDef,
} from 'zod';
import type { Refs } from 'zod-to-json-schema/src/Refs.js';
import type { JsonSchema7Type } from 'zod-to-json-schema/src/parseDef.js';

export type DisabledTypes =
  | ZodFirstPartyTypeKind[]
  | readonly ZodFirstPartyTypeKind[]
  | false;

export type TypeTemplates =
  | Partial<Record<ZodFirstPartyTypeKind, (input: string) => string>>
  | false;

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

const requiredDescriptionTypes: ZodFirstPartyTypeKind[] = [
  ZodFirstPartyTypeKind.ZodBigInt,
  ZodFirstPartyTypeKind.ZodBoolean,
  ZodFirstPartyTypeKind.ZodDate,
  ZodFirstPartyTypeKind.ZodEnum,
  ZodFirstPartyTypeKind.ZodFunction,
  ZodFirstPartyTypeKind.ZodNativeEnum,
  ZodFirstPartyTypeKind.ZodNumber,
  ZodFirstPartyTypeKind.ZodString,
];

export type HopfieldFunctionOptions<
  D extends DisabledTypes,
  T extends TypeTemplates,
> = {
  /**
   * Allows you to throw development errors in production. This defaults to `false`
   * for speed/devex when deploying to prod.
   */
  requireDescriptions?: boolean;
  /**
   * Allows you to throw development errors in production. This defaults to `false`
   * for speed/devex when deploying to prod.
   */
  templates?: T;
  /**
   * Allows you override or disable "unstable" types, which are types that do not typically
   * produce good results with a given model. These are defined on a per-model basis and
   * test cases must back up their unreliability.
   *
   * Set to false to allow all "unstable" types.
   */
  disabledTypes?: D;
};

function isValidFunctionName(name: string) {
  const regex = /^[a-zA-Z0-9_-]{1,64}$/;
  return regex.test(name);
}

export type BaseHopfieldFunctionProps<
  Args extends ZodTuple<any, any>,
  Returns extends ZodTypeAny,
  ZFunction extends ZodFunction<Args, Returns>,
  FName extends string,
  D extends DisabledTypes,
  T extends TypeTemplates,
> = {
  schema: ZFunction;
  name: FName;
  options?: HopfieldFunctionOptions<D, T> | undefined;
};

export abstract class BaseHopfieldFunction<
  ZFunctionArgs extends ZodTuple<any, any>,
  ZFunctionReturns extends ZodTypeAny,
  ZFunction extends ZodFunction<ZFunctionArgs, ZFunctionReturns>,
  FName extends string,
  DTypes extends DisabledTypes,
  TTemplates extends TypeTemplates,
> extends BaseHopfieldSchema {
  /**
   *
   */
  _schema: ZFunction;
  /**
   *
   */
  name: FName;
  /**
   *
   */
  options: HopfieldFunctionOptions<DTypes, TTemplates>;
  protected _parameters: ZFunction['_def']['args'];

  constructor({
    schema,
    name,
    options = {},
  }: BaseHopfieldFunctionProps<
    ZFunctionArgs,
    ZFunctionReturns,
    ZFunction,
    FName,
    DTypes,
    TTemplates
  >) {
    super();

    this._schema = schema;
    this.name = name;
    this.options = options;

    const items = this._schema.parameters()?.items ?? [];

    this._parameters =
      (items?.length ?? 0) === 1 ? items[0] : this._schema.parameters();

    this._defaultTypeTemplates = this._defaultTypeTemplates.bind(this);
    this._defaultDisabledTypes = this._defaultDisabledTypes.bind(this);
  }

  protected abstract _defaultTypeTemplates(): TypeTemplates;
  protected abstract _defaultDisabledTypes(): DisabledTypes;

  /**
   * Returns a formatted JSON schema function definition for LLM function calling.
   * This is checked for correctness against the provided rules, so make sure this is only done
   * once and not called repeatedly in the critical path.
   *
   * @returns @interface JsonSchemaFunction a definition for a valid JSON schema function.
   */
  format(): JsonSchemaFunction<FName> {
    if (!isValidFunctionName(this.name)) {
      throw new BaseError('The function name is invalid.', {
        docsPath: '/api/function',
        details:
          'The function name must be comprised of a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.',
      });
    }

    if (!this._schema.description) {
      throw new BaseError(
        'You must define a description for the function schema',
        {
          docsPath: '/api/function',
          details:
            'There must be a function description provided, to describe what the function does. This is especially important with interacting with tools - the more specificity, the better.',
        },
      );
    }

    const onParseDef = (
      def: ZodTypeDef,
      _refs: Refs,
      schema: JsonSchema7Type,
    ) => {
      const typeName: ZodFirstPartyTypeKind = (def as any).typeName;

      const templates =
        this.options.templates === false
          ? false
          : {
              ...this._defaultTypeTemplates(),
              ...this.options.templates,
            };
      const requireDescriptions = this.options.requireDescriptions ?? true;
      const disabledTypes = !this.options.disabledTypes
        ? false
        : {
            ...this._defaultDisabledTypes(),
            ...this.options.disabledTypes,
          };

      // check here for typeName and description being defined
      if (
        requireDescriptions &&
        requiredDescriptionTypes.includes(typeName) &&
        !schema.description
      ) {
        throw new BaseError(
          `You must define a description for the type: ${typeName}`,
          {
            docsPath: '/api/function',
            details: `There must be a description provided for ${typeName}, to describe what the function does for the LLM to infer a value.`,
          },
        );
      }

      const descriptionEnding =
        typeof templates === 'object'
          ? templates?.[typeName]?.('') ?? null
          : null;

      if (
        descriptionEnding &&
        schema.description &&
        !schema.description?.endsWith(descriptionEnding)
      ) {
        throw new BaseError(
          `It's recommended to template your descriptions - we recommend ending the type ${typeName} with "${descriptionEnding}".`,
          {
            docsPath: '/api/function',
            details: '',
          },
        );
      }

      // check here for disabled types
      if (
        typeof disabledTypes !== 'boolean' &&
        disabledTypes.includes(typeName)
      ) {
        throw new BaseError(
          `You should not use ${typeName} yet - it provides unreliable results from LLMs.`,
          {
            docsPath: '/api/function',
            details: '',
          },
        );
      }
    };

    return {
      name: this.name,
      description: this._schema.description,
      parameters: zodToJsonSchema(this._parameters, {
        $refStrategy: 'none',
        onParseDef,
      }),
    };
  }

  get parameters(): ZFunction['_def']['args'] {
    return this._parameters;
  }
}
