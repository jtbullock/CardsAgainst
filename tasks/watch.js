var clientStylesheets = require('./components/client_stylesheets');
var clientTemplates = require('./components/client_templates');
var clientScripts = require('./components/client_scripts');
var vendorStylesheets = require('./components/vendor_stylesheets');
var vendorScripts = require('./components/vendor_scripts');
var vendorFonts = require('./components/vendor_fonts');
var serverViews = require('./components/server_views');
var serverScripts = require('./components/server_scripts');
var runner = require('./components/runner');

var Q = require('q');
var path = require('path');
var gutil = require('gulp-util');

/**
* task: watch
* Watches all assets and rebuilds on change
*/
module.exports = function() {
  return Q.all([
    clientStylesheets.watch(function(event) {
      gutil.log('-', gutil.colors.green('stylesheet changed:'), path.basename(event.path));
      clientStylesheets.build();
    }),
    clientTemplates.watch(function(event) {
      gutil.log('-', gutil.colors.green('template changed:'), path.basename(event.path));
      clientTemplates.build();
    }),
    clientScripts.watch(function(event) {
      gutil.log('-', gutil.colors.green('client changed:'), path.basename(event.path));
      clientScripts.build();
    }),
    vendorStylesheets.watch(function(event) {
      gutil.log('-', gutil.colors.green('stylesheet changed:'), path.basename(event.path));
      vendorStylesheets.build();
    }),
    vendorScripts.watch(function(event) {
      gutil.log('-', gutil.colors.green('library changed:'), path.basename(event.path));
      vendorScripts.build();
    }),
    vendorFonts.watch(function(event) {
      gutil.log('-', gutil.colors.green('font changed:'), path.basename(event.path));
      vendorFonts.build();
    }),
    serverViews.watch(function(event) {
      gutil.log('-', gutil.colors.green('view changed:'), path.basename(event.path));
      serverViews.build();
    }),
    serverScripts.watch(function(event) {
      gutil.log('-', gutil.colors.green('server changed:'), path.basename(event.path));
      serverScripts.build();
      runner.restart();
    })
  ]).then(function() {
    runner.start();
    return Q.Promise(function(resolve,reject) {
      //never resolves, keeping the task open
    })
  })
};
