/**
 * Created by madlord on 16/1/14.
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var STATIC_SRC = require("../f2eci")["static-src"];
var DIST_PATH = require('../f2eci').dist;
var HTML_PATH = require('../f2eci').output;
var CortexRecombinerPlugin = require('cortex-recombiner-webpack-plugin');
var relativeToRootPath = "..";
const env = require("../f2eci").env;
const WebpackShellPlugin = require('webpack-shell-plugin');
const PUBLIC_PATH = '/' + STATIC_SRC + '/';

const polyfills = [
    require.resolve('./polyfills/object-assign.js'),
    require.resolve('./polyfills/promise.js'),
    require.resolve('./polyfills/tap-event.js')
];

module.exports = {
    // bail: true,
    entry: {
        "alpha": ['./src/pages/alpha/boot-loader.jsx'],
        "result": ['./src/pages/result/boot-loader.jsx'],
        "test": ['./src/pages/test/boot-loader.jsx'],
        "common": [...polyfills, '@dp/hippo', 'react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'rlu','preact-compat']//将经常用的库js包打到commons.js中,此js中的内容不会经常变动
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, relativeToRootPath, DIST_PATH, STATIC_SRC),
        publicPath: PUBLIC_PATH,
        //publicPath:'/op-task/dist/static/',
        chunkFilename: '[name].[chunkhash].js',
        sourceMapFilename: '[file].[chunkhash].map'
    },
    cache: true,
    devtool: 'cheap-module-source-map',
    resolve: {
        alias: {
            "@lib": path.resolve(__dirname, relativeToRootPath, "./src/lib"),
            'ducker':path.resolve(__dirname, relativeToRootPath, "./src/ducker"),
            'duck':path.resolve(__dirname, relativeToRootPath, "./src/duck"),
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
            "react-tap-event-plugin":"preact-tap-event-plugin",
            // 'react': 'react-lite',
            // 'react-dom': 'react-lite',
            'react-addons-css-transition-group': 'rc-css-transition-group'
        },
        modulesDirectories: ["web_modules", "node_modules", "cortex_modules"],
        extensions: ['.js', '.es6', '.json', '.jsx', '']
    },
    module: {
        loaders: [{
            test: /\.(es6|jsx|js)$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                babelrc: false,
                presets: ['react-app'],
                plugins: ['transform-decorators-legacy',"transform-function-bind"],
                cacheDirectory: true
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css-loader?-restructuring!postcss')
        }, {
            test: /\.css\.module/,
            loader: ExtractTextPlugin.extract('css-loader?-restructuring&modules&localIdentName=[local]___[hash:base64:5]!postcss')
            // },{
            //     test: /\.svg$/,
            //     loader: "url-loader?limit=10000&mimetype=image/svg+xml"
        }, {
            test: /\.woff|ttf|woff2|eot$/,
            loader: 'url?limit=100000'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('css-loader!postcss!less')
        }, {
            test: /\.less\.module/,
            loader: ExtractTextPlugin.extract('css-loader?modules&localIdentName=[local]___[hash:base64:5]!postcss!less')
            // }, {
            //     test: /\.(png|jpg)$/,
            //     loader: 'url?limit=25000'
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: ['url?limit=25000'],
            // loaders: env == "dev" ? ["url?limit=25000"] : [
            //     'url?limit=25000',
            //     'image-webpack?progressive&optimizationLevel=3&interlaced=false'
            // ]
        }]
    },
    postcss: function () {
        //处理css兼容性代码，无须再写-webkit之类的浏览器前缀
        return [
            require('postcss-initial')({
                reset: 'all' // reset only inherited rules
            }),
            require('autoprefixer')({
                browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                ]
            })];
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "common.js",
            // async: true,
            minChunks: Infinity//当项目中引用次数超过2次的包自动打入commons.js中,可自行根据需要进行调整优化

        }),
        new ExtractTextPlugin("[name].css", {
            // disable: env == "dev",
            allChunks: true
        }),
        new CortexRecombinerPlugin({
            base: path.resolve(__dirname, relativeToRootPath),
            noBeta: env == 'product',
            target_path: './cortex_modules/@cortex',

        }),
        new WebpackShellPlugin({onBuildStart: ['gulp']}),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),

    ],
    devServer: {
        contentBase: HTML_PATH,
        historyApiFallback: false,
        hot: true,
        port: 8089,
        publicPath: PUBLIC_PATH,
        noInfo: false
    },
};
