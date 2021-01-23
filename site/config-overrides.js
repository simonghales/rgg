const { override, getBabelLoader } = require('customize-cra');

const prependBabelPlugin = (plugin) => (config) => {
    getBabelLoader(config).options.plugins.unshift(plugin);
    return config;
};

module.exports = override(prependBabelPlugin('babel-plugin-react-engine'));