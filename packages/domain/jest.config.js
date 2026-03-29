/** @type {import('jest').Config} */
module.exports = {
  preset:            'ts-jest',
  testEnvironment:   'node',
  roots:             ['<rootDir>/__tests__'],
  testMatch:         ['**/*.test.ts'],
  moduleNameMapper:  {
    '^@repo/domain$': '<rootDir>/index.ts',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'logic/**/*.ts',
    'constants/**/*.ts',
    '!**/__tests__/**',
    '!**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches:   90,
      functions:  100,
      lines:      95,
      statements: 95,
    },
  },
};
