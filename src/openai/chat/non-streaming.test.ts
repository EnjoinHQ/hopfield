import { describe, expect, it } from 'vitest';

import { test } from 'vitest';

import { weatherFunction } from '../../_test/function.js';
import {
  openaiBasicMessage,
  openaiFunctionCall,
  openaiFunctionCallLengthLimited,
  openaiLengthLimited,
  openaiTwoResponses,
} from '../../_test/openai-non-streaming.js';
import hop from '../../index.js';
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
  expect(hop.chat('gpt-3.5-turbo-16k').model).toMatchInlineSnapshot(
    '"gpt-3.5-turbo-16k"',
  );
});

test('should set a default model name', async () => {
  expect(hop.chat().model).toMatchInlineSnapshot('"gpt-3.5-turbo-0613"');
});

describe.concurrent('non-streaming chat', () => {
  test('all test messages', async () => {
    const allTests = [openaiBasicMessage, openaiLengthLimited];

    const testChat = hop.chat();

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
          "model": "gpt-3.5-turbo-0613",
          "object": "chat.completion",
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
          "model": "gpt-3.5-turbo-0613",
          "object": "chat.completion",
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

    const testChat = hop.chat('gpt-3.5-turbo-0613', 2);

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
          "model": "gpt-3.5-turbo-0613",
          "object": "chat.completion",
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
      openaiFunctionCall,
      // openaiFunctionCallLengthLimited,
      openaiLengthLimited,
    ];

    const testChat = hop.chat().functions([weatherFunction]);

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
          "model": "gpt-3.5-turbo-0613",
          "object": "chat.completion",
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
          "model": "gpt-3.5-turbo-0613",
          "object": "chat.completion",
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
          "model": "gpt-3.5-turbo-0613",
          "object": "chat.completion",
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
      .chat('gpt-3.5-turbo-0613', 2)
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
          "model": "gpt-3.5-turbo-0613",
          "object": "chat.completion",
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
    const testChat = hop.chat().functions([weatherFunction]);

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
                  \\"code\\": \\"invalid_literal\\",
                  \\"expected\\": \\"function_call\\",
                  \\"path\\": [
                    \\"choices\\",
                    0,
                    \\"finish_reason\\"
                  ],
                  \\"message\\": \\"Invalid literal value, expected \\\\\\"function_call\\\\\\"\\"
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
        }
      ]"
    `);
  });
});
