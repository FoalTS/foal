const gulp = require('gulp');
const header = require('gulp-header');
const pkg = require('./package.json');
const fs = require('fs');
const del = require('del');

gulp.task('clean', () => {
  return del(['dist/']);
});

gulp.task('add-header', () => {
  gulp.src('./dist/**/*.js')
    .pipe(header(fs.readFileSync('../../header.txt', 'utf8'), { 
      pkg,
      today: new Date().getFullYear()
    }))
    .pipe(gulp.dest('./dist/'))
});