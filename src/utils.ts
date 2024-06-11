import type { StringifiedArray, StringifiedObject } from './types.js';

type JsonStringifyReturn<T extends object | object[]> = T extends object[]
  ? StringifiedArray
  : T extends object
    ? StringifiedObject
    : never;

export function jsonStringify<T extends object | object[]>(
  value: T,
  spacing: 2 | 'none' = 2,
): JsonStringifyReturn<T> {
  if (spacing === 'none') {
    return JSON.stringify(value) as JsonStringifyReturn<T>;
  }
  return JSON.stringify(value, null, spacing) as JsonStringifyReturn<T>;
}

/**
 * Implements ReadableStream.from(asyncIterable), which isn't documented in MDN and isn't implemented in node.
 * https://github.com/whatwg/streams/commit/8d7a0bf26eb2cc23e884ddbaac7c1da4b91cf2bc
 *
 * This handles backpressure with a pull-based stream.
 */
export function readableFromAsyncIterable<T>(iterable: AsyncIterable<T>) {
  const it = iterable[Symbol.asyncIterator]();

  return new ReadableStream<T>({
    async pull(controller) {
      const { done, value } = await it.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },

    async cancel(reason) {
      await it.return?.(reason);
    },
  });
}
