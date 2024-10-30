export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/test/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^/src/(.*)$': '<rootDir>/src/$1',
    '^/mock/(.*)$': '<rootDir>/mock/$1',
    '^(.*).wasm$': '<rootDir>/mock/wasmMock.ts'
  }
};
