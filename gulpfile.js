'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var $ = require('gulp-load-plugins')();

//clean build directory
gulp.task('clean', function() {
    return gulp.src(['build/*', 'build/.git/*'], {
            read: false
        })
        .pipe($.clean());
});

//copy static folders to build directory
gulp.task('copy', function(done) {
    gulp.src('src/_locales/**')
        .pipe(gulp.dest('build/_locales'));

    gulp.src('src/manifest.json')
        .pipe(gulp.dest('build'));
    done();
});

//copy and compress HTML files
gulp.task('templates', function() {
    return gulp.src('src/templates/*.tpl.html')
        .pipe($.cleanhtml())
        .pipe(gulp.dest('build/templates'));
});

//run scripts through JSHint
gulp.task('jshint', function() {
    return gulp.src('src/scripts/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')));
});

//copy vendor scripts and uglify all other scripts, creating source maps
gulp.task('scripts', ['jshint', 'templates'], function() {
    var b = browserify('./src/scripts/septiwatch.js');
    b.transform('brfs');

    return b.bundle()
        .pipe(source('septiwatch.js'))
        .pipe(gulp.dest('build/scripts'));
});

//minify styles
gulp.task('styles', function() {
    return gulp.src('src/styles/*.css')
        .pipe(gulp.dest('build/styles'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('build/images'))
        .pipe($.size());
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['scripts', 'styles', 'copy'], function() {
    var manifest = require('./src/manifest'),
        distFileName = manifest.name + ' v' + manifest.version + '.zip',
        mapFileName = manifest.name + ' v' + manifest.version + '-maps.zip';
    //collect all source maps
    gulp.src('build/scripts/**/*.map')
        .pipe($.zip(mapFileName))
        .pipe(gulp.dest('dist'));
    //build distributable extension
    return gulp.src(['build/**', '!build/scripts/**/*.map'])
        .pipe($.zip(distFileName))
        .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('dist', ['clean', 'zip']);

gulp.task('build', ['clean', 'scripts', 'styles', 'images', 'copy']);
