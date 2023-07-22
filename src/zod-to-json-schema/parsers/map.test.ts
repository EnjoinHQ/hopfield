const Ajv = require('ajv');
import type { JSONSchema7Type } from 'json-schema';

import { getRefs } from '../Refs.js';
import { parseMapDef } from './map.js';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const ajv = new Ajv();

describe('map', () => {
  it('should be possible to use Map', () => {
    const mapSchema = z.map(z.string(), z.number());

    const parsedSchema = parseMapDef(mapSchema._def, getRefs());

    const jsonSchema: JSONSchema7Type = {
      type: 'array',
      maxItems: 125,
      items: {
        type: 'array',
        items: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
        minItems: 2,
        maxItems: 2,
      },
    };

    expect(parsedSchema).toStrictEqual(jsonSchema);

    const myMap: z.infer<typeof mapSchema> = new Map<string, number>();
    myMap.set('hello', 123);

    ajv.validate(jsonSchema, [...myMap]);
    const ajvResult = !ajv.errors;

    const zodResult = mapSchema.safeParse(myMap).success;

    expect(zodResult).toBe(true);
    expect(ajvResult).toBe(true);
  });
});
