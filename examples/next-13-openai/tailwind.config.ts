import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        accent: 'hsl(39, 90%, 49.8%)',
        'code-block-bg': 'hsl(240 4% 8.5%)',
        'c-text-code': '#c0cec0',
        'custom-block-tip-text': 'rgb(166, 103, 30)',
        'custom-block-tip-border': 'rgba(166, 103, 30, 0.5)',
        'custom-block-tip-bg': 'rgba(166, 103, 30, 0.1)',
        'text-dark-2': 'rgba(235, 235, 235, 0.75)',
        'text-dark-3': 'rgba(235, 235, 235, 0.38)',
        'sidebar-bg-color': 'hsl(240 4% 8.5%)',
        bg: 'hsl(240, 4%, 3.9%)',
        'text-1': 'hsl(0, 0%, 98%)',
      },
    },
  },
  plugins: [],
};
export default config;
