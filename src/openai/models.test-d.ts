import type { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/index.mjs';
import { assertType, test } from 'vitest';
import { openAIChatModelNames } from './models.js';

test('align with openai types', () => {
  assertType<readonly ChatCompletionCreateParamsNonStreaming['model'][]>(
    openAIChatModelNames,
  );
});
