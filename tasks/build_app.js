'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');
var concat = require('gulp-concat')
var process = require('gulp-util')

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');

gulp.task('bundle', function () {
    return Promise.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js'))
    ]);
});

gulp.task('css', function
    () {
    return gulp.src('src/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest(destDir.path('themes'), {overwrite: true}))
});

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.jsx', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.css', batch(function (events, done) {
        gulp.start('css', beepOnError(done));
    }));
});

gulp.task('build', ['css','bundle', 'environment']);
