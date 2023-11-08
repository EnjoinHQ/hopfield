import { describe, expect, it } from 'vitest';

import * as Exports from './streaming.js';
import { test } from 'vitest';

import { weatherFunction } from '../../_test/openai-function.js';
import hop from '../../index.js';

import {
  openaiStreamBasicMessage,
  openaiStreamFunctionCall,
  openaiStreamFunctionCallLengthLimited,
  openaiStreamLengthLimited,
  openaiStreamTwoResponses,
} from '../../_test/openai-streaming.js';
import openai from '../index.js';

const chat = hop.client(openai).chat('gpt-3.5-turbo-1106').streaming();
const chatWithFunction = chat.functions([weatherFunction]);

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "AssistantRole",
      "ChoiceWithRoleDelta",
      "ChoiceWithContentDelta",
      "ChoiceWithContentFilterDelta",
      "ChoiceWithStopReasonDelta",
      "ChoiceWithLengthReasonDelta",
      "OpenAIChatStreamingSchema",
      "OpenAIStreamingChat",
    ]
  `);
});

test('should set a model name', async () => {
  expect(
    hop.client(openai).chat('gpt-4-1106-preview').streaming().model,
  ).toMatchInlineSnapshot('"gpt-4-1106-preview"');
});

test('should set a default model name', async () => {
  expect(hop.client(openai).chat().streaming().model).toMatchInlineSnapshot(
    '"gpt-3.5-turbo-1106"',
  );
});

describe.concurrent('streaming chat', () => {
  test('all test messages', async () => {
    const allTests = [openaiStreamBasicMessage, openaiStreamLengthLimited];

    const allTypes: string[] = [];

    const testChat = hop.client(openai).chat().streaming();

    for (const messages of allTests) {
      const output = messages.map((m) => testChat.returnType.parse(m));
      const types = output.map((output) => output.choices[0].__type).join(', ');
      allTypes.push(types);
    }
    expect(allTypes).toMatchInlineSnapshot(`
      [
        "content, content, content, content, stop",
        "content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, length",
      ]
    `);
  });

  test('two n messages', async () => {
    const allTests = [openaiStreamTwoResponses];

    const allTypes: string[] = [];

    const testChat = hop
      .client(openai)
      .chat('gpt-3.5-turbo-1106', 2)
      .streaming();

    for (const messages of allTests) {
      const output = messages.map((m) => testChat.returnType.parse(m));
      const types = output
        .map(
          (output) => `${output.choices[0].__type}[${output.choices[0].index}]`,
        )
        .join(', ');
      allTypes.push(types);
    }
    expect(allTypes).toMatchInlineSnapshot(`
      [
        "content[0], content[0], content[1], content[1], content[0], content[1], content[0], content[1], stop[0], stop[1]",
      ]
    `);
  });

  test('should parse a streaming role', async () => {
    const parsed = chat.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485556,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {
            role: 'assistant',
            content: '',
          },
          finish_reason: null,
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"content"');
  });

  test('should fail on streaming function name', async () => {
    expect(() =>
      chat.returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485919,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 0,
            delta: {
              role: 'assistant',
              content: null,
              function_call: {
                name: 'getCurrentWeather',
                arguments: '',
              },
            },
            finish_reason: null,
          },
        ],
      }),
    ).toThrow();
  });

  test('should fail on function args', async () => {
    expect(() =>
      chat.returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485893,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 0,
            delta: {
              function_call: {
                arguments: '{\n',
              },
            },
            finish_reason: null,
          },
        ],
      }),
    ).toThrow();
  });

  test('should parse a streaming content', async () => {
    const parsed = chat.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485556,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {
            content: 'Ban',
          },
          finish_reason: null,
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"content"');
  });

  test('should parse a streaming content with index', async () => {
    const parsed = hop
      .client(openai)
      .chat('gpt-3.5-turbo-1106', 2)
      .streaming()
      .returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485556,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 1,
            delta: {
              content: 'Ban',
            },
            finish_reason: null,
          },
        ],
      });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"content"');
  });

  test('should parse a streaming stop', async () => {
    const parsed = chat.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485556,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'stop',
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"stop"');
  });

  test('should parse a streaming stop with two indices', async () => {
    const parsed = hop
      .client(openai)
      .chat('gpt-3.5-turbo-1106', 2)
      .streaming()
      .returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485556,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 1,
            delta: {},
            finish_reason: 'stop',
          },
        ],
      });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"stop"');
  });

  test('should parse a streaming function call stop', async () => {
    expect(() =>
      chat.returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485919,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 0,
            delta: {},
            finish_reason: 'function_call',
          },
        ],
      }),
    ).toThrow();
  });

  test('should parse a streaming length limited', async () => {
    const parsed = chat.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485893,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'length',
        },
      ],
    });

    expect(parsed.choices[0].finish_reason).toMatchInlineSnapshot('"length"');
  });
});

describe.concurrent('streaming chat with function', () => {
  test('all test messages', async () => {
    const allTests = [
      openaiStreamBasicMessage,
      openaiStreamFunctionCall,
      openaiStreamFunctionCallLengthLimited,
      openaiStreamLengthLimited,
    ];

    const allTypes: string[] = [];

    const testChat = hop
      .client(openai)
      .chat()
      .streaming()
      .functions([weatherFunction]);

    for (const messages of allTests) {
      const output = messages.map((m) => testChat.returnType.parse(m));
      const types = output.map((output) => output.choices[0].__type).join(', ');
      allTypes.push(types);
    }
    expect(allTypes).toMatchInlineSnapshot(`
      [
        "content, content, content, content, stop",
        "function_name, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_completed",
        "function_name, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, function_arguments, length",
        "content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, content, length",
      ]
    `);
  });

  test('two n messages', async () => {
    const allTests = [openaiStreamTwoResponses];

    const allTypes: string[] = [];

    const testChat = hop
      .client(openai)
      .chat('gpt-3.5-turbo-1106', 2)
      .streaming()
      .functions([weatherFunction]);

    for (const messages of allTests) {
      const output = messages.map((m) => testChat.returnType.parse(m));
      const types = output
        .map(
          (output) => `${output.choices[0].__type}[${output.choices[0].index}]`,
        )
        .join(', ');
      allTypes.push(types);
    }
    expect(allTypes).toMatchInlineSnapshot(`
      [
        "content[0], content[0], content[1], content[1], content[0], content[1], content[0], content[1], stop[0], stop[1]",
      ]
    `);
  });

  test('should parse a streaming role', async () => {
    const parsed = chatWithFunction.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485556,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {
            role: 'assistant',
            content: '',
          },
          finish_reason: null,
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"content"');
  });

  test('should fail with an invalid function name', async () => {
    expect(() =>
      chatWithFunction.returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485919,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 0,
            delta: {
              role: 'assistant',
              content: null,
              function_call: {
                name: 'someBadName',
                arguments: '',
              },
            },
            finish_reason: null,
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"code\\": \\"unrecognized_keys\\",
          \\"keys\\": [
            \\"name\\"
          ],
          \\"path\\": [
            \\"choices\\",
            0,
            \\"delta\\",
            \\"function_call\\"
          ],
          \\"message\\": \\"Unrecognized key(s) in object: 'name'\\"
        }
      ]"
    `);
  });

  test('should parse a streaming function name', async () => {
    const parsed = chatWithFunction.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485919,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {
            role: 'assistant',
            content: null,
            function_call: {
              name: 'getCurrentWeather',
              arguments: '',
            },
          },
          finish_reason: null,
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"function_name"');
  });

  test('should parse a streaming function args', async () => {
    const parsed = chatWithFunction.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485893,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {
            function_call: {
              arguments: '{\n',
            },
          },
          finish_reason: null,
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot(
      '"function_arguments"',
    );
  });

  test('should parse a streaming content', async () => {
    const parsed = chatWithFunction.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485556,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {
            content: 'Ban',
          },
          finish_reason: null,
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"content"');
  });

  test('should parse a streaming content with index', async () => {
    const parsed = hop
      .client(openai)
      .chat('gpt-3.5-turbo-1106', 2)
      .streaming()
      .functions([weatherFunction])
      .returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485556,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 1,
            delta: {
              content: 'Ban',
            },
            finish_reason: null,
          },
        ],
      });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"content"');
  });

  test('should parse a streaming stop', async () => {
    const parsed = chatWithFunction.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485556,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'stop',
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"stop"');
  });

  test('should parse a streaming stop with two indices', async () => {
    const parsed = hop
      .client(openai)
      .chat('gpt-3.5-turbo-1106', 2)
      .streaming()
      .functions([weatherFunction])
      .returnType.parse({
        id: 'chatcmpl-12345',
        object: 'chat.completion.chunk',
        created: 1690485556,
        model: 'gpt-3.5-turbo-1106',
        choices: [
          {
            index: 1,
            delta: {},
            finish_reason: 'stop',
          },
        ],
      });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot('"stop"');
  });

  test('should parse a streaming function call stop', async () => {
    const parsed = chatWithFunction.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485919,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'function_call',
        },
      ],
    });

    expect(parsed.choices[0].__type).toMatchInlineSnapshot(
      '"function_completed"',
    );
  });

  test('should parse a streaming length limited', async () => {
    const parsed = chatWithFunction.returnType.parse({
      id: 'chatcmpl-12345',
      object: 'chat.completion.chunk',
      created: 1690485893,
      model: 'gpt-3.5-turbo-1106',
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'length',
        },
      ],
    });

    expect(parsed.choices[0].finish_reason).toMatchInlineSnapshot('"length"');
  });
});
