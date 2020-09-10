/*
 * @file:
 * @Date: 2020-09-07 15:15:09
 * @author: manyao.zhu
 */
// const path = require('path');
const webpack = require('webpack');
const express = require('express');
const args = require('yargs').argv;
// const opn = require('opn');
// const proxyMiddleware = require('http-proxy-middleware');

const webpackconfig = require('../webpack/webpack.dev.config');

// default host where dev server listens ip address
const host = args.host || '127.0.0.1';
// default port where dev server listens for incoming traffic
const port = args.port || 8081;

// const proxy = {
// };

/* eslint new-cap: ["error", { "newIsCapExceptions": ["express"] }] */
const app = new express();
const compiler = webpack(webpackconfig);

// const staticPath = path.join(__dirname, '/');

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    quiet: true
});

app.use(express.static('static', {
    // setHeaders: function (res, path, stat) {
    //   res.set('Content-Type', 'application/json');
    //   res.set('Access-Control-Allow-Origin', '*');
    //   res.set('Access-Control-Allow-Credentials', 'true');
    //   res.set('Access-Control-Allow-Methods', 'get,post');
    // }
}));

// serve webpack bundle output
app.use(devMiddleware);

/* eslint no-console: "off" */
console.log('> Starting Mock server...');
devMiddleware.waitUntilValid(() => {
    const uri = `http://${host}:${port}`;
    console.log('> Listening at ' + uri + '\n');
    // when env is testing, don't need open it
});

app.listen(port);