import { hop } from '../index.js';

import openai from '../openai/index.js';
// import OpenAI from 'openai';
import { z } from 'zod';

const template = hop.client(openai).template();

const unitDescription = template.enum('The unit for the temperature.');

export const weatherFunctionParams = {
  name: 'getCurrentWeather',
  description: 'Get the current weather in a given location',
  parameters: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z.enum(['celsius', 'fahrenheit']).describe(unitDescription),
  }),
} as const;

export const weatherFunction = hop
  .client(openai)
  .function(weatherFunctionParams);
