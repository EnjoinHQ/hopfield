import { expectTypeOf, test } from 'vitest';

import type { Error } from './types.js';

test('Error', () => {
  expectTypeOf<Error<'Custom error message'>>().toEqualTypeOf<
    ['Error: Custom error message']
  >();
  expectTypeOf<
    Error<['Custom error message', 'Another custom message']>
  >().toEqualTypeOf<
    ['Error: Custom error message', 'Error: Another custom message']
  >();
});
