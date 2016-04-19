/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('admin3', {
					abstract: true,
					url: "/admin3",
					templateUrl: "views/common/contentArgusOroomCoordinator.html",
					controller: "NavigationAdmin3Ctrl",
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
				.state('admin3.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin3/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin3Ctrl",
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
				.state('admin3.oroomActivityLogAdmin', {
					url: "/OroomActivityLogA",
					templateUrl: 'views/admin2/oroomActivityLogAdmin.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogAdminCtrl',
					resolve: {
					}
				})
				
				.state('admin3.CoordinatorReferralSystem', {
					url: "/OroomCoordinatorReferral",
					templateUrl: 'views/admin2/referralSystem.html',
					data: {pageTitle: 'Referral'},
					controller: 'ORoomCoordinatorReferralCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/jasny/jasny-bootstrap.min.js']
								}, {
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								}, {
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}
				})
				
				.state('admin3.attendanceRosters', {
					url: "/attendanceRosters",
					templateUrl: 'views/admin3/attendanceRosters.html',
					data: {pageTitle: 'Referral'},
					controller: 'attendanceRostersCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								}, {
									name: 'ngGrid',
									files: ['js/plugins/nggrid/ng-grid-2.0.3.min.js']
								},
								{
									insertBefore: '#loadBefore',
									files: ['js/plugins/nggrid/ng-grid.css']
								}

							]);
						}
					}
				})
				.state('admin3.attendanceRosters.oroom', {
					url: "/Oroom",
					templateUrl: 'views/rosters/oroom.html',
					data: {pageTitle: 'oroom'},
					controller: 'OroomRosterCtrl',
					resolve: {}
				})
				.state('admin3.attendanceRosters.lunchDetention', {
					url: "/LunchDetention",
					templateUrl: 'views/rosters/lunchDetention.html',
					data: {pageTitle: 'LunchD'},
					controller: 'LunchDetentionRosterCtrl',
					resolve: {}
				})
				.state('admin3.attendanceRosters.iss', {
					url: "/ISS",
					templateUrl: 'views/live/iss.html',
					data: {pageTitle: 'ISS'},
					controller: 'ISSLiveCtrl',
					resolve: {}
				})
				.state('admin3.attendanceRosters.oss', {
					url: "/OSS",
					templateUrl: 'views/live/oss.html',
					data: {pageTitle: 'OSS'},
					controller: 'OSSLiveCtrl',
					resolve: {}
				})

				.state('admin3.reports', {
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
								}, {
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}
							])
								;
						}
					}
				})
				.state('admin3.reports.eod', {
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
										'js/plugins/flot/angular-flot.js']
								}
							]);
						}
					}
				})

			;
		}]);


}(angular.module('Argus')));