export const openaiBasicMessage = {
  id: 'chatcmpl-8976324',
  object: 'chat.completion',
  created: 1690495858,
  model: 'gpt-3.5-turbo-0613',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'Banana.',
      },
      finish_reason: 'stop',
    },
  ],
  usage: {
    prompt_tokens: 28,
    completion_tokens: 3,
    total_tokens: 31,
  },
} as const;

export const openaiLengthLimited = {
  id: 'chatcmpl-1230789',
  object: 'chat.completion',
  created: 1690495920,
  model: 'gpt-3.5-turbo-0613',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'Once upon a time, in a quaint little village',
      },
      finish_reason: 'length',
    },
  ],
  usage: {
    prompt_tokens: 27,
    completion_tokens: 10,
    total_tokens: 37,
  },
} as const;

export const openaiFunctionCallLengthLimited = {
  id: 'chatcmpl-908213',
  object: 'chat.completion',
  created: 1690496036,
  model: 'gpt-3.5-turbo-0613',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: null,
        function_call: {
          name: 'getCurrentWeather',
          arguments: '{\n  "location',
        },
      },
      finish_reason: 'length',
    },
  ],
  usage: {
    prompt_tokens: 102,
    completion_tokens: 10,
    total_tokens: 112,
  },
} as const;

export const openaiFunctionCall = {
  id: 'chatcmpl-098234',
  object: 'chat.completion',
  created: 1690496097,
  model: 'gpt-3.5-turbo-0613',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: null,
        function_call: {
          name: 'getCurrentWeather',
          arguments: '{\n  "location": "Phoenix, AZ",\n  "unit": "celsius"\n}',
        },
      },
      finish_reason: 'function_call',
    },
  ],
  usage: {
    prompt_tokens: 102,
    completion_tokens: 25,
    total_tokens: 127,
  },
} as const;

export const openaiTwoResponses = {
  id: 'chatcmpl-23490823',
  object: 'chat.completion',
  created: 1690496163,
  model: 'gpt-3.5-turbo-0613',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'Subjective preference.',
      },
      finish_reason: 'stop',
    },
    {
      index: 1,
      message: {
        role: 'assistant',
        content: 'Subjective preference.',
      },
      finish_reason: 'stop',
    },
  ],
  usage: {
    prompt_tokens: 23,
    completion_tokens: 8,
    total_tokens: 31,
  },
} as const;
