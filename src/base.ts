import type { ZodType } from 'zod';

export abstract class BaseHopfieldSchema<
  P = ZodType<any, any, any>,
  R = ZodType<any, any, any>,
> {
  abstract get parameters(): P;
  abstract get returnType(): R;
}
