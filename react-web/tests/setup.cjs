require("@testing-library/jest-dom");

const { TextDecoder, TextEncoder } = require("node:util");

Object.assign(global, { TextDecoder, TextEncoder });
