import { type ZodLiteral, ZodNumber } from 'zod';

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
  ? Pretty<Item & { [_K in Exclude<AllKeys, keyof Item>]?: never }>
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

export type Tuple32 = Tuple<32, ZodNumber>;

export type Tuple1536 = [
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
  ...Tuple32,
];

/**
 * Gets if the array T is empty.
 */
export type IsEmptyArray<T extends any[]> = T extends [infer _X, ...infer _Rest]
  ? false
  : true;

/**
 * Makes a limited tuple of length N of type T.
 * This prevents infinite recursion and supports up to 20 elements.
 */
export type LimitedTuple<N extends number, T> = N extends 1
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
  : N extends 11
  ? [T, T, T, T, T, T, T, T, T, T, T]
  : N extends 12
  ? [T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 13
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 14
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 15
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 16
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 17
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 18
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 19
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  : N extends 20
  ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  : never;

type ZL<T> = ZodLiteral<T>;

/**
 * Makes a limited tuple of length N of ZodLiterals.
 * This prevents infinite recursion and supports up to 20 elements.
 */
export type LimitedTupleWithUnion<N extends number> = N extends 1
  ? [ZL<0>]
  : N extends 2
  ? [ZL<0>, ZL<1>]
  : N extends 3
  ? [ZL<0>, ZL<1>, ZL<2>]
  : N extends 4
  ? [ZL<0>, ZL<1>, ZL<2>, ZL<3>]
  : N extends 5
  ? [ZL<0>, ZL<1>, ZL<2>, ZL<3>, ZL<4>]
  : N extends 6
  ? [ZL<0>, ZL<1>, ZL<2>, ZL<3>, ZL<4>, ZL<5>]
  : N extends 7
  ? [ZL<0>, ZL<1>, ZL<2>, ZL<3>, ZL<4>, ZL<5>, ZL<6>]
  : N extends 8
  ? [ZL<0>, ZL<1>, ZL<2>, ZL<3>, ZL<4>, ZL<5>, ZL<6>, ZL<7>]
  : N extends 9
  ? [ZL<0>, ZL<1>, ZL<2>, ZL<3>, ZL<4>, ZL<5>, ZL<6>, ZL<7>, ZL<8>]
  : N extends 10
  ? [ZL<0>, ZL<1>, ZL<2>, ZL<3>, ZL<4>, ZL<5>, ZL<6>, ZL<7>, ZL<8>, ZL<9>]
  : N extends 11
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
    ]
  : N extends 12
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
    ]
  : N extends 13
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
    ]
  : N extends 14
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
      ZL<13>,
    ]
  : N extends 15
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
      ZL<13>,
      ZL<14>,
    ]
  : N extends 16
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
      ZL<13>,
      ZL<14>,
      ZL<15>,
    ]
  : N extends 17
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
      ZL<13>,
      ZL<14>,
      ZL<15>,
      ZL<16>,
    ]
  : N extends 18
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
      ZL<13>,
      ZL<14>,
      ZL<15>,
      ZL<16>,
      ZL<17>,
    ]
  : N extends 19
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
      ZL<13>,
      ZL<14>,
      ZL<15>,
      ZL<16>,
      ZL<17>,
      ZL<18>,
    ]
  : N extends 20
  ? [
      ZL<0>,
      ZL<1>,
      ZL<2>,
      ZL<3>,
      ZL<4>,
      ZL<5>,
      ZL<6>,
      ZL<7>,
      ZL<8>,
      ZL<9>,
      ZL<10>,
      ZL<11>,
      ZL<12>,
      ZL<13>,
      ZL<14>,
      ZL<15>,
      ZL<16>,
      ZL<17>,
      ZL<18>,
      ZL<19>,
    ]
  : never;
