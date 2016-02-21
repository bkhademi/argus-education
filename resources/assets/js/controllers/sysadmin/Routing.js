/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('sysadmin', {
					abstract: true,
					url: "/sysadmin",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationSysAdminCtrl",
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
				.state('sysadmin.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/sysadmin/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin1Ctrl",
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
				
				.state('sysadmin.referrals', {
					url: "/Referrals",
					templateUrl: 'views/sysadmin/referrals.html',
					data: {pageTitle: 'Referral'},
					controller: 'ReferralsCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}

				})
				.state('sysadmin.activities', {
					url: "/Activities",
					templateUrl: 'views/sysadmin/activities.html',
					data: {pageTitle: 'Referral'},
					controller: 'ActivitiesCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}

				})
				.state('sysadmin.users', {
					url: "/Users",
					templateUrl: 'views/sysadmin/users.html',
					data: {pageTitle: 'Referral'},
					controller: 'UsersCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}

				})
				
				
				.state('sysadmin.referral', {
					url: "/adminReferral",
					templateUrl: 'views/admin1/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'admin1referalController',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}

				})
				.state('sysadmin.AECList', {
					url: "/AECList",
					templateUrl: 'views/sharedItems/manageAEC.html',
					data: {pageTitle: 'AEC List'},
					controller: 'manageAECController',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									name: 'BarcodeGenerator',
									files: ['css/plugins/barcode/barcode.css', 'js/plugins/barcode/barcode.js']
								}
							]);
						}
					}

				})
				.state('sysadmin.pending', {
					url: "/pending",
					templateUrl: 'views/sharedItems/manageAECabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'manageAECAbsenceController',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}
				})
				.state('sysadmin.studentData', {
					url: "/studentData",
					templateUrl: 'views/sharedItems/studentInfo.html',
					data: {pageTitle: 'Student Data'},
					controller: 'studentInfoCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}
				})
				.state('sysadmin.createStudentPass', {
					url: "/createStudentPass",
					templateUrl: 'views/sharedItems/multiplePasses.html',
					data: {pageTitle: 'Create Pass'}
				})
				.state('sysadmin.oroomActivityLogAdmin', {
					url: "/OroomActivityLogA",
					templateUrl: 'views/admin2/oroomActivityLogAdmin.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogAdminCtrl',
					resolve: {
					}
				})

				/* oroom Activity Log */
				.state('sysadmin.oroomActivitiLog', {
					url: "/OroomActivityLog",
					templateUrl: 'views/admin2/oroomActivityLog.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogCtrl',
					resolve: {
					}
				})

				.state('sysadmin.oroomActivitiLog.oroom', {
					url: "/Oroom",
					templateUrl: 'views/live/oroom.html',
					data: {pageTitle: 'oroom'},
					controller: 'OroomLiveCtrl',
					resolve: {}
				})
				.state('sysadmin.oroomActivitiLog.lunchDetention', {
					url: "/LunchDetention",
					templateUrl: 'views/live/lunchDetention.html',
					data: {pageTitle: 'LunchD'},
					controller: 'LunchDetentionLiveCtrl',
					resolve: {}
				})
				.state('sysadmin.oroomActivitiLog.iss', {
					url: "/ISS",
					templateUrl: 'views/live/iss.html',
					data: {pageTitle: 'ISS'},
					controller: 'ISSLiveCtrl',
					resolve: {}
				})
				.state('sysadmin.oroomActivitiLog.oss', {
					url: "/OSS",
					templateUrl: 'views/live/oss.html',
					data: {pageTitle: 'OSS'},
					controller: 'OSSLiveCtrl',
					resolve: {}
				})


				.state('sysadmin.CoordinatorReferralSystem', {
					url: "/OroomCoordinatorReferral",
					templateUrl: 'views/admin2/referralSystem.html',
					data: {pageTitle: 'Referral'},
					controller: 'ORoomCoordinatorReferralCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}
							]);
						}
					}
				})

				/* Attendance Rosters */
				.state('sysadmin.attendanceRosters', {
					url: "/attendanceRosters",
					templateUrl: 'views/admin2/attendanceRosters.html',
					data: {pageTitle: 'Referral'},
					controller: 'attendanceRostersCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}
							]);
						}
					}
				})
				.state('sysadmin.attendanceRosters.oroom', {
					url: "/Oroom",
					templateUrl: 'views/rosters/oroom.html',
					data: {pageTitle: 'oroom'},
					controller: 'OroomRosterCtrl',
					resolve: {}
				})
				.state('sysadmin.attendanceRosters.lunchDetention', {
					url: "/LunchDetention",
					templateUrl: 'views/rosters/lunchDetention.html',
					data: {pageTitle: 'LunchD'},
					controller: 'LunchDetentionRosterCtrl',
					resolve: {}
				})
				.state('sysadmin.attendanceRosters.iss', {
					url: "/ISS",
					templateUrl: 'views/rosters/iss.html',
					data: {pageTitle: 'ISS'},
					controller: 'ISSRosterController',
					resolve: {}
				})
				.state('sysadmin.attendanceRosters.oss', {
					url: "/OSS",
					templateUrl: 'views/rosters/oss.html',
					data: {pageTitle: 'OSS'},
					controller: 'OSSRosterController',
					resolve: {}
				})



				/* Reports */
				.state('sysadmin.reports', {
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
				.state('sysadmin.reports.eod', {
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
				.state('sysadmin.reports.oroomActivity', {
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
				.state('sysadmin.reports.progression', {
					url: '/Progression',
					templateUrl: 'views/reports/reports.progression.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsProgressionCtrl'
				})
				.state('sysadmin.reports.atRisk', {
					url: '/At_Risk',
					templateUrl: 'views/reports/reports.atRisk.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsAtRiskCtrl'
				});








		}]);

}(angular.module('Argus')));