import type { ZodFirstPartyTypeKind } from 'zod';

export type TypeTemplates = Partial<
  Record<ZodFirstPartyTypeKind, (input: string) => string>
>;
