import { expect, it, test } from 'vitest';

import { weatherFunction } from '../_test/function.js';
import { openai } from '../_test/openai.js';
import * as Exports from './function.js';
import { OpenAIHopfieldFunction } from './function.js';

import hop from '../index.js';
import { z } from 'zod';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "OpenAIHopfieldFunction",
    ]
  `);
});

test('should add enum suffix', () => {
  expect(
    hop.template.function.enum('The city and state, e.g. San Francisco, CA.'),
  ).toMatchInlineSnapshot(
    '"The city and state, e.g. San Francisco, CA. This must always be a possible value from the `enum` array."',
  );
});

test('should pass with valid function', () => {
  expect(
    hop
      .provider(openai)
      .function({
        schema: weatherFunction.schema,
        name: weatherFunction.name,
      })
      .format(),
  ).toMatchInlineSnapshot(`
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
  expect(() =>
    hop
      .provider(openai)
      .function({
        name: 'getWeather',
        schema: z.function().args(
          z.object({
            location: z
              .string()
              .describe('The city and state, e.g. San Francisco, CA'),
            unit: z
              .enum(['celsius', 'fahrenheit'])
              .describe(
                OpenAIHopfieldFunction.templates.enum(
                  'The unit for the temperature.',
                ),
              ),
          }),
        ),
      })
      .format(),
  ).toThrowErrorMatchingInlineSnapshot(`
    "You must define a description for the function schema

    Docs: https://hopfield.ai/api/function
    Details: There must be a function description provided, to describe what the function does. This is especially important with interacting with tools - the more specificity, the better.
    Version: hopfield@x.y.z"
  `);
});

test('should fail with no enum description', () => {
  expect(() =>
    hop
      .provider(openai)
      .function({
        name: 'getWeather',
        schema: z
          .function()
          .args(
            z.object({
              location: z
                .string()
                .describe('The city and state, e.g. San Francisco, CA'),
              unit: z.enum(['celsius', 'fahrenheit']),
            }),
          )
          .describe('Get the current weather in a given location'),
      })
      .format(),
  ).toThrowErrorMatchingInlineSnapshot(`
    "You must define a description for the type: ZodEnum

    Docs: https://hopfield.ai/api/function
    Details: There must be a description provided for ZodEnum, to describe what the function does for the LLM to infer a value.
    Version: hopfield@x.y.z"
  `);
});

test('should fail with no string description', () => {
  expect(() =>
    hop
      .provider(openai)
      .function({
        name: 'getWeather',
        schema: z
          .function()
          .args(
            z.object({
              location: z.string(),
              unit: z
                .enum(['celsius', 'fahrenheit'])
                .describe(
                  OpenAIHopfieldFunction.templates.enum(
                    'The unit for the temperature.',
                  ),
                ),
            }),
          )
          .describe('Get the current weather in a given location'),
      })
      .format(),
  ).toThrowErrorMatchingInlineSnapshot(`
    "You must define a description for the type: ZodString

    Docs: https://hopfield.ai/api/function
    Details: There must be a description provided for ZodString, to describe what the function does for the LLM to infer a value.
    Version: hopfield@x.y.z"
  `);
});

test('should fail with no enum templated description', () => {
  expect(() =>
    hop
      .provider(openai)
      .function({
        name: 'getWeather',
        schema: z
          .function()
          .args(
            z.object({
              location: z
                .string()
                .describe('The city and state, e.g. San Francisco, CA'),
              unit: z
                .enum(['celsius', 'fahrenheit'])
                .describe('The unit for the temperature.'),
            }),
          )
          .describe('Get the current weather in a given location'),
      })
      .format(),
  ).toThrowErrorMatchingInlineSnapshot(`
    "It's recommended to template your descriptions - we recommend ending the type ZodEnum with \\" This must always be a possible value from the \`enum\` array.\\".

    Docs: https://hopfield.ai/api/function
    Version: hopfield@x.y.z"
  `);
});

test('should fail with an invalid function name', () => {
  expect(() =>
    hop
      .provider(openai)
      .function({
        schema: weatherFunction.schema,
        name: 'function?',
      })
      .format(),
  ).toThrowErrorMatchingInlineSnapshot(`
    "The function name is invalid.

    Docs: https://hopfield.ai/api/function
    Details: The function name must be comprised of a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
    Version: hopfield@x.y.z"
  `);
});
