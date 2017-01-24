'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');
const internalIP=require('internal-ip');
const DashboardPlugin = require('webpack-dashboard/plugin');

let config = require('./webpack/webpack.dev.config.js');
const port = config.devServer.port;
const ip='0.0.0.0';//internalIP.v4();
for (let key in config.entry) {
    let ar = config.entry[key];
    if (key != "common") {
        ar.unshift("webpack-dev-server/client?http://"+ip+":"+port+"/", "webpack/hot/dev-server");
    }
}


config.plugins = config.plugins || [];
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(
    new DashboardPlugin()
);
new WebpackDevServer(webpack(config), config.devServer)
    .listen(port, ip, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + port);
        console.log('Opening your system browser...');
        open('http://'+(internalIP.v4()||'127.0.0.1')+':' + port + '/');
    });
