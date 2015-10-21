var gulp = require('gulp');
var taskDir = './tasks';

//load task modules
var build = require(taskDir+'/build');
var watch = require(taskDir+'/watch');

//create tasks
gulp.task('build', build);
gulp.task('watch', watch);
gulp.task('default', watch);
