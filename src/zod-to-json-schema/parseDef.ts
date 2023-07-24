import { BaseError } from '../errors.js';
import type { Refs, Seen } from './Refs.js';
import { type JsonSchema7AnyType, parseAnyDef } from './parsers/any.js';
import { type JsonSchema7ArrayType, parseArrayDef } from './parsers/array.js';
import {
  type JsonSchema7BigintType,
  parseBigintDef,
} from './parsers/bigint.js';
import {
  type JsonSchema7BooleanType,
  parseBooleanDef,
} from './parsers/boolean.js';
import { parseBrandedDef } from './parsers/branded.js';
import { parseCatchDef } from './parsers/catch.js';
import { type JsonSchema7DateType, parseDateDef } from './parsers/date.js';
import { parseDefaultDef } from './parsers/default.js';
import { parseEffectsDef } from './parsers/effects.js';
import { type JsonSchema7EnumType, parseEnumDef } from './parsers/enum.js';
import {
  type JsonSchema7AllOfType,
  parseIntersectionDef,
} from './parsers/intersection.js';
import {
  type JsonSchema7LiteralType,
  parseLiteralDef,
} from './parsers/literal.js';
import { type JsonSchema7MapType, parseMapDef } from './parsers/map.js';
import {
  type JsonSchema7NativeEnumType,
  parseNativeEnumDef,
} from './parsers/nativeEnum.js';
import { type JsonSchema7NeverType, parseNeverDef } from './parsers/never.js';
import { type JsonSchema7NullType, parseNullDef } from './parsers/null.js';
import {
  type JsonSchema7NullableType,
  parseNullableDef,
} from './parsers/nullable.js';
import {
  type JsonSchema7NumberType,
  parseNumberDef,
} from './parsers/number.js';
import {
  type JsonSchema7ObjectType,
  parseObjectDef,
} from './parsers/object.js';
import { parseOptionalDef } from './parsers/optional.js';
import { parsePipelineDef } from './parsers/pipeline.js';
import { parsePromiseDef } from './parsers/promise.js';
import {
  type JsonSchema7RecordType,
  parseRecordDef,
} from './parsers/record.js';
import { type JsonSchema7SetType, parseSetDef } from './parsers/set.js';
import {
  type JsonSchema7StringType,
  parseStringDef,
} from './parsers/string.js';
import { type JsonSchema7TupleType, parseTupleDef } from './parsers/tuple.js';
import {
  type JsonSchema7UndefinedType,
  parseUndefinedDef,
} from './parsers/undefined.js';
import { type JsonSchema7UnionType, parseUnionDef } from './parsers/union.js';
import {
  type JsonSchema7UnknownType,
  parseUnknownDef,
} from './parsers/unknown.js';
import { ZodFirstPartyTypeKind, type ZodTypeDef } from 'zod';

type JsonSchema7RefType = { $ref: string };
type JsonSchema7Meta = {
  default?: any;
  description?: string;
  markdownDescription?: string;
};

export type JsonSchema7TypeUnion =
  | JsonSchema7StringType
  | JsonSchema7ArrayType
  | JsonSchema7NumberType
  | JsonSchema7BigintType
  | JsonSchema7BooleanType
  | JsonSchema7DateType
  | JsonSchema7EnumType
  | JsonSchema7LiteralType
  | JsonSchema7NativeEnumType
  | JsonSchema7NullType
  | JsonSchema7NumberType
  | JsonSchema7ObjectType
  | JsonSchema7RecordType
  | JsonSchema7TupleType
  | JsonSchema7UnionType
  | JsonSchema7UndefinedType
  | JsonSchema7RefType
  | JsonSchema7NeverType
  | JsonSchema7MapType
  | JsonSchema7AnyType
  | JsonSchema7NullableType
  | JsonSchema7AllOfType
  | JsonSchema7UnknownType
  | JsonSchema7SetType;

export type JsonSchema7Type = JsonSchema7TypeUnion & JsonSchema7Meta;

export function parseDef(
  def: ZodTypeDef,
  refs: Refs,
  forceResolution = false, // Forces a new schema to be instantiated even though its def has been seen. Used for improving refs in definitions. See https://github.com/StefanTerdell/zod-to-json-schema/pull/61.
): JsonSchema7Type | undefined {
  const seenItem = refs.seen.get(def);

  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);

    if (seenSchema !== undefined) {
      return seenSchema;
    }
  }

  const newItem: Seen = { def, path: refs.currentPath, jsonSchema: undefined };

  refs.seen.set(def, newItem);

  const jsonSchema = selectParser(def, (def as any).typeName, refs);

  if (jsonSchema) {
    addMeta(def, refs, jsonSchema, (def as any).typeName);
  }

  newItem.jsonSchema = jsonSchema;

  return jsonSchema;
}

const get$ref = (
  item: Seen,
  refs: Refs,
):
  | {
      $ref: string;
    }
  | {}
  | undefined => {
  switch (refs.$refStrategy) {
    case 'root':
      return {
        $ref:
          item.path.length === 0
            ? ''
            : item.path.length === 1
            ? `${item.path[0]}/`
            : item.path.join('/'),
      };
    case 'relative':
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case 'none': {
      if (
        item.path.length < refs.currentPath.length &&
        item.path.every((value, index) => refs.currentPath[index] === value)
      ) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            '/',
          )}! Defaulting to any`,
        );
        return {};
      }

      return undefined;
    }
    case 'seen': {
      if (
        item.path.length < refs.currentPath.length &&
        item.path.every((value, index) => refs.currentPath[index] === value)
      ) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            '/',
          )}! Defaulting to any`,
        );
        return {};
      } else {
        return item.jsonSchema;
      }
    }
  }
};

const getRelativePath = (pathA: string[], pathB: string[]) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join('/');
};

const selectParser = (
  def: any,
  typeName: ZodFirstPartyTypeKind,
  refs: Refs,
): JsonSchema7Type | undefined => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return parseDef(def.getter()._def, refs);
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return undefined;
    default:
      return ((_: never) => undefined)(typeName);
  }
};

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

const addMeta = (
  def: ZodTypeDef,
  refs: Refs,
  jsonSchema: JsonSchema7Type,
  typeName: ZodFirstPartyTypeKind,
): JsonSchema7Type => {
  // check here for typeName and description being defined
  if (
    refs.requireDescriptions &&
    requiredDescriptionTypes.includes(typeName) &&
    !def.description
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
    typeof refs.templates === 'object'
      ? refs.templates?.[typeName]?.('') ?? null
      : null;

  console.log({ descriptionEnding, d: def.description });

  if (
    descriptionEnding &&
    def.description &&
    !def.description?.endsWith(descriptionEnding)
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
    typeof refs.disabledTypes !== 'boolean' &&
    refs.disabledTypes.includes(typeName)
  ) {
    throw new BaseError(
      `You should not use ${typeName} yet - it provides unreliable results from LLMs.`,
      {
        docsPath: '/api/function',
        details: '',
      },
    );
  }

  if (def.description) {
    jsonSchema.description = def.description;

    if (refs.markdownDescription) {
      jsonSchema.markdownDescription = def.description;
    }
  }

  return jsonSchema;
};
