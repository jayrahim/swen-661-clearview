module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/main.jsx"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "html", "lcov", "json-summary"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/tests/styleMock.cjs",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.cjs"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
