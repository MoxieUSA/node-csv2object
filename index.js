/**
 * Created by Keith Morris on 8/3/15.
 */
"use strict";

var csv = require('csv-parser'),
	fs = require('fs'),
	gulpif = require('gulp-if'),
	zlib = require('zlib'),
	q = require('q');

function createCSVString(csvFile, options, gzipped) {
	var gunzip = zlib.createGunzip();
	options = options || {};

	return fs.createReadStream(csvFile)
		.pipe(gulpif(gzipped, gunzip))
		.pipe(csv(options));
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
			deferred.reject(err);
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
