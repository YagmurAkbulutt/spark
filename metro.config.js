const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname); 
const config = mergeConfig(defaultConfig, {}); 

module.exports = wrapWithReanimatedMetroConfig(config);

