var gulp = require('gulp'),
		gutil = require('gulp-util'),
		compass = require('gulp-compass'),
		minifyHTML = require('gulp-minify-html'),
		minifyCss = require('gulp-minify-css'),
		imagemin = require('gulp-imagemin'),
		pngcrush = require('imagemin-pngcrush'),
		gulpif = require('gulp-if'),
		connect = require('gulp-connect');

var env,
		htmlSource,
		outputDir,
		sassSource,

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	outputDir = 'builds/development/';
} else {
	outputDir = 'builds/production/';
}

htmlSource = [outputDir + '*.html'];
sassSource = ['components/sass/style.scss'];

gulp.task('connect', function() {
	connect.server({
		root: 'builds/development',
		livereload: true
	})
});

gulp.task('compass', function(){
	gulp.src(sassSource)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + 'images',
			style: 'expanded'
		})
		.on('error', gutil.log))
		.pipe(gulpif(env === 'production', minifyCss()))
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

gulp.task('html', function() {
	gulp.src('builds/development/*.html')
		.pipe(gulpif(env === 'production', minifyHTML()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
		.pipe(connect.reload())
});

gulp.task('images', function() {
	gulp.src('builds/development/images/*.*')
		.pipe(gulpif(env === 'production', imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngcrush()]
		})))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
		.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch('components/sass/*.scss',['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/images/*.*', ['images']);
});

gulp.task('default', ['connect', 'compass', 'html', 'images', 'watch']);