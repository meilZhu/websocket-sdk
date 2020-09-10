/*
 * @file: webpack的正式环境配置
 * @Date: 2020-09-07 14:30:16
 * @author: manyao.zhu
 */
const _ = require('lodash');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpackConfig = require('./webpack.base.conf');

const webpackConf = webpackConfig.map(config => {
    const isSDK = config.output.library != null;
    const filename = config.output.filename.replace(/\.js$/, isSDK ? '.min.js' : '[chunkhash:8].js');
    const plugins = [
        new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false }),
        new HtmlWebpackPlugin({
            template: './sdk/index.html',
            filename: 'sdk.html',
            inject: 'head'
        })
    ];

    return _.merge({}, config, {
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename,
            publicPath: '/'
        },
        devtool: false,
        plugins
    });
});

module.exports = webpackConf;