import { test, describe } from 'vitest';

import { SupportCategoryEnum } from '../../_test/zod.js';
import { hop } from '../../index.js';

import { openAIClient } from '../../_test/openai-client.js';
import openai from '../index.js';
import { z } from 'zod';

const TEST_TIMEOUT = 8_000;

const hopfield = hop.client(openai).provider(openAIClient);

// change the model here to see performance diff
const hopfieldChat = hopfield.chat('gpt-3.5-turbo-0613');

const classifyMessage = hopfield.function({
  name: 'classifyMessage',
  description: 'Triage an incoming support message.',
  parameters: z.object({
    summary: z.string().describe('The short summary of the message.'),
    category: SupportCategoryEnum.describe(
      hopfield.template().enum('The category of the message.'),
    ),
  }),
});

const getMessageActions = hopfield.function({
  name: 'getMessageActions',
  description: 'Get the important actions from a message.',
  parameters: z.object({
    title: z
      .string()
      .describe(
        'A short summary of the message. This MUST be less than 5 words.',
      ),
    links: z
      .array(z.string().describe('Markdown link.'))
      .describe('ALL Markdown links in the message.'),
  }),
});

describe.concurrent('non-streaming with functions', () => {
  test(
    'should parse actions from a message',
    async ({ expect }) => {
      const chat = hopfieldChat.functions([getMessageActions]);

      const message1 = `[![Build Status](https://img.shields.io/github/actions/workflow/status/pmndrs/zustand/lint-and-type.yml?branch=main&style=flat&colorA=000000&colorB=000000)](https://github.com/pmndrs/zustand/actions?query=workflow%3ALint)
      [![Build Size](https://img.shields.io/bundlephobia/minzip/zustand?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=zustand)
      [![Version](https://img.shields.io/npm/v/zustand?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/zustand)
      [![Downloads](https://img.shields.io/npm/dt/zustand.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/zustand)
      [![Discord Shield](https://img.shields.io/discord/740090768164651008?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=ffffff)](https://discord.gg/poimandres)
      
      A small, fast and scalable bearbones state-management solution using simplified flux principles. Has a comfy API based on hooks, isn't boilerplatey or opinionated.
      
      Don't disregard it because it's cute. It has quite the claws, lots of time was spent dealing with common pitfalls, like the dreaded [zombie child problem](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children), [react concurrency](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md), and [context loss](https://github.com/facebook/react/issues/13332) between mixed renderers. It may be the one state-manager in the React space that gets all of these right.
      
      You can try a live demo [here](https://githubbox.com/pmndrs/zustand/tree/main/examples/demo).
      `;

      const parsed = await chat.get({
        messages: [
          {
            role: 'user',
            content: message1,
          },
        ],
        temperature: 0,
        function_call: {
          name: 'getMessageActions',
        },
      });

      const actualLinks = [
        'https://github.com/pmndrs/zustand/actions?query=workflow%3ALint',
        'https://bundlephobia.com/result?p=zustand',
        'https://www.npmjs.com/package/zustand',
        'https://discord.gg/poimandres',
        'https://react-redux.js.org/api/hooks#stale-props-and-zombie-children',
        'https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md',
        'https://github.com/facebook/react/issues/13332',
        'https://githubbox.com/pmndrs/zustand/tree/main/examples/demo',
      ] as const;

      expect(
        parsed.choices[0].__type === 'function_call' &&
          parsed.choices[0].message.function_call.arguments.links.length,
      ).toEqual(actualLinks.length);

      for (const link of actualLinks) {
        expect(
          parsed.choices[0].__type === 'function_call' &&
            parsed.choices[0].message.function_call.arguments.links,
        ).toContain(link);
      }
    },
    TEST_TIMEOUT * 2,
  );

  test(
    'should parse actions from a message with multiple links',
    async ({ expect }) => {
      const chat = hopfieldChat.functions([getMessageActions]);

      const message2 = `Zod is designed to be as developer-friendly as possible. The goal is to eliminate duplicative type declarations. With Zod, you declare a validator _once_ and Zod will automatically infer the static TypeScript type. It's easy to compose simpler types into complex data structures.
  
      Some other great aspects:
      
      - Zero dependencies
      - Works in Node.js and [all modern browsers](https://johns-hopkins.com/3322301-sflk-1jsdlkfj/2904nd)
      - Functional approach: [parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
      - Works with plain JavaScript too! You don't need to use TypeScript.
      
      Sponsorship at any level is appreciated and encouraged. For individual developers, consider the [Cup of Coffee tier](https://github.com/sponsors/colinhacks). If you built a paid product using Zod, consider one of the [podium tiers](https://github.com/sponsors/colinhacks).
      `;

      const parsed2 = await chat.get({
        messages: [
          {
            role: 'user',
            content: message2,
          },
        ],
        temperature: 0,
        function_call: {
          name: 'getMessageActions',
        },
      });

      const actualLinks = [
        'https://johns-hopkins.com/3322301-sflk-1jsdlkfj/2904nd',
        'https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/',
        'https://github.com/sponsors/colinhacks',
        'https://github.com/sponsors/colinhacks',
      ];

      expect(
        parsed2.choices[0].__type === 'function_call' &&
          parsed2.choices[0].message.function_call.arguments.links.length,
      ).toEqual(actualLinks.length);

      for (const link of actualLinks) {
        expect(
          parsed2.choices[0].__type === 'function_call' &&
            parsed2.choices[0].message.function_call.arguments.links,
        ).toContain(link);
      }
    },
    TEST_TIMEOUT * 2,
  );

  test(
    'should parse actions from a message with a single link',
    async ({ expect }) => {
      const chat = hopfieldChat.functions([getMessageActions]);

      const singleLinkMessage =
        'Check out the latest update on [our official site](https://example.com/update).';

      const parsed = await chat.get({
        messages: [
          {
            role: 'user',
            content: singleLinkMessage,
          },
        ],
        temperature: 0,
        function_call: {
          name: 'getMessageActions',
        },
      });

      const actualLink = 'https://example.com/update';

      expect(
        parsed.choices[0].__type === 'function_call' &&
          parsed.choices[0].message.function_call.arguments.links.length,
      ).toBe(1);

      expect(
        parsed.choices[0].__type === 'function_call' &&
          parsed.choices[0].message.function_call.arguments.links,
      ).toContain(actualLink);

      expect(
        parsed.choices[0].__type === 'function_call' &&
          parsed.choices[0].message.function_call.arguments.title,
      ).toMatchInlineSnapshot('"Latest update"');
    },
    TEST_TIMEOUT,
  );

  test(
    'should parse actions from a message with no link',
    async ({ expect }) => {
      const chat = hopfieldChat.functions([getMessageActions]);

      const message3 =
        'The set function has a second argument, false by default. Instead of merging, it will replace the state model. Be careful not to wipe out parts you rely on, like actions.';

      const parsed = await chat.get({
        messages: [
          {
            role: 'user',
            content: message3,
          },
        ],
        temperature: 0,
        function_call: {
          name: 'getMessageActions',
        },
      });

      expect(
        parsed.choices[0].__type === 'function_call' &&
          parsed.choices[0].message.function_call.arguments.links.length,
      ).toBe(0);
    },
    TEST_TIMEOUT,
  );

  test(
    'should classify a support request',
    async ({ expect }) => {
      const chat = hopfieldChat.functions([classifyMessage]);

      const messages: hop.inferMessageInput<typeof chat>[] = [
        {
          role: 'system',
          content: 'You are a helpful classification assistant.',
        },
        {
          role: 'user',
          content:
            'I have an urgent problem with my credit card being charged twice and need help.',
        },
      ];

      const parsed = await chat.get({
        messages,
        temperature: 0,
      });

      expect(parsed.choices[0]).toMatchInlineSnapshot(`
        {
          "__type": "function_call",
          "finish_reason": "function_call",
          "index": 0,
          "message": {
            "content": null,
            "function_call": {
              "arguments": {
                "category": "BILLING_AND_PAYMENTS",
                "summary": "Urgent problem with credit card being charged twice",
              },
              "name": "classifyMessage",
            },
            "role": "assistant",
          },
        }
      `);
    },
    TEST_TIMEOUT,
  );

  test(
    'should classify a support request w/ forced function call',
    async ({ expect }) => {
      const chat = hopfieldChat.functions([classifyMessage]);

      const messages: hop.inferMessageInput<typeof chat>[] = [
        {
          role: 'system',
          content: 'You are a helpful classification assistant.',
        },
        {
          role: 'user',
          content:
            'I have an urgent problem with my credit card being charged twice and need help.',
        },
      ];

      const parsed = await chat.get({
        messages,
        temperature: 0,
        function_call: { name: classifyMessage.name },
      });

      expect(parsed.choices[0]).toMatchInlineSnapshot(`
        {
          "__type": "function_call",
          "finish_reason": "stop",
          "index": 0,
          "message": {
            "content": null,
            "function_call": {
              "arguments": {
                "category": "BILLING_AND_PAYMENTS",
                "summary": "Urgent problem with credit card being charged twice",
              },
              "name": "classifyMessage",
            },
            "role": "assistant",
          },
        }
      `);
    },
    TEST_TIMEOUT,
  );

  test(
    'should classify a support request with no required descriptions',
    async ({ expect }) => {
      const classifyMessage = hopfield.function({
        name: 'classifyMessage',
        description: 'Triage an incoming support message.',
        parameters: z.object({
          summary: z.string().describe('The summary of the message.'),
          category: SupportCategoryEnum,
        }),
        options: {
          requireDescriptions: false,
        },
      });

      const chat = hopfieldChat.functions([classifyMessage]);

      const messages: hop.inferMessageInput<typeof chat>[] = [
        {
          role: 'system',
          content: 'You are a helpful classification assistant.',
        },
        {
          role: 'user',
          content:
            'I have an urgent problem with my credit card being charged twice and need help.',
        },
      ];

      const parsed = await chat.get({
        messages,
        temperature: 0,
        function_call: { name: classifyMessage.name },
      });

      expect(parsed.choices[0]).toMatchInlineSnapshot(`
        {
          "__type": "function_call",
          "finish_reason": "stop",
          "index": 0,
          "message": {
            "content": null,
            "function_call": {
              "arguments": {
                "category": "BILLING_AND_PAYMENTS",
                "summary": "I have an urgent problem with my credit card being charged twice and need help.",
              },
              "name": "classifyMessage",
            },
            "role": "assistant",
          },
        }
      `);
    },
    TEST_TIMEOUT,
  );

  test(
    'should classify a support request w/ forced function call',
    async ({ expect }) => {
      const chat = hopfieldChat.functions([classifyMessage]);

      const messages: hop.inferMessageInput<typeof chat>[] = [
        {
          role: 'system',
          content: 'You are a helpful classification assistant.',
        },
        {
          role: 'user',
          content:
            'I have an urgent problem with my credit card being charged twice and need help.',
        },
      ];

      const parsed = await chat.get({
        messages,
        temperature: 0,
        function_call: { name: classifyMessage.name },
      });

      expect(parsed.choices[0]).toMatchInlineSnapshot(`
        {
          "__type": "function_call",
          "finish_reason": "stop",
          "index": 0,
          "message": {
            "content": null,
            "function_call": {
              "arguments": {
                "category": "BILLING_AND_PAYMENTS",
                "summary": "Urgent problem with credit card being charged twice",
              },
              "name": "classifyMessage",
            },
            "role": "assistant",
          },
        }
      `);
    },
    TEST_TIMEOUT,
  );

  test(
    'should classify a support request with no required descriptions',
    async ({ expect }) => {
      const classifyMessage = hopfield.function({
        name: 'classifyMessage',
        description: 'Triage an incoming support message.',
        parameters: z.object({
          summary: z.string().describe('The summary of the message.'),
          category: SupportCategoryEnum,
        }),
        options: {
          requireDescriptions: false,
        },
      });

      const chat = hopfieldChat.functions([classifyMessage]);

      const messages: hop.inferMessageInput<typeof chat>[] = [
        {
          role: 'system',
          content: 'You are a helpful classification assistant.',
        },
        {
          role: 'user',
          content:
            'I have an urgent problem with my credit card being charged twice and need help.',
        },
      ];

      const parsed = await chat.get({
        messages,
        temperature: 0,
        function_call: { name: classifyMessage.name },
      });

      expect(parsed.choices[0]).toMatchInlineSnapshot(`
        {
          "__type": "function_call",
          "finish_reason": "stop",
          "index": 0,
          "message": {
            "content": null,
            "function_call": {
              "arguments": {
                "category": "BILLING_AND_PAYMENTS",
                "summary": "I have an urgent problem with my credit card being charged twice and need help.",
              },
              "name": "classifyMessage",
            },
            "role": "assistant",
          },
        }
      `);
    },
    TEST_TIMEOUT,
  );
});
