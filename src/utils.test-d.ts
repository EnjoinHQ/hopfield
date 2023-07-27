import { expectTypeOf, test } from 'vitest';

import type { StringifiedArray, StringifiedObject } from './types.js';
import { jsonStringify } from './utils.js';

class TestClass {}

test('jsonStringify', () => {
  expectTypeOf(
    jsonStringify([{ hello: 'there' }]),
  ).toEqualTypeOf<StringifiedArray>();
  expectTypeOf(
    jsonStringify({ hello: 'there' }),
  ).toEqualTypeOf<StringifiedObject>();
  expectTypeOf(
    jsonStringify(new TestClass()),
  ).toEqualTypeOf<StringifiedObject>();
});
