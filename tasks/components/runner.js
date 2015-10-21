var nodemon = require('nodemon');
var gutil = require('gulp-util');
var path = require('path');

var settings = {
  execMap: {
    js: 'node'
  },
  script: path.join(process.cwd(),'dist/app'),
  ignore: ['*'],
  watch: ['foo/'],
  ext: 'noop'
};

module.exports = {
  start: function() {
    console.log(gutil.colors.yellow('\nServer Start\n'))
    return nodemon(settings)
      .on('restart', function() {
        console.log(gutil.colors.yellow('\nServer Restart\n'))
      })
  },
  restart: nodemon.restart
};
