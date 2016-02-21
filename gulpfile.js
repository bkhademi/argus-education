var elixir = require('laravel-elixir');
var gulp = require('gulp');
//elixir.config.sourcemaps = false;
/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function (mix) {
	mix.sass('app.scss');
	mix
		.scripts([
			'controllers/admin1/',
			'controllers/admin2/',
			'controllers/admin3/',
			'controllers/live',
			'controllers/student/',
			'controllers/supportstaff/',
			'controllers/teacher/',
			'controllers/attendanceRosters/',
			'controllers/reports',
			'controllers/iss',
			'controllers/dataStaff',
			'controllers/sysadmin',
			'controllers/reteach',
			'controllers/aspcoordinator',
			'controllers/manageAEC',
			'controllers/manageORM',
			'controllers/commons'

		], 'public/js/admin1Main.js')

		.scripts([
			'../../../public/js/app.js',
			'../../../public/js/argusdirectives.js',
			'../../../public/js/argusservices.js'
		], 'public/js/argusCore.min.js')
		
//		.scripts([
//			'../../../public/js/directives.js'
//		], 'public/js/angular-inspinia-directives.min.js')
//	
//		   
//		.scripts(['../../../public/js/inspinia.js'], 'public/js/inspinia.min.js')
		;




//	mix.scripts([
//		'controllers/admin2/'
//		],'public/js/admin2Main.js');
//	mix.scripts([
//		'controllers/admin3/'
//		],'public/js/admin3Main.js');
});

gulp.task('mincore', function (mix) {
	mix.scripts('../../../public/js/app.js', 'public/js/app.min.js');

}); 