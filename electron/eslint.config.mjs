const browserGlobals = {
  clearTimeout: "readonly",
  document: "readonly",
  setTimeout: "readonly",
  window: "readonly",
};

const nodeGlobals = {
  __dirname: "readonly",
  console: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
};

const jestGlobals = {
  afterEach: "readonly",
  beforeEach: "readonly",
  expect: "readonly",
  jest: "readonly",
  test: "readonly",
};

const qualityRules = {
  "no-undef": "error",
  "no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^React$" },
  ],
};

export default [
  {
    ignores: [
      "node_modules/",
      "renderer.js",
      "test-results/",
      "playwright-report/",
    ],
  },
  {
    files: ["main.js", "preload.js", "tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: nodeGlobals,
    },
    rules: qualityRules,
  },
  {
    files: ["src/**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: browserGlobals,
    },
    rules: qualityRules,
  },
  {
    files: ["src/**/*.test.jsx", "tests/**/*.integration.test.js", "tests/setup-jest.js"],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...jestGlobals,
        Event: "readonly",
        HTMLDialogElement: "readonly",
      },
    },
  },
];
