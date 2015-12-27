(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {
			$ocLazyLoadProvider.config({
				// Set to true if you want to see what and when is dynamically loaded
				debug: false
			});
			$urlRouterProvider.otherwise('/auth');
			$stateProvider
				.state('admin2	', {
					abstract: true,
					url: "/admin2",
					templateUrl: "views/common/contentArgus.html",
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'angles',
									files: ['js/plugins/chartJs/angles.js']
								},
								{
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									files: ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js', 'js/plugins/fullcalendar/gcal.js']
								},
								{
									name: 'ui.calendar',
									files: ['js/plugins/fullcalendar/calendar.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								},
								{
									name: 'ui.slimscroll',
									files: ['js/plugins/slimscroll/angular.slimscroll.js']
								}

							]);
						}
					}
				})
				.state('admin2.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin2/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin2Ctrl",
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}
				})
				.state('admin1.oroomActivityLogAdmin', {
					url: "/OroomActivityLogA",
					templateUrl: 'views/admin2/oroomActivityLogAdmin.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogAdminCtrl',
					resolve: {
					}
				})
				.state('admin1.oroomActivitiLog', {
					url: "/OroomActivityLog",
					templateUrl: 'views/admin2/oroomActivityLog.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogCtrl',
					resolve: {
					}
				});
				
		}]);


}(angular.module('Argus')));