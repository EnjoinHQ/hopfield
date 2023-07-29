import { BaseHopfieldChatTemplate, type TypeTemplates } from '../template.js';
import type { SentenceOrError } from '../types.js';

export const defaultOpenAITypeTemplates = {
  ZodEnum: <D extends string>(description: SentenceOrError<D>) =>
    `${description} This must always be a possible value from the \`enum\` array.` as const,
} as const satisfies TypeTemplates;

export type DefaultOpenAITypeTemplates = typeof defaultOpenAITypeTemplates;

export type OpenAIChatTemplateProps<TTemplates extends TypeTemplates,> = {
  templates: TTemplates;
};

export class OpenAIChatTemplate<
  TTemplates extends TypeTemplates,
> extends BaseHopfieldChatTemplate<TTemplates> {
  constructor(props: OpenAIChatTemplateProps<TTemplates>) {
    super({
      ...props,
    });
  }

  enum<D extends string>(description: SentenceOrError<D>) {
    return defaultOpenAITypeTemplates.ZodEnum(description);
  }

  static template<TTemplates extends TypeTemplates,>(
    opts: OpenAIChatTemplateProps<TTemplates>,
  ) {
    return new OpenAIChatTemplate(opts);
  }
}
