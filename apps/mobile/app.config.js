/**
 * Expo App Configuration
 *
 * This file extends app.json with dynamic values from environment variables.
 * Environment variables prefixed with EXPO_PUBLIC_ are passed to the app at runtime.
 */

// Read the base config from app.json
const appJson = require('./app.json');

module.exports = ({ config }) => {
  return {
    ...config,
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      // Pass through environment variables for runtime access
      EXPO_PUBLIC_USE_API: process.env.EXPO_PUBLIC_USE_API ?? 'false',
    },
  };
};
