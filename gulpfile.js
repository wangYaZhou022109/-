'use strict';

var fs = require('fs'),
    path = require('path'),
    del = require('del'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    express = require('express'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    sleet = require('gulp-sleet'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    cssimport = require('postcss-import'),
    eslint = require('gulp-eslint'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    preprocess = require('gulp-preprocess');

var libs = [
        'jquery', 'handlebars/runtime', 'lodash/collection', 'lodash/object',
        'get-form-data', 'drizzlejs', 'selectize',
        'pickadate/lib/picker', 'pickadate/lib/picker.date',
        'pickadate/lib/picker.time', 'pickadate/lib/translations/zh_CN',
        'perfect-scrollbar', 'kindeditor',

        './vendors/alertify',
        './vendors/upload/plupload.min',
        './vendors/upload/jquery.plupload.queue.min',
        './vendors/upload/zh_CN',
        './vendors/upload/moxie.min'
    ],
    options = {
        entries: ['./main.js'],
        extensions: ['.html', '.hbs'],
        basedir: './scripts',
        debug: false,
        cache: {}, packageCache: {}
    },
    requireDrizzleModules = function(dir, root, b) {
        fs.readdirSync(dir).forEach(function(file) {
            var filename = path.join(dir, file), ext;
            if (fs.statSync(filename).isDirectory()) {
                requireDrizzleModules(filename, root, b);
            } else {
                ext = path.extname(filename);
                if (ext === '.js' || ext === '.hbs' || ext === '.html') {
                    filename = path.relative(root, filename);
                    filename = path.join(path.dirname(filename), path.basename(filename, ext));
                    filename = './' + filename.replace(/\\/g, '/');
                    b.require({file: filename}, {basedir: root});
                }
            }
        });
    },
    main = function() {
        var b = watchify(browserify(options));
        b.on('update', main);
        b.on('log', gutil.log);
        requireDrizzleModules('./scripts/app', './scripts', b);

        b.external(libs);
        gulp.run('lint');

        return b.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./bundle'));
    };

gulp.task('postcss', function() {
    gulp.src([
            'styles/postcss/main.css',
            'styles/postcss/theme.css',
            'styles/postcss/theme-white.css'
        ])
        .pipe(postcss([cssimport(), cssnext()]))
        .pipe(gulp.dest('bundle/'));
});

gulp.task('watch-css', function() {
    watch('styles/postcss/**/*.css', batch(function(e, done) {
        gulp.start('postcss', done);
    }));
});

gulp.task('lint', function() {
    return gulp.src(['scripts/**/*.js', '!scripts/vendors/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.formatEach());
});

gulp.task('common', function() {
    var b = browserify();
    b.require(libs.filter(function(item) { return item.charAt(0) !== '.';}));
    // b.require(libs.filter(function(item) { return item.charAt(0) === '.';}), { basedir: './scripts' });

    libs.filter(function(item) { return item.charAt(0) === '.';}).forEach(function(item) {
        b.require(path.resolve('./scripts', item + '.js'), {expose: item});
    });

    return b.bundle()
        .pipe(source('common.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./bundle'));
});

gulp.task('build-main', function() {
    var b = browserify(options);
    requireDrizzleModules('./scripts/app', './scripts', b);

    b.external(libs);

    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./bundle'));
});

gulp.task('sleet', function() {
    return gulp.src('./**/*.sleet')
        .pipe(sleet())
        .pipe(gulp.dest('./'));
});

gulp.task('main', ['sleet', 'postcss'], main);

gulp.task('clean-build', function(cb) {
    return del(['./dist'], cb);
});

gulp.task('images', ['clean-build'], function() {
    return gulp.src(['images/**/*', 'styles/jquery.plupload.queue/images/**/*'])
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('font', ['clean-build'], function() {
    return gulp.src(['font/**/*', 'styles/pe-icon-7-stroke/font/**/*'])
        .pipe(gulp.dest('./dist/font'));
});

gulp.task('files', ['clean-build', 'images', 'font'], function() {
    return gulp.src('node_modules/es6-promise/dist/es6-promise.js')
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('build', ['clean-build', 'lint', 'sleet', 'common', 'build-main', 'files'], function() {
    gulp.src('./index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulpif('!index.html', rev()))
        .pipe(gulpif('index.html', preprocess({context: {ES6PROMISE: 'scripts/es6-promise.js'}})))
        .pipe(revReplace())
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['main', 'common', 'watch-css'], function() {
    var app = express()

    app.use(function(req, res, next) {
        next();
    });
    app.use(express.static('.'));

    app.listen(8002, function() {
        console.log('Server started at http://localhost:8002');
        console.log('in nginx you can started at http://localhost');
    });
});

gulp.task('serve-dist', function() {
    var app = express()
    app.use(function(req, res, next) {
        next();
    });
    app.use(express.static('./dist'));

    app.listen(8002, function() {
        console.log('Server started at http://localhost:8002');
        console.log('in nginx you can started at http://localhost');
    });

});
