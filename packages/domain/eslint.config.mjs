import { config } from "@repo/eslint-config/base";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ["**/*.config.js", "**/*.config.cjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
];

