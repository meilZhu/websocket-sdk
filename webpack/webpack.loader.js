/*
 * @file: webpack 的 loaders
 * @Date: 2020-09-07 14:29:43
 * @author: manyao.zhu
 */

// 生成样式加载器
const generateStyleLoader = (name) => {
    const loaders = [];
    if (process.env.NODE_ENV === 'development') {
        loaders.push({ loader: 'vue-style-loader' });
    }

    loaders.push({
        loader: 'css-loader',
        options: { sourceMap: true }
    });

    loaders.push({
        loader: 'postcss-loader',
        options: { sourceMap: true }
    });

    if (name) {
        loaders.push({ loader: `${name}-loader`, options: { sourceMap: true } });
    }
    return loaders;
};

/**
 * vue loader options
 */
function vueOptions() {
    return {
        loaders: {
            css: generateStyleLoader(),
            less: generateStyleLoader('less')
        }
    };
}

/**
 * url load options
 */
function urlLoadOptions(name) {
    return {
        limit: 1000,
        name: name
    };
}

exports.eslint = {
    test: /\.(ts|js|vue)$/,
    use: [{
        loader: 'eslint-loader',
        options: { failOnError: true }
    }],
    enforce: 'pre',
    exclude: /node_modules/
};

exports.iview = {
    test: /iview.src.*?js$/,
    use: [{ loader: 'babel-loader' }]
};

exports.babel = {
    test: /\.(js|ts)$/,
    use: [{ loader: 'babel-loader' }],
    exclude: /node_modules/
};

exports.vue = {
    test: /\.vue$/,
    use: [{
        loader: 'vue-loader',
        options: vueOptions()
    }]
};

exports.css = {
    test: /\.css$/,
    use: generateStyleLoader()
};

exports.less = {
    test: /\.less$/,
    use: generateStyleLoader('less')
};

exports.images = {
    test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
    use: [{
        loader: 'url-loader',
        options: urlLoadOptions('images/[name].[ext]')
    }]
};

exports.fonts = {
    test: /\.(woff|woff2|ttf|eot)$/,
    use: [{
        loader: 'url-loader',
        options: urlLoadOptions('fonts/[name].[ext]')
    }]
};