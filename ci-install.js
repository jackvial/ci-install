#!/usr/bin/env node

'use strict';

var fs = require('fs');
var program = require('commander');
var request = require('request');
var unzip = require('unzip');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');
var progress = require('progress');
var bar;

/**
 *
 * Name: ci-install
 * Description: Creates a fresh CodeIgniter project in current directory
 * Author: Jack Vial (https://github.com/jackvial)
 *
 */

// Meta
program
    .version('0.1.0')
    .usage('run \'ci-install\' to setup the lastest stable version of CodeIgniter in the current directory')
    .parse(process.argv);

function handleResponse(response) {
    console.log(' Response: ', response.statusCode);
    console.log(' Size: ', response.headers['content-length']);

    // Create a download progress bar
    var len = parseInt(response.headers['content-length'], 10);
    bar = new progress(' Downloading CI: [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: len
    });
}

function handleDownloadComplete() {
    console.log(' Unzip Complete');

    // Set concurrency limit
    ncp.limit = 16;

    // Copy all the files from the directory created
    // by unzip 
    ncp('./CodeIgniter-2.2.1/', './', function(err) {
        if (err) {
            return console.error(err);
        }

        // Remove the old directory
        rimraf('./CodeIgniter-2.2.1', function() {
            console.log(' Successfully installed CodeIgniter-2.2.1');
        });
    });
}

// Download and unzip CodeIgnitor to the current directory
request
    .get('https://github.com/bcit-ci/CodeIgniter/archive/2.2.1.zip')
    .on('response', handleResponse)
    .on('error', function(error) {
    	console.log(error);
    })
    .on('data', function(chunk) {

        // Update the progress bar
        bar.tick(chunk.length);
    })
    .pipe(unzip.Extract({
        path: './'
    }))
    .on('close', handleDownloadComplete);
