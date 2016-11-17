# csv2object

[![Build Status](https://travis-ci.org/keithmorris/node-csv2object.svg?branch=master)](https://travis-ci.org/keithmorris/node-csv2object)

A Simple NodeJS library for extracting an array of Javascript Objects from a CSV file. The CSV file may also (optionally) be GZipped (`file.csv.gz`).

## Installation

`npm install --save csv2object`

```javascript
var csv2obj = require('csv2object');
```

## Methods

### .load(filePath[,options[,gzipped]])

Returns a **ReadableStream** of the parsed CSV (and optionally unzipped) file.

Returns: **ReadableStream**

Parameters:

* **filePath** - Path to the CSV file
* **options** - Object of options passed through to the [`csv-parser`](https://www.npmjs.com/package/csv-parser) module
* **gzipped** - Boolean of whether the `filePath` file is gzipped (e.g.`file.csv.gz`)

#### Example

```javascript
csv2obj.load('data/mydata.csv.gz', null, true)
	.on('data', function(row){
		console.log(row);
	});
```

### .loadAll(filePath[,csvOptions[,gzipped]])

Returns a **Promise** that resolves with an `Array` of Objects each being a row from the CSV.

Returns: **Promise**

Parameters:

* **filePath** - Path to the CSV file
* **options** - Object of options passed through to the [`csv-parser`](https://www.npmjs.com/package/csv-parser) module
* **gzipped** - Boolean of whether the `filePath` file is gzipped (e.g.`file.csv.gz`)

#### Example

```javascript
csv2obj.loadAll('data/mydata.csv.gz', null, true)
	.then(function success(data){
		console.log(data); // array of objects
	}, function error(err){
		console.log(err);
	});
```

## Changelog

### 1.0.0

* Move and cleanup repository

### 0.0.2
* Added README.md documentation

### 0.0.1
* Initial Release
