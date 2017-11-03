var gulp = require('gulp');
var sass = require('gulp-sass');
var ignoreErrors = require('gulp-ignore-errors');
var browserSync = require('browser-sync').create();

//func for silence errors
function swallowError(error) {
	console.log(error.toString());
	this.emit('end')
}


gulp.task('sass', function () {
	return gulp.src('src/scss/custom.scss')
		.pipe(sass())
		.on('error', function (err) {
			console.log(err.toString());
			this.emit('end');
		})
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: 'src'
		},
	})
})

gulp.task('watch', ['browserSync', 'sass'], function () {
	gulp.watch('src/scss/custom.scss', ['sass']).on('error', function (err) {
		console.log(err.toString());
		this.emit('end');
	})
})

