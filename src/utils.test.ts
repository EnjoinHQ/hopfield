import { expect, it } from 'vitest';

import * as Exports from './utils.js';
import { jsonStringify } from './utils.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "jsonStringify",
    ]
  `);
});

it('should stringify an array of objects', () => {
  const returnValue = jsonStringify([{ hello: 'there' }]);

  expect(returnValue).toMatchInlineSnapshot(`
    "[
      {
        \\"hello\\": \\"there\\"
      }
    ]"
  `);
});

it('should stringify an object', () => {
  const returnValue = jsonStringify({ hello: 'there' });

  expect(returnValue).toMatchInlineSnapshot(`
    "{
      \\"hello\\": \\"there\\"
    }"
  `);
});

class TestClass {
  value = 'a-value';
}

it('should stringify a class', () => {
  expect(jsonStringify(new TestClass())).toMatchInlineSnapshot(`
    "{
      \\"value\\": \\"a-value\\"
    }"
  `);
});

it('should disable spacing', () => {
  const returnValue = jsonStringify({ hello: 'there' }, 'none');

  expect(returnValue).toMatchInlineSnapshot('"{\\"hello\\":\\"there\\"}"');
});
