import type { WithError } from './type-utils.js';

export type StringifiedObject = `{${string}}`;
export type StringifiedArray<T extends string = string> = `[${T}]`;

export type Sentence = `${string}.`;

export type SentenceOrError<T extends string> = T extends Sentence
  ? T
  : WithError<T, 'The text must end with a period `.` for valid parsing.'>;
