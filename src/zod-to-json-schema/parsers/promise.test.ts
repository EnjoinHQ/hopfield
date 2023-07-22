import { getRefs } from '../Refs.js';
import { parsePromiseDef } from './promise.js';
import type { JSONSchema7Type } from 'json-schema';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('promise', () => {
  it('should be possible to use promise', () => {
    const parsedSchema = parsePromiseDef(z.promise(z.string())._def, getRefs());
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
    };
    expect(parsedSchema).toStrictEqual(jsonSchema);
  });
});
