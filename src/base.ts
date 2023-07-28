import type { ZodType } from 'zod';

export abstract class BaseHopfieldSchema {
  abstract get parameters(): ZodType<any, any, any>;
  abstract get returnType(): ZodType<any, any, any>;
}
