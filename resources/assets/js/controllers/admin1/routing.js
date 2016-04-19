/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('admin1', {
					abstract: true,
					url: "/admin1",
					templateUrl: "views/common/contentArgusLeadCoordinator.html",
					controller: "NavigationAdmin1Ctrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'ui.slimscroll',
									files: ['js/plugins/slimscroll/angular.slimscroll.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								}

							]);
						}
					}
				})
				.state('admin1.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin1/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin1Ctrl",
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								}, {
									name: 'angles',
									files: ['js/plugins/chartJs/angles.js']
								}, {
									files: ['js/plugins/chartJs/Chart.min.js']
								}, {
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}
							]);
						}
					}
				})
				/* AEC */
				.state('admin1.referral', {
					url: "/adminReferral",
					templateUrl: 'views/admin1/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'admin1referalController',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}
							]);
						}
					}

				})
				.state('admin1.AECList', {
					url: "/AECList",
					templateUrl: 'views/sharedItems/manageAEC.html',
					data: {pageTitle: 'AEC List'},
					controller: 'manageAECController',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}
							]);
						}
					}

				})
				.state('admin1.pending', {
					url: "/pending",
					templateUrl: 'views/sharedItems/manageAECabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'manageAECAbsenceController',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}
							]);
						}
					}
				})

				/* Reteach */
				.state('admin1.reteachReferral', {
					url: "/ReteachReferral",
					templateUrl: 'views/reteach/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'ReteachReferralCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}, {
									files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
								}
							]);
						}
					}

				})
				.state('admin1.reteachList', {
					url: "/ReteachList",
					templateUrl: 'views/reteach/manageReteach.html',
					data: {pageTitle: 'List'},
					controller: 'ManageReteachCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}
							]);
						}
					}

				})
				.state('admin1.reteachPending', {
					url: "/ReteachFollowup",
					templateUrl: 'views/reteach/manageReteachabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'ManageReteachAbsenceCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}
							]);
						}
					}
				})

				.state('admin1.studentData', {
					url: "/studentData",
					templateUrl: 'views/sharedItems/studentInfo.html',
					data: {pageTitle: 'Student Data'},
					controller: 'studentInfoCtrl',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
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
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								}, {
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								}
							]);
						}
					}
				})

				.state('admin1.CoordinatorReferralSystem', {
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

				/* Attendance Rosters */
				.state('admin1.attendanceRosters', {
					url: "/attendanceRosters",
					templateUrl: 'views/admin2/attendanceRosters.html',
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
								}

							]);
						}
					}
				})
				.state('admin1.attendanceRosters.oroom', {
					url: "/Oroom",
					templateUrl: 'views/rosters/oroom.html',
					data: {pageTitle: 'oroom'},
					controller: 'OroomRosterCtrl',
					resolve: {}
				})
				.state('admin1.attendanceRosters.lunchDetention', {
					url: "/LunchDetention",
					templateUrl: 'views/rosters/lunchDetention.html',
					data: {pageTitle: 'LunchD'},
					controller: 'LunchDetentionRosterCtrl',
					resolve: {}
				})
				.state('admin1.attendanceRosters.iss', {
					url: "/ISS",
					templateUrl: 'views/rosters/iss.html',
					data: {pageTitle: 'ISS'},
					controller: 'ISSRosterController',
					resolve: {}
				})
				.state('admin1.attendanceRosters.oss', {
					url: "/OSS",
					templateUrl: 'views/rosters/oss.html',
					data: {pageTitle: 'OSS'},
					controller: 'OSSRosterController',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}, {
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
							])
								;
						}
					}
				})

				.state('admin1.issFollowup', {
					url: '/ISSFollowup',
					templateUrl: 'views/iss/issFollowupList.html',
					data: {pageTitle: 'ISS Followup'},
					controller: 'IssFollowupListCtrl',
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
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
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

				.state('admin1.parentMeetingList', {
					url: '/Parent Meeting List',
					templateUrl: 'views/iss/parentMeeting.html',
					data: {pageTitle: 'Parent Meeting List'},
					controller: 'ParentMeetingCtrl',
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
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								}
							])
								;
						}
					}
				})
				.state('admin1.parentMeetingFollowup', {
					url: '/Parent Meeting Followup',
					templateUrl: 'views/iss/parentMeetingFollowup.html',
					data: {pageTitle: 'Parent Meeting List'},
					controller: 'ParentMeetingFollowupCtrl',
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
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								}, {
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								}
							])
								;
						}
					}
				})

				/* Reports */
				.state('admin1.reports', {
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
				.state('admin1.reports.eod', {
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
				.state('admin1.reports.oroomActivity', {
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
										'js/plugins/flot/angular-flot.js']
								}
							]);
						}
					}
				})
				.state('admin1.reports.progression', {
					url: '/Progression',
					templateUrl: 'views/reports/reports.progression.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsProgressionCtrl'
				})
				.state('admin1.reports.atRisk', {
					url: '/At_Risk',
					templateUrl: 'views/reports/reports.atRisk.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsAtRiskCtrl'
				})

			;


		}]);

}(angular.module('Argus')));