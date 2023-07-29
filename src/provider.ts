import type { BaseHopfieldChat } from './chat.js';
import type { BaseHopfieldEmbedding } from './embedding.js';
import type { BaseHopfieldFunction } from './function.js';
import type { BaseHopfieldChatTemplate } from './template.js';

export abstract class BaseHopfield<Provider> {
  abstract provider(provider: Provider): BaseHopfield<Provider>;

  abstract chat(opts?: any): BaseHopfieldChat<any, any, any>;
  abstract embedding(opts?: any): BaseHopfieldEmbedding<any, any, any>;
  abstract function(
    opts?: any,
  ): BaseHopfieldFunction<any, any, any, any, any, any>;
  abstract template(opts?: any): BaseHopfieldChatTemplate<any>;
}
