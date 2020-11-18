'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const helpers = require('./helpers');
const commonConfig = require('./webpack.config.common');
const environment = require('./env/dev.env');
const config = require('./env/config');
const path = require('path');

const PORT = process.env.PORT && Number(process.env.PORT);

const webpackConfig = merge(commonConfig, {
	mode: 'development',
	//devtool: 'cheap-module-eval-source-map',
	devtool: 'none',
	output: {
		path: helpers.root('dist'),
		publicPath: '/',
		filename: 'js/[name].bundle.js'
	},
	plugins: [
		new webpack.EnvironmentPlugin(environment),
		new webpack.HotModuleReplacementPlugin(),
		new FriendlyErrorsPlugin()
	],
	devServer: {
		compress: true,
		historyApiFallback: true,
		hot: true,
		open: true,
		overlay: true,
		port: PORT || config.dev.port,
		stats: {
			normal: true
		}
	}
});

module.exports = webpackConfig;
