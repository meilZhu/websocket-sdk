/*
 * @file: webpack 的开发环境配置
 * @Date: 2020-09-07 14:29:58
 * @author: manyao.zhu
 */
const webpack = require('webpack');
const _ = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = require('./webpack.base.conf');

const webpackConf = webpackConfig.map(config => {
    return _.merge({}, config, {
        entry: [`webpack-hot-middleware/client?name=${config.name}`].concat(config.entry),
        output: { publicPath: '/' },
        plugins: [
            new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"development"' } }),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                template: './sdk/index.html',
                filename: 'sdk.html',
                inject: 'head'
            })
        ]
    });
});

module.exports = webpackConf;