import type { Refs } from '../Refs.js';
import { type JsonSchema7Type, parseDef } from '../parseDef.js';
import type { ZodOptionalDef } from 'zod';

export const parseOptionalDef = (
  def: ZodOptionalDef,
  refs: Refs,
): JsonSchema7Type | undefined => {
  if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
    return parseDef(def.innerType._def, refs);
  }

  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, 'anyOf', '1'],
  });

  return innerSchema
    ? {
        anyOf: [
          {
            not: {},
          },
          innerSchema,
        ],
      }
    : {};
};
