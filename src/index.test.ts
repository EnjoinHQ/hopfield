import { expect, it } from 'vitest';

import * as Exports from './index.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "BaseError",
      "chat",
      "embedding",
      "function",
      "provider",
      "template",
      "hop",
      "default",
    ]
  `);
});
