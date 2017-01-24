/**
 * Created by madlord on 16/1/14.
 */

"use strict";
const config=require('./webpack.base.config.js');
const webpack = require('webpack');

process.env.NODE_ENV = 'development';
config.output.pathinfo=true;
config.plugins=config.plugins||[];
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify('development')
        }
    })
);
module.exports = config;

