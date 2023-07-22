import type { Options, Targets } from '../Options.js';
import { type Refs, getRefs } from '../Refs.js';

export function errorReferences(
  options?: string | Partial<Options<Targets>>,
): Refs {
  const r = getRefs(options);
  r.errorMessages = true;
  return r;
}
