module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/**/*.test.{js,jsx}"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup-jest.js"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.jsx"],
};
