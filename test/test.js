/**
 * Created by Keith Morris on 8/17/15.
 */
var expect = require('chai').expect,
	csv2obj = require('..');

describe('csv2obj Tests', function () {
	describe('`load` method tests', function () {
		it('Should load and parse CSV file into object', function (done) {
			var fileStream = csv2obj.load('./test/data/file.csv', null, false)
				.on('data', function (data) {
					expect(data.header1).to.equal('row 1 item 1');
					expect(data.header2).to.equal('row 1 item 2');
					expect(data.header3).to.equal('row 1 item 3');
					fileStream.pause();
					done();
				});
		});

		it('Should load and parse gzipped CSV file into object', function (done) {
			var fileStream = csv2obj.load('./test/data/file.csv.gz', null, true)
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
			csv2obj.loadAll('./test/data/file.csv', null, false)
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
			csv2obj.loadAll('./test/data/file.csv.gz', null, true)
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
			csv2obj.loadAll('./test/data/filePipe.csv', {
				//raw: false,     // do not decode to utf-8 strings
				separator: '|', // specify optional cell separator
				//newline: '\r',  // specify a newline character
				//strict: true    // require column length match headers length
				headers: ['firstHeader', 'secondHeader', 'thirdHeader']
			}, false)
				.then(function success(data) {
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
