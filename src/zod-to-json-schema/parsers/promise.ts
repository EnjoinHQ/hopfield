import type { Refs } from '../Refs.js';
import { type JsonSchema7Type, parseDef } from '../parseDef.js';
import type { ZodPromiseDef } from 'zod';

export function parsePromiseDef(
  def: ZodPromiseDef,
  refs: Refs,
): JsonSchema7Type | undefined {
  return parseDef(def.type._def, refs);
}
