// apps/mobile/jest.config.js

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          'babel-preset-expo',
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|native-base|react-native-svg)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@repo/mock-data$': '<rootDir>/../../packages/mock-data',
    '^@repo/domain$': '<rootDir>/../../packages/domain',
    '^@repo/theme$': '<rootDir>/../../packages/theme',
    '^.+\\.(png|jpg|jpeg|gif|webp|svg|ttf|otf)$': '<rootDir>/src/__tests__/fileMock.js',
  },
};
