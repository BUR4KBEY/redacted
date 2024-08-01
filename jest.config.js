/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['stdout.test.ts', 'constants.test.ts'],
  testTimeout: 30000
};
