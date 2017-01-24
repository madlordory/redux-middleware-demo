/**
 * Created by madlord on 16/1/14.
 */

"use strict";
let config=require('./webpack.base.config.js');
const url = require('url');
const urlPrefix=require("../f2eci").urlPrefix;
const STATIC_SRC=require("../f2eci")["static-src"];
const webpack = require('webpack');

process.env.NODE_ENV = 'beta';
config.plugins=config.plugins||[];
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify('beta')
        }
    })
);
config.output.pathinfo=true;
config.output.publicPath=url.resolve(urlPrefix, STATIC_SRC) + '/',
module.exports = config;


