const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

module.exports = defineConfig([
  expoConfig,
  prettierRecommended,
  {
    ignores: ['coverage/*'],
  },
  {
    files: ['**/__tests__/**/*.{js,jsx}', 'jest.setup.js'],
    languageOptions: {
      globals: globals.jest,
    },
  },
]);
