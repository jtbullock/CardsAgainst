var config = require('../config');

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var path = require('path');
var Q = require('q');

var src = [
  path.join(config.src_dir, 'server/views/**/*.html')
];

var dest = path.join(config.dest_dir, config.public_dirname);

/**
* Copy all server views. Return a promise.
*/
var build = function() {
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(plumber())
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};

/**
* Start watch on server views. Return a promise.
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
