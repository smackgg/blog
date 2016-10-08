var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin')

var htmlmin = require('gulp-html-minifier');

gulp.task('minify-css', function() {
  return gulp.src('./public/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./public'));
});

gulp.task('minify-html', function() {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
         removeComments: true,
         minifyJS: true,
         minifyCSS: true,
         minifyURLs: true,
    }))
    .pipe(gulp.dest('./public'))
});

gulp.task('minify-js', function() {
  return gulp.src('./public/**/*.js')
    .pipe(uglify().on('error', function(e){
        console.log(e);
     }))
    .pipe(gulp.dest('./public'));
});

gulp.task('images', function() {
  gulp.src('./photos/*.*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('default', [
  'minify-html', 'minify-css', 'minify-js', 'images'
]);