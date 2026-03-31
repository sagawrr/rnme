const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.resolver.alias = {
  ...config.resolver.alias,
  '@assets': path.resolve(projectRoot, 'assets'),
};

module.exports = config;
