var config = require('../config');

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var path = require('path');
var Q = require('q');

/**
* Concatenate angular components into a single file with module
* definitions first. Return a promise.
*/
module.exports = function() {
  var src = [
    path.join(config.src_dir, 'client/modules.js'),
    path.join(config.src_dir, 'client/modules/**/*.js')
  ];
  var dest = path.join(
    config.dest_dir,
    config.public_dirname,
    config.scripts_dirname
  );
  var filename = config.client_script;
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat(filename))
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};
