import type { Refs } from '../Refs.js';
import { parseDef } from '../parseDef.js';
import type { ZodCatchDef } from 'zod';

export const parseCatchDef = (def: ZodCatchDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};
