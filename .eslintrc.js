module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'eslint-plugin-prettier',
    'eslint-plugin-import'
  ],
  rules: {
    'import/extensions': 0,
    'class-methods-use-this': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-restricted-syntax': 0
  }
};
