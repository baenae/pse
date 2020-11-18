'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const helpers = require('./helpers');
const commonConfig = require('./webpack.config.common');
const isProd = process.env.NODE_ENV === 'production';
const environment = isProd ? require('./env/prod.env') : require('./env/staging.env');

const webpackConfig = merge(commonConfig, {
	mode: 'production',
	output: {
		path: helpers.root('dist'),
		publicPath: './',
		filename: helpers.assetsPath('js/[name].bundle.js')
	},
	optimization: {
		runtimeChunk: 'single',
		minimizer: [
			new OptimizeCSSAssetsPlugin({
				cssProcessorPluginOptions: {
					preset: ['default', {discardComments: {removeAll: true}}],
				}
			}),
			new UglifyJSPlugin({
				cache: true,
				parallel: true,
				sourceMap: !isProd
			})
		],
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						return `npm.${packageName.replace('@', '')}`;
					}
				},
				styles: {
					test: /\.css$/,
					name: 'styles',
					chunks: 'all',
					enforce: true
				}
			}
		}
	},
	plugins: [
		new webpack.EnvironmentPlugin(environment),
		new webpack.HashedModuleIdsPlugin(),
		new MiniCSSExtractPlugin({
			filename: helpers.assetsPath('css/[name].bundle.css'),
			chunkFilename: helpers.assetsPath('css/[id].bundle.css')
		}),
	]
});

if (!isProd) {
	webpackConfig.devtool = 'source-map';
}

module.exports = webpackConfig;
