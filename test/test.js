/**
 * Created by Keith Morris on 8/17/15.
 */
var expect = require('chai').expect,
	fs = require('fs'),
	csv2obj = require('..'),
	gzip = require('zlib').gzipSync,
	mock = require('mock-fs'),
	stream = require('stream'),
	csv = ['header1,header2,header3',
		'"row 1 item 1","row 1 item 2","row 1 item 3"',
		'"row 2 item 1","row 2 item 2","row 2 item 3"',
		'"row 3 item 1","row 3 item 2","row 3 item 3"'].join('\n'),
	csvGzipped = gzip(new Buffer(csv, 'utf8')),
	csvPiped = ['header1|header2|header3',
		'"row 1 item 1"|"row 1 item 2"|"row 1 item 3"',
		'"row 2 item 1"|"row 2 item 2"|"row 2 item 3"',
		'"row 3 item 1"|"row 3 item 2"|"row 3 item 3"'].join('\r'),
	csvPipedGzipped = gzip(new Buffer(csv, 'utf8'));

var csvParser = require('csv-parser');

mock({
	'/mocked/directory': {

		'file.csv': csv,
		'file.csv.gz': csvGzipped,
		'filePipe.csv': csvPiped,
		'filePipe.csv.gz': csvPipedGzipped
	}
});

//fs.createReadStream('/mocked/directory/file.csv')
//	.pipe(csvParser({}))
//	.on('data', function(data){
//		console.log("data", data);
//	});

describe('csv2obj Tests', function () {
	describe('`load` method tests', function () {
		it('Should load and parse CSV file into object', function (done) {
			var fileStream = csv2obj.load('/mocked/directory/file.csv', null, false)
				.on('data', function (data) {
					expect(data.header1).to.equal('row 1 item 1');
					expect(data.header2).to.equal('row 1 item 2');
					expect(data.header3).to.equal('row 1 item 3');
					fileStream.pause();
					done();
				});
		});

		it('Should load and parse gzipped CSV file into object', function (done) {
			var fileStream = csv2obj.load('/mocked/directory/file.csv.gz', null, true)
				.on('data', function (data) {
					expect(data.header1).to.equal('row 1 item 1');
					expect(data.header2).to.equal('row 1 item 2');
					expect(data.header3).to.equal('row 1 item 3');
					fileStream.pause();
					done();
				});
		});
	});

	describe('`loadAll` method tests', function () {
		it('Should load all data from CSV file into an array of objects', function (done) {
			csv2obj.loadAll('/mocked/directory/file.csv', null, false)
				.then(function success(data) {
					try {
						expect(data).to.be.an('array');
						expect(data.length).to.equal(3);
						expect(data[0].header1).to.equal('row 1 item 1');
						expect(data[1].header2).to.equal('row 2 item 2');
						expect(data[2].header3).to.equal('row 3 item 3');
						done();
					} catch (err) {
						done(err);
					}
				}, function error() {

				});
		});

		it('Should load all data from gzipped CSV file into an array of objects', function (done) {
			csv2obj.loadAll('/mocked/directory/file.csv.gz', null, true)
				.then(function success(data) {
					try {
						expect(data).to.be.an('array');
						expect(data.length).to.equal(3);
						expect(data[0].header1).to.equal('row 1 item 1');
						expect(data[1].header2).to.equal('row 2 item 2');
						expect(data[2].header3).to.equal('row 3 item 3');
						done();
					} catch (err) {
						done(err);
					}
				}, function error() {

				});
		});
	});

	describe('Passing through options to csv-parser', function () {
		it('Should properly pass through options to the csv-parser module for CSV files', function (done) {
			csv2obj.loadAll('/mocked/directory/filePipe.csv', {
				//raw: false,     // do not decode to utf-8 strings
				separator: '|', // specify optional cell separator
				newline: '\r',  // specify a newline character
				//strict: true    // require column length match headers length
				headers: ['firstHeader', 'secondHeader', 'thirdHeader']
			}, false)
				.then(function success(data) {
					//console.log(data);
					try {
						expect(data).to.be.an('array');
						expect(data.length).to.equal(4);
						expect(data[1].firstHeader).to.equal('row 1 item 1');
						expect(data[2].secondHeader).to.equal('row 2 item 2');
						expect(data[3].thirdHeader).to.equal('row 3 item 3');
						done();
					} catch (err) {
						done(err);
					}
				}, function error() {

				});
		});
	});
});
