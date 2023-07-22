import { expect, test } from 'vitest';

import { BaseError } from './errors.js';

test('BaseError', () => {
  expect(new BaseError('An error occurred.')).toMatchInlineSnapshot(`
    [HopfieldError: An error occurred.

    Version: hopfield@x.y.z]
  `);

  expect(
    new BaseError('An error occurred.', { details: 'details' }),
  ).toMatchInlineSnapshot(`
    [HopfieldError: An error occurred.

    Details: details
    Version: hopfield@x.y.z]
  `);

  expect(new BaseError('', { details: 'details' })).toMatchInlineSnapshot(`
    [HopfieldError: An error occurred.

    Details: details
    Version: hopfield@x.y.z]
  `);
});

test('BaseError (w/ docsPath)', () => {
  expect(
    new BaseError('An error occurred.', {
      details: 'details',
      docsPath: '/api/function',
    }),
  ).toMatchInlineSnapshot(`
    [HopfieldError: An error occurred.

    Docs: https://hopfield.ai/api/function
    Details: details
    Version: hopfield@x.y.z]
  `);
  expect(
    new BaseError('An error occurred.', {
      cause: new BaseError('error', { docsPath: '/api/function' }),
    }),
  ).toMatchInlineSnapshot(`
    [HopfieldError: An error occurred.

    Docs: https://hopfield.ai/api/function
    Version: hopfield@x.y.z]
  `);
  expect(
    new BaseError('An error occurred.', {
      cause: new BaseError('error'),
      docsPath: '/api/function',
    }),
  ).toMatchInlineSnapshot(`
    [HopfieldError: An error occurred.

    Docs: https://hopfield.ai/api/function
    Version: hopfield@x.y.z]
  `);
});

test('BaseError (w/ metaMessages)', () => {
  expect(
    new BaseError('An error occurred.', {
      details: 'details',
      metaMessages: ['Reason: huh', 'Cause: why'],
    }),
  ).toMatchInlineSnapshot(`
    [HopfieldError: An error occurred.

    Reason: huh
    Cause: why

    Details: details
    Version: hopfield@x.y.z]
  `);
});

test('inherited BaseError', () => {
  const err = new BaseError('An error occurred.', {
    details: 'details',
    docsPath: '/api/function',
  });
  expect(
    new BaseError('An internal error occurred.', {
      cause: err,
    }),
  ).toMatchInlineSnapshot(`
    [HopfieldError: An internal error occurred.

    Docs: https://hopfield.ai/api/function
    Details: details
    Version: hopfield@x.y.z]
  `);
});

test('inherited Error', () => {
  const err = new Error('details');
  expect(
    new BaseError('An internal error occurred.', {
      cause: err,
      docsPath: '/api/function',
    }),
  ).toMatchInlineSnapshot(`
    [HopfieldError: An internal error occurred.

    Docs: https://hopfield.ai/api/function
    Details: details
    Version: hopfield@x.y.z]
  `);
});
