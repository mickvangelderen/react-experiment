var babelify = require('babelify')
var browserify = require('browserify')
var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var uglifyify = require('uglifyify')
var vinylSourceStream = require('vinyl-source-stream')
var spawn = require('cross-spawn')

var mode = process.env.NODE_ENV

gulp.task('js', ['js:clean'], function() {
	var transforms = [ babelify ]
	if (mode === 'production') transforms.push(uglifyify)
	var bundler = browserify({
		entries: 'main.js',
		basedir: 'interface/',
		debug: mode !== 'production',
		transform: transforms
	})
	return bundler.bundle()
		.pipe(vinylSourceStream('main.js'))
		.pipe(gulp.dest('client/'))
})

gulp.task('js:clean', function() {
	return gulp.src('client/**/*.js')
		.pipe(plugins.rimraf())
})

gulp.task('js:watch', function() {
	return gulp.watch('interface/**/*.js', ['js'])
})

gulp.task('less', ['less:clean'], function() {
	gulp.src('interface/main.less')
		.pipe(plugins.plumber())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.less())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest('client/'))
})

gulp.task('less:clean', function() {
	return gulp.src('client/**/*.css')
		.pipe(plugins.rimraf())
})

gulp.task('less:watch', function() {
	return gulp.watch('interface/**/*.less', ['less'])
})

gulp.task('jade', ['jade:clean'], function() {
	gulp.src('interface/**/*.jade')
		.pipe(plugins.plumber())
		.pipe(plugins.jade({
			pretty: mode !== 'production'
		}))
		.pipe(gulp.dest('client/'))
})

gulp.task('jade:watch', function() {
	return gulp.watch('interface/**/*.jade', ['jade'])
})

gulp.task('jade:clean', function() {
	return gulp.src('client/**/*.html')
		.pipe(plugins.rimraf())
})

gulp.task('livereload', function() {
	plugins.livereload.listen()
	gulp.watch('client/**/*').on('change', plugins.livereload.changed)
})

gulp.task('serve', function() {
	let server = null
	let state = 'STOPPED'
	function restartServer() {
		switch (state) {
			case 'STOPPED':
				server = spawn('babel-node', ['server/server.js'])
				server.stdout.pipe(process.stdout)
				server.stderr.pipe(process.stderr)
				state = 'STARTED'
				break
			case 'STARTED':
				kill(server).on('exit', function() {
					state = 'STOPPED'
					restartServer()
				})
				state = 'STOPPING'
				break
			case 'STOPPING':
				// Do nothing.
				break
		}
	}
	gulp.watch(['client/**/*.js', 'server/**/*.js'])
		.on('change', restartServer)
	restartServer()
})

gulp.task('clean', ['js:clean', 'less:clean', 'jade:clean'])

gulp.task('watch', ['default', 'js:watch', 'less:watch', 'jade:watch', 'livereload'])

gulp.task('default', ['js', 'less', 'jade'])

function kill(job) {
	if (/win/.test(process.platform)) {
		return spawn('taskkill', ['/pid', job.pid, '/f', '/t'])
	} else {
		return job.kill()
	}
}