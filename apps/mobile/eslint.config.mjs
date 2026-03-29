import { config as mobileConfig } from "@repo/eslint-config/mobile";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...mobileConfig,
  {
    ignores: [
      "android/**",
      "ios/**",
      "coverage/**",
      "dist/**",
      "build/**",
      ".expo/**",
    ],
  },
];
