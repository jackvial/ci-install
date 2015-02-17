#!/usr/bin/env node

var fs = require('fs.extra');
var program = require('commander');
var request = require('request');
var unzip = require('unzip');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');

program
	.version('0.1.0')
	.usage('run ci-install to setup CodeIgniter in the current directory')
	.parse(process.argv);

// Download and unzip CodeIgnitor to the current directory
request
	.get('https://github.com/bcit-ci/CodeIgniter/archive/2.2.1.zip')
  	.on('response', function(response) {
    	console.log(response.statusCode);
    	console.log(response.headers['content-type']);
	})
  	.pipe(unzip.Extract({ path: './' }))
  	.on('close', function(){
  		console.log('unzip finished');

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