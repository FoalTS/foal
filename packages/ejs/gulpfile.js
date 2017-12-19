const gulp = require('gulp');
const header = require('gulp-header');
const pkg = require('./package.json');
const fs = require('fs');

gulp.task('add-header', () => {
  gulp.src('./dist/**/*.js')
    .pipe(header(fs.readFileSync('../../header.txt', 'utf8'), { pkg }))
    .pipe(gulp.dest('./dist/'))
});