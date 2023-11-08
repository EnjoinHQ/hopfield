export const openaiStreamBasicMessage = [
  {
    id: 'chatcmpl-72991',
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
  },
  {
    id: 'chatcmpl-72991',
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
  },
  {
    id: 'chatcmpl-72991',
    object: 'chat.completion.chunk',
    created: 1690485556,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: 'ana',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-72991',
    object: 'chat.completion.chunk',
    created: 1690485556,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: '.',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-72991',
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
  },
] as const;

export const openaiStreamFunctionCallLengthLimited = [
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
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
  },
  {
    id: 'chatcmpl-238907',
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
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' ',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' "',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'location',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '":',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' "',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'Phoenix',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ',',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' AZ',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '",\n',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' ',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' "',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'unit',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
    object: 'chat.completion.chunk',
    created: 1690485893,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '":',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-238907',
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
  },
] as const;

export const openaiStreamLengthLimited = [
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
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
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: 'Once',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' upon',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' a',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' time',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ',',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' in',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' a',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' quaint',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' little',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' village',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' nestled',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' amidst',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' rolling',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' hills',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' and',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' lush',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' green',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: ' me',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: 'adows',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-234897',
    object: 'chat.completion.chunk',
    created: 1690485855,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'length',
      },
    ],
  },
] as const;

export const openaiStreamFunctionCall = [
  {
    id: 'chatcmpl-7878123',
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
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
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
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' ',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' "',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'location',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '":',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' "',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'Phoenix',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ',',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' AZ',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '",\n',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' ',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' "',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'unit',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '":',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: ' "',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'c',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: 'elsius',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '"\n',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
    object: 'chat.completion.chunk',
    created: 1690485919,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            arguments: '}',
          },
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-7878123',
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
  },
] as const;

export const openaiStreamTwoResponses = [
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
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
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
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
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 1,
        delta: {
          role: 'assistant',
          content: '',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
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
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: 'ana',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 1,
        delta: {
          content: 'ana',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {
          content: '.',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 1,
        delta: {
          content: '.',
        },
        finish_reason: null,
      },
    ],
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'stop',
      },
    ],
  },
  {
    id: 'chatcmpl-334897',
    object: 'chat.completion.chunk',
    created: 1690486212,
    model: 'gpt-3.5-turbo-1106',
    choices: [
      {
        index: 1,
        delta: {},
        finish_reason: 'stop',
      },
    ],
  },
] as const;
