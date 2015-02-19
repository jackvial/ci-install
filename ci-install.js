#!/usr/bin/env node

'use strict';

var fs = require('fs');
var program = require('commander');
var request = require('request');
var unzip = require('unzip');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');
var progress = require('progress');
var readline = require('readline');
var bar;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


/**
 *
 * Name: ci-install
 * Description: Creates a fresh CodeIgniter project in current directory
 * Author: Jack Vial (https://github.com/jackvial)
 *
 */

// Meta
program
    .version('1.1.0-alpha')
    .usage('run \'ci-install version-number\' to setup the lastest stable version of CodeIgniter in the current directory')
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

function runProgram() {
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
}

rl.question("Install CodeIgniter 2.2.1 here? [y/n]", function(answer) {
    switch(answer.toLowerCase()) {
        case 'y':
            runProgram();
            rl.close();
            break;
        case 'n':
            console.log('Exiting program!');
            rl.close();
            break;
        default:
            runProgram();
            rl.close();
            break;
    }   
});