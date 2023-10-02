import {
  type InferInput,
  type InferInputMessage,
  type InferResult,
  type InferStreamingChunk,
  type InferStreamingResult,
  type StreamingOptions,
} from './chat.js';
import type { BaseHopfield } from './provider.js';

export type {
  InferInput as inferInput,
  InferInputMessage as inferMessageInput,
  InferResult as inferResult,
  InferStreamingChunk as inferStreamingChunk,
  InferStreamingResult as inferStreamingResult,
  StreamingOptions,
};

export * from './errors.js';
export * from './types.js';

export const client = <Provider, Hopfield extends BaseHopfield<Provider>>(
  hopfield: Hopfield,
): Hopfield => hopfield;
