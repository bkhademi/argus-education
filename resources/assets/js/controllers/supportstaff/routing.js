/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('supportstaff', {
					abstract: true,
					url: "/supportstaff",
					templateUrl: "views/common/contentArgusSupportStaff.html",
					controller: "NavigationSupportStaffCtrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								}, {
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									name: 'ui.slimscroll',
									files: ['js/plugins/slimscroll/angular.slimscroll.js']
								}, {
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}, {
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								}, {
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								}
							]);
						}
					}
				})
				.state('supportstaff.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin1/dashboard.html',
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
				.state('supportstaff.oroomActivitiLog', {
					url: "/OroomActivityLog",
					templateUrl: 'views/admin2/oroomActivityLogSupport.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogCtrl',
					resolve: {}
				})
				.state('supportstaff.oroomActivitiLog.aec', {
					url: "/AEC",
					templateUrl: 'views/live/aec.html',
					data: {pageTitle: 'OSS'},
					controller: 'AECLiveCtrl',
					resolve: {}
				})
				.state('supportstaff.oroomActivitiLog.reteach', {
					url: "/Reteach",
					templateUrl: 'views/live/reteach.html',
					data: {pageTitle: 'OSS'},
					controller: 'ReteachCtrl',
					resolve: {}
				})
				.state('supportstaff.oroomActivitiLog.oroom', {
					url: "/Oroom",
					templateUrl: 'views/live/oroom.html',
					data: {pageTitle: 'oroom'},
					controller: 'OroomLiveCtrl',
					resolve: {}
				})
				.state('supportstaff.oroomActivitiLog.lunchDetention', {
					url: "/LunchDetention",
					templateUrl: 'views/live/lunchDetention.html',
					data: {pageTitle: 'LunchD'},
					controller: 'LunchDetentionLiveCtrl',
					resolve: {}
				})
				.state('supportstaff.oroomActivitiLog.iss', {
					url: "/ISS",
					templateUrl: 'views/live/iss.html',
					data: {pageTitle: 'ISS'},
					controller: 'ISSLiveCtrl',
					resolve: {}
				})
				.state('supportstaff.oroomActivitiLog.oss', {
					url: "/OSS",
					templateUrl: 'views/live/oss.html',
					data: {pageTitle: 'OSS'},
					controller: 'OSSLiveCtrl',
					resolve: {}
				});

		}]);

}(angular.module('Argus')));