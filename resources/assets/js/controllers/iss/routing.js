/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('iss', {
					abstract: true,
					url: "/iss",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationISSCtrl",
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
				
				.state('iss.Lists', {
					url: '/ISSList',
					templateUrl:  'views/iss/Lists.html',
					data: {pageTitle: 'Lists'},
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
				
				.state('iss.Lists.iss', {
					url: "/ISSList",
					templateUrl: 'views/iss/issList.html',
					data: {pageTitle: 'Iss List'},
					controller: 'IssListCtrl'
					

				})
				.state('iss.Lists.oroom', {
					url: "/Oroom",
					templateUrl: 'views/live/oroom.html',
					data: {pageTitle: 'oroom'},
					controller: 'OroomLiveCtrl',
					resolve: {}
				})
				.state('iss.Lists.lunchDetention', {
					url: "/LunchDetention",
					templateUrl: 'views/live/lunchDetention.html',
					data: {pageTitle: 'LunchD'},
					controller: 'LunchDetentionLiveCtrl',
					resolve: {}
				})
				
				.state('iss.Lists.oss', {
					url: "/OSS",
					templateUrl: 'views/live/oss.html',
					data: {pageTitle: 'OSS'},
					controller: 'OSSLiveCtrl',
					resolve: {}
				})

				
				.state('iss.pending', {
					url: "/ISSFollowup",
					templateUrl: 'views/iss/issFollowupList.html',
					data: {pageTitle: 'Followup'},
					controller: 'IssFollowupListCtrl',
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



			;
		}]);


}(angular.module('Argus')));
			