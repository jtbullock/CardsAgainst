var config = require('../config');

var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var path = require('path');
var Q = require('q');

/**
* Copy all angular templates into the templates directory. Return a promise.
*/
module.exports = function() {
  var src = mainBowerFiles('**/*.css')
  var dest = path.join(
    config.dest_dir,
    config.public_dirname,
    config.stylesheets_dirname
  );
  var filename = config.vendor_stylesheet;
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(concat(filename))
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};