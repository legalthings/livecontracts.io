var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var del = require('del');


gulp.task('minify-css', function () {
	return gulp.src('files/dist/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('files/dist'));
});

gulp.task('minify-js', function () {
	gulp.src('./files/dist/*.js')
		.pipe(minify({
			ext: {
				src: '.min.js',
				min: '.js'
			},
			exclude: ['tasks'],
			ignoreFiles: ['.combo.js', '-min.js']
		}))
		.pipe(gulp.dest('./files/dist'))
});

gulp.task('compress-css', function () {
	return gulp.src([
		'files/css/animate.css',
		'files/css/style.css',
		'files/css/font-awesome.min.css',
		'files/css/ionicons.css',
		// 'files/revolution/css/settings.css',
		// 'files/revolution/css/layers.css',
		// 'files/revolution/css/navigation.css',
		'files/css/owl.carousel.css',
		'files/css/lightcase.css',
		'files/css/mqueries.css',
		'files/css/step-form-wizard-all.css',
		'files/css/jquery.mCustomScrollbar.min.css',
	])
		.pipe(concatCss("compress.css"))
		.pipe(gulp.dest('files/dist/'));
});

gulp.task('compress-js', function () {
	return gulp.src(
		[
			'files/js/jquery-2.1.4.min.js',
			'files/js/jquery.easing.1.3.js',
			'files/js/jquery.visible.min.js',
			// 'files/revolution/js/jquery.themepunch.tools.min.js?rev=5.0',
			
			// 'files/revolution/js/jquery.themepunch.revolution.min.js?rev=5.0',
			// 'files/revolution/js/extensions/revolution.extension.slideanims.min.js',
			// 'files/revolution/js/extensions/revolution.extension.layeranimation.min.js',
			// 'files/revolution/js/extensions/revolution.extension.navigation.min.js',
			//
			// 'files/revolution/js/extensions/revolution.extension.video.min.js',
			// 'files/revolution/js/extensions/revolution.extension.actions.min.js',
			// 'files/js/tweenMax.js',
			'files/js/jquery.backgroundparallax.min.js',
			//
			'files/js/jquery.isotope.min.js',
			'files/js/jquery.imagesloaded.min.js',
			// 'files/js/jquery.owl.carousel.js',
			// 'files/js/jquery.lightcase.min.js',
			//
			'files/js/script.js',
			'files/js/jquery.ajaxchimp.min.js',
			'files/js/jquery.countdown.min.js',
			'files/js/social.js',
			//
			'files/js/step-form-wizard.min.js',
			'files/js/jquery.mCustomScrollbar.concat.min.js',
			'files/js/custom.js'
		])
		.pipe(concat('compress.js'))
		.pipe(gulp.dest('./files/dist'));
});

gulp.task('clean:dist', function() {
	return del.sync('files/dist');
});


gulp.task('default', function (callback) {
	runSequence('clean:dist', ['compress-js','compress-css', 'minify-js', 'minify-css'],
		callback
	)
});