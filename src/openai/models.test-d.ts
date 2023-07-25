import { openAIChatModelNames } from './models.js';
import { OpenAI } from 'openai';
import { assertType, test } from 'vitest';

test('align with openai types', () => {
  assertType<
    readonly OpenAI.Chat.CompletionCreateParams.CreateChatCompletionRequestNonStreaming['model'][]
  >(openAIChatModelNames);
});
