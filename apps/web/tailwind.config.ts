// tailwind config is required for editor support

import sharedConfig from '@repo/tailwind-config';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
  prefix: 'tw-',
};

export default config;
