var gulp = require('gulp'),
		gutil = require('gulp-util'),
		compass = require('gulp-compass'),
		minifyHTML = require('gulp-minify-html'),
		// imagemin = require('gulp-imagemin'),
		// pngcrush = require('imagemin-pngcrush'),
		// gulpif = require('gulp-if'),
		connect = require('gulp-connect');

var env,
		htmlSource,
		outputDir,
		sassSource,
		sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = "compressed";
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
			style: sassStyle
		})
		.on('error', gutil.log))
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

gulp.task('html', function() {
	gulp.src(htmlSource)
		// .pipe(gulpif(env === 'production', minifyHTML()))
		// .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
		.pipe(connect.reload())
});

// gulp.task('images', function() {
// 	gulp.src('builds/development/images/*.*')
// 		.pipe(gulpif(env === 'production', imagemin({
// 			progressive: true,
// 			svgoPlugins: [{ removeViewBox: false }],
// 			use: [pngcrush()]
// 		})))
// 		.pipe(gulpif(env === 'production', gulp.dest('builds/development/images')))
// 		.pipe(connect.reload())
// });

gulp.task('watch', function() {
	gulp.watch('components/sass/*.scss',['compass']);
	gulp.watch(htmlSource, ['html']);
	// gulp.watch('builds/development/images/*.*', ['images']);
});

gulp.task('default', ['connect', 'compass', 'html', 'watch']);
// gulp.task('default', ['connect', 'compass', 'html', 'images', 'watch']);