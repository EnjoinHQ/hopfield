import type { Tuple, WithError } from './type-utils.js';
import type { ZodNumber } from 'zod';

export type StringifiedObject = `{${string}}`;
export type StringifiedArray<T extends string = string> = `[${T}]`;

export type Sentence = `${string}.`;

export type SentenceOrError<T extends string> = T extends Sentence
  ? T
  : WithError<T, 'The text must end with a period `.` for valid parsing.'>;

export type Tuple256 = Tuple<256, ZodNumber>;
