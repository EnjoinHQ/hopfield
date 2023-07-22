import type { Refs } from '../Refs.js';
import { type JsonSchema7Type, parseDef } from '../parseDef.js';
import type { ZodEffectsDef } from 'zod';

export function parseEffectsDef(
  _def: ZodEffectsDef,
  refs: Refs,
): JsonSchema7Type | undefined {
  return refs.effectStrategy === 'input'
    ? parseDef(_def.schema._def, refs)
    : {};
}
