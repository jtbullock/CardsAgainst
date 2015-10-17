var config = require('../config');

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var path = require('path');
var Q = require('q');

var src = mainBowerFiles('**/*.js');

var dest = path.join(
  config.dest_dir,
  config.public_dirname,
  config.scripts_dirname
);

var filename = config.vendor_script;

/**
* Copy all vendored scripts in bower dependency order. Return a promise.
*/
var build = function() {
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(plumber())
      .pipe(concat(filename))
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};

/**
* Start watch on vendored javascript sources. Return a promise.
*/
var watch = function(onChange) {
  return build()
    .then(function() {
      return Q.Promise(function(resolve,reject) {
        gulp.watch(src)
          .on('change', onChange)
          .on('error', reject)
          .on('ready', resolve);
      });
    });
};

module.exports = {
  build: build,
  watch: watch
}
