var config = require('../config');

var gulp = require('gulp');
var concat = require('gulp-concat');
var path = require('path');
var Q = require('q');

/**
* Concatenate stylesheets into a single file. Return a promise.
*/
module.exports = function() {
  var src = [
    path.join(config.src_dir, 'client/**/*.css')
  ];
  var dest = path.join(
    config.dest_dir,
    config.public_dirname,
    config.stylesheets_dirname
  );
  var filename = config.client_stylesheet;
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(concat(filename))
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};
