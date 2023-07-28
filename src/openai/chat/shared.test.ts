import { expect, it } from 'vitest';

import * as Exports from './shared.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "FunctionName",
      "FunctionCall",
      "MessageSystem",
      "MessageAssistant",
      "MessageUser",
      "MessageAssistantFunctionCall",
      "MessageFunction",
      "Message",
      "OpenAIChatBaseInput",
    ]
  `);
});
