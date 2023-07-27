/**
 * Prints custom error message
 *
 * @param T - Error message
 * @returns Custom error message
 *
 * @example
 * type Result = Error<'Custom error message'>
 * //   ^? type Result = ['Error: Custom error message']
 */
export type Error<T extends string | string[]> = T extends string
  ? [
      // Surrounding with array to prevent `T` from being widened to `string`
      `Error: ${T}`,
    ]
  : {
      [K in keyof T]: T[K] extends infer Message extends string
        ? `Error: ${Message}`
        : never;
    };

/**
 * Adds an error {@link E} to the compile time type {@link T}
 *
 * @param T - Input
 * @param E - Type to check
 *
 * @example
 * type Result = WithError<"test", "error">
 * //   ^? type Result = "test" & { __friendlyError: "error" }
 */
export type WithError<T, E extends string | string[]> = T & {
  __friendlyError: Error<E>;
};

/**
 * Combines members of an intersection into a readable type.
 *
 * @link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 * @example
 * type Result = Pretty<{ a: string } | { b: string } | { c: number, d: bigint }>
 * //   ^? type Result = { a: string; b: string; c: number; d: bigint }
 */
export type Pretty<T> = { [K in keyof T]: T[K] } & unknown;

/**
 * Makes objects destructurable.
 *
 * @param Union - Union to distribute.
 *
 * @example
 * type Result = OneOf<{ foo: boolean } | { bar: boolean }>
 * //   ^? type Result = { foo: boolean; bar?: undefined; } | { bar: boolean; foo?: undefined; }
 */
export type OneOf<
  Union extends object,
  AllKeys extends KeyofUnion<Union> = KeyofUnion<Union>,
> = Union extends infer Item
  ? Pretty<Item & { [K in Exclude<AllKeys, keyof Item>]?: never }>
  : never;
type KeyofUnion<T> = T extends T ? keyof T : never;

/**
 * Makes a tuple of length N of type T.
 */
export type Tuple<
  N extends number,
  T,
  A extends unknown[] = [T],
> = A['length'] extends N ? A : Tuple<N, T, [T, ...A]>;

/**
 * Makes a limited tuple of length N of type T. This prevents infinite recursion.
 */
export type LimitedTuple<N extends number, T> = number extends N
  ? [T]
  : N extends 1
  ? [T]
  : N extends 2
  ? [T, T]
  : N extends 3
  ? [T, T, T]
  : N extends 4
  ? [T, T, T, T]
  : N extends 5
  ? [T, T, T, T, T]
  : N extends 6
  ? [T, T, T, T, T, T]
  : N extends 7
  ? [T, T, T, T, T, T, T]
  : N extends 8
  ? [T, T, T, T, T, T, T, T]
  : N extends 9
  ? [T, T, T, T, T, T, T, T, T]
  : N extends 10
  ? [T, T, T, T, T, T, T, T, T, T]
  : never;

/**
 * Gets if the array T is empty.
 */
export type IsEmptyArray<T extends any[]> = T extends [infer _X, ...infer _Rest]
  ? false
  : true;
