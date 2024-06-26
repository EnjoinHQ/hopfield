import footNote from 'markdown-it-footnote';
import { defineConfig } from 'vitepress';
import { withTwoslash } from 'vitepress-plugin-shiki-twoslash';

import { version } from '../../src/package.json';
import pkg from 'typescript';
const { ScriptTarget } = pkg;

export default withTwoslash(
  defineConfig({
    cleanUrls: true,
    description:
      'Typescript-first LLM framework with static type inference, testability, and composability.',
    head: [
      ['meta', { name: 'theme-color', content: '#F09922' }],
      [
        'link',
        {
          rel: 'icon',
          href: '/favicon.png',
          type: 'image/png',
          sizes: '32x32',
        },
      ],
      [
        'meta',
        {
          name: 'keywords',
          content: 'ai, zod, openai, embeddings',
        },
      ],
      ['meta', { property: 'og:url', content: 'https://hopfield.ai' }],
      [
        'meta',
        {
          property: 'og:image',
          content: 'https://hopfield.ai/hopfield-og.png',
        },
      ],
      [
        'meta',
        {
          name: 'twitter:image',
          content: 'https://hopfield.ai/hopfield-og.png',
        },
      ],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['script', { defer: '', src: '/_vercel/insights/script.js' }],
    ],
    lang: 'en-US',
    lastUpdated: true,
    markdown: {
      theme: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      config: (md) => {
        md.use(footNote);
      },
    },
    themeConfig: {
      // algolia: {
      //   appId: '',
      //   apiKey: '',
      //   indexName: 'hopfield',
      // },
      search: {
        provider: 'local',
      },
      editLink: {
        pattern: 'https://github.com/EnjoinHQ/hopfield/edit/main/docs/:path',
        text: 'Suggest changes to this page',
      },
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2023-PRESENT Chase Adams',
      },
      logo: {
        light: '/hopfield-white-w-text.png',
        dark: '/hopfield-w-text.png',
        alt: 'Hopfield logo',
      },
      nav: [
        { text: 'Guide', link: '/' },
        { text: 'Embeddings', link: '/embeddings/overview' },
        { text: 'Chat', link: '/chat/overview' },
        {
          text: `v${version}`,
          items: [
            {
              text: 'Release Notes ',
              link: 'https://github.com/EnjoinHQ/hopfield/releases',
            },
            {
              text: 'Contributing ',
              link: 'https://github.com/EnjoinHQ/hopfield/blob/main/.github/CONTRIBUTING.md',
            },
          ],
        },
      ],
      outline: [2, 3],
      sidebar: {
        '/': [
          {
            text: 'Guide',
            items: [
              {
                text: 'What is Hopfield?',
                link: '/',
              },
              {
                text: 'Getting Started',
                link: '/guide/getting-started',
              },
              {
                text: 'Comparisons',
                link: '/guide/comparisons',
              },
            ],
          },
          {
            text: 'Embeddings',
            items: [
              {
                text: 'Overview',
                link: '/embeddings/overview',
              },
              {
                text: 'Embeddings',
                link: '/embeddings/details',
              },
            ],
          },
          {
            text: 'Chat',
            items: [
              {
                text: 'Overview',
                link: '/chat/overview',
              },
              {
                text: 'Prompt Templates',
                link: '/chat/templates',
              },
              {
                text: 'Non-streaming',
                link: '/chat/non-streaming',
              },
              {
                text: 'Streaming',
                link: '/chat/streaming',
              },
              {
                text: 'Functions',
                link: '/chat/functions',
              },
              {
                text: 'Functions w/ Streaming',
                link: '/chat/functions-streaming',
              },
            ],
          },
          {
            text: 'Frameworks',
            items: [
              {
                text: 'Next.js App Router',
                link: '/frameworks/next-13',
              },
            ],
          },
        ],
      },
      siteTitle: false,
      socialLinks: [
        { icon: 'twitter', link: 'https://twitter.com/EnjoinHQ' },
        { icon: 'github', link: 'https://github.com/EnjoinHQ/hopfield' },
      ],
    },
    title:
      'Hopfield: Typescript-first LLM framework with static type inference, testability, and composability.',
    twoslash: {
      defaultCompilerOptions: {
        target: ScriptTarget.ESNext,
      },
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    },
  }),
);
