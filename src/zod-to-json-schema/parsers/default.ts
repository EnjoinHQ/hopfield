import type { Refs } from '../Refs.js';
import { type JsonSchema7Type, parseDef } from '../parseDef.js';
import type { ZodDefaultDef } from 'zod';

export function parseDefaultDef(
  _def: ZodDefaultDef,
  refs: Refs,
): JsonSchema7Type & { default: any } {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue(),
  };
}
