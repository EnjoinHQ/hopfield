import { expect, it } from 'vitest';

import * as Exports from './function.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "BaseHopfieldFunction",
    ]
  `);
});
