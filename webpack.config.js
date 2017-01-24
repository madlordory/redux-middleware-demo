/**
 * Created by madlord on 16/1/14.
 */

"use strict";
const env = require("./f2eci").env;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var configMap = {
    "dev": () => {
        let config=require("./webpack/webpack.dev.config");
        config.plugins=config.plugins||[];
        config.plugins.push(new BundleAnalyzerPlugin());
        return config;
    },
    "beta": () => require("./webpack/webpack.beta.config"),
    "ppe": () => require("./webpack/webpack.product.config"),
    "product": () => require("./webpack/webpack.product.config"),
    "production": () => require("./webpack/webpack.product.config")
}
module.exports = configMap[env] && configMap[env]() || configMap.dev();


