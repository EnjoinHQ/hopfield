import OpenAI from 'openai';

const openAIClient = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY ?? '',
});

export { openAIClient };
