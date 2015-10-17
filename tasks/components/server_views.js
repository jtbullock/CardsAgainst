var config = require('../config');

var gulp = require('gulp');
var gutil = require('gulp-util');
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
var watch = function() {
  return Q.Promise(function(resolve,reject) {
    gulp.watch(src)
      .on('change', function(event) {
        gutil.log('-', gutil.colors.green('view changed:'), path.basename(event.path));
        build();
      })
      .on('error', reject);
  });
};

module.exports = {
  build: build,
  watch: watch
}
