var babelify = require('babelify')
var browserify = require('browserify')
var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var uglifyify = require('uglifyify')
var vinylSourceStream = require('vinyl-source-stream')

var mode = process.env.NODE_ENV

gulp.task('js', ['js:clean'], function() {
	var transforms = [ babelify ]
	if (mode === 'production') transforms.push(uglifyify)
	var bundler = browserify({
		entries: './main.js',
		basedir: './client',
		debug: mode !== 'production',
		transform: transforms
	})
	return bundler.bundle()
		.pipe(vinylSourceStream('./main.js'))
		.pipe(gulp.dest('serve/'))
})

gulp.task('js:clean', function() {
	return gulp.src('serve/**/*.js')
		.pipe(plugins.rimraf())
})

gulp.task('js:watch', function() {
	return gulp.watch('./client/**/*.js', ['js'])
})

gulp.task('less', ['less:clean'], function() {
	gulp.src('./client/main.less')
		.pipe(plugins.plumber())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.less())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest('./serve/'))
})

gulp.task('less:clean', function() {
	return gulp.src('serve/**/*.css')
		.pipe(plugins.rimraf())
})

gulp.task('less:watch', function() {
	return gulp.watch('./client/**/*.less', ['less'])
})

gulp.task('jade', ['jade:clean'], function() {
	gulp.src('./client/**/*.jade')
		.pipe(plugins.plumber())
		.pipe(plugins.jade({
			pretty: mode !== 'production'
		}))
		.pipe(gulp.dest('./serve/'))
})

gulp.task('jade:watch', function() {
	return gulp.watch('./client/**/*.jade', ['jade'])
})

gulp.task('jade:clean', function() {
	return gulp.src('serve/**/*.html')
		.pipe(plugins.rimraf())
})

gulp.task('livereload:watch', function() {
	plugins.livereload.listen()
	gulp.watch('serve/**/*').on('change', plugins.livereload.changed)
})

gulp.task('clean', ['js:clean', 'less:clean', 'jade:clean'])

gulp.task('watch', ['default', 'js:watch', 'less:watch', 'jade:watch', 'livereload:watch'])

gulp.task('default', ['js', 'less', 'jade'])