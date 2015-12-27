(function(app){
"use strict";
	app.config(['$stateProvider','$urlRouterProvider', '$ocLazyLoadProvider','$provide', 
	function($stateProvider,$urlRouterProvider, $ocLazyLoadProvider,  $provide){
		$ocLazyLoadProvider.config({
			// Set to true if you want to see what and when is dynamically loaded
			debug: false
		});
		$urlRouterProvider.otherwise('/auth');
		$stateProvider
		.state('auth', {
			url: '/auth',
			templateUrl: 'views/login.html',
			controller: 'AuthController as auth',
			data: {pageTitle: "Login", specialClass: "white-bg"}
		})
		.state('admin1', {
			abstract: true,
			url: "/admin1",
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
						},
						{
							name: 'datePicker',
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						}
					]);
				}
			}
		})
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
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						}
					]);
				}
			}
			
		})
		.state('admin1.AECList', {
			url: "/AECList",
			templateUrl: 'views/sharedItems/manageAEC.html',
			data: {pageTitle: 'AEC List'},
			controller : 'manageAECController',
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
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
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
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						}
					]);
				}
			}
		})
		.state('admin1.createStudentPass', {
			url: "/createStudentPass",
			templateUrl: 'views/sharedItems/multiplePasses.html',
			data: {pageTitle: 'Create Pass'}
		})
	
	}])
	
}(angular.module('Argus')));