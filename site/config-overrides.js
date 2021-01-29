const { override, getBabelLoader } = require('customize-cra');
const WorkerPlugin = require('worker-plugin');

const prependBabelPlugin = (plugin) => (config) => {
    getBabelLoader(config).options.plugins.unshift(plugin);
    return config;
};

const addWorkerPlugin = (config) => {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
    })
    config.plugins.push(new WorkerPlugin());
    return config;
}

module.exports = override(prependBabelPlugin('babel-plugin-react-engine'), addWorkerPlugin);