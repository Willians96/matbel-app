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
    // During development we allow explicit any as a warning to avoid blocking CI for legacy files.
    "@typescript-eslint/no-explicit-any": "warn",
  },
  overrides: [
    {
      files: ["scripts/**/*.js", "scripts/**/*.ts"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
