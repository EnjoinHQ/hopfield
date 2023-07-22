import { getRefs } from '../Refs.js';
import type { JsonSchema7Type } from '../parseDef.js';
import { parseBigintDef } from './bigint.js';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('bigint', () => {
  it('should be possible to use bigint', () => {
    const parsedSchema = parseBigintDef(z.bigint()._def, getRefs());
    const jsonSchema: JsonSchema7Type = {
      type: 'integer',
      format: 'int64',
    };
    expect(parsedSchema).toStrictEqual(jsonSchema);
  });

  // Jest doesn't like bigints. 🤷
  it.skip('should be possible to define gt/lt', () => {
    const parsedSchema = parseBigintDef(
      z.bigint().gt(BigInt(10)).lt(BigInt(20))._def,
      getRefs(),
    );
    const jsonSchema = {
      type: 'integer',
      format: 'int64',
      minimum: BigInt(10),
      maximum: BigInt(20),
    };
    expect(parsedSchema).toStrictEqual(jsonSchema);
  });
});
