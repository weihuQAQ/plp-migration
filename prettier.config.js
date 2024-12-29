export default {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'lf',
  quoteProps: 'preserve',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['tw'],
  tailwindConfig: 'apps/web/tailwind.config.ts',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
  ],
};
