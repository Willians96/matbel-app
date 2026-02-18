module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  rules: {
    // project-specific rules go here
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
