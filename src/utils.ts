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
