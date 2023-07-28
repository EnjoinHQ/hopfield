import { hop } from '../index.js';

import { z } from 'zod';

export const weatherFunctionParams = {
  name: 'getCurrentWeather',
  description: 'Get the current weather in a given location',
  parameters: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z
      .enum(['celsius', 'fahrenheit'])
      .describe(hop.template.function.enum('The unit for the temperature.')),
  }),
} as const;

export const weatherFunction = hop.function(weatherFunctionParams);
