var config = require('../config');

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var path = require('path');
var Q = require('q');

var src = [
  path.join(config.src_dir, 'client/**/*.html')
];

var dest = path.join(
  config.dest_dir,
  config.public_dirname,
  config.template_dirname
);

/**
* Copy all angular templates. Return a promise.
*/
var build = function() {
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(plumber())
      .pipe(flatten())
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};

/**
* Start watch on angular templates. Retern a promise.
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
