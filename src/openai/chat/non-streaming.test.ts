import { describe, expect, it } from 'vitest';

import { test } from 'vitest';

import { weatherFunction } from '../../_test/openai-function.js';
import {
  openaiBasicFunctionCall,
  openaiBasicMessage,
  openaiFunctionCall,
  openaiFunctionCallLengthLimited,
  openaiLengthLimited,
  openaiTwoResponses,
} from '../../_test/openai-non-streaming.js';
import hop from '../../index.js';
import openai from '../index.js';
import * as Exports from './non-streaming.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "ChoiceWithContentFilterReason",
      "ChoiceWithMessageStopReason",
      "ChoiceWithLengthReason",
      "Usage",
      "OpenAIChatSchema",
      "OpenAIChat",
    ]
  `);
});

test('should set a model name', async () => {
  expect(
    hop.client(openai).chat('gpt-4o-2024-05-13').model,
  ).toMatchInlineSnapshot('"gpt-4o-2024-05-13"');
});

test('should set a default model name', async () => {
  expect(hop.client(openai).chat().model).toMatchInlineSnapshot('"gpt-4o"');
});

describe.concurrent('non-streaming chat', () => {
  test('all test messages', async () => {
    const allTests = [openaiBasicMessage, openaiLengthLimited];

    const testChat = hop.client(openai).chat();

    const allTypes: hop.inferResult<typeof testChat>[] = [];

    for (const message of allTests) {
      const output = testChat.returnType.parse(message);
      allTypes.push(output);
    }

    expect(allTypes).toMatchInlineSnapshot(`
      [
        {
          "choices": [
            {
              "__type": "stop",
              "finish_reason": "stop",
              "index": 0,
              "message": {
                "content": "Banana.",
                "role": "assistant",
              },
            },
          ],
          "created": 1690495858,
          "id": "chatcmpl-8976324",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 3,
            "prompt_tokens": 28,
            "total_tokens": 31,
          },
        },
        {
          "choices": [
            {
              "__type": "length",
              "finish_reason": "length",
              "index": 0,
              "message": {
                "content": "Once upon a time, in a quaint little village",
                "role": "assistant",
              },
            },
          ],
          "created": 1690495920,
          "id": "chatcmpl-1230789",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 10,
            "prompt_tokens": 27,
            "total_tokens": 37,
          },
        },
      ]
    `);
  });

  test('two n messages', async () => {
    const allTests = [openaiTwoResponses];

    const testChat = hop.client(openai).chat('gpt-4o-2024-05-13', 2);

    const allTypes: hop.inferResult<typeof testChat>[] = [];

    for (const message of allTests) {
      const output = testChat.returnType.parse(message);
      allTypes.push(output);
    }

    expect(allTypes).toMatchInlineSnapshot(`
      [
        {
          "choices": [
            {
              "__type": "stop",
              "finish_reason": "stop",
              "index": 0,
              "message": {
                "content": "Subjective preference.",
                "role": "assistant",
              },
            },
            {
              "__type": "stop",
              "finish_reason": "stop",
              "index": 1,
              "message": {
                "content": "Subjective preference.",
                "role": "assistant",
              },
            },
          ],
          "created": 1690496163,
          "id": "chatcmpl-23490823",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 8,
            "prompt_tokens": 23,
            "total_tokens": 31,
          },
        },
      ]
    `);
  });
});

describe.concurrent('non-streaming functions chat', () => {
  test('all test messages', async () => {
    const allTests = [
      openaiBasicMessage,
      openaiBasicFunctionCall,
      openaiFunctionCall,
      openaiLengthLimited,
    ];

    const testChat = hop.client(openai).chat().functions([weatherFunction]);

    const allTypes: hop.inferResult<typeof testChat>[] = [];

    for (const message of allTests) {
      const output = testChat.returnType.parse(message);
      allTypes.push(output);
    }

    expect(allTypes).toMatchInlineSnapshot(`
      [
        {
          "choices": [
            {
              "__type": "stop",
              "finish_reason": "stop",
              "index": 0,
              "message": {
                "content": "Banana.",
                "role": "assistant",
              },
            },
          ],
          "created": 1690495858,
          "id": "chatcmpl-8976324",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 3,
            "prompt_tokens": 28,
            "total_tokens": 31,
          },
        },
        {
          "choices": [
            {
              "__type": "function_call",
              "finish_reason": "stop",
              "index": 0,
              "message": {
                "content": null,
                "function_call": {
                  "arguments": {
                    "location": "Phoenix, AZ",
                    "unit": "celsius",
                  },
                  "name": "getCurrentWeather",
                },
                "role": "assistant",
              },
            },
          ],
          "created": 1690825708,
          "id": "chatcmpl-5544332211",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 26,
            "prompt_tokens": 72,
            "total_tokens": 98,
          },
        },
        {
          "choices": [
            {
              "__type": "function_call",
              "finish_reason": "function_call",
              "index": 0,
              "message": {
                "content": null,
                "function_call": {
                  "arguments": {
                    "location": "Phoenix, AZ",
                    "unit": "celsius",
                  },
                  "name": "getCurrentWeather",
                },
                "role": "assistant",
              },
            },
          ],
          "created": 1690496097,
          "id": "chatcmpl-098234",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 25,
            "prompt_tokens": 102,
            "total_tokens": 127,
          },
        },
        {
          "choices": [
            {
              "__type": "length",
              "finish_reason": "length",
              "index": 0,
              "message": {
                "content": "Once upon a time, in a quaint little village",
                "role": "assistant",
              },
            },
          ],
          "created": 1690495920,
          "id": "chatcmpl-1230789",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 10,
            "prompt_tokens": 27,
            "total_tokens": 37,
          },
        },
      ]
    `);
  });

  test('two n messages', async () => {
    const allTests = [openaiTwoResponses];

    const testChat = hop
      .client(openai)
      .chat('gpt-4o-2024-05-13', 2)
      .functions([weatherFunction]);

    const allTypes: hop.inferResult<typeof testChat>[] = [];

    for (const message of allTests) {
      const output = testChat.returnType.parse(message);
      allTypes.push(output);
    }

    expect(allTypes).toMatchInlineSnapshot(`
      [
        {
          "choices": [
            {
              "__type": "stop",
              "finish_reason": "stop",
              "index": 0,
              "message": {
                "content": "Subjective preference.",
                "role": "assistant",
              },
            },
            {
              "__type": "stop",
              "finish_reason": "stop",
              "index": 1,
              "message": {
                "content": "Subjective preference.",
                "role": "assistant",
              },
            },
          ],
          "created": 1690496163,
          "id": "chatcmpl-23490823",
          "model": "gpt-4o-2024-05-13",
          "usage": {
            "completion_tokens": 8,
            "prompt_tokens": 23,
            "total_tokens": 31,
          },
        },
      ]
    `);
  });

  test('should throw on invalid function call arguments', async () => {
    const testChat = hop.client(openai).chat().functions([weatherFunction]);

    expect(() =>
      testChat.returnType.parse(openaiFunctionCallLengthLimited),
    ).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"code\\": \\"invalid_union\\",
          \\"unionErrors\\": [
            {
              \\"issues\\": [
                {
                  \\"received\\": \\"length\\",
                  \\"code\\": \\"invalid_enum_value\\",
                  \\"options\\": [
                    \\"stop\\",
                    \\"function_call\\"
                  ],
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"finish_reason\\"
                  ],
                  \\"message\\": \\"Invalid enum value. Expected 'stop' | 'function_call', received 'length'\\"
                },
                {
                  \\"code\\": \\"custom\\",
                  \\"message\\": \\"Invalid JSON when parsing - likely the arguments are malformed.\\",
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"message\\",
                    \\"function_call\\",
                    \\"arguments\\"
                  ]
                }
              ],
              \\"name\\": \\"ZodError\\"
            },
            {
              \\"issues\\": [
                {
                  \\"received\\": \\"length\\",
                  \\"code\\": \\"invalid_literal\\",
                  \\"expected\\": \\"stop\\",
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"finish_reason\\"
                  ],
                  \\"message\\": \\"Invalid literal value, expected \\\\\\"stop\\\\\\"\\"
                },
                {
                  \\"code\\": \\"invalid_type\\",
                  \\"expected\\": \\"string\\",
                  \\"received\\": \\"null\\",
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"message\\",
                    \\"content\\"
                  ],
                  \\"message\\": \\"Expected string, received null\\"
                }
              ],
              \\"name\\": \\"ZodError\\"
            },
            {
              \\"issues\\": [
                {
                  \\"code\\": \\"invalid_type\\",
                  \\"expected\\": \\"string\\",
                  \\"received\\": \\"null\\",
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"message\\",
                    \\"content\\"
                  ],
                  \\"message\\": \\"Expected string, received null\\"
                }
              ],
              \\"name\\": \\"ZodError\\"
            },
            {
              \\"issues\\": [
                {
                  \\"received\\": \\"length\\",
                  \\"code\\": \\"invalid_literal\\",
                  \\"expected\\": \\"content_filter\\",
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"finish_reason\\"
                  ],
                  \\"message\\": \\"Invalid literal value, expected \\\\\\"content_filter\\\\\\"\\"
                },
                {
                  \\"code\\": \\"invalid_type\\",
                  \\"expected\\": \\"string\\",
                  \\"received\\": \\"null\\",
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"message\\",
                    \\"content\\"
                  ],
                  \\"message\\": \\"Expected string, received null\\"
                }
              ],
              \\"name\\": \\"ZodError\\"
            }
          ],
          \\"path\\": [
            \\"choices\\",
            0
          ],
          \\"message\\": \\"Invalid input\\"
        },
        {
          \\"received\\": \\"gpt-4o-2024-05-13\\",
          \\"code\\": \\"invalid_literal\\",
          \\"expected\\": \\"gpt-4o\\",
          \\"path\\": [
            \\"model\\"
          ],
          \\"message\\": \\"Invalid literal value, expected \\\\\\"gpt-4o\\\\\\"\\"
        }
      ]"
    `);
  });
});
