import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import boundaries from "eslint-plugin-boundaries";
import globals from "globals";
import { config as baseConfig } from "./base.js";
import { repoRulesPlugin } from "./repo-rules-plugin.js";

/**
 * ESLint configuration for the mobile app with component boundary enforcement.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      boundaries: boundaries,
      repo: repoRulesPlugin,
    },
    settings: {
      react: { version: "detect" },
      "boundaries/elements": [
        {
          type: "screen-component",
          pattern: "src/screens/*/components/*",
          capture: ["screen", "component"],
        },
        {
          type: "shared-component",
          pattern: "src/shared/*",
          capture: ["component"],
        },
        { type: "ui-primitive", pattern: "src/components/ui/*" },
        { type: "global-hook", pattern: "src/hooks/*" },
        { type: "global-util", pattern: "src/utils/*" },
        { type: "screen", pattern: "src/screens/*", capture: ["screen"] },
        { type: "db", pattern: "src/db/*" },
        { type: "i18n", pattern: "src/i18n/*" },
        { type: "navigation", pattern: "src/navigation/*" },
      ],
      "boundaries/ignore": ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**"],
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",

      "repo/test-location": "error",

      // Import boundary rules
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          rules: [
            // Screen components can't import from other screens' components
            {
              from: ["screen-component"],
              disallow: [["screen-component", { screen: "!${screen}" }]],
            },
            // Shared components can't import screen-specific components
            {
              from: ["shared-component"],
              disallow: [["screen-component"]],
            },
            // UI primitives should be self-contained
            {
              from: ["ui-primitive"],
              disallow: [["screen-component"], ["shared-component"]],
            },
          ],
        },
      ],
    },
  },
];
