import type { SentenceOrError } from './types.js';
import type { ZodFirstPartyTypeKind } from 'zod';

export type TypeTemplates =
  | Partial<
      Record<ZodFirstPartyTypeKind, (input: SentenceOrError<string>) => string>
    >
  | false;

export type BaseHopfieldChatTemplateProps<TTemplates extends TypeTemplates> = {
  /**
   * Allows you to specify custom templates to use for different Zod types.
   */
  templates: TTemplates;
};

export abstract class BaseHopfieldChatTemplate<
  TTemplates extends TypeTemplates,
> {
  _templates: TTemplates;

  constructor({ templates }: BaseHopfieldChatTemplateProps<TTemplates>) {
    this._templates = templates;
  }
}
