const path = require('path');
const { resolve } = require('metro-resolver');

// Ensure any hoisted Metro/Babel tooling can still resolve workspace-local modules.
// This prevents errors like "Cannot find module 'expo/config'" when a hoisted
// package (e.g. babel-preset-expo) tries to require workspace dependencies.
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

process.env.NODE_PATH = [
    path.resolve(projectRoot, 'node_modules'),
    process.env.NODE_PATH,
]
    .filter(Boolean)
    .join(path.delimiter);

// Re-initialize Node's module paths after updating NODE_PATH.

require('module').Module._initPaths();

const { getDefaultConfig } = require('expo/metro-config');

// Find the project and workspace directories
// This can be replaced with `find-up` or a similar library if the monorepo is deeper

const config = getDefaultConfig(projectRoot);

// SVG Transformer Config
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// 1. Watch all files within the monorepo
config.watchFolders = Array.from(new Set([...(config.watchFolders || []), workspaceRoot]));

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = Array.from(
    new Set([
        ...(config.resolver.nodeModulesPaths || []),
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(workspaceRoot, 'node_modules'),
    ])
);

// Force React resolution to use the app's React, even when the requesting module
// lives in the hoisted workspace root node_modules.
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react' || moduleName.startsWith('react/')) {
        return resolve(
            {
                ...context,
                originModulePath: path.join(projectRoot, 'index.js'),
            },
            moduleName,
            platform
        );
    }

    if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
        return resolve(
            {
                ...context,
                originModulePath: path.join(projectRoot, 'index.js'),
            },
            moduleName,
            platform
        );
    }

    return resolve(context, moduleName, platform);
};

// 2b. Hard-pin core runtime deps to the app's own node_modules.
// This avoids "Invalid hook call" issues caused by Metro bundling multiple React copies.
const reactPath = path.resolve(projectRoot, 'node_modules/react');
const reactNativePath = path.resolve(projectRoot, 'node_modules/react-native');
config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    react: reactPath,
    'react/jsx-runtime': path.join(reactPath, 'jsx-runtime.js'),
    'react/jsx-dev-runtime': path.join(reactPath, 'jsx-dev-runtime.js'),
    'react-native': reactNativePath,
};

// 3. Allow Metro to resolve modules from workspace root (needed for hoisted deps)
// Removed disableHierarchicalLookup to allow proper resolution in monorepo

module.exports = config;
