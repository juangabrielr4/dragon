process.on('uncaughtException', console.log)
process.on('unhandledRejection', function(reason, p) {

    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason)
    // application specific logging, throwing an error, or other logic here

})

var babelify       = require('babelify'),
    browserify     = require('browserify'),
    chalk          = require('chalk'),
    concat         = require('gulp-concat'),
    glob           = require('glob'),
    gulp           = require('gulp'),
    gutil          = require('gulp-util'),
    mkdirp         = require('mkdirp'),
    mocha          = require('gulp-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    path           = require('path'),
    sequence       = require('run-sequence'),
    size           = require('gulp-size'),
    source         = require('vinyl-source-stream'),
    watching       = require('paradigm-minimist-watching')

gulp.task('build', function(done) {

  var bundler = browserify({
    bundleExternal: true,
    cache: {},
    debug: true,
    entries: [
      './src/dragon.js'
    ],
    extensions: [],
    fullPaths: true,
    insertGlobals: false,
    packageCache: {},
    standalone: 'Dragon'
  })

  bundler
    .transform(babelify.configure({
      blacklist: ["useStrict"]
    }))
    .bundle()
    .on('error', function() {
      console.log(arguments)
    })
    .pipe(source('dragon.js'))
    .pipe(gulp.dest('build/'))
    .on('end', function() {
      console.log('build/dragon.js created.')
      done()
    })

})

function buildBrowserMocha(options, done) {

  var testFiles   = glob.sync(options.testFiles)
  var testHelpers = options.testHelpers || [
    './test/helpers/browser/js/runner.js'
  ]

  var sources = testHelpers.concat(testFiles)

  var bundler = browserify({
    bundleExternal: true,
    cache: {},
    debug: true,
    entries: sources,
    extensions: [],
    fullPaths: true,
    insertGlobals: false,
    packageCache: {}
  })

  bundler
    .transform(babelify.configure({
      blacklist: ["useStrict"]
    }))
    .bundle()
    .on('error', function() {
      console.log(arguments)
    })
    .pipe(source('spec.js'))
    .pipe(gulp.dest('test/helpers/browser/js/'))
    .on('end', function() {
      done()
    })

}

gulp.task('mocha-browser-build', function(done) {

  buildBrowserMocha({
    testFiles: './test/unit/browser/**/*.js'
  }, done)

})

gulp.task('mocha-build-bind-existing-dom', function(done) {

  buildBrowserMocha({
    testFiles: './test/bind/existing-dom/**/*.js'
  }, done)

})

gulp.task('mocha-build-events-ui', function(done) {

  buildBrowserMocha({
    testFiles: './test/events/ui/**/*.js'
  }, done)

})

gulp.task('mocha-build-ui-events', function(done) {

  buildBrowserMocha({
    testFiles: './test/ui/events/**/*.js'
  }, done)

})

gulp.task('mocha-browser', ['mocha-build'], function() {

  return gulp
    .src('./test/helpers/browser/runner.html')
    .pipe(mochaPhantomJS({reporter: 'spec'}))

})

gulp.task('mocha-cli', function() {

  return gulp
    .src([
      './test/helpers/cli/runner.js',
      './lib/polyfills/**/*.js',
      './test/unit/**/*.js'
    ], {read: false})
    .pipe(mocha({reporter: 'spec'}))

})

gulp.task('mocha-server-run', function() {

  return gulp
    .src([
      './test/helpers/cli/runner.js',
      './lib/polyfills/**/*.js',
      './test/unit/server/**/*.js'
    ], {read: false})
    .pipe(mocha({reporter: 'spec'}))

})

gulp.task('t', [
  //'mocha-cli',
  'mocha-browser-run'
])
