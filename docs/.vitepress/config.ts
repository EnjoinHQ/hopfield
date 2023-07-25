import footNote from 'markdown-it-footnote';
import { ScriptTarget } from 'typescript';
import { defineConfig } from 'vitepress';
import { withTwoslash } from 'vitepress-plugin-shiki-twoslash';

import { version } from '../../package.json';

export default withTwoslash(
  defineConfig({
    cleanUrls: true,
    description:
      'Minimal typescript library for type-safe, testable interactions with LLMs',
    head: [
      ['meta', { name: 'theme-color', content: '#729b1a' }],
      ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      [
        'link',
        {
          rel: 'alternate icon',
          href: '/favicon.png',
          type: 'image/png',
          sizes: '48x48',
        },
      ],
      [
        'meta',
        {
          name: 'keywords',
          content: 'ai, openai, embeddings',
        },
      ],
      ['meta', { property: 'og:url', content: 'https://hopfield.ai' }],
      ['meta', { property: 'og:image', content: 'https://hopfield.ai/og.png' }],
      [
        'meta',
        { name: 'twitter:image', content: 'https://hopfield.ai/og.png' },
      ],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
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
      editLink: {
        pattern: 'https://github.com/propology/hopfield/edit/main/docs/:path',
        text: 'Suggest changes to this page',
      },
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2023-PRESENT Chase Adams',
      },
      logo: {
        light: '/logo-light.svg',
        dark: '/logo-dark.svg',
        alt: 'Hopfield logo',
      },
      nav: [
        { text: 'Guide', link: '/' },
        { text: 'API', link: '/api/types' },
        {
          text: `v${version}`,
          items: [
            {
              text: 'Release Notes ',
              link: 'https://github.com/propology/hopfield/releases',
            },
            {
              text: 'Contributing ',
              link: 'https://github.com/propology/hopfield/blob/main/.github/CONTRIBUTING.md',
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
                text: 'Walkthrough',
                link: '/guide/walkthrough',
              },
              {
                text: 'Comparisons',
                link: '/guide/comparisons',
              },
            ],
          },
          {
            text: 'API',
            items: [
              {
                text: 'Zod',
                link: '/api/zod',
              },
            ],
          },
          {
            text: 'Config',
            items: [
              {
                text: 'Reference',
                link: '/config',
              },
            ],
          },
        ],
      },
      siteTitle: false,
      socialLinks: [
        { icon: 'twitter', link: 'https://twitter.com/propology_' },
        { icon: 'github', link: 'https://github.com/propology/hopfield' },
      ],
    },
    title:
      'Hopfield: Minimal typescript library for type-safe, testable interactions with LLMs',
    twoslash: {
      addTryButton: true,
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
