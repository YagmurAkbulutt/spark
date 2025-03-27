const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname); // Default metro config al
const config = mergeConfig(defaultConfig, {}); // Configleri birleştir

module.exports = wrapWithReanimatedMetroConfig(config); // Reanimated ile sar

