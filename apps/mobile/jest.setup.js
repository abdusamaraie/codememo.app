// apps/mobile/jest.setup.js

// Mock React Native Animated
const mockAnimatedValue = {
  setValue: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
  interpolate: jest.fn(function() { return this; }),
  __getValue: jest.fn(() => 0),
};

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Animated = {
    ...RN.Animated,
    Value: jest.fn(() => mockAnimatedValue),
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback({ finished: true })),
      stop: jest.fn(),
      reset: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback({ finished: true })),
      stop: jest.fn(),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback({ finished: true })),
    })),
    parallel: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback({ finished: true })),
    })),
    loop: jest.fn(() => ({
      start: jest.fn(),
      stop: jest.fn(),
    })),
    View: RN.View,
  };

  return RN;
});

// Mock expo modules
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
  loadAsync: jest.fn(),
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({ uri: 'mock-uri' })),
    loadAsync: jest.fn(),
  },
}));

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: { extra: {} },
    manifest: {},
  },
  Constants: {
    expoConfig: { extra: {} },
    manifest: {},
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
