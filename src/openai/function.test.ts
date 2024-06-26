import { describe, expect, it, test } from 'vitest';

import {
  weatherFunction,
  weatherFunctionParams,
} from '../_test/openai-function.js';
import * as Exports from './function.js';

import hop from '../index.js';
import openai from './index.js';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "OpenAIFunction",
    ]
  `);
});

describe.concurrent('test functions', () => {
  test('should add enum suffix', () => {
    expect(
      hop
        .client(openai)
        .template()
        .enum('The city and state, e.g. San Francisco, CA.'),
    ).toMatchInlineSnapshot(
      '"The city and state, e.g. San Francisco, CA. This must always be a possible value from the `enum` array."',
    );
  });

  test('should pass with valid function', () => {
    expect(weatherFunction.jsonSchema).toMatchInlineSnapshot(`
    {
      "description": "Get the current weather in a given location",
      "name": "getCurrentWeather",
      "parameters": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "location": {
            "description": "The city and state, e.g. San Francisco, CA",
            "type": "string",
          },
          "unit": {
            "description": "The unit for the temperature. This must always be a possible value from the \`enum\` array.",
            "enum": [
              "celsius",
              "fahrenheit",
            ],
            "type": "string",
          },
        },
        "required": [
          "location",
          "unit",
        ],
        "type": "object",
      },
    }
  `);
  });

  test('should fail with no function description', () => {
    expect(
      () =>
        hop.client(openai).function({
          ...weatherFunctionParams,
          description: undefined as unknown as string,
        }).jsonSchema,
    ).toThrowErrorMatchingInlineSnapshot(`
      "You must define a valid function description.

      Docs: https://hopfield.ai/chat/functions
      Details: [
        {
          \\"code\\": \\"invalid_type\\",
          \\"expected\\": \\"string\\",
          \\"received\\": \\"undefined\\",
          \\"path\\": [],
          \\"message\\": \\"Required\\"
        }
      ]
      Version: hopfield@x.y.z"
    `);
  });

  test('should fail with an invalid function name', () => {
    expect(
      () =>
        hop.client(openai).function({
          ...weatherFunctionParams,
          name: 'function?',
        }).jsonSchema,
    ).toThrowErrorMatchingInlineSnapshot(`
      "You must define a valid function name.

      Docs: https://hopfield.ai/chat/functions
      Details: [
        {
          \\"code\\": \\"custom\\",
          \\"message\\": \\"Function name can only contain a-z, A-Z, 0-9, underscores and dashes.\\",
          \\"path\\": []
        }
      ]
      Version: hopfield@x.y.z"
    `);
  });

  test('should parse a valid return type', () => {
    expect(
      weatherFunction.returnType.parse({
        name: 'getCurrentWeather',
        arguments: '{\n  "location": "Phoenix, AZ",\n  "unit": "celsius"\n}',
      }),
    ).toMatchInlineSnapshot(`
    {
      "arguments": {
        "location": "Phoenix, AZ",
        "unit": "celsius",
      },
      "name": "getCurrentWeather",
    }
  `);
  });

  test('should fail on an invalid return type', () => {
    expect(() =>
      weatherFunction.returnType.parse({
        name: 'getCurrentWeather',
        arguments: '{\n  "location": "Phoenix, AZ"\n}',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
    "[
      {
        \\"expected\\": \\"'celsius' | 'fahrenheit'\\",
        \\"received\\": \\"undefined\\",
        \\"code\\": \\"invalid_type\\",
        \\"path\\": [
          \\"unit\\"
        ],
        \\"message\\": \\"Required\\"
      }
    ]"
  `);
  });

  test('should expose the function name', () => {
    expect(weatherFunction.name).toMatchInlineSnapshot('"getCurrentWeather"');
  });
});
