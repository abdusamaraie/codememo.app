import path from "node:path";

/**
 * Local ESLint plugin for repo-specific rules.
 *
 * @type {import("eslint").ESLint.Plugin}
 */
export const repoRulesPlugin = {
  rules: {
    "test-location": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Enforce tests live under src/__tests__ and mirror the src/ module path they test",
        },
        schema: [],
        messages: {
          mustBeCentral:
            "Test files must be located under src/__tests__ (centralized tests folder).",
          mustMirror:
            "Test path must mirror the module under src/. Expected: {{expected}}",
        },
      },
      create(context) {
        const filename = context.filename;
        if (!filename || filename === "<input>") {
          return {};
        }

        const normalized = filename.replaceAll("\\\\", "/");
        const isActualTestFile = /\.(test|spec)\.[jt]sx?$/.test(normalized);
        const isTestRelated = isActualTestFile || normalized.includes("/__tests__/");

        if (!isTestRelated) {
          return {};
        }

        const isCentral = normalized.includes("/src/__tests__/");
        const isAllowedNonCentral = normalized.endsWith("/jest.setup.js");

        return {
          Program(node) {
            // Enforce centralization for real test files.
            if (isActualTestFile && !isCentral && !isAllowedNonCentral) {
              context.report({ node, messageId: "mustBeCentral" });
              return;
            }

            // Only enforce mirroring for centralized test files.
            if (!isCentral || !isActualTestFile) {
              return;
            }

            // Allow standalone infra tests at the root of src/__tests__.
            if (
              normalized.includes("/src/__tests__/babelConfigWorklets.test") ||
              normalized.includes("/src/__tests__/workletsResolution.test")
            ) {
              return;
            }

            const sourceCode = context.getSourceCode();
            const importDeclarations = sourceCode.ast.body.filter(
              (statement) => statement.type === "ImportDeclaration"
            );

            // Find the first relative import that resolves into src/ but not src/__tests__.
            let moduleRelative = null;
            for (const importDeclaration of importDeclarations) {
              const importSource = importDeclaration.source?.value;
              if (typeof importSource !== "string" || !importSource.startsWith(".")) {
                continue;
              }

              const resolved = path
                .resolve(path.dirname(filename), importSource)
                .replaceAll("\\\\", "/");

              const srcIndex = resolved.lastIndexOf("/src/");
              if (srcIndex === -1) {
                continue;
              }
              if (resolved.includes("/src/__tests__/")) {
                continue;
              }

              moduleRelative = resolved.slice(srcIndex + "/src/".length);
              moduleRelative = moduleRelative.replace(/\.(ts|tsx|js|jsx)$/, "");
              if (moduleRelative.endsWith("/index")) {
                moduleRelative = moduleRelative.slice(0, -"/index".length);
              }
              break;
            }

            if (!moduleRelative) {
              return;
            }

            const testRelative = normalized.split("/src/__tests__/", 2)[1];
            if (!testRelative) {
              return;
            }

            const testDir = path.posix.dirname(testRelative);
            const testFile = path.posix.basename(testRelative);
            const testBase = testFile.replace(/\.(test|spec)\.[jt]sx?$/, "");

            const expectedDir = path.posix.dirname(moduleRelative);
            const expectedBase = path.posix.basename(moduleRelative);

            const currentExt = testFile.endsWith(".tsx")
              ? "tsx"
              : testFile.endsWith(".ts")
              ? "ts"
              : testFile.endsWith(".jsx")
              ? "jsx"
              : "js";

            const expected = `src/__tests__/${moduleRelative}.test.${currentExt}`;

            const dirMatches = testDir === expectedDir;
            const baseMatches =
              testBase === expectedBase || testBase.startsWith(`${expectedBase}.`);

            if (!dirMatches || !baseMatches) {
              context.report({
                node,
                messageId: "mustMirror",
                data: { expected },
              });
            }
          },
        };
      },
    },
  },
};
