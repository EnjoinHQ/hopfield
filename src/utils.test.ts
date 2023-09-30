import { expect, it, describe } from 'vitest';

import * as Exports from './utils.js';
import { jsonStringify, readableFromAsyncIterable } from './utils.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "jsonStringify",
      "readableFromAsyncIterable",
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

describe.concurrent('readableFromAsyncIterable', () => {
  it('should respect backpressure from the readable stream', async () => {
    const bufferedValues: number[] = [];

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    async function* bufferedGenerator() {
      let count = 0;
      while (true) {
        await delay(100); // Increased delay for clearer demonstration
        count++;
        bufferedValues.push(count);
        yield count;
      }
    }

    const stream = readableFromAsyncIterable(bufferedGenerator());
    const reader = stream.getReader();

    const values: number[] = [];
    for (let i = 0; i < 3; i++) {
      const { value } = await reader.read();
      if (value) values.push(value);
      await delay(400); // Increased delay for clearer demonstration
    }
    await reader.cancel(); // Cleanup

    // Expect that the buffered values shouldn't be too far ahead of the consumed values
    expect(values).toEqual([1, 2, 3]);
    expect(bufferedValues.length).toBeLessThanOrEqual(values.length + 2);
  });

  it('should convert async iterable to readable stream', async () => {
    async function* asyncGenerator() {
      yield 'a';
      yield 'b';
      yield 'c';
    }

    // Convert the async iterable to readable stream
    const stream = readableFromAsyncIterable(asyncGenerator());

    // Collect the data from the readable stream
    const reader = stream.getReader();
    const chunks: string[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Assert that the data matches
    expect(chunks).toEqual(['a', 'b', 'c']);
  });

  it('should stop the iterator when the reader is closed early', async () => {
    const log: string[] = [];

    // Create an async generator with side effects
    async function* asyncGenerator() {
      yield 'a';
      log.push('a yielded');
      yield 'b';
      log.push('b yielded');
      yield 'c';
      log.push('c yielded');
    }

    // Convert the async iterable to readable stream
    const stream = readableFromAsyncIterable(asyncGenerator());

    // Read only the first value and then close the reader
    const reader = stream.getReader();
    const { value: firstValue } = await reader.read();
    await reader.releaseLock();

    // Assert that the first value is 'a' and that the generator stopped after yielding 'a'
    expect(firstValue).toEqual('a');
    expect(log).toEqual(['a yielded']);
  });

  it('should propagate errors from the async iterable', async () => {
    async function* errorGenerator() {
      throw new Error('Sample Error');
      // biome-ignore lint: test case
      yield '';
    }

    const stream = readableFromAsyncIterable(errorGenerator());
    const reader = stream.getReader();

    await expect(reader.read()).rejects.toThrow('Sample Error');
  });

  it('should call the iterator return method on stream cancel', async () => {
    let wasReturnCalled = false;
    async function* cancelableGenerator() {
      yield 'a';
      yield 'b';
    }
    cancelableGenerator.prototype.return = () => {
      wasReturnCalled = true;
      return { done: true, value: undefined };
    };

    const stream = readableFromAsyncIterable(cancelableGenerator());
    const reader = stream.getReader();

    await reader.read();
    await reader.cancel();

    expect(wasReturnCalled).toBeTruthy();
  });

  it('should return a closed stream for an empty async iterable', async () => {
    async function* emptyGenerator() {}
    const stream = readableFromAsyncIterable(emptyGenerator());
    const reader = stream.getReader();

    const { done } = await reader.read();

    expect(done).toBeTruthy();
  });
});
