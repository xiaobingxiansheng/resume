const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const autoprefix = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const print = require('gulp-filesinstream');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const img64Html = require('gulp-imgbase64');
const img64Css = require('gulp-css-base64'); // css inline base64
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const reload = browserSync.reload;

const compressConfig = {
    basePath: './src',
    distPath: './dist/',
    cssPath: './src/css/*.css',
    lessPath: './src/less/*.less',
    jsPath: './src/js/*.js',
    imgPath: './src/img/*.*',
    htmlPath: './src/*.html',
    distCssPath: './dist/css/*.css',
    distLessPath: './dist/less/*.less',
    distJsPath: './dist/js/*.js',
    distImgPath: './dist/img/*.*',
    distHtmlPath: './dist/*.html',
};

const autoprefixConfig = {
    browsers: ['last 2 versions']
};

gulp.task('pro-compressJs', () => {
    return gulp.src(compressConfig.jsPath)
    .pipe(print())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(babel({
        plugins: ['transform-runtime']  
    }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev/js'))
});

gulp.task('dev-hashJs', ()=>{
    return gulp.src(compressConfig.jsPath)
    .pipe(rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev/js'))
})

gulp.task('pro-less', () => {
    return gulp.src([compressConfig.cssPath, compressConfig.lessPath])
        .pipe(cleanCSS())
        .pipe(less())
        .pipe(autoprefix(autoprefixConfig))
        .pipe(img64Css())
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/rev/css'))
});

gulp.task('dev-hashImg', ()=>{
    return gulp.src(compressConfig.imgPath)
    .pipe(rev())
    .pipe(gulp.dest('./dist/img'))
    .pipe(rev.manifest()) 
    .pipe(gulp.dest('./dist/rev/img'))
})

gulp.task('dev-hashLess', ()=>{
    return gulp.src([compressConfig.cssPath, compressConfig.lessPath])
    .pipe(cleanCSS())
    .pipe(less())
    .pipe(rev())// CSS生成文件hash编码
    .pipe(gulp.dest('./dist/css'))
    .pipe(rev.manifest())// 生成rev-manifest.json文件名对照映射
    .pipe(gulp.dest('./dist/rev/css'))
})

gulp.task('pro-imageMin', ()=>{
    return gulp.src(compressConfig.imgPath)
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./dist/img'))
        .pipe(rev.manifest()) 
        .pipe(gulp.dest('./dist/rev/img'))
})

gulp.task('pro-devHtml', ()=>{
    return gulp.src(['dist/rev/**/*.json',compressConfig.htmlPath])
    .pipe(img64Html())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(revCollector({ 
        replaceReved: true,
        dirReplacements: {
            'css': '/css',
            'js': '/js',
            'img': '/img'
        }
    }))
    .pipe(gulp.dest('dist/'));
})

gulp.task('dev-revLess', function(){
    return gulp.src(['./dist/rev/**/*.json',compressConfig.distCssPath])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('dev-revHtml', function(){
	return gulp.src(['./dist/rev/**/*.json',compressConfig.htmlPath])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': '/css',
                'js': '/js',
                'img': '/img'
            }
        }))
        .pipe(gulp.dest('dist/'));
});


gulp.task('pro', gulp.series('pro-compressJs', 'pro-less', 'pro-imageMin'));

gulp.task('dev', gulp.series('dev-hashImg', 'dev-hashJs', 'dev-hashLess', 'dev-revLess', 'dev-revHtml', () => {
    browserSync({
        server: {
            baseDir: compressConfig.distPath
        }
    })
    // 更新缓存映射
    gulp.watch(compressConfig.jsPath, gulp.series('dev-hashJs','dev-revHtml')).on('change', reload);
    gulp.watch([compressConfig.cssPath, compressConfig.lessPath], gulp.series('dev-hashLess', 'dev-hashImg', 'dev-revLess', 'dev-revHtml')).on('change', reload);
    gulp.watch(compressConfig.htmlPath, gulp.series('dev-hashImg','dev-revHtml')).on('change', reload);
}));