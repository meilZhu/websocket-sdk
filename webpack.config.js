/*
 * @file: webpack的根据环境获取配置信息
 * @Date: 2020-09-07 14:24:40
 * @author: manyao.zhu
 */
const webpackConfig = (env) => {
    switch(env) {
        case 'development':
            return require('./webpack/webpack.dev.conf');
        case 'testing':
            return require('./webpack/webpack.test.conf');
        case 'production':
            return require('./webpack/webpack.prod.conf');
    }
}

module.exports = webpackConfig;