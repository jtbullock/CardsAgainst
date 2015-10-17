var clientStylesheets = require('./build/client_stylesheets');
var clientTemplates = require('./build/client_templates');
var clientScripts = require('./build/client_scripts');
var vendorStylesheets = require('./build/vendor_stylesheets');
var vendorScripts = require('./build/vendor_scripts');
var vendorFonts = require('./build/vendor_fonts');
var serverViews = require('./build/server_views');
var serverApp = require('./build/server_app');

var Q = require('q');

/**
* task: watch
* Watches all assets and rebuilds on change
*/
module.exports = function() {
  return Q.all([
    clientStylesheets.watch(),
    clientTemplates.watch(),
    clientScripts.watch(),
    vendorStylesheets.watch(),
    vendorScripts.watch(),
    vendorFonts.watch(),
    serverViews.watch(),
    serverScripts.watch()
  ])
};
