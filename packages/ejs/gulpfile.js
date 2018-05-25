const gulp = require('gulp');
const header = require('gulp-header');
const pkg = require('./package.json');
const fs = require('fs');
const del = require('del');

gulp.task('clean', () => {
  return del(['lib/']);
});

gulp.task('add-header', () => {
  gulp.src([ './lib/**/*.js', './lib/**/*.d.ts' ])
    .pipe(header(fs.readFileSync('../../header.txt', 'utf8'), { 
      pkg,
      today: new Date().getFullYear()
    }))
    .pipe(gulp.dest('./lib/'))
});