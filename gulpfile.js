var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');

gulp.task('minif', function() {
	gulp.src('./files/dist/*.js')
		.pipe(minify({
			ext:{
				src:'.min.js',
				min:'.js'
			},
			exclude: ['tasks'],
			ignoreFiles: ['.combo.js', '-min.js']
		}))
		.pipe(gulp.dest('./files/dist'))
});

gulp.task('compress', function () {
	return gulp.src(
		[
			'files/js/jquery-2.1.4.min.js',
			'files/js/jquery.easing.1.3.js',
			'files/js/jquery.visible.min.js',
			'files/revolution/js/jquery.themepunch.tools.min.js?rev=5.0',
			
			'files/revolution/js/jquery.themepunch.revolution.min.js?rev=5.0',
			'files/revolution/js/extensions/revolution.extension.slideanims.min.js',
			'files/revolution/js/extensions/revolution.extension.layeranimation.min.js',
			'files/revolution/js/extensions/revolution.extension.navigation.min.js',
			//
			// 'files/revolution/js/extensions/revolution.extension.video.min.js',
			// 'files/revolution/js/extensions/revolution.extension.actions.min.js',
			// 'files/js/tweenMax.js',
			// 'files/js/jquery.backgroundparallax.min.js',
			//
			// 'files/js/jquery.isotope.min.js',
			// 'files/js/jquery.imagesloaded.min.js',
			// 'files/js/jquery.owl.carousel.js',
			// 'files/js/jquery.lightcase.min.js',
			//
			// 'files/js/script.js',
			// 'files/js/jquery.ajaxchimp.min.js',
			// 'files/js/jquery.countdown.min.js',
			// 'files/js/social.js',
			//
			// 'files/js/step-form-wizard.min.js',
			// 'files/js/jquery.mCustomScrollbar.concat.min.js',
			// 'files/js/custom.js'
		])
		.pipe(concat('compress.js'))
		.pipe(gulp.dest('./files/dist'));
});