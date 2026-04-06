declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Expo Metro replaces EXPO_PUBLIC_* env vars at bundle time
declare const process: {
  env: {
    EXPO_PUBLIC_CONVEX_URL?: string;
    EXPO_PUBLIC_USE_API?: string;
    [key: string]: string | undefined;
  };
};
