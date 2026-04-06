// apps/mobile/babel.config.js

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo', ['@babel/preset-react', { runtime: 'automatic' }]],
    plugins: [
      [
        'module-resolver',
        {
          cwd: __dirname,
          root: ['./'],
          alias: {
            '@': './src',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be listed last
    ],
  };
};
