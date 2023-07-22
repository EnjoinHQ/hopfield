import type { Refs } from '../Refs.js';
import { parseDef } from '../parseDef.js';
import type { ZodBrandedDef } from 'zod';

export function parseBrandedDef(_def: ZodBrandedDef<any>, refs: Refs) {
  return parseDef(_def.type._def, refs);
}
