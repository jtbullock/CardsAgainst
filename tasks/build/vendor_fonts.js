var config = require('../config');

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var path = require('path');
var Q = require('q');

/**
* Copy all angular templates into the templates directory. Return a promise.
*/
module.exports = function() {
  var src = mainBowerFiles({
    filter: '**/*.@(eot|svg|ttf|woff|woff2)'
  })
  var dest = path.join(
    config.dest_dir,
    config.public_dirname,
    config.fonts_dirname
  );
  return Q.Promise(function(resolve,reject) {
    gulp.src(src)
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', reject);
  });
};
