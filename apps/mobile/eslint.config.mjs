import { config as mobileConfig } from "@repo/eslint-config/mobile";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...mobileConfig,
  {
    files: ["**/*.config.js", "**/*.config.cjs", "app.config.js", "metro.config.js", "babel.config.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "turbo/no-undeclared-env-vars": "off",
    },
  },
  {
    files: ["**/__tests__/**", "jest.setup.js", "**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
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


