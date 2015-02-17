#!/usr/bin/env node

var fs = require('fs.extra');
var program = require('commander');
var request = require('request');
var unzip = require('unzip');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');

program
	.version('0.0.1')
	.usage('<version>')
	.parse(process.argv);

var zipName = 'codeigniter-2.2.1.zip';

// Download and unzip CodeIgnitor to the current directory
//request('https://github.com/bcit-ci/CodeIgniter/archive/2.2.1.zip').pipe(unzip.Extract({ path: './' }));
request
	.get('https://github.com/bcit-ci/CodeIgniter/archive/2.2.1.zip')
  	.on('response', function(response) {
    console.log(response.statusCode) // 200 
    console.log(response.headers['content-type']) // 'image/png' 
  })
  .pipe(unzip.Extract({ path: './' }))
  .on('close', function(){
  		console.log('unzip finished');

  		/*
  		// Move files
  		fs.copy('CodeIgniter-2.2.1/*', './', function(err) {
		  if (err) return console.error(err)
		  console.log("success!")
		}); //copies file 
*/
		ncp.limit = 16;
 
		ncp("./CodeIgniter-2.2.1/", "./", function (err) {
		 if (err) {
		   return console.error(err);
		 }
		 console.log('done!');

		// Remove the old directory
		rimraf("./CodeIgniter-2.2.1", function(error){
			console.log(error);
		});
	});
});

console.log('aync still running');