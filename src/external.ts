import {
  type InferInput,
  type InferInputMessage,
  type InferResult,
  type InferStreamingResult,
} from './chat.js';
import type { BaseHopfield } from './provider.js';

export type {
  InferInput as inferInput,
  InferInputMessage as inferMessageInput,
  InferResult as inferResult,
  InferStreamingResult as inferStreamingResult,
};

export { readableFromAsyncIterable } from './utils.js';

export * from './errors.js';
export * from './types.js';

export const client = <Provider, Hopfield extends BaseHopfield<Provider>>(
  hopfield: Hopfield,
): Hopfield => hopfield;
