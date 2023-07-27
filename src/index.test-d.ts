import { expectTypeOf, test } from 'vitest';

import * as Exports from './index.js';

test('index type exports are correct', () => {
  expectTypeOf(Exports).toMatchTypeOf();
});
