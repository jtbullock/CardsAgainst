var config = require('../config');

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var path = require('path');
var Q = require('q');

var src = [
  path.join(config.src_dir, 'client/cardsAgainst.module.js'),
  path.join(config.src_dir, 'client/cardsAgainstApp/**/*.js')
];

var dest = path.join(
  config.dest_dir,
  config.public_dirname,
  config.scripts_dirname
);

var filename = config.client_script;

/**
* Concatenate angular components into a single file with module
* definitions first. Return a promise.
*/
var build = function() {
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(plumber())
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(concat(filename))
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};

/**
* Start watch on angular client components. Return a promise.
*/
var watch = function() {
  return Q.Promise(function(resolve,reject) {
    gulp.watch(src)
      .on('change', function(event) {
        gutil.log('-', gutil.colors.green('client changed:'), path.basename(event.path));
        build();
      })
      .on('error', reject);
  });
};

module.exports = {
  build: build,
  watch: watch
}
