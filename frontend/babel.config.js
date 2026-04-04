// babel.config.js used for React Native Reanimated, see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation#babel-plugin
// Babel is used for transforming modern JavaScript and JSX syntax into a format that can be understood by older browsers or environments. In this case, it's used for React Native development with Expo and Reanimated.

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // must be last in the plugins list
    ],
  };
};