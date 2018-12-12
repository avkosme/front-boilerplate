var fs = require('fs');
const gulp = require('gulp'),
    pug = require('gulp-pug'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync'),
    gulpCopy = require('gulp-copy');

const SITE_DIR = 'dist',
    LESS_DIR = './src/less',
    CSS_DIR = './dist/css',
    JS_DIR = 'js';

/**
 * pug compiler
 */
gulp.task('pug', function () {
    gulp.src('./src/index.pug')
        .pipe(pug({
            pretty: false,
            locals: JSON.parse(fs.readFileSync('./src/data/test.json')),
        }))
        .pipe(gulp.dest(SITE_DIR))
        .pipe(browserSync.reload({ stream: true }))
})

/**
 * less compiler
 */
gulp.task('less', function () {
    gulp.src([
        './src/less/**.less',
    ])
        .pipe(less())
        .pipe(concat('index.css'))
        .pipe(gulp.dest(CSS_DIR))
        .pipe(browserSync.reload({ stream: true }))
});

/**
 * js compiler
 */
gulp.task('js', function () {
    gulp.src(
        [
            './src/js/main.js',
        ]
    )
        .pipe(rigger())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.reload({ stream: true }))
});

/**
 * browser-sync
 */
gulp.task('browser-sync', ['less', 'pug'], function () {
    browserSync({
        server: { baseDir: SITE_DIR },
        notify: true
    })
})

gulp.task('watch', function () {
    gulp.watch(LESS_DIR + '/index.less', ['less'])
    gulp.watch('./src/js/**', ['js'])
    gulp.watch(['*pug', './src/index.pug'], ['pug'])
})

gulp.task('copy-fonts', function () {
    gulp.src(['./src/fonts/*'])
    .pipe(gulp.dest('./dist/fonts/'));
})

gulp.task('default', ['js', 'browser-sync', 'copy-fonts', 'watch'])
