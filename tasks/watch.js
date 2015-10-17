var clientStylesheets = require('./components/client_stylesheets');
var clientTemplates = require('./components/client_templates');
var clientScripts = require('./components/client_scripts');
var vendorStylesheets = require('./components/vendor_stylesheets');
var vendorScripts = require('./components/vendor_scripts');
var vendorFonts = require('./components/vendor_fonts');
var serverViews = require('./components/server_views');
var serverScripts = require('./components/server_scripts');

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
