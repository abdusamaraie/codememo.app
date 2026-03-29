/**
 * Root Jest config for the monorepo.
 * VS Code Jest runners often execute from the repo root.
 */
module.exports = {
  projects: [
    '<rootDir>/apps/mobile',
    '<rootDir>/packages/domain',
  ],
};
