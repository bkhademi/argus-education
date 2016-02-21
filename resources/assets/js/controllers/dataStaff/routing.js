/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('datastaff', {
					abstract: true,
					url: "/dataAdmin",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationDataStaffCtrl",
					controllerAs: 'navigation',
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
//				.state('admin1.dashboard', {
//					url: "/dashboard",
//					templateUrl: 'views/admin1/dashboard.html',
//					data: {pageTitle: 'Dashboard'},
//					controller: "DashAdmin1Ctrl",
//					resolve: {
//						loadPlugin: function ($ocLazyLoad) {
//							return $ocLazyLoad.load([
//								{
//									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
//								},
//								{
//									name: 'datePicker',
//									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
//								}
//							]);
//						}
//					}
//				})

				/* Reports */
				.state('datastaff.reports', {
					url: '/Reports',
					templateUrl: 'views/reports/reports.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							])
								;
						}
					}
				})
				.state('datastaff.reports.eod', {
					url: '/EOD',
					templateUrl: 'views/reports/reports.eod.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsEODCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									serie: true,
									name: 'angular-flot',
									files: [
										'js/plugins/flot/jquery.flot.js',
										'js/plugins/flot/jquery.flot.time.js',
										'js/plugins/flot/jquery.flot.tooltip.min.js',
										'js/plugins/flot/jquery.flot.spline.js',
										'js/plugins/flot/jquery.flot.resize.js',
										'js/plugins/flot/jquery.flot.pie.js',
										'js/plugins/flot/curvedLines.js',
										'js/plugins/flot/angular-flot.js' ]
								}
							]);
						}
					}
				})
				.state('datastaff.reports.oroomActivity', {
					url: '/OroomActivity',
					templateUrl: 'views/reports/reports.oroomActivity.html',
					data: {pageTitle: 'OroomActivity'},
					controller: 'ReportsOroomActivityCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									serie: true,
									name: 'angular-flot',
									files: [
										'js/plugins/flot/jquery.flot.js',
										'js/plugins/flot/jquery.flot.time.js',
										'js/plugins/flot/jquery.flot.tooltip.min.js',
										'js/plugins/flot/jquery.flot.spline.js',
										'js/plugins/flot/jquery.flot.resize.js',
										'js/plugins/flot/jquery.flot.pie.js',
										'js/plugins/flot/curvedLines.js',
										'js/plugins/flot/angular-flot.js' ]
								}
							]);
						}
					}
				})
				.state('datastaff.reports.progression', {
					url: '/Progression',
					templateUrl: 'views/reports/reports.progression.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsProgressionCtrl'
				})
				.state('datastaff.reports.atRisk', {
					url: '/At_Risk',
					templateUrl: 'views/reports/reports.atRisk.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsAtRiskCtrl'
				});






		}]);

}(angular.module('Argus')));