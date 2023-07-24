import { OpenAIHopfieldEmbedding } from './embedding.js';
import { OpenAIHopfieldFunction } from './function.js';

export const oa = {
  function: OpenAIHopfieldFunction.create,
  embedding: OpenAIHopfieldEmbedding.create,
  template: {
    function: OpenAIHopfieldFunction.templates,
  },
};
