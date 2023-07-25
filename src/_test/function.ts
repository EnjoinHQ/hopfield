import { hop } from '../index.js';
import { openai } from './openai.js';
import { z } from 'zod';

export const weatherFunction = {
  schema: z
    .function()
    .args(
      z.object({
        location: z
          .string()
          .describe('The city and state, e.g. San Francisco, CA'),
        unit: z
          .enum(['celsius', 'fahrenheit'])
          .describe(
            hop
              .provider(openai)
              .template.function.enum('The unit for the temperature.'),
          ),
      }),
    )
    .describe('Get the current weather in a given location'),
  name: 'getCurrentWeather',
} as const;
