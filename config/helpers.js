'use strict';

const path = require('path');
const config = require('./env/config');

const _root = path.resolve(__dirname, '..');

exports.root = function (args) {
	args = Array.prototype.slice.call(arguments, 0);

	return path.join.apply(path, [_root].concat(args));
};

exports.assetsPath = function (_path) {
	const assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory;

	//  return path.posix.join('static', _path);
	return path.posix.join(assetsSubDirectory, _path);
};
