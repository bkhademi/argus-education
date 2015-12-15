var elixir = require('laravel-elixir');

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

elixir(function(mix) {
    mix.sass('app.scss');
	mix.scripts([
		'../../../public/js/controllers/admin1/routing.js',
		'../../../public/js/controllers/admin1/DashboardCtrl.js',
		'../../../public/js/controllers/admin1/ReferralCtrl.js',
		'../../../public/js/controllers/admin1/ManageAECCtrl.js',
		'../../../public/js/controllers/admin1/ManageAECAbsenceCtrl.js', 
		'../../../public/js/controllers/admin1/StudentDataCtrl.js',
		'../../../public/js/controllers/admin1/ProfileCtrl.js',
		'../../../public/js/controllers/admin1/NavigationCtrl.js',
		], 'public/js/admin1Main.js')
});
