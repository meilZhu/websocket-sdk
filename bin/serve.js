/*
 * @file: 启动运行服务（本地启动）
 * @Date: 2020-09-07 15:14:36
 * @author: manyao.zhu
 */
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const args = require('yargs').argv;
const opn = require('opn');
const proxyMiddleware = require('http-proxy-middleware');

const webpackconfig = require('../webpack/webpack.dev.conf');
// default host where dev server listens ip address
const host = args.host || '127.0.0.1';
// default port where dev server listens for incoming traffic
const port = args.port || 8686;

const proxy = {
    intergration: {
        filter: '/ftt/api/v1/',
        target: 'http://114.215.172.9:8090/',
        changeOrigin: true
    }
};

/* eslint new-cap: ["error", { "newIsCapExceptions": ["express"] }] */
const app = new express();
const compiler = webpack(webpackconfig);

const staticPath = path.join(__dirname, '../dist');

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000

});

// proxy api requests
Object.keys(proxy).forEach(context => {
    const options = proxy[context];
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

// // handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

app.use(staticPath, express.static('./images'));
app.use(staticPath, express.static('./scripts'));
app.use(staticPath, express.static('./fonts'));
app.use(staticPath, express.static('./styles'));

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
    const uri = `http://${host}:${port}/sdk.html`;
    console.log('> Listening at ' + uri + '\n');
    // when env is testing, don't need open it
    opn(uri);
});

app.listen(port);