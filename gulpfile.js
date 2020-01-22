const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
var exec = require('child_process').exec;
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const prettyUrl = require('gulp-pretty-url');
var del = require('del');
const gulpEdge = require('gulp-edgejs');

// scss compiler:
gulp.task(
	'styles',
	gulp.series(() => {
		return gulp
			.src('resources/assets/scss/**/*.scss')
			.pipe(
				sass({
					outputStyle: 'compressed'
				}).on('error', sass.logError)
			)
			.pipe(
				autoprefixer({
					browsers: ['last 2 versions']
				})
			)
			.pipe(gulp.dest('./public/css'))
			.pipe(browserSync.stream());
	})
);

// webpack set to dev mode
gulp.task(
	'webpack:dev',
	gulp.series(cb => {
		return exec('npm run dev:webpack', function(err, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			cb(err);
		});
	})
);

gulp.task(
	'webpack:prod',
	gulp.series(cb => {
		return exec('npm run build:webpack', function(err, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			cb(err);
		});
	})
);

// browser-sync to  live reload
// set open:false to open:true for browser live load
gulp.task(
	'browser-sync',
	gulp.series(function() {
		browserSync.init({
			server: './public',
			notify: false,
			open: false
		});
	})
);

// browser-sync task for all types of backends
// gulp.series enables when there are multiple servers
// ws: true enables websockets (chat functionality)
gulp.task(
	'browser-sync-proxy',
	gulp.series(function() {
		browserSync.init({
			proxy: {
				target: 'http://localhost:3333/',
				ws: true
			}
		});
	})
);

gulp.task(
	'imagemin',
	gulp.series(function minizingImages() {
		return gulp
			.src('resources/assets/img/**/*')
			.pipe(
				imagemin([
					imagemin.gifsicle({ interlaced: true }),
					imagemin.jpegtran({ progressive: true }),
					imagemin.optipng({ optimizationLevel: 5 }),
					imagemin.svgo({
						plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
					})
				])
			)
			.pipe(gulp.dest('./public/img'));
	})
);

// default gulp task-runner
gulp.task(
	'default',
	gulp.parallel([
		gulp.series([
			'webpack:dev',
			'styles',
			function runningWatch() {
				gulp.watch('./resources/assets/scss/**/*', gulp.parallel('styles'));
				gulp.watch('./resources/assets/js/**/*', gulp.parallel('webpack:dev'));
				gulp.watch(['./public/**/*', './public/*']).on('change', reload);
			}
		]),
		gulp.series(['browser-sync'])
	])
);


// for PHP/GO backend env
gulp.task(
	'watch-proxy',
	gulp.parallel([
		gulp.series([
			'webpack:dev',
			'styles',
			function runningWatch() {
				gulp.watch('./resources/assets/scss/**/*', gulp.parallel('styles'));
				gulp.watch('./resources/assets/js/**/*', gulp.parallel('webpack:dev'));
				gulp
					.watch(['./public/**/*', './public/*', './resources/views/*'])
					.on('change', reload);
			}
		]),
		gulp.series(['browser-sync-proxy'])
	])
);
// Production build
gulp.task('build', gulp.series([gulp.parallel(['styles', 'webpack:prod'])]));

/*
|--------------------------------------------------------------------------
| Static Site Generator
|--------------------------------------------------------------------------
|
| Run These commands below for static site generator
|	optional this is if you want to create a static website
|
*/

// Edge or PUG Template Engines
gulp.task(
	'views',
	gulp.series(
		function buildGULPHTML() {
			return gulp
				.src([
					'resources/views/**/*.pug',
					'!resources/views/{layouts,layouts/**}',
					'!resources/views/{includes,includes/**}'
				])
				.pipe(pug({ pretty: true }))
				.pipe(gulp.dest('./temp'));
		},
		/* =================== */
		// function buildEDGEHTML() {
		// 	return gulp
		// 		.src([
		// 			'resources/views/**/*.edge',
		// 			'!resources/views/{layouts,layouts/**}',
		// 			'!resources/views/{includes,includes/**}'
		// 		])
		// 		.pipe(gulpEdge())
		// 		.pipe(gulp.dest('./temp'));
		// },
		function cleanUrl() {
			return gulp
				.src('temp/**/*.html')
				.pipe(prettyUrl())
				.pipe(gulp.dest('public'));
		}
	)
);
// delete temp files
gulp.task(
	'cleanTemp',
	gulp.series(() => {
		return del([
			'./temp'
		]);
	})
);

// Static site generator live reload
gulp.task(
	'static-dev',
	gulp.parallel([
		gulp.series([
			'views',
			'webpack:dev',
			'styles',
			'cleanTemp',
			function runningWatch() {
				gulp.watch('./resources/views/**/*', gulp.series('views'));
				gulp.watch('./resources/views/**/*', gulp.series('cleanTemp'));
				gulp.watch('./resources/assets/scss/**/*', gulp.parallel('styles'));
				gulp.watch('./resources/assets/js/**/*', gulp.parallel('webpack:dev'));
				gulp.watch(['./public/**/*', './public/*']).on('change', reload);
			}
		]),
		gulp.series(['browser-sync'])
	])
);

// static site for live reload
gulp.task(
	'static-build',
	gulp.series([
		gulp.series(['views', 'cleanTemp']),
		gulp.parallel(['styles', 'webpack:prod'])
	])
);
