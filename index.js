/**
 * Created by Keith Morris on 8/3/15.
 */
"use strict";

var csv = require('csv-parser'),
	combiner = require('stream-combiner2'),
	fs = require('fs'),
	gulpif = require('gulp-if'),
	zlib = require('zlib'),
	q = require('q');

function createCSVString(csvFile, options, gzipped) {
	var gunzip = zlib.createGunzip();
	options = options || {};

	return combiner.obj([
		fs.createReadStream(csvFile),
		gulpif(gzipped, gunzip),
		csv(options)]);
}

/**
 * Return a promise that when resolves, returns all of the loaded Splunk events as an array of objects.
 * @param csvFile
 * @returns {*|promise}
 */
exports.loadAll = function (csvFile, options, gzipped) {
	var deferred = q.defer(),
		events = [];

	createCSVString.apply(createCSVString, arguments)
		.on('data', function (data) {
			events.push(data);
		})
		.on('end', function () {
			deferred.resolve(events);
		})
		.on('error', function (err) {
			var msg;
			switch (err.code) {
				case 'ENOENT':
					msg = "File not found.";
					break;
				case 'Z_DATA_ERROR':
					msg = "Invalid GZip file.";
					break;
				default:
					msg = "You should not get this message!"
			}
			deferred.reject(msg);
		});
	return deferred.promise;
};

/**
 * Return a stream that emits splunk event objects in each on('data') event.
 * @param csvFile
 * @returns {Stream}
 */
exports.load = function (csvFile, options, gzipped) {
	return createCSVString.apply(createCSVString, arguments);
};
