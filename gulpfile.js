var gulp = require('gulp');
var taskDir = './tasks';

//load task modules
var build = require(taskDir+'/build');

//create tasks
gulp.task('build', build);
