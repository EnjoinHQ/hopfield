import { describe, expect, it, test } from 'vitest';

import { weatherFunction, weatherFunctionParams } from '../_test/function.js';
import * as Exports from './function.js';

import hop from '../index.js';
import { z } from 'zod';

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
      hop.template.function.enum('The city and state, e.g. San Francisco, CA.'),
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
        hop.function({
          ...weatherFunctionParams,
          description: undefined as unknown as string,
        }).jsonSchema,
    ).toThrowErrorMatchingInlineSnapshot(`
    "You must define a valid function description.

    Docs: https://hopfield.ai/api/function
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

  test('should fail with no enum description', () => {
    expect(
      () =>
        hop.function({
          ...weatherFunctionParams,
          parameters: z.object({
            location: z
              .string()
              .describe('The city and state, e.g. San Francisco, CA'),
            unit: z.enum(['celsius', 'fahrenheit']),
          }),
        }).jsonSchema,
    ).toThrowErrorMatchingInlineSnapshot(`
    "You must define a description for the type: ZodEnum

    Docs: https://hopfield.ai/api/function
    Details: There must be a description provided for ZodEnum, to describe what the function does for the LLM to infer a value.
    Version: hopfield@x.y.z"
  `);
  });

  test('should fail with no string description', () => {
    expect(
      () =>
        hop.function({
          ...weatherFunctionParams,
          parameters: z.object({
            location: z.string(),
            unit: z
              .enum(['celsius', 'fahrenheit'])
              .describe(
                hop.template.function.enum('The unit for the temperature.'),
              ),
          }),
        }).jsonSchema,
    ).toThrowErrorMatchingInlineSnapshot(`
    "You must define a description for the type: ZodString

    Docs: https://hopfield.ai/api/function
    Details: There must be a description provided for ZodString, to describe what the function does for the LLM to infer a value.
    Version: hopfield@x.y.z"
  `);
  });

  test('should fail with no enum templated description', () => {
    expect(
      () =>
        hop.function({
          ...weatherFunctionParams,
          parameters: z.object({
            location: z
              .string()
              .describe('The city and state, e.g. San Francisco, CA'),
            unit: z
              .enum(['celsius', 'fahrenheit'])
              .describe('The unit for the temperature.'),
          }),
        }).jsonSchema,
    ).toThrowErrorMatchingInlineSnapshot(`
    "You should template your descriptions.

    Docs: https://hopfield.ai/api/function
    Details: It's recommended to template your descriptions - we recommend ending the type ZodEnum with \\" This must always be a possible value from the \`enum\` array.\\".
    Version: hopfield@x.y.z"
  `);
  });

  test('should fail with an invalid function name', () => {
    expect(
      () =>
        hop.function({
          ...weatherFunctionParams,
          name: 'function?',
        }).jsonSchema,
    ).toThrowErrorMatchingInlineSnapshot(`
    "You must define a valid function name.

    Docs: https://hopfield.ai/api/function
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
