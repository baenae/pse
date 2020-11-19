'use strict';

const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const helpers = require('./helpers');
const environment = (process.env.NODE_ENV || 'development').trim();
const isDev = environment === 'development';

const path = require('path');

// je nachdem in welchem env wir uns befinden ist der Pfad zu den assets anders.
// wird im DefinePlugin geprüft, das liefert den passenden String zurück
const ASSETS_PATH_PREFIX = {
	development: JSON.stringify('../static/'),
	production: JSON.stringify("./static/")
};

const webpackConfig = {
	entry: {
		polyfill: '@babel/polyfill',
		main: helpers.root('src', 'main')
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': helpers.root('src'),
			'assets': path.resolve(__dirname, '../src/assets'),
			'node_modules': path.join(__dirname, 'node_modules')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [helpers.root('src'), /node_modules/],
				options: {
					presets: ['@babel/preset-env'],
					plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-transform-classes"]
				}

			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: helpers.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: helpers.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: helpers.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	},
	plugins: [
		//new CleanWebpackPlugin(),
		new HtmlPlugin({ template: 'index.html', chunksSortMode: 'dependency', inject: 'head' }),
		new CopyPlugin([
			{ from: 'static/img', to: 'static/img', ignore: ['.gitkeep'] }
		]),
		new webpack.DefinePlugin({
			'ASSETS_PATH_PREFIX': ASSETS_PATH_PREFIX[environment]
		}),
	]/*,
	optimization: {
		minimize: true
	}*/
};

module.exports = webpackConfig;
