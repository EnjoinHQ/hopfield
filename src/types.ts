import type { WithError } from './type-utils.js';

export type Sentence = `${string}.`;

export type SentenceOrError<T extends string> = T extends Sentence
  ? T
  : WithError<T, 'The text must end with a period `.` for valid parsing.'>;
