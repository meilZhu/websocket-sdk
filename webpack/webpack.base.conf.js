/*
 * @file: webpack的基础配置
 * @Date: 2020-09-07 14:31:07
 * @author: manyao.zhu
 */
const path = require('path');
const _ = require('lodash');

const loader = require('./webpack.loader');

const webpackConfig = [{
    name: 'sdk',
    entry: ['babel-polyfill', './sdk/index.js'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'sdk/websocket-sdk.js',
        library: 'WebSocketSdk',
        libraryTarget: 'umd'
    },
    devtool: '#source-map',
    module: {
        rules: _.flatten([loader.eslint, loader.babel])
    },
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    },
    plugins: []
}];

module.exports = webpackConfig;