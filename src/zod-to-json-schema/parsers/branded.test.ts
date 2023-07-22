import { getRefs } from '../Refs.js';
import { parseBrandedDef } from './branded.js';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('objects', () => {
  it('should be possible to use branded string', () => {
    const schema = z.string().brand<'x'>();
    const parsedSchema = parseBrandedDef(schema._def, getRefs());

    const expectedSchema = {
      type: 'string',
    };
    expect(parsedSchema).toStrictEqual(expectedSchema);
  });
});
