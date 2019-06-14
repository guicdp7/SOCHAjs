/*Dependencias */
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    jsonminify = require('gulp-jsonminify');

/*Paths */
const path = {
    assets: {
        dev: "./wwwDev/src/Assets/**/*",
        dest: "./www/src/Assets/"
    },
    scss: {
        watch: "./wwwDev/src/Scss/*.scss",
        dev: "./wwwDev/src/Scss/index.scss",
        dest: "./www/src/Css"
    },
    html: {
        index: {
            dev: "./wwwDev/index.html",
            dest: "./www"
        },
        view: {
            dev: "./wwwDev/src/View/*.html",
            dest: "./www/src/View"
        }
    },
    js: {
        src: {
            dev: "./wwwDev/src/*.js",
            dest: "./www/src"
        },
        controller: {
            dev: "./wwwDev/src/Controller/*.js",
            dest: "./www/src/Controller"
        },
        model: {
            dev: "./wwwDev/src/Model/*.js",
            dest: "./www/src/Model"
        }
    },
    json: {
        language: {
            dev: "./wwwDev/src/Language/*.json",
            dest: "./www/src/Language"
        }
    }
};

/*Options */
const scssProdOpt = {
    outputStyle: "compressed"
}, prefixOpt = {
    cascade: false
}, htmlMinOpt = {
    collapseWhitespace: true
}, babelOpt = {
    presets: [
        [
            "@babel/preset-env",
            {
                "targets": "> 0.25%, not dead"
            }
        ]
    ]
};
/*json */
function json() {
    return gulp.src(path.json.language.dev)
        .pipe(jsonminify())
        .pipe(gulp.dest(path.json.language.dest));
};

/*Assets */
function assets() {
    return gulp.src(path.assets.dev)
        .pipe(gulp.dest(path.assets.dest));
};
/*styles */
function styles() {
    return gulp.src(path.scss.dev, { sourcemaps: true, allowEmpty: true })
        .pipe(sass(scssProdOpt).on('error', sass.logError))
        .pipe(autoprefixer(prefixOpt))
        .pipe(gulp.dest(path.scss.dest));
};
/*html */
function htmlIndex() {
    return gulp.src(path.html.index.dev)
        .pipe(htmlmin(htmlMinOpt))
        .pipe(gulp.dest(path.html.index.dest));
};
function htmlView() {
    return gulp.src(path.html.view.dev)
        .pipe(htmlmin(htmlMinOpt))
        .pipe(gulp.dest(path.html.view.dest));
};

/*javascript */
function srcScripts() {
    return gulp.src(path.js.src.dev)
        .pipe(babel(babelOpt))
        .pipe(uglify())
        .pipe(gulp.dest(path.js.src.dest));
};
function controllerScripts() {
    return gulp.src(path.js.controller.dev)
        .pipe(babel(babelOpt))
        .pipe(uglify())
        .pipe(gulp.dest(path.js.controller.dest));
};
function modelScripts() {
    return gulp.src(path.js.model.dev)
        .pipe(babel(babelOpt))
        .pipe(uglify())
        .pipe(gulp.dest(path.js.model.dest));
};

function watch() {
    gulp.watch([path.assets.dev], assets);
    gulp.watch([path.scss.watch], styles);
    gulp.watch([path.html.index.dev], htmlIndex);
    gulp.watch([path.html.view.dev], htmlView);
    gulp.watch([path.js.src.dev], srcScripts);
    gulp.watch([path.js.controller.dev], controllerScripts);
    gulp.watch([path.js.model.dev], modelScripts);
    gulp.watch([path.json.language.dev], json);
};

let build = gulp.parallel(assets, styles, htmlIndex, htmlView, srcScripts, controllerScripts, modelScripts, json, watch);

gulp.task('default', build);
