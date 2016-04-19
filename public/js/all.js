/* global angular */

(function(app){
	"use strict";  
	app.controller('DashAdmin1Ctrl', ['$scope', '$modal', 'referrals', 'notify','OroomService',
	function($scope, $modal, referrals, notify, orooms){
		
		 
		$scope.studentsToday = 0;
		var date = Date();
		var dateStr = date.substring(4,7) + ' '+date.substring(8,10) + ' '+date.substring(11,15);
		referrals.query({id:dateStr},function(data){
			var count= 0;
			for(var i = 0; i < data.length ; i++){
				for(var j = 0 ; j < data[i].referred.length ; j++){
				}
				if(data[i].referred.length !== 0 ){
					count++;
				}
				
			}
			$scope.studentsToday = count;
		});;
		$scope.followUp  = 0;
		referrals.query({id:dateStr, absence:true},function(data){$scope.followUp = data.length;});
		orooms.get({count:true}, function(data){
			$scope.studentsToday = data.OroomList;
		});
		
		$scope.downloadEODReport =function(){
			notify({message:'Now Doing, hold on'});
			return;
		};
		
		/**
		 * Opens modal for average attendance
		 */
		$scope.openAverageAttendance = function () {
			$scope.studentsToday  = 0;
			$scope.FollowUp = 0;
			$scope.averageAttendance = 0;
			$scope.rating = 0;
			
			var averageAttendanceModal = $modal.open({
				templateUrl: 'averageAttendanceModal.html',
				size: 'lg',
				controller: ["$scope", "$modalInstance", "graphOptions", "graphData", "$timeout", function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				}],
				resolve: {
					graphOptions : function () { return $scope.lineOptions; },
					graphData: function () { return $scope.lineData; }
				}
			});// End assignmentsModal
		};
		/**
		 * Opens Modal for Rating's Modal
		 */
		$scope.openRating = function () {
			var ratingsModal = $modal.open({
				templateUrl: 'ratingsModal.html',
				size: 'lg',
				controller: ["$scope", "$modalInstance", "graphOptions", "graphData", "$timeout", function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				}],
				resolve: {
					graphOptions : function () { return $scope.lineOptions; },
					graphData: function () { return $scope.lineData; }
				}
			});// End assignmentsModal
		};
		
		/**
		 * Data for Line chart
		 */
		$scope.lineData = {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "Example dataset",
					fillColor: "rgba(185, 35, 34, .5)",
					strokeColor: "rgba(185, 35, 34, .8)",
					pointColor: "#B92322",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [0, 0, 0, 0, 0, 0, 0]
				}
			]
		};
		
		/**
		 * Options for Line chart
		 */
		$scope.lineOptions = {
			scaleShowGridLines: true,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineWidth: 1,
			bezierCurve: false,
			bezierCurveTension: 0.4,
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeWidth: 1,
			pointHitDetectionRadius: 20,
			datasetStroke: true,
			datasetStrokeWidth: 2,
			datasetFill: true
		};
		/**
		 * Data for Doughnut chart
		 */
		$scope.doughnutData = [
			{
				value: 300,
				color: "#2f4050",
				highlight: "#1ab394",
				label: "App"
			},
			{
				value: 50,
				color: "#2f4060",
				highlight: "#1ab394",
				label: "Software"
			},
			{
				value: 100,
				color: "#2f4070",
				highlight: "#1ab394",
				label: "Laptop"
			}
		];
		
		/**
		 * Options for Doughnut chart
		 */
		$scope.doughnutOptions = {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 45, // This is 0 for Pie charts
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false
		};
		
		/**
		 * List of the techer's tutors if any
		 */
		$scope.teachersTeam = [
			{fn:"Adrian Omar", ln:"Galicia Mendez", subjects:["Math", "Physics","Spanish"], days:["M","W", "Sat"], rate:9.5},
			{fn:"Brandon", ln:"Hernandez", subjects:["Math", "Physics","Chemistry", "Biology"], days:["T","Th", "F"], rate:8.9},
			{fn:"Jose", ln:"Martinez", subjects:["Math", "Physics","Computer Science"], days:["M","W", "Sat"], rate:2.1}
		];
		
	}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationAdmin1Ctrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin1.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'AEC Referral System',
				link: "admin1.referral",
				icon: 'eye fa-2x'
			},
			{
				id: 'AEC List',
				link: "admin1.AECList",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Follow-up List',
				link: "admin1.pending",
				icon: 'exclamation fa-2x'
			} 
//			{
//				id: 'Student Data',
//				link: "admin1.studentData",
//				icon: 'user fa-2x'
//			}
			, {
				id: 'ORoom Activity Log',
				link: "admin1.oroomActivityLogAdmin",
				icon: 'tasks fa-2x'
			}
//			, {
//				id: 'Live Activity Log',
//				link: "admin1.oroomActivitiLog.oroom",
//				icon: 'user fa-2x'
//			}
			,{
				id: 'ORoom Coordinator Referral',
				link: "admin1.CoordinatorReferralSystem",
				icon: 'pencil-square-o fa-2x'
			},{
				id: 'Attendance Rosters',
				link: "admin1.attendanceRosters.oroom",
				icon: 'list-alt fa-2x'
			},{
				id: 'Parent Meeting Followup List',
				link: "admin1.issFollowup",
				icon: 'list-alt fa-2x'
			},
			 {
				id: 'Reports',
				link: 'admin1.reports',
				icon: 'area-chart fa-2x'
			}
		];
	});
}(angular.module('Argus')));

/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('admin1', {
					abstract: true,
					url: "/admin1",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationAdmin1Ctrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin1.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin1/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin1Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin1.referral', {
					url: "/adminReferral",
					templateUrl: 'views/admin1/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'admin1referalController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}

				})
				.state('admin1.AECList', {
					url: "/AECList",
					templateUrl: 'views/sharedItems/manageAEC.html',
					data: {pageTitle: 'AEC List'},
					controller: 'manageAECController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}

				})
				.state('admin1.pending', {
					url: "/pending",
					templateUrl: 'views/sharedItems/manageAECabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'manageAECAbsenceController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin1.studentData', {
					url: "/studentData",
					templateUrl: 'views/sharedItems/studentInfo.html',
					data: {pageTitle: 'Student Data'},
					controller: 'studentInfoCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
								}
							]);
						}]
					}
				})

				.state('admin1.oroomActivityLogAdmin', {
					url: "/OroomActivityLogA",
					templateUrl: 'views/admin2/oroomActivityLogAdmin.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogAdminCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})


				.state('admin1.CoordinatorReferralSystem', {
					url: "/OroomCoordinatorReferral",
					templateUrl: 'views/admin2/referralSystem.html',
					data: {pageTitle: 'Referral'},
					controller: 'ORoomCoordinatorReferralCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
								}
							]);
						}]
					}
				})

				/* Attendance Rosters */
				.state('admin1.attendanceRosters', {
					url: "/attendanceRosters",
					templateUrl: 'views/admin2/attendanceRosters.html',
					data: {pageTitle: 'Referral'},
					controller: 'attendanceRostersCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
										'js/plugins/flot/angular-flot.js' ]
								}
							])
								;
						}]
					}
				})

				.state('admin1.issFollowup', {
					url: '/ISSFollowup',
					templateUrl: 'views/iss/issFollowupList.html',
					data: {pageTitle: 'ISS Followup'},
					controller: 'IssFollowupListCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})

				/* Reports */
				.state('admin1.reports', {
					url: '/Reports',
					templateUrl: 'views/reports/reports.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin1.reports.eod', {
					url: '/EOD',
					templateUrl: 'views/reports/reports.eod.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsEODCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin1.reports.oroomActivity', {
					url: '/OroomActivity',
					templateUrl: 'views/reports/reports.oroomActivity.html',
					data: {pageTitle: 'OroomActivity'},
					controller: 'ReportsOroomActivityCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
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
				});

		}]);

}(angular.module('Argus')));
/* global angular */

(function(app){
	"use strict";  
	app.controller('DashAdmin2Ctrl', ['$scope', '$modal', 'referrals', 'notify',
	function($scope, $modal, referrals, notify){
		
		 
		$scope.studentsToday =0;
		var date = Date();
		$scope.counters = {};
		var dateStr = date.substring(4,7) + ' '+date.substring(8,10) + ' '+date.substring(11,15);
		referrals.query({id:dateStr},function(data){
			$scope.counters.aec = data.length;
		});
		referrals.query({id:dateStr, absence:true},function(data){
			$scope.counters.aecAbsent = data.length;
		});
		
		$scope.downloadEODReport =function(){
			//notify({message:'t'});
			return;
		};
		
		/**
		 * Opens modal for average attendance
		 */
		$scope.openAverageAttendance = function () {
			$scope.studentsToday  = 0;
			$scope.FollowUp = 0;
			$scope.averageAttendance = 0;
			$scope.rating = 0;
			
			var averageAttendanceModal = $modal.open({
				templateUrl: 'averageAttendanceModal.html',
				size: 'lg',
				controller: ["$scope", "$modalInstance", "graphOptions", "graphData", "$timeout", function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				}],
				resolve: {
					graphOptions : function () { return $scope.lineOptions ;},
					graphData: function () { return $scope.lineData; }
				}
			});// End assignmentsModal
		};
		/**
		 * Opens Modal for Rating's Modal
		 */
		$scope.openRating = function () {
			var ratingsModal = $modal.open({
				templateUrl: 'ratingsModal.html',
				size: 'lg',
				controller: ["$scope", "$modalInstance", "graphOptions", "graphData", "$timeout", function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				}],
				resolve: {
					graphOptions : function () { return $scope.lineOptions; },
					graphData: function () { return $scope.lineData; }
				}
			});// End assignmentsModal
		};
		
		/**
		 * Data for Line chart
		 */
		$scope.lineData = {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "Example dataset",
					fillColor: "rgba(185, 35, 34, .5)",
					strokeColor: "rgba(185, 35, 34, .8)",
					pointColor: "#B92322",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [0, 0, 0, 0, 0, 0, 0]
				}
			]
		};
		
		/**
		 * Options for Line chart
		 */
		$scope.lineOptions = {
			scaleShowGridLines: true,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineWidth: 1,
			bezierCurve: false,
			bezierCurveTension: 0.4,
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeWidth: 1,
			pointHitDetectionRadius: 20,
			datasetStroke: true,
			datasetStrokeWidth: 2,
			datasetFill: true
		};
		/**
		 * Data for Doughnut chart
		 */
		$scope.doughnutData = [
			{
				value: 300,
				color: "#2f4050",
				highlight: "#1ab394",
				label: "App"
			},
			{
				value: 50,
				color: "#2f4060",
				highlight: "#1ab394",
				label: "Software"
			},
			{
				value: 100,
				color: "#2f4070",
				highlight: "#1ab394",
				label: "Laptop"
			}
		];
		
		/**
		 * Options for Doughnut chart
		 */
		$scope.doughnutOptions = {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 45, // This is 0 for Pie charts
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false
		};
		

		
	}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationAdmin2Ctrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin2.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'Referral System',
				link: "admin2.referral",
				icon: 'eye fa-2x'
			},
			{
				id: 'AEC List',
				link: "admin2.AECList",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Follow-up List',
				link: "admin2.pending",
				icon: 'exclamation fa-2x'
			}, {
				id: 'Student Data',
				link: "admin2.studentData",
				icon: 'user fa-2x'
			}
		];
	});
}(angular.module('Argus')));


/* global angular */

(function (app) {
	app.controller('ORoomCoordinatorReferralCtrl',
		['$scope', '$modal', 'notify', 'StudentsService', 'teachers', 'DevService', 'LunchService', 'OroomService', 'ISSService', 'CountersService',
			function ($scope, $modal, notify, students, teachers, dev, lunchs, orooms, isss, counters) {

				$scope.selected = {};
				$scope.schoolStudents = students.query({admin: true, light: true}, function () {
				}, function (error) {
					dev.openError(error);
				});

				$scope.teachers = teachers.query();

				$scope.assignLunch = function () {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/lunchDetentionModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", "PeriodsService", function ($scope, student, PeriodsService) {
							$scope.periods = PeriodsService.query();
							$scope.student = student;
							
						}],
						resolve: {
							student: function () {


								return $scope.selected.student;
							}
						}
					});

					modalInstance.result.then(function () {// on SUBMIT
						// post the comment and other things to the database 
						var student = $scope.selected.student;
						var urlParams = {};
						var payload = {
							StudentId: student.Id,
							PeriodId: student.period ? student.period.Id : 0,
							TardyTime: student.tardyTime
						};


						lunchs.save(urlParams, payload, function (data) {
							notify('success');
						}, dev.openError);

						$scope.selected.student = null;
					});
				};
				$scope.assignORoom = function () {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/assignOroomModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "PeriodsService", "student", "teachers", function ($scope, PeriodsService, student, teachers) {
							$scope.periods = PeriodsService.query();
							$scope.student = student;
							$scope.teachers = teachers;
						}],
						resolve: {
							student: function () {
								return $scope.selected.student;
							},
							teachers: function () {
								return $scope.teachers;
							}
						}
					});

					modalInstance.result.then(function () {// on SUBMIT
						var student = $scope.selected.student;
						console.log(student);
						// post the comment and other things to the database 

						var payload = {
							//Date:$scope.currentDate,
							StudentId: student.Id,
							TeacherId: student.teacher ? student.teacher.id : 0,
							ReferralType: "First Time - Teacher",
							Comment: student.comment
						};

						orooms.save({ormlist: true}, payload, function () {
							notify('success');
						}, dev.openError);

						$scope.selected.student = null;
					});
				};
				$scope.assignISS = function () {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/ISSReferralAdminModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", "PeriodsService", function ($scope, student, PeriodsService) {
							$scope.periods = PeriodsService.query();
							$scope.student = student;
						}],
						resolve: {
							student: function () {
								return $scope.selected.student;
							}
						}
					});

					modalInstance.result.then(function () {// on SUBMIT
						var student = $scope.selected.student;
						// post the comment and other things to the database 
						isss.save({
							StudentId: student.Id,
							ReferralTypeId: 10,
							ActionType: 21,
							Comment: student.comment
						}, function (data) {
							notify(data.msg);
						}, dev.openError);

						$scope.selected.student = null;
					});
				};
				$scope.changeAndComment = function () {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/oRoomCoordinatorUpdateAdminModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
							console.log(student);
						}],
						resolve: {
							student: function () {
								return students.get({id: $scope.selected.student.Id}, function (data) {
									
									$scope.selected.student.counters = data.counters;
									return $scope.selected.student;
								});
								return $scope.selected.student;
							}
						}
					});

					modalInstance.result.then(function (data) {// on SUBMIT
						var item = $scope.selected.student;
						// post the comment and other things to the database 
						var urlParams = {
							id: item.Id
						};

						counters.update(urlParams,
							{counters: item.counters,
								Comment: data.comment
							}, function () {
							notify('success');
						}, function (error) {
							dev.openError(error);
						});
						$scope.selected.student = null;
					});
				};


			}]);
}(angular.module('Argus')));


/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('admin2', {
					abstract: true,
					url: "/admin2",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationAdmin2Ctrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin2.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin2/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin2Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('admin2.referral', {
					url: "/adminReferral",
					templateUrl: 'views/admin1/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'admin1referalController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}

				})
				.state('admin2.AECList', {
					url: "/AECList",
					templateUrl: 'views/sharedItems/manageAEC.html',
					data: {pageTitle: 'AEC List'},
					controller: 'manageAECController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}

				})
				.state('admin2.pending', {
					url: "/pending",
					templateUrl: 'views/sharedItems/manageAECabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'manageAECAbsenceController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('admin2.studentData', {
					url: "/studentData",
					templateUrl: 'views/sharedItems/studentInfo.html',
					data: {pageTitle: 'Student Data'},
					controller: 'studentInfoCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('admin2.createStudentPass', {
					url: "/createStudentPass",
					templateUrl: 'views/sharedItems/multiplePasses.html',
					data: {pageTitle: 'Create Pass'}
				});




		}]);


}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.controller('DashAdmin3Ctrl', ['$scope', '$modal', 'notify', 'OroomService', "LunchService", "ISSService", "OSSService",
		function ($scope, $modal, notify, orooms, lunchs, isss, osss) {
			$scope.counters = {oroom: 0, average: 'N/A'};
			orooms.get({roster: true}, function (data) {
				$scope.counters.oroom += data.OroomList.length;
				angular.forEach(data.OroomList, function (item) {
					if (item.counters.ISSDays > 0) {
						$scope.counters.oroom--;
					}
				});

			});

			lunchs.query({roster: true}, function (data) {
				$scope.counters.oroom += data.length;

			});

			isss.query({roster: true}, function (data) {
				$scope.counters.oroom += data.length;


			});

			osss.query({roster: true}, function (data) {
				$scope.counters.oroom += data.length;

			});

			var date = Date();


			$scope.downloadEODReport = function () {
				//notify({message:'t'});
				return;
			};

			/**
			 * Opens modal for average attendance
			 */
			$scope.openAverageAttendance = function () {
				$scope.studentsToday = 0;
				$scope.FollowUp = 0;
				$scope.averageAttendance = 0;
				$scope.rating = 0;

				var averageAttendanceModal = $modal.open({
					templateUrl: 'averageAttendanceModal.html',
					size: 'lg',
					controller: ["$scope", "$modalInstance", "graphOptions", "graphData", "$timeout", function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
						$scope.graphOptions = graphOptions;
						$scope.graphData = graphData;

						$timeout(function () {
							$scope.drawGraph = true;
						}, 100);


						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};
					}],
					resolve: {
						graphOptions: function () {
							return $scope.lineOptions;
						},
						graphData: function () {
							return $scope.lineData;
						}
					}
				});// End assignmentsModal
			};

			/**
			 * Data for Line chart
			 */
			$scope.lineData = {
				labels: ["January", "February", "March", "April", "May", "June", "July"],
				datasets: [
					{
						label: "Example dataset",
						fillColor: "rgba(185, 35, 34, .5)",
						strokeColor: "rgba(185, 35, 34, .8)",
						pointColor: "#B92322",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: [0, 0, 0, 0, 0, 0, 0]
					}
				]
			};

			/**
			 * Options for Line chart
			 */
			$scope.lineOptions = {
				scaleShowGridLines: true,
				scaleGridLineColor: "rgba(0,0,0,.05)",
				scaleGridLineWidth: 1,
				bezierCurve: false,
				bezierCurveTension: 0.4,
				pointDot: true,
				pointDotRadius: 4,
				pointDotStrokeWidth: 1,
				pointHitDetectionRadius: 20,
				datasetStroke: true,
				datasetStrokeWidth: 2,
				datasetFill: true
			};

		}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
//	O-Room Coordinator
	app.controller('NavigationAdmin3Ctrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin3.dashboard",
				icon: 'dashboard fa-2x'
			},{
				id: 'Activity Log',
				link: 'admin3.oroomActivityLogAdmin',
				icon: 'tasks fa-2x'
			},{
				id: 'Create Referral',
				link: "admin3.CoordinatorReferralSystem",
				icon: 'pencil-square-o fa-2x'
			},{
				id: 'Attendance Rosters',
				link: "admin3.attendanceRosters.oroom",
				icon: 'list-alt fa-2x'
			},{
				id: 'Reports',
				link: 'admin3.reports',
				icon: 'area-chart fa-2x'
			}
		];
	});
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsController', ['$scope'	, function ($scope) {
			$scope.eod = {};
			$scope.eod.issStudents = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				
				
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  }
				
			];
		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsEODController', ['$scope', "$timeout", function ($scope , $timeout) {
			$scope.eodReports = [
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'Reteach', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			$scope.eod.selected = {name:0, value:0 };
			
			
			
			
			angular.forEach($scope.eod.issStudents, function(item){
				if(item.Attendance === 'Absent')
					item.class = 'bg-gray';
				else if(item.Attendance ==='Sent-Out')
					item.class = 'bg-danger';
				else 
					item.class = 'bg-green';
			});
			
		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsProgressionController', ['$scope', '$timeout'	, function ($scope, $timeout) {
			$scope.startingPoints = [
				{name:'Reteach', value:1},
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'O-Room+1', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			
			
			
			$scope.starting = undefined;
			$scope.eod.issStudents1 = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Date:'12/10/2015'  },
				{StudentId:'100131423', FirstName:'Adrian ',LastName:'Black',  Date:'12/10/2015', class:'bg-warning'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/10/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/10/2015'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez',  Date:'12/10/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/10/2015'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/10/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/10/2015'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/10/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/10/2015'  }];
			
			$scope.eod.issStudents2 = [
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/11/2015'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez',  Date:'12/11/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/11/2015'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/11/2015'  },
				{StudentId:'100344318', FirstName:'Adrian ',LastName:'Black',  Date:'12/11/2015', class:'bg-warning'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/11/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/11/2015'  }];
			
			
			$scope.eod.issStudents3 = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Date:'12/12/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/12/2015'  },
				{StudentId:'100131834', FirstName:'Adrian ',LastName:'Black', Date:'12/12/2015' ,class:'bg-warning'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/12/2015'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez',  Date:'12/12/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/12/2015'  }];
			
			
			$scope.eod.issStudents4 = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Date:'12/13/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/13/2015'  },
				{StudentId:'100131834', FirstName:'Adrian ',LastName:'Black', Date:'12/13/2015', class:'bg-warning'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/13/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/13/2015'  }];
			
			$scope.eod.issStudents5 = [
			
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/14/2015'  },
				{StudentId:'100131834', FirstName:'Adrian ',LastName:'Black', Date:'12/14/2015', class:'bg-warning'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/14/2015'  }];
			$scope.selected = $scope.eod.issStudents1[1];
		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsAtRiskController', ['$scope'	, function ($scope) {
			$scope.eodReports = [
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'Reteach', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			$scope.eod.selected = {name:0, value:0 };
			
			angular.forEach($scope.eod.issStudents, function(item){
				item.class = 'bg-danger';
			});
		}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('admin3', {
					abstract: true,
					url: "/admin3",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationAdmin3Ctrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin3.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin3/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin3Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}
							]);
						}]
					}
				})
				
				.state('admin3.attendanceRosters', {
					url: "/attendanceRosters",
					templateUrl: 'views/admin3/attendanceRosters.html',
					data: {pageTitle: 'Referral'},
					controller: 'attendanceRostersCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}
							]);
						}]
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
					templateUrl: 'views/reports/reportsAdmin3.html',
					data: {pageTitle: 'Reports'},
					controller: 'Admin1ReportsController'
				})
				.state('admin3.reports.eod', {
					url: '/EOD',
					templateUrl: 'views/reports/reports.eod.html',
					data: {pageTitle: 'EOD'},
					controller: 'ReportsEODCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('admin3.reports.progression', {
					url: '/Progression',
					templateUrl: 'views/reports/reports.progression.html',
					data: {pageTitle: 'Progression'},
					controller: 'Admin1ReportsProgressionController'
				})
				.state('admin3.reports.atRisk', {
					url: '/At_Risk',
					templateUrl: 'views/reports/reports.atRisk.html',
					data: {pageTitle: 'At Risk'},
					controller: 'Admin1ReportsAtRiskController'
				});
				

		}]);


}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('ISSLiveCtrl', ['$scope', '$interval','notify','ISSService',
		function ($scope, $interval, notify, isss) {
			
			var intervalPromise = $interval(function () {
				getISSList();
			}, 2000);
			
			$scope.$on('$destroy', function(){
				$interval.cancel(intervalPromise);
			});
			
			function getISSList(date){
				isss.query({date:date}, function (data) {
					$scope.iss = data;
				});
			};
			
		}]);
}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global angular */

(function (app) {
	app.controller('oRoomActivityLogCtrl',
		['$scope', 'notify','$interval','FormatTimeService',
			function ($scope, notify, $interval, time) {
				$scope.currentList = 'oroom';
				$scope.currentList = 'oroom';
				$scope.refTable = [];
				$scope.lunchTableA = [];
				$scope.lunchTableB = [];
				$scope.iss = [];
				$scope.oss = [];
				$scope.currentDate = formatDate(new Date());
				
				$interval(function(){
					$scope.currentTime = time.formatAMPM(new Date());
				}, 1000);
				
				
			}]);
}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('LunchDetentionLiveCtrl', ['$scope', '$interval', 'notify', 'DevService', 'LunchService',
		function ($scope, $interval, notify, dev, lunchs) {

			$scope.lunchTableA = [];
			$scope.lunchTableB = [];

			var intervalPromise = $interval(function () {
				getLunchLists();
			}, 2000);


			$scope.$on('$destroy', function () {
				$interval.cancel(intervalPromise);
			});

			function getLunchLists(date) {
				lunchs.query({date: date}, function (data) {
					// separate the lists by the lunch type of the students
					$scope.lunchTableA = [];
					$scope.lunchTableB = [];
					$scope.lunchTableC = [];
					$scope.lunchTable = data;
					angular.forEach(data, function (item) {
						if (item.LunchType === 'A Lunch')
							$scope.lunchTableA.push(item);
						else if (item.LunchType === 'B Lunch')
							$scope.lunchTableB.push(item);
						else
						$scope.lunchTableC.push(item);

					});

				});
			}
			;
		}]);
}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global angular */

(function (app) {
	app.controller('OSSLiveCtrl', ['$scope', '$interval','notify', 'OSSService',
		function ($scope, $interval, notify, osss) {
			
			var intervalPromise = $interval(function () {
				getOSSList(); 
			}, 2000);
			
			$scope.$on('$destroy', function(){
				$interval.cancel(intervalPromise);
			});
			
			function getOSSList(date){
				osss.query({date:date}, function (data) {
					$scope.oss = data;
				});
			};
			
		}]);
}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('OroomLiveCtrl', ['$scope', '$interval', 'notify', 'OroomService', 'PeriodsService', 'FormatTimeService', '$timeout','$rootScope',
		function ($scope, $interval, notify, orooms, periods, time, $timeout, $rootScope) {
			var intervalPromise = $interval(interval, 2000);
			
			$scope.$on('$destroy',function(){
				$interval.cancel(intervalPromise); 
			});

			function interval() {

				var now = new Date();
				$scope.currentTime = formatAMPM(now);
				$scope.currentDate = formatDate(now);
				$scope.currentPeriod = getPeriod(now);
				//var newPeriod = getPeriod(now);
				
				getORoomLists($scope.currentPeriod);
				
			}

			$scope.changePeriodTables = function (newPeriod, manual) {
				$scope.currentPeriod = newPeriod;
				
			};


			$scope.periods = periods.query(function (data) {
				$scope.currentPeriod = getPeriod(new Date());
				interval();
			});

			var formatAMPM = time.formatAMPM;
			var formatDate = time.formatDate;
			var formatTime24 = time.formatTime24;

			function getPeriod(date) {
				var currentPeriod = null;
				var datestr = formatTime24(date);

				angular.forEach($scope.periods, function (item) {
					if (datestr > item.StartTime) {
						//console.log('datestr < ' + item.StartTime);
						if (datestr < item.EndTime) {
							//console.log('datestr < ' + item.EndTime);
							currentPeriod = item;
						}
					}
				});
				return currentPeriod;
			}


			function getORoomLists(period) {
				orooms.get({}, function (data) {
					var ormList = [];
					angular.forEach(data.OroomList, function(item,$index){
						if(item.user.SchoolId === $rootScope.currentUser.SchoolId){
							ormList.push(item);
						}
					});
					$scope.refTable = data.reftable;
					$scope.oroomlist = ormList;
				});
			}
			getORoomLists();


		}]);
}(angular.module('Argus')));
(function (app) {
	"use strict";
	app.controller('NavigationStudentCtrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin1.dashboard",
				icon: 'dashboard fa-2x'
			},
			{
				id: 'Student Data',
				link: "admin1.studentData",
				icon: 'user fa-2x'
			}

		];
	});
}(angular.module('Argus')));

/* global angular */

(function (app) {
	app
		.controller("ProfileCtrl",
			["$scope", "StudentsService", "$http", '$rootScope', 'ProfessorClassesService', 'RoomsService', function ($scope, students, $http, $rootScope, professorclasses, rooms) {
					$scope.schedule = []; // holds  student's schedule
					$scope.activities = []; // holds student'activities
					$scope.checks = [];
					$scope.currentDate = new Date();

					$scope.$watch('checks', function (n, o) {
//			console.log(n);
					}, true);
					$scope.role = $rootScope.currentUser.role;
					$scope.updateStudent = function () {
						students.update({id: $scope.student.Id, updateStudent: true}, {
							GuardianName: $scope.student.GuardianName,
							GuardianPhone: $scope.student.GuardianPhone,
							GuardianMPhone: $scope.student.GuardianMPhone,
							GuardianEmail: $scope.student.GuardianEmail
						});
					};
					$scope.rooms = rooms.query();

					$scope.onRoomChanged = function (professorclass) {
						console.log(professorclass);
						professorclasses.update({id: professorclass.Id}, {RoomId: professorclass.room.Id}, function (data) {
							console.log('success');
						});
					};

					$scope.downloadActivity = function () {
						var text = '';
						var heading = 'Date,ActionBy,Activity,Comment \n';
						text += heading;
						angular.forEach($scope.activities, function (act) {
							text += act.ActionDate.split(' ')[0] + ',';
							text += act.user.FirstName + ' ' + act.user.LastName + ',';
							text += act.activity.Name + ',';
							text += act.Comment + ',';
							text += "\n";
						});


						download(text, $scope.student);
					};
					var download = function (text, student) {

						//console.log(text);
						var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
						element.setAttribute('download', 'ActivityFor-' + student.user.FirstName + '_' + student.user.LastName + '.csv');
						element.style.display = 'none';
						document.body.appendChild(element);
						element.click();
						document.body.removeChild(element);
					};


					//console.log($scope.student)// contains the student to display 

					$scope.$watch('student', function (newVal, oldVal) {

						$scope.schedule = newVal.classes;
						var parentName = newVal.GuardianName ? newVal.GuardianName.split(',') : ["No", " name"];
						$scope.parents = [{
								fn: parentName[0],
								ln: parentName[1],
								phone: newVal.GuardianPhone || "none",
								mphone: 'None',
								email: 'None'}];

						$scope.activities = newVal.user.activities_affected;

					});

					/*******************  Right Side Controllers*********************/
					$scope.currentDate;
					$scope.$watch("profileForm.date.$modelValue", function (newVal, oldVal) {
						//console.info("date changedto :" + newVal)
					});


					$scope.showDetail = false;
					$scope.toggleShowDetail = function (index) {
						$scope.showDetail = !$scope.showDetail;
						$scope.selected = $scope.activities[index];
					};

					$scope.showComment = false;
					$scope.toggleShowComment = function (index) {
						$scope.showComment = !$scope.showComment;
						$scope.selected = $scope.activities[index];
					};

					$scope.addComment = function () {
						var entry =
							{date: formatDate(new Date),
								activity: "comment",
								Comment: $scope.comment,
								taff: $rootScope.currentUser.FirstName + ' ' + $rootScope.currentUser.LastName};
						$scope.activities.push(entry);
						$scope.comment = '';
					};

					$scope.graduationYear = 2015 + (12 - parseInt($scope.student.Grade, 10));

					function formatDate(date) {
						return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
					}

					$scope.filter = [];
					$scope.getActivities = function () {
						return ($scope.activities || []).map(function (w) {
							return w.activity.Name;
						}).filter(function (w, idx, arr) {
							return arr.indexOf(w) === idx;
						});
					};

					$scope.filterByCategory = function (act) {
						return $scope.filter[act.activity.Name] || noFilter($scope.filter);
					};
					// date selected on the checkboxes;
					function noFilter(filterObj) {
						for (var key in filterObj) {
							if (filterObj[key]) {
								return false;
							}
						}
						return true;
					}


				}]);

}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('student', {
					abstract: true,
					url: "/student",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationStudentCtrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('student.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin1/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin1Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				});

				
		}]);

}(angular.module('Argus')));
(function (app) {
	"use strict";
	app.controller('NavigationSupportStaffCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
//			{
//				id: 'Dashboard',
//				text: ['Dashboard', 'System'],
//				route: path + 'referal.html',
//				link: "supportstaff.dashboard",
//				icon: 'dashboard fa-2x'
//			}, 
{
				id: 'ORoom Activity Log',
				text: ['Oroom', 'Activity', 'log'],
				link: "supportstaff.oroomActivitiLog",
				icon: 'user fa-2x'
			}
		];
	});
}(angular.module('Argus')));


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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('supportstaff.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin1/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin1Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('supportstaff.oroomActivitiLog', {
					url: "/OroomActivityLog",
					templateUrl: 'views/admin2/oroomActivityLogSupport.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogCtrl',
					resolve: {
					}
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
/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationTeacherCtrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin1.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'Student Data',
				link: "admin1.studentData",
				icon: 'user fa-2x'
			}
		];
	});
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('teacher', {
					abstract: true,
					url: "/teacher",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationTeacherCtrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('teacher.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin1/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin1Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				});

		}]);

}(angular.module('Argus')));

/* global angular */

(function (app) {
	app.controller('ISSRosterController', ['$scope', 'notify', '$modal', 'ISSService',
		function ($scope, notify, $modal, isss) {
			$scope.getList = function () {
				$scope.iss = isss.query({roster: true}, function (data) {
					angular.forEach(data, function (item) {
						if (item.counters.ORoomsToBeServed > 0) {
							item.overlap = {class: 'bg-danger', msg: 'Has ORoom'};
						}

					});

					angular.forEach(data, function (item) {
						angular.forEach(item.referred, function (ref) {
							if (ref.ReferralTypeId === 12) {
								item.overlap = {class: 'bg-warning', msg: 'Has AEC'};
							}
						});

					});

					angular.forEach(data, function (item) {
						if (item.counters.OSSPMP > 0) {
							item.overlap = {class: 'bg-danger', msg: 'Has OSS'};
						}

					});
				});
			};
			$scope.getList();

			$scope.issAttendance = function (student, $index) {


				var overlap = false;
				var overlapPlace = '';

				if (student.counters.OSSPMP > 0) {
					overlapPlace = 'OSS';
					overlap = true;
				}
				if (!!student.overlap && student.overlap.msg === 'Has AEC') {
					// show present for AEC
				}


				if (overlap) {
					modalInstance = $modal.open({
						templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", "activity", function ($scope, student, activity) {
							$scope.student = student;
							console.log(student);
							$scope.activity = activity;
						}],
						resolve: {
							student: function () {
								return student;
							},
							activity: function () {
								return overlapPlace;
							}
						}
					});
					return;
				}

				var modalInstance = $modal.open({
					templateUrl: 'views/modals/attendanceISSModal.html',
					//template:'<div> MODAL : true in Referral IN </div>',
					size: 'lg',
					controller: ["$scope", "student", "PeriodsService", function ($scope, student, PeriodsService) {
						$scope.periods = PeriodsService.query();
						$scope.student = student;
					}],
					resolve: {
						student: function () {
							return student;
						}
					}
				});

				modalInstance.result.then(function () {// on SUBMIT
					// post the comment and other things to the database 
					isss.update({id: student.referred[0].Id}, {
						ActionType: student.radioModel,
						Comment: student.comment,
						StudentId: student.StudentId
					}, function (data) {
						notify(data.msg);
						$scope.iss.splice($index, 1);
					}, function (error) {
						notify('error');
					});


					//$scope.selected.student = null;
				}, function () {// on modal DISMISS

				});



			};

			$scope.printList = function () {
				var heading = 'First Name, Last Name, Student ID, 1st Per., 2nd Per., Ref. Type, '
					+ 'ISS Days, ORM Days, Overlap, Attendance,  \n';
				var text = heading;
				angular.forEach($scope.iss, function (item) {
					text += item.user.FirstName + ', ' + item.user.LastName + ', ';
					text += item.StudentId + ',' + item.classes[0].professor_class.room.Name + ',' + item.classes[1].professor_class.room.Name + ',';
					text += item.referred[0].referral_type.Name + ', ';
					text += item.counters.ISSDays + ', ';
					text += item.counters.ORoomsToBeServed + ', ';
					text += item.overlap.msg + ',';
					text += item.referred[0].activity.Name;

					text += '\n';
				});

				$scope.download(text, 'ISS');
			};

		}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	app.controller('LunchDetentionRosterCtrl', ['$scope', 'notify', '$modal', 'LunchService', '$rootScope',
		function ($scope, notify, $modal, lunchs, $rootScope) {
			lunchs.query({roster: true}, function (data) {
				$scope.lunchTableA = [];
				$scope.lunchTableB = [];
				$scope.lunchTableC = [];
				$scope.lunchTable = data;
				$scope.ngOptions = {data: 'ngData'};
				$scope.ngOptions2 = {
					data: 'lunchTable',
					showGroupPanel: true,
					jqueryUIDraggable: true
				};

				angular.forEach(data, function (item, $index) {

					if (item.LunchType === 'A Lunch')
						$scope.lunchTableA.push(item);
					else if (item.LunchType === 'B Lunch')
						$scope.lunchTableB.push(item);
					else
						$scope.lunchTableC.push(item);

					if (item.counters.ISSDays > 0) {
						item.overlap = {class: 'bg-danger', msg: 'Has ISS'};
//						var referred = [];
//						angular.forEach(item.referred , function(ref){
//							if((ref.ReferralTypeId === 5 || ref.ReferralTypeId === 6 || ref.ReferralTypeId === 7 || ref.ReferralTypeId === 17 ))
//								referred.push(ref);
//						});
						//item.referred = referred;
					}

				});

			}, function () {
				notify('error');
			});

			$scope.lunchAttendance = function (student, $index) {
				console.log('lunch attendance');
				var modalInstance;

				var overlap = false;
				var overlapPlace = '';


				if (student.counters.ISSDays > 0) {
					overlapPlace = 'ISS';
					overlap = true;
				}
//				if (student.counters.OSSPMP > 0) {
//					overlapPlace = 'OSS';
//					overlap = true;
//				}


				if (overlap) {
					modalInstance = $modal.open({
						templateUrl: 'views/modals/AttendanceUnavailableModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", "activity", function ($scope, student, activity) {
							$scope.student = student;
							console.log(student);
							$scope.activity = activity;
						}],
						resolve: {
							student: function () {
								return student;
							},
							activity: function () {
								return overlapPlace;
							}
						}
					});
					return;
				}


				modalInstance = $modal.open({
					templateUrl: 'views/modals/attendanceLunchModal.html',
					//template:'<div> MODAL : true in Referral IN </div>',
					size: 'lg',
					controller: ["$scope", "student", "PeriodsService", function ($scope, student, PeriodsService) {
						$scope.periods = PeriodsService.query();
						$scope.student = student;
					}],
					resolve: {
						student: function () {
							return student;
						}
					}
				});

				modalInstance.result.then(function () {// on SUBMIT
					// post the comment and other things to the database 
					lunchs.update({id: student.referred[0].Id, attendance: true}, {
						ActionType: student.radioModel,
						Comment: student.comment,
						StudentId: student.Id
					}, function (data) {
						notify(data.msg);
						if ($rootScope.currentUser.SchoolId === 2) {// dunbar
							$scope.lunchTable.splice($index, 1);
							return;
						}

						var lunch = student.LunchType;
						if (lunch === 'A Lunch') {
							$scope.lunchTableA.splice($index, 1);
						} else if (lunch === 'B Lunch') {
							$scope.lunchTableB.splice($index, 1);
						} else {
							$scope.lunchTableC.splice($index, 1);
						}
						if ($rootScope.currentUser.SchoolId !== 1) {
							$scope.lunchTable.splice($index, 1);
						}
					}, function (error) {
						notify('error');
					});



				}, function () {// on modal DISMISS

				});


			};
			$scope.printListAll = function () {
				var heading = 'First Name,' + 'Last Name,' + 'Student ID, ' +
					'Grade, ' + 'Attendance' + ', ' + 'Progression, Overlap\n';
				var text = heading;
				angular.forEach($scope.lunchTable, function (item) {
					text += item.user.FirstName + ', ' + item.user.LastName + ', ';
					text += item.StudentId + ',' + item.Grade + ', ';
					text += item.activity ? item.activity.Name : '' + ', ' + (item.referred[0] ? item.referred[0].referral_type.Name : '');
					text += ',' + (item.overlap ? item.overlap.msg : '');
					text += '\n';
				});
				notify('printing');
				$scope.download(text);
			};

			$scope.printEstacado = function () {

			};
		}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	app.controller('OSSRosterController',
		['$scope', 'notify', '$modal', 'OSSService', 'FormatTimeService', 'ISSService', 'CountersService',
			function ($scope, notify, $modal, osss, time, isss, counters) {
				$scope.oss = osss.query({roster: true}, function (data) {
					angular.forEach(data, function (item) {
						item.Date = time.formatDate(new Date(item.Date));
					});
				}, function () {
					notify('error');
				});

				$scope.ossAttendance = function (student, $index) {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/parentMeetingAttendaceModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", "teachers", function ($scope, student, teachers) {
							$scope.student = student;
							$scope.currentDate = new Date();
							$scope.teachers = teachers.query();
							$scope.$watch('form.date.$viewValue', function (newV, oldV) {
								student.date = newV ? newV : oldV;
								console.log(newV);
							});
						}],
						resolve: {
							student: function () {
								return student;
							}
						}
					});

					modalInstance.result.then(function (data) {
						switch (student.radioModel) {
							case '1':
								counters.update({id: student.student_user.id},
								{counters: student.student_user.student.counters,
									Comment: student.comment
								}, function () {
									notify('success');
									osss.update({id: student.Id},
									{ OssPresent: true});

								}, function (error) {
									notify('error');
								});
								break;
							case '2':
								osss.update({id: student.Id},
								{
									Comment: student.comment
								}, function (data) {
									notify(data.msg);
								}, function (error) {
									notify('error');
								});
								break;
							case '3':
								isss.update({id: student.Id, followup: true}, {
									Date: student.date,
									Time: student.time,
									ActionType: 46,
									Comment: student.comment,
									StudentId: student.StudentId,
									TeacherId: student.teacher.id
								}, function (data) {
									notify(data.msg);
									$scope.oss.splice($index, 1);
								}, function (error) {
									notify('error');
								});
								break;
						}
						$scope.oss.splice($index, 1);
					});

//				osss.update({id:student.Id, attendance:true}, {
//					ActionType:student.activity.Id
//				});


				};

			}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	app.controller('OroomRosterCtrl', ['$scope', 'notify', '$modal', 'OroomService', "AECListService",
		function ($scope, notify, $modal, orooms, aec) {
			//$scope.currentDate = new Date();


			$scope.getList = function () {
				orooms.get({roster: true}, function (data) {
					$scope.refTable = data.OroomList;
					$scope.count.oroom = data.OroomList.length;
//				angular.forEach(data.OroomList, function (item) {
//					if (item.counters.ISSDays > 0) {
//						item.overlap = {class: 'bg-danger', msg: 'Has ISS'};
//						var referred = [];
//						angular.forEach(item.referred , function(ref){
//							if((ref.ReferralTypeId === 5 || ref.ReferralTypeId === 6 || ref.ReferralTypeId === 7 || ref.ReferralTypeId === 17 ))
//								referred.push(ref);
//						});
//						item.referred = referred;
//					}
//				});
					var to_remove_indexes = [];
					angular.forEach(data.OroomList, function (item, $index) {


						var referred = [];
						var hasOroom = false;
						angular.forEach(item.referred, function (ref, $index) {
							if (ref.ReferralTypeId === 12) {
								item.overlap = {class: 'bg-warning', msg: 'Has AEC'};
							}

						});
						var hasiss = false;
						angular.forEach(item.referred, function (ref, $index) {
							
							if ((ref.ReferralTypeId === 5 || ref.ReferralTypeId === 6 || ref.ReferralTypeId === 7
								|| ref.ReferralTypeId === 10 || ref.ReferralTypeId === 17 || ref.ReferralTypeId === 15 )) {
									hasiss = true;
									item.overlap = {class: 'bg-danger', msg: 'Has ISS'};
							}
							referred.push(ref);

							if ((ref.ReferralTypeId === 1 || ref.ReferralTypeId === 2 || ref.ReferralTypeId === 3 || ref.ReferralTypeId === 16 || ref.ReferralTypeId === 10 || ref.ReferralTypeId === 19)) {
								
								hasOroom = true;
							}

						});
						if(hasiss){
							console.log('Has ISS');
							console.log(item);
						}

						
						
						
						if (!hasOroom) {
							console.log('doesnt have oroom');
							to_remove_indexes.push($index);
						}
						item.referred = referred;

					});

					angular.forEach(to_remove_indexes, function (index, $index) {
						console.log(data.OroomList[index]);
						data.OroomList.splice(index, 1);
					});

					console.log(data.OroomList);
				});
			};
			$scope.getList();
			$scope.oRoomAttendance = function (student, $index) {
				var modalInstance;
				console.log('o-room attendance');

				var overlap = false;
				var overlapPlace = '';

				if (student.counters.ISSDays > 0) {
					overlapPlace = 'ISS';
					overlap = true;
				}
//					if (student.counters.OSSPMP > 0) {
//						overlapPlace = 'OSS';
//						overlap = true;
//					}

				if (overlap) {
					modalInstance = $modal.open({
						templateUrl: 'views/modals/AttendanceUnavailableModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", "activity", function ($scope, student, activity) {
							$scope.student = student;
							console.log(student);
							$scope.activity = activity;
						}],
						resolve: {
							student: function () {
								return student;
							},
							activity: function () {
								return overlapPlace;
							}
						}
					});
					return;
				}

				//
				modalInstance = $modal.open({
					templateUrl: 'views/modals/attendanceOroomModal.html',
					//template:'<div> MODAL : true in Referral IN </div>',
					size: 'lg',
					controller: ["$scope", "student", "PeriodsService", function ($scope, student, PeriodsService) {
						$scope.periods = PeriodsService.query();
//						student.hasAEC = false;
//						$scope.showAssignments = false;
//						if(student.overlap && student.overlap.msg === 'Has AEC'){
//							console.log('this student has AEC');
//							student.hasAEC = true;
//						}
//						$scope.referredAEC = 1;
//						
//						$scope.$watch('student.radioModel', function(n,o){
//							if(n && n == 24 && student.hasAEC ){
//								$scope.showAssignments = true;
//							}else{
//								$scope.showAssignments = false;
//							}
//						})
						
						$scope.student = student;
					}],
					resolve: {
						student: function () {
							return student;
						}
					}
				});

				modalInstance.result.then(function () {// on SUBMIT
					// post the comment and other things to the database 
					
					if(student.radioModel == 24 && student.hasAEC){
						
						var aecPresent = '49';
						var comment = student.comment || '';
						angular.forEach(student.referred, function(item){
							if(item.ReferralTypeId !== 12)
								return;
							console.log(item);
							if(item.assignment.selected){
								comment += '(' + item.assignment.Name +' completed)';
							}else{
								comment += '(' + item.assignment.Name +' incomplete)';
							}
						});
						student.comment = comment;
						console.log(student.comment);
						
					}
					
					
					orooms.update({id: student.referred[0].Id, attendance: true}, {
						ActionType: student.radioModel,
						Comment: student.comment,
						StudentId: student.id
					}, function (data) {
						notify(data.msg);
					}, function (error) {
						notify('error, Before continuing please contact an admin');
					});

					$scope.refTable.splice($index, 1);
					//$scope.selected.student = null;
				}, function () {// on modal DISMISS

				});

			};

			$scope.printList = function () {
				var heading = 'First Name, Last Name, Student ID, Pending Days, Referral Type, 8th period, Attendance\n';
				var text = heading;
				angular.forEach($scope.refTable, function (item) {
					text += item.user.FirstName + ', ' + item.user.LastName + ', ';
					text += item.user.UserName + ',' + item.counters.ORoomsToBeServed + ', ';
					text += item.referred[0].referral_type.Name + ', ';
					text += item.classes[7] ? item.classes[7].professor_class.room.Name : 'N/A';

					text += '\n';
				});

				$scope.download(text, 'O-Room');
			};
		}]);
}(angular.module('Argus')));

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('attendanceRostersCtrl',
		['$scope', '$modal', 'notify',  'StudentsService','OroomService', 'LunchService','ISSService','OSSService',
			function ($scope, $modal, notify, students, orooms, lunchs, isss, osss) {
				$scope.currentList = 'oroom';
				$scope.count =  {};
				$scope.refTable = [];
				$scope.lunchTableA = [];
				$scope.lunchTableB = [];
				$scope.iss = [];
				$scope.oss = [];
				$scope.currentDate = formatDate(new Date());

				$scope.activities = [
					{name: "Present", Id: 38},
					{name: "No Show", Id: 39},
					{name: "Left School", Id: 40},
					{name: "School Absent", Id: 41},
					{name: "Sent Out", Id: 42},
					{name: "Walked Out", Id: 42},
					{name: "Other", Id: 44}
				];
				$scope.download = function (text,type) {
					type = type? type:'';
					//console.log(text);
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
					element.setAttribute('download', 'roster'+type+'.csv');
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				};
				
				lunchs.query({roster:true},function(data){ $scope.count.lunch = data.length;});
				orooms.get({count:true}, function(data){ $scope.count.oroom = data.OroomList;});
				isss.get({roster:true, count:true}, function(data){$scope.count.iss = data.count;});
				osss.get({roster:true, count:true}, function(data){$scope.count.oss = data.count;});
			}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	app.controller('ReportsAtRiskCtrl', ['$scope', 'notify','$modal', function ($scope, notify,$modal) {
			notify('ReportsAtRiskCtrl');
			$scope.eodReports = [
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'Reteach', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			$scope.eod.selected = {name:0, value:0 };
			
			angular.forEach($scope.eod.issStudents, function(item){
				item.class = 'bg-danger';
			});
		}]);
}(angular.module('Argus')));

/* global angular */

(function (app) {
	app.controller('ReportsCtrl', ['$scope', 'notify','$modal', function ($scope, notify,$modal) {
			$scope.eod = {};
			$scope.eod.issStudents = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				
				
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  }
				
			];
		}]);
}(angular.module('Argus')));

/* global angular */

(function (app) {
	app.controller('ReportsEODCtrl',
		['$scope', 'notify', '$modal', '$http', 'FormatTimeService', '$rootScope',
			function ($scope, notify, $modal, $http, time, $rootScope) {
				$scope.eodReports = [
					{name: 'AEC', value: 1, url: 'report-eod-aec'},
					{name: 'O-Room', value: 2, url: 'report-eod-oroom'},
//					{name: 'Reteach', value: 3, url:'report-eod-reteach'},
					{name: 'ISS', value: 4, url: 'report-eod-iss'},
					{name: 'OSS PMP', value: 5, url: 'report-edo-oss'},
					{name: 'Lunch', value: 6, url: 'report-eod-lunchd'}
				];
				$scope.eod = {};
				$scope.eod.selected = $scope.eodReports[1];
				$scope.eodCounters = {
					expected: 0,
					present: 0,
					noShows: 0,
					sentOuts: 0,
					walkedOuts: 0,
					schoolAbsent: 0,
					leftSchool: 0,
					other: 0
				};
				$scope.percentages = {
					todays: 0,
					averageThusFar: 0,
					difference: 0
				};
				$scope.currentDate = new Date();
				$scope.$watch('date.date.$viewValue', function (newValue, oldValue) {
					if (newValue) {
						date = time.formatDate(new Date(newValue));
						$scope.reportChanged();
					}
				});
				$scope.reportChanged = function () {
					$http.get('api/' + $scope.eod.selected.url + '?date=' + date).then(processResponse, function () {
						notify('error');
					});
				};
				
				function processResponse(response) {
					var list = response.data;
					$scope.orooms = list;
					$scope.eodCounters.expected = list.length;
					angular.forEach(list, function (item) {
						if (item.student.SchoolId !== $rootScope.currentUser.SchoolId)
							console.log(item);
						switch ($scope.eod.selected.value) {
							case 1:
								checkAEC(item.ActionType);
								break;
							case 2:
								checkOroom(item.ActionType);
								break;
							case 4:
								checkISS(item.ActionType);
								break;
							case 5:
								checkOSS(item.ActionType);
								break;
							case 6:
								checkLunchD(item.ActionType);
								break;
						}



					});
					var i = 0;
					angular.forEach($scope.eodCounters, function (item, key) {
						if (item !== list.length)
							$scope.flotPieData[i++].data = item;
					});
					console.log($scope.eodCounters);
				}

				function checkOroom(actionTypeId) {
					switch (actionTypeId) {
						case 24:
							$scope.eodCounters.present++;
							break;
						case 25:
							$scope.eodCounters.noShows++;
							break;
						case 28:
							$scope.eodCounters.sentOuts++;
							break;
						case 29:
							$scope.eodCounters.walkedOuts++;
							break;
						case 27:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 26:
							$scope.eodCounters.leftSchool++;
							break;
						case 30:
							$scope.eodCounters.other++;
							break;
					}
				}
				function checkAEC(actionTypeId) {
					switch (actionTypeId) {
						case 24:
							$scope.eodCounters.present++;
							break;
						case 25:
							$scope.eodCounters.noShows++;
							break;
						case 28:
							$scope.eodCounters.sentOuts++;
							break;
						case 29:
							$scope.eodCounters.walkedOuts++;
							break;
						case 27:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 26:
							$scope.eodCounters.leftSchool++;
							break;
						case 30:
							$scope.eodCounters.other++;
							break;
					}
				}
				function checkISS(actionTypeId) {
					switch (actionTypeId) {
						case 38:
							$scope.eodCounters.present++;
							break;
						case 39:
							$scope.eodCounters.noShows++;
							break;
						case 42:
							$scope.eodCounters.sentOuts++;
							break;
						case 43:
							$scope.eodCounters.walkedOuts++;
							break;
						case 41:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 40:
							$scope.eodCounters.leftSchool++;
							break;
						case 47:
							$scope.eodCounters.other++;
							break;
					}
				}
				function checkOSS(actionTypeId) {
					switch (actionTypeId) {
						case 24:
							$scope.eodCounters.present++;
							break;
						case 25:
							$scope.eodCounters.noShows++;
							break;
						case 28:
							$scope.eodCounters.sentOuts++;
							break;
						case 29:
							$scope.eodCounters.walkedOuts++;
							break;
						case 27:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 26:
							$scope.eodCounters.leftSchool++;
							break;
						case 30:
							$scope.eodCounters.other++;
							break;
					}
				}
				function checkLunchD(actionTypeId) {
					switch (actionTypeId) {
						case 31:
							$scope.eodCounters.present++;
							break;
						case 32:
							$scope.eodCounters.noShows++;
							break;
						case 35:
							$scope.eodCounters.sentOuts++;
							break;
						case 36:
							$scope.eodCounters.walkedOuts++;
							break;
						case 34:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 33:
							$scope.eodCounters.leftSchool++;
							break;
						case 37:
							$scope.eodCounters.other++;
							break;
					}
				}

				$scope.flotPieData = [
//				{
//					label: "Expected",
//					data: 5,
//					color: "#d3d3d3"
//				},
					{
						label: "Present",
						data: 5,
						color: "#bababa"
					},
					{
						label: "No Show's",
						data: 5,
						color: "#79d2c0"
					},
					{
						label: "Sent Out's",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "Walked Out's",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "School Absent",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "Left School",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "Other",
						data: 5,
						color: "#1ab394"
					}

				];
				/**
				 * Pie Chart Options
				 */
				$scope.flotPieOptions = {
					series: {
						pie: {
							show: true
						}
					},
					grid: {
						hoverable: true
					},
					tooltip: true,
					tooltipOpts: {
						content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
						shifts: {
							x: 20,
							y: 0
						},
						defaultTheme: true
					}
				};
				angular.forEach($scope.eod.issStudents, function (item) {
					if (item.Attendance === 'Absent')
						item.class = 'bg-gray';
					else if (item.Attendance === 'Sent-Out')
						item.class = 'bg-danger';
					else
						item.class = 'bg-green';
				});
			}]);
}(angular.module('Argus')));


/* global angular */

(function (app) {
	app.controller('ReportsOroomActivityCtrl', ['$scope', 'notify', '$modal', '$http', 'FormatTimeService', '$rootScope',
		function ($scope, notify, $modal, $http, time, $rootScope) {
			$scope.currentDate = new Date();
			$scope.list = [];
			$scope.counters = {};
			$scope.activities = [{Name: "In O-Room", Id: 1},
				{Name: "Assign ISS", Id: 2},
				{Name: "Walked-Out", Id: 3},
				{Name: "No Show", Id: 4},
				{Name: "Other", Id: 5}
			];
			$scope.$watch('date.date.$viewValue', function (newValue, oldValue) {
				if (newValue) {
					var date = time.formatDate(new Date(newValue));
					$http.get('/api/report-oroomactivity' + '/?date=' + date).then(function (response) {

						$scope.counters = {
							students: 0,
							referredIn: 0,
							inOroom: 0,
							assignISS: 0,
							walkedOuts: 0,
							noShows: 0,
							other: 0
						};
						$scope.list = response.data;
						$scope.counters.students = response.data.length;
						angular.forEach($scope.list, function (item) {

							if (item.ReferralIn === 1) {
								$scope.counters.referredIn++;
							}
							switch (item.activity.Id) {
								case 1:
									$scope.counters.inOroom++;
									break;
								case 2:
									$scope.counters.assignISS++;
									break;
								case 3:
									$scope.counters.walkedOuts++;
									break;
								case 4:
									$scope.counters.noShows++;
									break;
								case 5:
									$scope.counters.other++;
									break;
							}
						});
						var i = 0;
						angular.forEach($scope.counters, function (item, key) {
							if (key !== 'students' && key !== 'referredIn')
								$scope.flotPieData[i++].data = item;
							else if (key === 'referredIn' ){
								$scope.flotPieDataReferralIn[0].data = item;
								$scope.flotPieDataReferralIn[1].data=  $scope.counters.students-item;
							}
						});
					});

				}
			});

			$scope.flotPieData = [
				{
					label: "In Oroom",
					data: 5,
					color: "#bababa"
				},
				{
					label: "Assign ISS",
					data: 5,
					color: "#79d2c0"
				},
				{
					label: "Walked Out's",
					data: 5,
					color: "#1ab394"
				},
				{
					label: "No Show",
					data: 5,
					color: "#1ab394"
				},
				{
					label: "Other",
					data: 5,
					color: "#1ab394"
				}
			];
			$scope.flotPieDataReferralIn = [
				{
					label: "YES",
					data: 5,
					color: "#bababa"
				},
				{
					label: "NO",
					data: 5,
					color: "#79d2c0"
				}
			];

			/**
			 * Pie Chart Options
			 */
			$scope.flotPieOptions = {
				series: {
					pie: {
						show: true
					}
				},
				grid: {
					hoverable: true
				},
				tooltip: true,
				tooltipOpts: {
					content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
					shifts: {
						x: 20,
						y: 0
					},
					defaultTheme: true
				}
			};




		}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	app.controller('ReportsProgressionCtrl', ['$scope', 'notify', '$modal', function ($scope, notify, $modal) {
			notify('ReportsProgressionCtrl');
			$scope.startingPoints = [
				{name: 'Reteach', value: 1},
				{name: 'AEC', value: 1},
				{name: 'O-Room', value: 2},
				{name: 'O-Room+1', value: 3},
				{name: 'ISS', value: 4},
				{name: 'OSS PMP', value: 5}
			];



			$scope.starting = undefined;
			$scope.eod.issStudents1 = [
				{StudentId: '100109607', FirstName: 'Mark', LastName: 'Gonzales', Date: '12/10/2015'},
				{StudentId: '100131423', FirstName: 'Adrian ', LastName: 'Black', Date: '12/10/2015', class: 'bg-warning'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/10/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/10/2015'},
				{StudentId: '102234384', FirstName: 'Henry ', LastName: 'Lopez', Date: '12/10/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/10/2015'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/10/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/10/2015'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/10/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/10/2015'}];

			$scope.eod.issStudents2 = [
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/11/2015'},
				{StudentId: '102234384', FirstName: 'Henry ', LastName: 'Lopez', Date: '12/11/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/11/2015'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/11/2015'},
				{StudentId: '100344318', FirstName: 'Adrian ', LastName: 'Black', Date: '12/11/2015', class: 'bg-warning'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/11/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/11/2015'}];


			$scope.eod.issStudents3 = [
				{StudentId: '100109607', FirstName: 'Mark', LastName: 'Gonzales', Date: '12/12/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/12/2015'},
				{StudentId: '100131834', FirstName: 'Adrian ', LastName: 'Black', Date: '12/12/2015', class: 'bg-warning'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/12/2015'},
				{StudentId: '102234384', FirstName: 'Henry ', LastName: 'Lopez', Date: '12/12/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/12/2015'}];


			$scope.eod.issStudents4 = [
				{StudentId: '100109607', FirstName: 'Mark', LastName: 'Gonzales', Date: '12/13/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/13/2015'},
				{StudentId: '100131834', FirstName: 'Adrian ', LastName: 'Black', Date: '12/13/2015', class: 'bg-warning'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/13/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/13/2015'}];

			$scope.eod.issStudents5 = [
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/14/2015'},
				{StudentId: '100131834', FirstName: 'Adrian ', LastName: 'Black', Date: '12/14/2015', class: 'bg-warning'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/14/2015'}];
			$scope.selected = $scope.eod.issStudents1[1];
		}]);
}(angular.module('Argus')));

/* global angular */

(function (app) {
	app.controller('IssFollowupListCtrl', 
	['$scope', 'notify','ISSService','$modal', function ($scope, notify, isss, $modal) {
			$scope.iss = isss.query({followup:true});
			
			$scope.issFollowupAttendance = function (student,$index) {
				var modalInstance = $modal.open({
					templateUrl: 'views/modals/ISSFollowupModal.html',
					//template:'<div> MODAL : true in Referral IN </div>',
					size: 'lg',
					controller: ["$scope", "student", "teachers", function ($scope, student, teachers) {
						$scope.student = student;
						$scope.currentDate = new Date();
						$scope.teachers = teachers.query();
						$scope.$watch('form.date.$viewValue', function(newV, oldV){
							student.date = newV?newV:oldV;
							console.log(newV);
						});
					}],
					resolve: {
						student: function () {
							return student;
						}
					}
				});

				modalInstance.result.then(function () {// on SUBMIT
					// post the comment and other things to the database 
					isss.update({id:student.Id ,followup:true },{
						Date: student.date,
						Time: student.time,
						ActionType: 46,
						Comment: student.comment,
						StudentId: student.StudentId,
						TeacherId: student.teacher.id
					}, function(data){
						notify(data.msg);
						$scope.iss.splice($index,1);
					}, function(error){
						notify('error');
					});

					 
					//$scope.selected.student = null;
				}, function () {// on modal DISMISS

				});
				
				
				
			};
		}]);
}(angular.module('Argus')));


/* global angular */

(function (app) {
	app.controller('IssListCtrl', ['$scope', 'notify', '$modal', 'ISSService',
		function ($scope, notify, $modal, isss) {
			$scope.iss = isss.query({roster: true});
			
			$scope.getISSList = function(){
				$scope.iss = isss.query({roster: true});
			};
			$scope.activities = [
				{name: "Present", Id:38 },
//				{name: "No Show", Id: 12},
				{name: "Left School", Id: 40},
				{name: "School Absent", Id: 41},
				{name: "Sent Out", Id: 42},
				{name: "Walked Out", Id: 43}
			];

			$scope.issAttendance = function (item,  oldActValue) {
				//oldActValue = oldActValue?angular.fromJson(oldActValue) : '';
				
//				if(item.activity.Id === 13 || item.activity.Id === 14  ){
//					var confirmation = confirm('Are you sure the student activity is '+ item.activity.name
//						+ '. A push notification will be sent to all users');
//					
//					if(!confirmation){
//						item.activity = oldActValue;
//						return;
//					}
					
//					var modalInstance = $modal.open({
//						templateUrl: 'views/modals/ISSNotificationDocumentationModal.html',
//						size: 'lg',
//						controller:function($scope, student){
//							$scope.student  = student;
//							$scope.title = 'ISS'
//						},
//						resolve: {
//							student :function(){return item;}
//						}
//					});
//					
//					modalInstance.result.then(function(data){
//						// submit notification
//					});
//				
//					
//				
//				
//				
				
				//}
				
				if (!item) {
					isss.update({id: item.referred[0].Id, attendance: true}, {
						ActivityTypeId: 0
					});
					return;
				}
				//console.log(item);
				isss.update({id: item.referred[0].Id, attendance: true}, {
					ActivityTypeId: item.activity? item.activity.Id:0
				});

			};
		}]);
}(angular.module('Argus')));
 
/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationISSCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			
			{
				id: 'ISS List',
				link: "iss.Lists.iss",
				icon: 'list-alt fa-2x'
			}, {
				id: 'ISS Followup List',
				link: "iss.pending",
				icon: 'exclamation fa-2x'
			}
		];
	});
}(angular.module('Argus')));


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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				
				.state('iss.Lists', {
					url: '/ISSList',
					templateUrl:  'views/iss/Lists.html',
					data: {pageTitle: 'Lists'},
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				});
		}]);


}(angular.module('Argus')));
			
/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationDataStaffCtrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
//			{
//				id: 'Dashboard',
//				link: "admin1.dashboard",
//				icon: 'dashboard fa-2x'
//			}, {
//				id: 'Referral System',
//				link: "admin1.referral",
//				icon: 'eye fa-2x'
//			},
//			{
//				id: 'AEC List',
//				link: "admin1.AECList",
//				icon: 'list-alt fa-2x'
//			}, {
//				id: 'Absence List',
//				link: "admin1.pending",
//				icon: 'exclamation fa-2x'
//			}, {
//				id: 'Student Data',
//				link: "admin1.studentData",
//				icon: 'user fa-2x'
//			}, {
//				id: 'ORoom Activity Log Admin',
//				link: "admin1.oroomActivityLogAdmin",
//				icon: 'user fa-2x'
//			}, {
//				id: 'ORoom Activity Log',
//				link: "admin1.oroomActivitiLog.oroom",
//				icon: 'user fa-2x'
//			}, {
//				id: 'ORoom Coordinator Referral',
//				link: "admin1.CoordinatorReferralSystem",
//				icon: 'user fa-2x'
//			},
//			{
//				id: 'Attendance Rosters',
//				link: "admin1.attendanceRosters.oroom",
//				icon: 'user fa-2x'
//			},
			 {
				id: 'Reports',
				link: 'datastaff.reports.eod',
				icon: 'file fa-2x'
			}
		];
	}); 
}(angular.module('Argus')));


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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							])
								;
						}]
					}
				})
				.state('datastaff.reports.eod', {
					url: '/EOD',
					templateUrl: 'views/reports/reports.eod.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsEODCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('datastaff.reports.oroomActivity', {
					url: '/OroomActivity',
					templateUrl: 'views/reports/reports.oroomActivity.html',
					data: {pageTitle: 'OroomActivity'},
					controller: 'ReportsOroomActivityCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
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
(function (app) {
	app.controller('ActivitiesCtrl', ['$scope', function ($scope) {
			
		}]);
}(angular.module('Argus')));

(function (app) {
	"use strict";
	app.controller('NavigationSysAdminCtrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "sysadmin.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'Referrals',
				link: "sysadmin.referrals",
				icon: 'eye fa-2x'
			}, {
				id: 'User Activities',
				link: "sysadmin.activities",
				icon: 'eye fa-2x'
			}, {
				id: 'Users',
				link: "sysadmin.users",
				icon: 'eye fa-2x'
			},{
				id: 'AEC Referral System',
				link: "sysadmin.referral",
				icon: 'eye fa-2x'
			},{
				id: 'AEC List',
				link: "sysadmin.AECList",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Follow-up List',
				link: "sysadmin.pending",
				icon: 'exclamation fa-2x'
			}
//			{
//				id: 'Student Data',
//				link: "sysadmin.studentData",
//				icon: 'user fa-2x'
//			}
			, {
				id: 'ORoom Activity Log',
				link: "sysadmin.oroomActivityLogAdmin",
				icon: 'tasks fa-2x'
			}, {
				id: 'Live Activity Log',
				link: "sysadmin.oroomActivitiLog.oroom",
				icon: 'user fa-2x'
			}, {
				id: 'ORoom Coordinator Referral',
				link: "sysadmin.CoordinatorReferralSystem",
				icon: 'pencil-square-o fa-2x'
			},{
				id: 'Attendance Rosters',
				link: "sysadmin.attendanceRosters.oroom",
				icon: 'list-alt fa-2x'
			},{
				id: 'Reports',
				link: 'sysadmin.reports',
				icon: 'area-chart fa-2x'
			}
		];
	});
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsController', ['$scope', function ($scope) {

		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsEODController', ['$scope', "$timeout", function ($scope, $timeout) {

		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsProgressionController', ['$scope', '$timeout', function ($scope, $timeout) {

		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsAtRiskController', ['$scope', function ($scope) {

		}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	app.controller('ReferralsCtrl',
		['$scope', 'AdminReferralsService', 'SchoolsService', 'StudentsService', 'ActivitiesService', '$http',
			function ($scope, referrals, schools, students, activities, $http) {
				$scope.selected = {};
				$scope.referral = {};
				$scope.action = {};
				$scope.schools = schools.query();
				$scope.activities = activities.query();
				
				$scope.getSchoolStudents = function (school) {
					$scope.students = students.query({schoolId:school.Id});
				};
				
				$scope.getStudentsReferrals = function(student){
					$scope.referrals = referrals.query({id:student.Id});
				};
				$http.get('api/referraltypes').then(function (response) {
					$scope.referraltypes = response.data;
				});
				
				$scope.referralUpdate = function(referral){
					console.log(referral);
					
					// do an update request
				};
				
				$scope.selectItem = function(item){
					$scope.referral = item;
				};
				
				$scope.onDelete = function($index){
					console.log('referral Deleted')
				};
				
			}]);
}(angular.module('Argus')));

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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('sysadmin.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/sysadmin/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin1Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				
				.state('sysadmin.referrals', {
					url: "/Referrals",
					templateUrl: 'views/sysadmin/referrals.html',
					data: {pageTitle: 'Referral'},
					controller: 'ReferralsCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}

				})
				.state('sysadmin.activities', {
					url: "/Activities",
					templateUrl: 'views/sysadmin/activities.html',
					data: {pageTitle: 'Referral'},
					controller: 'ActivitiesCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}

				})
				.state('sysadmin.users', {
					url: "/Users",
					templateUrl: 'views/sysadmin/users.html',
					data: {pageTitle: 'Referral'},
					controller: 'ActivitiesCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}

				})
				
				
				.state('sysadmin.referral', {
					url: "/adminReferral",
					templateUrl: 'views/admin1/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'admin1referalController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}

				})
				.state('sysadmin.AECList', {
					url: "/AECList",
					templateUrl: 'views/sharedItems/manageAEC.html',
					data: {pageTitle: 'AEC List'},
					controller: 'manageAECController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}

				})
				.state('sysadmin.pending', {
					url: "/pending",
					templateUrl: 'views/sharedItems/manageAECabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'manageAECAbsenceController',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('sysadmin.studentData', {
					url: "/studentData",
					templateUrl: 'views/sharedItems/studentInfo.html',
					data: {pageTitle: 'Student Data'},
					controller: 'studentInfoCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}
							]);
						}]
					}
				})

				/* Attendance Rosters */
				.state('sysadmin.attendanceRosters', {
					url: "/attendanceRosters",
					templateUrl: 'views/admin2/attendanceRosters.html',
					data: {pageTitle: 'Referral'},
					controller: 'attendanceRostersCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
								}
							]);
						}]
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
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							])
								;
						}]
					}
				})
				.state('sysadmin.reports.eod', {
					url: '/EOD',
					templateUrl: 'views/reports/reports.eod.html',
					data: {pageTitle: 'Reports'},
					controller: 'ReportsEODCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('sysadmin.reports.oroomActivity', {
					url: '/OroomActivity',
					templateUrl: 'views/reports/reports.oroomActivity.html',
					data: {pageTitle: 'OroomActivity'},
					controller: 'ReportsOroomActivityCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
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
/* global angular */

(function (app) {
	app.controller('UsersCtrl', ['$scope', function ($scope) {
			
		}]);
}(angular.module('Argus')));



/* global angular */

(function(app){
	"use strict";  
	app.controller('DashReteachCtrl', ['$scope', '$modal', 'referrals', 'notify',
	function($scope, $modal, referrals, notify){
		
		 
		$scope.studentsToday =0;
		var date = Date();
		$scope.counters = {};
		var dateStr = date.substring(4,7) + ' '+date.substring(8,10) + ' '+date.substring(11,15);
		referrals.query({id:dateStr},function(data){
			$scope.counters.aec = data.length;
		});
		referrals.query({id:dateStr, absence:true},function(data){
			$scope.counters.aecAbsent = data.length;
		});
		
		$scope.downloadEODReport =function(){
			//notify({message:'t'});
			return;
		};
		
		/**
		 * Opens modal for average attendance
		 */
		$scope.openAverageAttendance = function () {
			$scope.studentsToday  = 0;
			$scope.FollowUp = 0;
			$scope.averageAttendance = 0;
			$scope.rating = 0;
			
			var averageAttendanceModal = $modal.open({
				templateUrl: 'averageAttendanceModal.html',
				size: 'lg',
				controller: ["$scope", "$modalInstance", "graphOptions", "graphData", "$timeout", function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				}],
				resolve: {
					graphOptions : function () { return $scope.lineOptions; },
					graphData: function () { return $scope.lineData; }
				}
			});// End assignmentsModal
		};
		/**
		 * Opens Modal for Rating's Modal
		 */
		$scope.openRating = function () {
			var ratingsModal = $modal.open({
				templateUrl: 'ratingsModal.html',
				size: 'lg',
				controller: ["$scope", "$modalInstance", "graphOptions", "graphData", "$timeout", function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				}],
				resolve: {
					graphOptions : function () { return $scope.lineOptions; },
					graphData: function () { return $scope.lineData; }
				}
			});// End assignmentsModal
		};
		
		/**
		 * Data for Line chart
		 */
		$scope.lineData = {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "Example dataset",
					fillColor: "rgba(185, 35, 34, .5)",
					strokeColor: "rgba(185, 35, 34, .8)",
					pointColor: "#B92322",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [0, 0, 0, 0, 0, 0, 0]
				}
			]
		};
		
		/**
		 * Options for Line chart
		 */
		$scope.lineOptions = {
			scaleShowGridLines: true,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineWidth: 1,
			bezierCurve: false,
			bezierCurveTension: 0.4,
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeWidth: 1,
			pointHitDetectionRadius: 20,
			datasetStroke: true,
			datasetStrokeWidth: 2,
			datasetFill: true
		};
		/**
		 * Data for Doughnut chart
		 */
		$scope.doughnutData = [
			{
				value: 300,
				color: "#2f4050",
				highlight: "#1ab394",
				label: "App"
			},
			{
				value: 50,
				color: "#2f4060",
				highlight: "#1ab394",
				label: "Software"
			},
			{
				value: 100,
				color: "#2f4070",
				highlight: "#1ab394",
				label: "Laptop"
			}
		];
		
		/**
		 * Options for Doughnut chart
		 */
		$scope.doughnutOptions = {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 45, // This is 0 for Pie charts
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false
		};
		
		/**
		 * List of the techer's tutors if any
		 */
		$scope.teachersTeam = [
			{fn:"Adrian Omar", ln:"Galicia Mendez", subjects:["Math", "Physics","Spanish"], days:["M","W", "Sat"], rate:9.5},
			{fn:"Brandon", ln:"Hernandez", subjects:["Math", "Physics","Chemistry", "Biology"], days:["T","Th", "F"], rate:8.9},
			{fn:"Jose", ln:"Martinez", subjects:["Math", "Physics","Computer Science"], days:["M","W", "Sat"], rate:2.1}
		];
		
	}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app
		.controller("ManageReteachAbsenceCtrl",
			["$scope", "$modal", "referrals", "PassesService", "UserActionsService", 'notify', 'ReteachAbsenceListService',
				function ($scope, $modal, referrals, passes, useractions, notify, aec) {
					$scope.selected = {};
					$scope.refTable = [];// table model
					$scope.currentDate = new Date(); // date on the date picker

					/**
					 * Watch for changes in the datepicker then load the AECAbsence list
					 */
					$scope.$watch('form.date.$viewValue', function (newVal, oldVal) {

						if (newVal) {//when date has a valid date request the List from that date
							$scope.currentDate = newVal;
							console.log("newVal = " + $scope.form.date.$viewValue);

							aec.query({id: newVal, absence: true}, function (data) {

								if (!data.length) {
									$scope.refTable = [];
									notify({message: "No students for current date",
										classes: 'alert-warning', templateUrl: 'views/common/notify.html'});

								} else {
									$scope.refTable = data;
									$scope.passesTable = data;
									angular.forEach($scope.refTable, function (student) {

										student.status = [false, true];

									})
								}

							})
						}
					});

					/**
					 * Makes API call to get a pdf of the AECAbsence passes for the students
					 * assigned AEC for the current date
					 */
					$scope.getPasses = function () {
						notify({message: "Now Generating Passes",
							classes: 'alert-successs', templateUrl: 'views/common/notify.html'});
						$scope.getPasses = function () {
							passes.pdf({date: $scope.currentDate, param: 'absence'}, function (data) {
								var fileURL = URL.createObjectURL(data.response);
								window.open(fileURL);
							})
						};
					}

					/**
					 * Select the student that is clicked in the table so that the user doesn't 
					 * have to type it 
					 * @param {int} $index: reftable index of the clicked student 
					 */
					$scope.onSelect = function ($index) {
						$scope.selected.student = $scope.refTable[$index];
					};

					/**
					 * Makes a download prompt of the current AEC list as a csv file
					 * @param {string} text
					 */
					var download = function (text) {

						var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
						element.setAttribute('download', 'info.csv');
						element.style.display = 'none';
						document.body.appendChild(element);
						element.click();
						document.body.removeChild(element);
					};

					/**
					 * Converts the Kids that were marked with SentOut or Walkout  into a csv text 
					 * format so it can downloaded and Referred to O-Room
					 * be passed to the download method 
					 */
					$scope.oRoomListCSV = function () {
						useractions.query({param: 'ORoom'}, function (data) {
							//headings
							var text = 'FirstName,LastName,StudentId\n';
							angular.forEach(data, function (item) {
								text += item.FirstName + ',' + item.LastName + ',' + item.UserName;

								text += ' \n';
							})
							download(text);
						})
					};

					/******** MANAGE AEC Absence **********/
					// for the next submit functions remove student from list self-reducing list.
					// To avoid duplicate profile entries only 1 entry should be created in
					// useractions table and all referrals must be changed in referrals 
					// table (see backend implementation)
					/**
					 * PUT API call to change the referral status to referred (ReferralStatus 0)
					 * as well as loggin it in the user actions for the profile 
					 * @param {object} data: information returned by modal 
					 * 	(noShow,walkOut, SentOut, schoolAbsent, disciplinary, clear,comment )
					 */
					var submitComment = function (data) {// data:{comment, noShow, walkOut, sentOut}
						var student = $scope.selected.student;
						var status = data.noShow ? 0 : data.walkOut ? 1 : data.sentOut ? 2 : data.schoolAbsent ? 3 : data.disciplinary ? 4 : data.clear ? 5 : -1;

						// submit info of student '$scope.selected.student' to database
						var dataToSent = {param: 'AbsentComment', comment: data.comment, status: status}
						referrals.update({id: student.id}, dataToSent);

						var indexOfStudent = $scope.refTable.indexOf($scope.selected.student);
						$scope.refTable.splice(indexOfStudent, 1);
						$scope.selected.student = null;
					}

					/********** MODALS   **********/
					/** Comment Modal
					 * Opens the Comment modal and passes in the student selected to be available
					 * in the modal context, calls the SubmitComment function when modal
					 * submit button is clicked, does nothing otherwise
					 */
					$scope.openComment = function (student) {

						console.log(student)
						var commentModal = $modal.open({
							templateUrl: 'views/modals/ReteachCommentAbsenceModal.html',
							size: 'md',
							controller: ["$scope", "student", function ($scope, student) {
								$scope.title = "Reteach Followup Attendance";
								$scope.student = student;
							}],
							resolve: {
								student: function () {
									return student;
								},
							}
						})// End commentModal

						commentModal.result.then(function (data) {
							if (student.radioModel == 66 || student.radioModel == 67) {
								var referralIds = student.referred.map(function (o) {
									return o.Id;
								});
								
								var payload = {
									ActionType: student.radioModel,
									Comment: student.comment,
									Date: $scope.currentDate,
									referrals: referralIds,
									referred: student.referred
								};
								aec.update({id: student.id}, payload, function (data) {
									notify(data.msg);
								}, function (error) {
									notify('error, Before continuing please contact a System Administrator');
								});
							} else {
								var referred = student.referred.map(function(o){
									return {Id: o.Id}
								});
								angular.forEach(student.referred, function (item) {
									var urlEncoded = {id: item.Id};
									var payload = {
										param: 'attendance',
										Folders: item.selected ? true : false,
										ActionType: student.radioModel,
										Comment: student.comment,
										Date: $scope.currentDate,
										Referrals: referred
									};
									aec.update(urlEncoded, payload, function (data) {
										//notify(data.msg);
									}, function (error) {
										notify('error, Before continuing please contact an admin');
									});
								});
							}
						});

						var indexOfStudent = $scope.refTable.indexOf($scope.selected.student);
						$scope.refTable.splice(indexOfStudent, 1);
						$scope.selected.student = null;
					};

				}])
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app
		.controller("ManageReteachCtrl", ["$scope", "$filter", "$modal", "referrals", "PassesService",
			"StudentsService", "notify", "ReteachListService",
			function ($scope, $filter, $modal, referrals, passes, students, notify, aec) {
				$scope.selected = {};
				$scope.refTable = [];// table model
				$scope.currentDate = new Date();

				/**
				 * Watch for changes in the datepicker then load the AECList 
				 * For the selected Date. Also adjusts data received
				 * to be easily shown in the view
				 */
				$scope.$watch('form.date.$viewValue', function (newVal) {

					if (newVal) {//when date has a valid date request the List from that date
						$scope.currentDate = newVal;
						console.log("newVal = " + $scope.form.date.$viewValue);
						aec.query({id: newVal}, function (data) {
							angular.forEach(data, function (student) {
								student.status = {classs: '', action: ''};
								student.ActivityTypeId = 0;
								angular.forEach(student.referred, function (ref) {
									var counters = student.counters;

									if (counters && counters.ORoomsToBeServed > 0) {
										student.overlap = {place: 'Has Oroom', class: 'bg-danger'};
									}
									if (counters && counters.ISSDays > 0) {
										student.overlap = {place: 'Has ISS', class: 'bg-danger'};
									}
									// check for present

									student.ActivityTypeId = ref.ActivityTypeId;


								});

								if (student.ActivityTypeId === 64) {// present , check what assignments were completed
									student.status.action = 'Present: ';
									student.status.class = 'bg-green';
									student.status.action += 'complete';

								} else if (student.ActivityTypeId === 75) { // sent out
									student.status.action = 'Sent Out: Oroom-today';
									student.status.class = 'bg-danger';
								} else if (student.ActivityTypeId === 70) { // walked out
									console.log('walked out');
									student.status.action = 'Walked Out: Oroom-tomorrow';
									student.status.class = 'bg-danger';
								} else if (student.ActivityTypeId === 65) { // rescheduled
									student.status = {action: 'Rescheduled', class: 'bg-green'};
								} else if (student.ActivityTypeId === 66) {
									student.status = {action: 'Cleared', class: 'bg-green'};
								}

							});

							if (!data.length) {
								$scope.refTable = [];
								notify({message: "No students for current date",
									classes: 'alert-warning', templateUrl: 'views/common/notify.html'});
							} else {
								$scope.refTable = data;
							}
						});
					}
				});


				/**
				 * Makes API call to get a pdf of the AEC passes for the students
				 * assigned AEC for the current date
				 */
				$scope.getPasses = function () {
					notify({message: "Now Generating Passes",
						classes: 'alert-successs', templateUrl: 'views/common/notify.html'});
					passes.pdf({date: $scope.currentDate, param: 'AECList'}, function (data) {
						console.log(data);
						var fileURL = URL.createObjectURL(data.response);
						window.open(fileURL);
					});

				};

				$scope.getLabels = function () {
					notify({message: "Now Generating labels, Hold On"});
					passes.pdf({date: $scope.currentDate, param: 'ReteachLabels'}, function (data) {
						console.log(data);
						var fileURL = URL.createObjectURL(data.response);
						window.open(fileURL);
					});
				}
				/**
				 * Select the student that is clicked in the table so that the user doesn't 
				 * have to type it 
				 * @param {int} $index: reftable index of the clicked student 
				 */
				$scope.onSelect = function ($index) {
					$scope.selected.student = $scope.refTable[$index];
				};


				/**
				 * Makes a download prompt of the current AEC list as a csv file
				 * @param {string} text
				 */
				var download = function (text) {

					//console.log(text);
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
					element.setAttribute('download', 'AECList-' + $scope.currentDate + '.csv');
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				};

				/**
				 * Converts the current AEC list into a csv text format so it can
				 * be passed to the download method 
				 */
				$scope.AECListCSV = function () {
					var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Assignment,Overlap, Attendance\n';
					angular.forEach($scope.refTable, function (item) {
						angular.forEach(item.referred, function (referred) {
							text += referred.teacher.FirstName + ',' + referred.teacher.LastName + ","
								+ item.user.FirstName + ',' + item.user.LastName + ',' + item.StudentId + ','
								+ item.Grade + ',' + referred.assignment.Name + ','
								+ (item.overlap ? item.overlap.place : 'N/A')
								+ ',' + item.status.action
								+ ' \n';
						});
					})
					download(text);
				};


				/******** MANAGE AEC **********/
				// To avoid duplicate profile entries only 1 entry should be created in
				// useractions table and all referrals must be changed in referrals 
				// table (see backend implementation)


				/**
				 * PUT API call to change the referral status to reschedule (ReferralStatus 2), 
				 * rescheduling all the referrals as well as loggin the reschedule 
				 * into user actions for the profile 
				 * @param {object} data: information returned by modal (date,comment,student,excused)
				 */
				var submitReschedule = function (data) {
					var student = data.student;
					// get info from comment box and DatePicker       
					// submit information of student '$scope.selected.student' to the database
					student.status = {action: 'Rescheduled',
						class: 'bg-green'};

					var referrals = student.referred.map(function (o) {
						return o.Id;
					});
					var urlEncoded = {id: student.Id};
					var payload = {
						param: 'reschedule',
						Comment: data.comment,
						newDate: data.date,
						ReferralIds: referrals,
						excused: data.excused
					};

					aec.update(urlEncoded, payload, function (data) {
						notify(data.msg);
					}, function (err) {
						notify({message: "Reschedule Failed, Please Contact The Admin",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});

					removeSelectedStudentFromTableAndClear();
				};

				/**
				 * PUT API call to change the referral status to clear(ReferralStatus 3), 
				 * rescheduling all the referrals as well as loggin the reschedule 
				 * into user actions for the profile 
				 * @param {object} data: information returned by modal (comment, student)
				 */
				var submitClear = function (data) {
					var student = data.student;
					student.status = {action: 'Cleared',
						class: 'bg-green'};

					// submit information of student '$scope.selected.student' to the database

					var referralsIds = student.referred.map(function (o) {
						return o.Id;
					});
					var urlEncoded = {id: student.Id};
					var payload = {
						param: 'clear',
						Comment: data.comment,
						ReferralIds: referralsIds,
						Date: $scope.currentDate
					};
					aec.update(urlEncoded, payload, function (data) {
						notify(data.msg);
					}, function (data) {
						notify({message: "Clear Failed, Please Contact The System Admin",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});

					removeSelectedStudentFromTableAndClear();
				};

				/**
				 * PUT API call to log parent notified information for current student
				 * into user actions for the profile. 
				 * In the case that parent requested a reschedule $scope.selected student 
				 * is changed to the current student and submit reschedule is 
				 * on that student, preprocess of data needed(line 193)
				 * to provide necessary info for sumit Reschedule 
				 * @param {object} data: information returned by modal (student,reschedule,newDate)
				 */
				var submitParentNotified = function (data) {
					var rescheduleComment = "Parent Requested Reschedule";
					console.log(data.student);


					// Remove Student if reschedule
					if (data.reschedule) {
						// sent a post to the reschedule api point
						angular.extend(data, {comment: rescheduleComment, excused: true, oldDate: $scope.currentDate, date: data.newDate});
						$scope.selected.student = data.student;
						submitReschedule(data);

					} else {
						// Make A post to update the student parent's information 
						var student = data.student.student;

						students.update({id: data.student.id}, {
							ParentNotified: student.ParentNotified ? 1 : 0,
							ParentNotifiedComment: student.ParentNotifiedComment,
							ValidNumber: student.ValidNumber ? 1 : 0,
							ParentSupportive: student.ParentSupportive ? 1 : 0,
							GuardianPhone: student.GuardianPhone
						}, function (response) {

						}, function (response) {
							notify({message: "Parent Notified Failed, Please Contact The Admin",
								classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
						});


					}


				}



				/**
				 * PUT API call to log student notified information for student clicked
				 * 
				 * @param {object} ref: student selected
				 * @param {int} $index: refTable index of student selected
				 */
				$scope.submitStudentNotified = function (ref, $index) {

					var studentNotified = ref.student.Notified;
					students.update({id: ref.id}, {Notified: !studentNotified ? 1 : 0}, function (response) {
						console.log(response);
					});
					console.log($scope.refTable[$index]);
				};

				/**
				 * PUT API call to change the all unprocessed referrals to absent(ReferralStatus 4)
				 * as well as logging the absent into user actions for the profile 
				 */
				$scope.finishManageAEC = function () {
					angular.forEach($scope.refTable, function (student) {
						// if no overlap and not action taken by user then send to absent list
						if ( !student.status.action && !student.overlap  ) {
							
							angular.forEach(student.referred, function (ref) {
							
								aec.update({'id': ref.Id},
								{'param': 'absent', Date: $scope.currentDate},
								function (response) {

								}, function (response) {
									notify({message: "Finish Failed, Please Contact The Admin",
										classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
								});
							});
						}
					});
					$scope.refTable = [];
				};

				function isOverlap(student) {
					var overlap = false;
					var overlapPlace = '';

					if (student.counters.ORoomsToBeServed > 0) {
						overlapPlace = 'O-Room';
						overlap = true;
					}
					if (student.counters.ISSDays > 0) {
						overlapPlace = 'ISS';
						overlap = true;
					}
					if (student.counters.OSSPMP > 0) {
						overlapPlace = 'OSS';
						overlap = true;
					}
					//
					overlap = false;
					if (overlap) {
						modalInstance = $modal.open({
							templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
							//template:'<div> MODAL : true in Referral IN </div>',
							size: 'lg',
							controller: ["$scope", "student", "activity", function ($scope, student, activity) {
								$scope.student = student;
								console.log(student);
								$scope.activity = activity;
							}],
							resolve: {
								student: function () {
									return student;
								},
								activity: function () {
									return overlapPlace;
								}
							}
						});
						return true;
					}

					return false;
				}
				/********************************************** MODALS   **************************/

				/** Attendance Modal
				 * opens the attendance modal with 3 buttons (present, sent out, walked out 
				 * 
				 */
				$scope.AECAttendance = function (student, $index) {

					if (isOverlap(student)) {
						return;
					}

					console.log(student);
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/attendanceReteachModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
						}],
						resolve: {
							student: function () {
								return student;
							}
						}
					});
					modalInstance.result.then(function (data) {// on SUBMIT
						var student = data.student;
						// check what buttons were present  and what assignments were completed
						// to set the color and the attendance 

						var status = {class: '', action: ''};
						if (student.radioModel == 64 ) {// present , check what assignments were completed
							//

							status.action = 'Present: ';
							status.class = 'bg-green';
							status.action += 'complete';


						} else if (student.radioModel == 75) {
							console.log('sent out');
							status.action = 'Sent Out: Oroom-today';
							status.class = 'bg-danger';
						} else if (student.radioModel == 70) {
							console.log('walked out');
							status.action = 'Walked Out: Oroom-tomorrow';
							status.class = 'bg-danger';
						}
						student.status = status;



						// post the comment and other things to the database 

						console.log(student);
						// sent when present
						var referrals = student.referred.map(function (o) {
							return {Id: o.Id, AssignmentCompleted: o.AssignmentCompleted}
						});
						// sent otherwhise
						var referralIds = student.referred.map(function (o) {
							return o.Id;
						});
						var urlEncoded = {id: student.Id};
						var payload = {
							param: 'attendance',
							ActionType: student.radioModel,
							Comment: student.comment,
							Date: $scope.currentDate,
							Referrals: student.radioModel == 64 ? referrals : referralIds
						};

						aec.update(urlEncoded, payload, function (data) {
							notify(data.msg);
						}, function (err) {
							notify('error, Before continuing please contact an admin');
						});



						// Do Not Remove From List
//						if ($index)
//							$scope.refTable.splice($index, 1);
//						else
//						
						// only clears the field
						$scope.selected.student = null;
					}, function () {// on modal DISMISS

					});

				};


				/** Reschedule Modal
				 * Opens the Reschedule modal and passes in the student selected to be available
				 * in the modal context, calls submitReschedule function when modal 
				 * submit button is clicked,does nothing otherwise
				 */
				$scope.openReschedule = function () {
					var resModal = $modal.open({
						templateUrl: 'views/modals/RescheduleModal.html',
						size: 'md',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
							$scope.date = new Date();

							$scope.$watch('form.date.$viewValue', function (newValue, oldValue) {
								if (newValue) { //when date has a valid date request the List from that date
									$scope.date = newValue;
									console.log('date changed');
								}
							});

						}],
						resolve: {
							student: function () {
								return $scope.selected.student;
							}
						}
					});// end modalInstance

					resModal.result.then(submitReschedule);
				};

				/** Clear Modal
				 * Opens the Clear modal and passes in the student selected to be available
				 * in the modal context, calls submitClear function when modal 
				 * submit button is clicked,does nothing otherwise
				 */
				$scope.openClear = function (studentInfo) {

					var clrModal = $modal.open({
						templateUrl: 'views/modals/ClearModal.html',
						size: 'md',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
							$scope.title = 'clear'
						}],
						resolve: {
							student: function () {
								return $scope.selected.student;
							}
						}
					})// End clrModal

					clrModal.result.then(submitClear)
				}

				/** Parent Notified Modal
				 * Opens the Parent Notified modal and passes in the student selected to be 
				 * available in the modal context, as well as the current date. 
				 * calls submitParentNotified function when modal submit 
				 * button is clicked,does nothing otherwise
				 * @param {object} stu: student selected for parent notified
				 */
				$scope.parentNotifiedModal = function (stu) {
					var parentModal = $modal.open({
						templateUrl: "views/modals/ParentModal.html",
						size: 'md',
						controller: ["$scope", "$modalInstance", "student", "date", function ($scope, $modalInstance, student, date) {
							$scope.student = student;
							$scope.date = date;

							$scope.$watch('form.date.$viewValue', function (newValue) {
								if (newValue) { //when date has a valid date request the List from that date
									$scope.date = newValue;
								}
							})
						}],
						resolve: {
							student: function () {
								return stu
							},
							date: function () {
								return $scope.currentDate
							}
						}
					})// end modal

					parentModal.result.then(submitParentNotified,
						function () {
							// change parent notified button it back to what it was
							stu.student.ParentNotified = !stu.student.ParentNotified;
						});

				}

				/**
				 * Removes $scope.selected student from the refTable and then
				 * sets it to null (clear field)
				 * 
				 */
				var removeSelectedStudentFromTableAndClear = function () {
//					for (var i = 0; i < $scope.refTable.length; i++)
//						if ($scope.selected.student.id === $scope.refTable[i].id) {
//							$scope.refTable.splice(i, 1);
//							break;
//						}
					$scope.selected.student = null;
				};
			}]);

}(angular.module('Argus')));						
(function (app) {
	"use strict";
	app.controller('NavigationReteachCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "reteach.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'Referral System',
				link: "reteach.referral",
				icon: 'eye fa-2x'
			},
			{
				id: 'Reteach List',
				link: "reteach.reteachlist",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Reteach Follow-up List',
				link: "reteach.pending",
				icon: 'exclamation fa-2x'
			}, {
				id: 'Student Data',
				link: "reteach.studentData",
				icon: 'user fa-2x'
			}
		];
	});
}(angular.module('Argus')));


(function (app) {
	"use strict";
	app.
		controller("ReteachReferralCtrl",
			["$scope", "assignmentsListService", "teachers", "referrals", "StudentsService", '$modal', 'notify', '$http','ReteachListService','ProfessorClassesService',
				function ($scope, assignmentsService, teachers, referrals, students, $modal, notify, $http, reteach, ProfessorClassesService) {
					$scope.selected = {}; // model for the possible selections (selected.student,   or seleted.assignments)
					$scope.currentDate = new Date(); // date on the datepicker
					$scope.teacherStudents = []; // model for autocomplete  
					$scope.refTable = []; // model for dynamic table 
					$scope.edits = [];
					$scope.eightPeriods = [];

					function getTeachers() {
						$scope.teachers = teachers.query(function (data) {
							console.log('the teachers');
							console.log(data);
						});
					}
					getTeachers();
					$scope.classes = ProfessorClassesService.query();

					$scope.schoolStudents = students.query({admin: true, light: true}, function () {
					}, function (error) {
						dev.openError(error);
					});

					/**
					 * Watch for changes in the datepicker to add students to that date's
					 * AEC List
					 */
					$scope.$watch('form.date.$viewValue', function (newVal, oldVal) {
						if (newVal) {//when date has a valid date request the List from that date
							var processReceivedReferrals = function (results) {
								console.log("Returned  refferals");
								console.log(results);

								// adjust the returned referrals 


								var AlluniqueTeachers = {};
								var results_length = results.length;
								var referrals = [];
								for (var i = 0; i < results_length; i++) {
									var student = results[i];
									var uniqueTeachers = {};
									angular.forEach(student.referred, function (referral, $index2) {
										uniqueTeachers[referral.UserId] = referral.user;
										delete referral.user;
										//AlluniqueTeachers[referral.StudentId] = uniqueTeachers;
									});
									var teachersNo = Object.keys(uniqueTeachers).length;
									var teachersKeys = Object.keys(uniqueTeachers);
									for (var j = 0; j < teachersNo; j++) {
										var studentCopy = angular.copy(student);
										var studentReferrals = [];
										studentCopy.teacher = uniqueTeachers[teachersKeys[j]];
										for (var k = 0; k < student.referred.length; k++) {

											var referral = student.referred[k];
											if (referral.assignment.TeacherId === teachersKeys[j])
												studentReferrals.push(referral.assignment);
										}
										studentCopy.referred = studentReferrals;
										studentCopy.old = true;
										referrals.push(studentCopy);
									}

								}
								results = referrals
								console.log(results);
								var data = results;
								console.log("Data For the ref table");
								console.log(results);
								// console.log(data);
								if (!data) {
									$scope.refTable = [];
									alert("No students for current date");

								} else {
									$scope.refTable = data;
								}
							}
							//                referrals.query({id:newVal},processReceivedReferrals, function(error) {
							//                    console.log(error);
							//                });



							console.log("New Date : " + newVal);
							console.log("Old Date : " + oldVal);
							//console.log("New Date : " +formatDate(newVal) );
							$scope.currentDate = newVal;

						}
					});

					/* REFER A STUDENT LOGIC */


					/**
					 * Called when a student is selected or deselected 
					 * no action for now 
					 */
					$scope.onSelectedStudent = function () {
						return;
						// add to the list
						var alreadyInList = false;
						for (var i = 0; i < $scope.refTable.length; i++) {
							if ($scope.refTable[i].id === $scope.selected.student.user.id) {
								alreadyInList = true;
							}
						}
						if (!alreadyInList)
							$scope.refTable.push($scope.selected.student.user);
						else
							alert('student is already in the list');
						// clear the field
						//$scope.selected.student = null;
					};

					/**
					 * Called when teacher is selected or deselected. Retrieves the selected
					 * teacher's students if a teacher is selected.  If deselected
					 * set teacherStudents to null
					 */
					$scope.onSelectedTeacher = function () {
						if (!$scope.selected.teacher) {// if teacher deselected 
							$scope.teacherStudents = null;
							return;
						}
						var teacherId = $scope.selected.teacher.id;
						students.query({teacherId: teacherId}, function (results) {
							console.log("Teacher students");
							console.log(results);

							$scope.teacherStudents = results;
						}, function (error) {
							console.log(error);
						});

					}


					/** New Assignment Modal
					 * Opens the New Assignment modal and passes in the teacher selected to be available
					 * in the modal context, on submit makes a post call to assignments
					 * to add the current assignment to the teacher 
					 */
					$scope.openCreateNewAssignment = function () {
						var modalInstance = $modal.open({
							templateUrl: 'views/modals/addNewAssignmentModal.html',
							size: 'md',
							controller: ["$scope", "teacher", function ($scope, teacher) {
								$scope.teacher = teacher;
							}],
							resolve: {// variables that get injected into the controller (taken from current $scope)
								teacher: function () {
									return $scope.selected.teacher;
								},
							}
						}) // End modalInstace

						modalInstance.result.then(function (data) {
							assignmentsService.save({teacher: $scope.selected.teacher, assignment: data}, function (response) {
								debugger;
								var teacher = $scope.selected.teacher;
								response.assignment.Id = response.assignment.Id + "";
								$scope.selected.teacher.assignments.push(response.assignment);

								console.log('assignment successfully added');
								console.log($scope.selected.teacher.assignments)
							}, function (response) {
								console.warn('assignment unseccessfuly added');
							});
						});
					};

					/**
					 * Adds selected.student with selected.assignments to the refTable
					 * then clears selected.student
					 */
					$scope.addToList = function () {
						//var selectedAssignments = $scope.selected.assignments;
						var referralToAdd = $scope.selected.student;
						var selectedTeacher = $scope.selected.teacher;
						$http.get('api/classes/' + $scope.selected.student.Id).then(function (response) {
							var last = response.data[7];
							$scope.eightPeriods.push(last)
							console.log($scope.eightPeriods);
						})

						//addAssignmentsToStudent(selectedAssignments, referralToAdd);
						referralToAdd.teacher = $scope.selected.teacher;
						$scope.refTable.push(referralToAdd);
						console.log($scope.refTable);
						$scope.selected.student = null;
					}

					/**
					 * Adds assignments to the student object 
					 * @param  {[objects]} assignments	: list of assignment objects to be added
					 * @param 	{object} 	student		: 
					 */
					function addAssignmentsToStudent(assignments, student) {

						if (!student.referred) {// current student doesnt have any assignments, add all the selected assignments	
							//  copy assignments into referred
							student.referred = assignments.slice();
							return;
						}

						for (var i = 0; i < assignments.length; i++) {
							var j = false;
							for (j = 0; j < student.referred.length; j++) {
								if (student.referred[j].Id === assignments[i].Id)
									break;
							}

							if (j === student.referred.length)// assignment is not already in the student
								student.referred.unshift(assignments[i]);
						}


						delete student.selected; // delete the selected property;

					}

					/**
					 * POST API call to referrals. adds all the students in the refTable to the 
					 * current date's AEC list.
					 * Despite the number of assignmets only 1 entry should be loged in 
					 * into user activities with information containig the assignments
					 */
					$scope.submitReferedStudents = function () {
						// format the data so it an be easily insterted in the database
						var studentsReferred = [];
						angular.forEach($scope.refTable, function (student) {
							console.log(student);
							var referral = {
								StudentId: student.Id,
								TeacherId: student.teacher.id,
								AssignmentId: 0,
								RefferalStatus: 0,
								ReferralTypeId: 18,
								ProfessorClassId: student.ProfessorClassId? student.ProfessorClassId.Id:0,
								Date: $scope.currentDate,
							};
							studentsReferred.push(referral);

						});
						if (studentsReferred.length){
							reteach.save({data: studentsReferred, date: $scope.currentDate},
							function (response) {
								notify({message: "Reteach List Was Submitted Successfully",
									classes: 'alert-success', templateUrl: 'views/common/notify.html'});
							}, function (response) {
								notify({message: "Submit Failed, Please Contact The Admin",
									classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
							});
						}
						//ServerDataModel.createAECList($scope.currentDate, $scope.refTable);
						$scope.refTable = [];
						
					}

				}])

}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

			$stateProvider
				.state('reteach', {
					abstract: true,
					url: "/reteach",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationReteachCtrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('reteach.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/reteach/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashReteachCtrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('reteach.referral', {
					url: "/ReteachReferral",
					templateUrl: 'views/reteach/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'ReteachReferralCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}

				})
				.state('reteach.reteachlist', {
					url: "/ReteachList",
					templateUrl: 'views/reteach/manageReteach.html',
					data: {pageTitle: 'List'},
					controller: 'ManageReteachCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}

				})
				.state('reteach.pending', {
					url: "/ReteachFollowup",
					templateUrl: 'views/reteach/manageReteachabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'ManageReteachAbsenceCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('reteach.studentData', {
					url: "/studentData",
					templateUrl: 'views/sharedItems/studentInfo.html',
					data: {pageTitle: 'Student Data'},
					controller: 'studentInfoCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				});




		}]);


}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app
		.controller("ManageASPStudentsDunbarCtrl", ["$scope", "$modal","notify","ASPService", "$timeout", '$rootScope',
			function ($scope,  $modal,  notify,  asp, $timeout, $rootScope) {
				$scope.selected = {student: null};
				$scope.refTable = [];// table model
				$scope.currentDate = new Date();

				$scope.refTable = asp.query();

			

				

				$scope.getStudents = function () {
					$scope.refTable = asp.query({Date: $scope.currentDate});
				};

				

			}]);

}(angular.module('Argus')));						
/* global angular */

(function (app) {
	"use strict";
	app
		.controller("ManageASPStudentsEstacadoCtrl", ["$scope", "$modal","notify","ASPService", "$timeout", '$rootScope',
			function ($scope,  $modal,  notify,  asp, $timeout, $rootScope) {
				$scope.selected = {student: null};
				$scope.refTable = [];// table model
				$scope.currentDate = new Date();

//				$scope.programs = [
//					{Name: 'Art', Id: 76},
//					{Name: 'Bikes (PE)', Id: 77},
//					{Name: 'Board Games (PE)', Id: 78},
//					{Name: 'Cooking (Class)', Id: 79},
//					{Name: 'Cooking (Kitchen)', Id: 80},
//					{Name: 'Hip-Hop (PE)', Id: 81},
//					{Name: 'Math Music (PE)', Id: 82},
//					{Name: 'Music', Id: 83},
//					{Name: 'PE', Id: 84},
//					{Name: 'Theatre', Id: 85}
//				];

				$scope.rotations = [
					{Name: 'Rotation 1', Value: 1},
					{Name: 'Rotation 2', Value: 2}

				];

				$scope.refTable = [
					{
						user: {FirstName: 'First', LastName: 'Last'},
						StudentId: '888',
						Grade: 99, Id: '1', attendance: 1
					}
				];

				/**
				 * Watch for changes in the datepicker then load the AECList 
				 * For the selected Date. Also adjusts data received
				 * to be easily shown in the view
				 */
				$scope.$watch('form.date.$viewValue', function (newVal) {
					if (newVal) {//when date has a valid date request the List from that date
						$scope.currentDate = newVal;
						$scope.selected.rotation = null;
						$scope.refTable = [];
						console.log($rootScope.schoolId);
						if ($rootScope.currentUser.schoolId === 2) {
							$scope.refTable = asp.query({Date: $scope.currentDate}, markOverlaps);
						}
					}
				});

				$scope.onSelectedRotation = function (rotation) {
					if (!rotation) {
						$scope.selected.program = null;
						$scope.refTable = [];
						return;
					}
					$scope.selected.program = null;
					$scope.refTable = null;
					asp.query({select: 1, rotation: rotation.Value, Date: $scope.currentDate},
					function (data) {
						// check for date and group all the PE into 1 PE 
						
						$scope.programs = data;
					}, function (err) {

					});
				};

				function markOverlaps(data) {
					angular.forEach(data, function (stu) {
						var hasiss = false, hasaec = false, hasoroom = false;
						angular.forEach(stu.student.user.referred, function (ref) {
							if (ref.ReferralTypeId === 12) {
								hasaec = true;

							} else if ((ref.ReferralTypeId === 5 || ref.ReferralTypeId === 6 || ref.ReferralTypeId === 7
								|| ref.ReferralTypeId === 10 || ref.ReferralTypeId === 17 || ref.ReferralTypeId === 15)) {
								hasiss = true;

							} else if ((ref.ReferralTypeId === 1 || ref.ReferralTypeId === 2 || ref.ReferralTypeId === 3 || ref.ReferralTypeId === 16 || ref.ReferralTypeId === 10 || ref.ReferralTypeId === 19)) {
								hasoroom = true;
							}
						});
						if (hasiss) {
							stu.overlap = {class: 'bg-danger', msg: 'Has ISS'};

						} else if (hasoroom) {
							stu.overlap = {class: 'bg-warning', msg: 'Has ORoom'};
						} else if (hasaec) {
							stu.overlap = {class: 'bg-warning', msg: 'Has AEC'};
						}

					});
				}

				$scope.onSelectedProgram = function (program, rotation) {
					if (!program) {
						$scope.refTable = [];
						return;
					}
					$scope.refTable = asp.query({select: 2, rotation: rotation.Value, program: program.Id, Date: $scope.currentDate},
					markOverlaps, function (err) {

					});
				};

				$scope.getStudents = function () {
					$scope.refTable = asp.query({Date: $scope.currentDate}, markOverlaps);
				};


				$scope.changeAttendance = function (stu_att, att) {
					asp.update({id: stu_att.Id}, {attendance: att},
					function (data) {
						console.log(data);
					}, function (err) {
						console.log(err);
					});
				};





				/**
				 * Makes a download prompt of the current AEC list as a csv file
				 * @param {string} text
				 */
				var download = function (text) {

					//console.log(text);
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
					element.setAttribute('download', 'ASPList-' + $scope.currentDate + '.csv');
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				};

				/**
				 * Converts the current AEC list into a csv text format so it can
				 * be passed to the download method 
				 */
				$scope.listCSV = function () {
					var text = 'FirstName,LastName,StudentId, Grade,Overlap, Attendance\n';
					angular.forEach($scope.refTable, function (item) {
						text += item.student.user.FirstName + ',' + item.student.user.LastName
							+ ',' + item.student.StudentId + ','
							+ item.student.Grade + ','
							+ (item.overlap ? item.overlap.msg : 'N/A')
							+ ',' + (item.student.asp_attendance[0].Attendance)
							+ ' \n';

					});
					download(text);
				};



				/**
				 * Removes $scope.selected student from the refTable and then
				 * sets it to null (clear field)
				 * 
				 */
				var removeSelectedStudentFromTableAndClear = function () {
//					for (var i = 0; i < $scope.refTable.length; i++)
//						if ($scope.selected.student.id === $scope.refTable[i].id) {
//							$scope.refTable.splice(i, 1);
//							break;
//						}
					$scope.selected.student = null;
				};
			}]);

}(angular.module('Argus')));						
/* global angular */

(function (app) {
	"use strict";
	app
		.controller("ManageCtrl", ["$scope", "$filter", "$modal", "referrals", "PassesService",
			"StudentsService", "notify", "AECListService", "ASPService", "$timeout", '$rootScope',
			function ($scope, $filter, $modal, referrals, passes, students, notify, aec, asp, $timeout, $rootScope) {
				$scope.selected = {student: null};
				$scope.refTable = [];// table model
				$scope.currentDate = new Date();

//				$scope.programs = [
//					{Name: 'Art', Id: 76},
//					{Name: 'Bikes (PE)', Id: 77},
//					{Name: 'Board Games (PE)', Id: 78},
//					{Name: 'Cooking (Class)', Id: 79},
//					{Name: 'Cooking (Kitchen)', Id: 80},
//					{Name: 'Hip-Hop (PE)', Id: 81},
//					{Name: 'Math Music (PE)', Id: 82},
//					{Name: 'Music', Id: 83},
//					{Name: 'PE', Id: 84},
//					{Name: 'Theatre', Id: 85}
//				];

				$scope.rotations = [
					{Name: 'Rotation 1', Value: 1},
					{Name: 'Rotation 2', Value: 2}

				];

				$scope.refTable = [
					{
						user: {FirstName: 'First', LastName: 'Last'},
						StudentId: '888',
						Grade: 99, Id: '1', attendance: 1
					}
				];

				/**
				 * Watch for changes in the datepicker then load the AECList 
				 * For the selected Date. Also adjusts data received
				 * to be easily shown in the view
				 */
				$scope.$watch('form.date.$viewValue', function (newVal) {
					if (newVal) {//when date has a valid date request the List from that date
						$scope.currentDate = newVal;
						$scope.selected.rotation = null;
						$scope.refTable = [];
						console.log($rootScope.schoolId);
						if ($rootScope.currentUser.schoolId === 2) {
							$scope.refTable = asp.query({Date: $scope.currentDate}, markOverlaps);
						}
					}
				});

				$scope.onSelectedRotation = function (rotation) {
					if (!rotation) {
						$scope.selected.program = null;
						$scope.refTable = [];
						return;
					}
					$scope.selected.program = null;
					$scope.refTable = null;
					asp.query({select: 1, rotation: rotation.Value, Date: $scope.currentDate},
					function (data) {
						// check for date and group all the PE into 1 PE 
						
						$scope.programs = data;
					}, function (err) {

					});
				};

				function markOverlaps(data) {
					angular.forEach(data, function (stu) {
						var hasiss = false, hasaec = false, hasoroom = false;
						angular.forEach(stu.student.user.referred, function (ref) {
							if (ref.ReferralTypeId === 12) {
								hasaec = true;

							} else if ((ref.ReferralTypeId === 5 || ref.ReferralTypeId === 6 || ref.ReferralTypeId === 7
								|| ref.ReferralTypeId === 10 || ref.ReferralTypeId === 17 || ref.ReferralTypeId === 15)) {
								hasiss = true;

							} else if ((ref.ReferralTypeId === 1 || ref.ReferralTypeId === 2 || ref.ReferralTypeId === 3 || ref.ReferralTypeId === 16 || ref.ReferralTypeId === 10 || ref.ReferralTypeId === 19)) {
								hasoroom = true;
							}
						});
						if (hasiss) {
							stu.overlap = {class: 'bg-danger', msg: 'Has ISS'};

						} else if (hasoroom) {
							stu.overlap = {class: 'bg-warning', msg: 'Has ORoom'};
						} else if (hasaec) {
							stu.overlap = {class: 'bg-warning', msg: 'Has AEC'};
						}

					});
				}

				$scope.onSelectedProgram = function (program, rotation) {
					if (!program) {
						$scope.refTable = [];
						return;
					}
					$scope.refTable = asp.query({select: 2, rotation: rotation.Value, program: program.Id, Date: $scope.currentDate},
					markOverlaps, function (err) {

					});
				};

				$scope.getStudents = function () {
					$scope.refTable = asp.query({Date: $scope.currentDate}, markOverlaps);
				};


				$scope.changeAttendance = function (stu_att, att) {
					asp.update({id: stu_att.Id}, {attendance: att},
					function (data) {
						console.log(data);
					}, function (err) {
						console.log(err);
					});
				};





				/**
				 * Makes a download prompt of the current AEC list as a csv file
				 * @param {string} text
				 */
				var download = function (text) {

					//console.log(text);
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
					element.setAttribute('download', 'ASPList-' + $scope.currentDate + '.csv');
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				};

				/**
				 * Converts the current AEC list into a csv text format so it can
				 * be passed to the download method 
				 */
				$scope.listCSV = function () {
					var text = 'FirstName,LastName,StudentId, Grade,Overlap, Attendance\n';
					angular.forEach($scope.refTable, function (item) {
						text += item.student.user.FirstName + ',' + item.student.user.LastName
							+ ',' + item.student.StudentId + ','
							+ item.student.Grade + ','
							+ (item.overlap ? item.overlap.msg : 'N/A')
							+ ',' + (item.student.asp_attendance[0].Attendance)
							+ ' \n';

					});
					download(text);
				};



				/**
				 * Removes $scope.selected student from the refTable and then
				 * sets it to null (clear field)
				 * 
				 */
				var removeSelectedStudentFromTableAndClear = function () {
//					for (var i = 0; i < $scope.refTable.length; i++)
//						if ($scope.selected.student.id === $scope.refTable[i].id) {
//							$scope.refTable.splice(i, 1);
//							break;
//						}
					$scope.selected.student = null;
				};
			}]);

}(angular.module('Argus')));						
/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationASPCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
//			{
//				id: 'Dashboard',
//				link: "asp.dashboard",
//				icon: 'dashboard fa-2x'
//			}, 
{
				id: 'Attendance',
				link: "asp.manage",
				icon: 'eye fa-2x'
			},
			{
				id: 'Manage Students',
				link: "asp.manageStudents",
				icon: 'list-alt fa-2x'
			}
//			, {
//				id: 'Follow-up List',
//				link: "asp.pending",
//				icon: 'exclamation fa-2x'
//			}, {
//				id: 'Student Data',
//				link: "asp.studentData",
//				icon: 'user fa-2x'
//			}
		];
	});
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide ) {
//			var user = JSON.parse(localStorage.getItem('user'));
//			var schoolId = user.SchoolId;
			$stateProvider
				.state('asp', {
					abstract: true,
					url: "/asp",
					templateUrl: "views/common/contentArgus.html",
					controller: "NavigationASPCtrl",
					controllerAs: 'navigation',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
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
						}]
					}
				})
				.state('asp.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/aspcoordinator/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin2Ctrl",
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}
				})
				.state('asp.manage', {
					url: "/manage",
					templateUrl: 'views/aspcoordinator/manage.html',
					data: {pageTitle: 'Attendance'},
					controller: 'ManageCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}]
					}

				})
				.state('asp.manageStudents', {
					url: "/ManageStudents",
					templateUrl: /*schoolId === 2? 'views/aspcoordinator/manageStudentsDunbar.html':*/'views/aspcoordinator/manageStudentsEstacado.html',
					data: {pageTitle: 'ASP Students'},
					controller: /*schoolId === 2? 'ManageASPStudentsDunbarCtrl':*/'ManageASPStudentsEstacadoCtrl',
					resolve: {
						loadPlugin: ["$ocLazyLoad", function ($ocLazyLoad) {
							return $ocLazyLoad.load([
							]);
						}]
					}

				});
//				.state('asp.pending', {
//					url: "/pending",
//					templateUrl: 'views/sharedItems/manageAECabsence.html',
//					data: {pageTitle: 'Pending'},
//					controller: 'manageAECAbsenceController',
//					resolve: {
//						loadPlugin: function ($ocLazyLoad) {
//							return $ocLazyLoad.load([
//								{
//									name: 'datePicker',
//									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
//								}
//							]);
//						}
//					}
//				})
				

		}]);


}(angular.module('Argus')));
/* global angular, URL */

(function (app) {
	"use strict";
	app
		.controller("manageAECAbsenceController",
			["$scope", "$modal", "referrals", "PassesService", "UserActionsService", 'notify', 'AECAbsenceListService',
				function ($scope, $modal, referrals, passes, useractions, notify, aec) {
					$scope.selected = {};
					$scope.refTable = [];// table model
					$scope.currentDate = new Date(); // date on the date picker

					/**
					 * Watch for changes in the datepicker then load the AECAbsence list
					 */
					$scope.$watch('form.date.$viewValue', function (newVal, oldVal) {

						if (newVal) {//when date has a valid date request the List from that date
							$scope.currentDate = newVal;
							console.log("newVal = " + $scope.form.date.$viewValue);

							referrals.query({id: newVal, absence: true}, function (data) {

								if (!data.length) {
									$scope.refTable = [];
									notify({message: "No students for current date",
										classes: 'alert-warning', templateUrl: 'views/common/notify.html'});

								} else {
									$scope.refTable = data;
									$scope.passesTable = data;
									angular.forEach($scope.refTable, function (student) {

										student.status = [false, true];

									});
								}

							});
						}
					});

					/**
					 * Makes API call to get a pdf of the AECAbsence passes for the students
					 * assigned AEC for the current date
					 */
					$scope.getPasses = function () {
						notify({message: "Now Generating Passes",
							classes: 'alert-successs', templateUrl: 'views/common/notify.html'});
						$scope.getPasses = function () {
							passes.pdf({date: $scope.currentDate, param: 'absence'}, function (data) {
								var fileURL = URL.createObjectURL(data.response);
								window.open(fileURL);
							});
						};
					};

					/**
					 * Select the student that is clicked in the table so that the user doesn't 
					 * have to type it 
					 * @param {int} $index: reftable index of the clicked student 
					 */
					$scope.onSelect = function ($index) {
						$scope.selected.student = $scope.refTable[$index];
					};

					/**
					 * Makes a download prompt of the current AEC list as a csv file
					 * @param {string} text
					 */
					var download = function (text) {

						var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
						element.setAttribute('download', 'info.csv');
						element.style.display = 'none';
						document.body.appendChild(element);
						element.click();
						document.body.removeChild(element);
					};

					/**
					 * Converts the Kids that were marked with SentOut or Walkout  into a csv text 
					 * format so it can downloaded and Referred to O-Room
					 * be passed to the download method 
					 */
					$scope.oRoomListCSV = function () {
						useractions.query({param: 'ORoom'}, function (data) {
							//headings
							var text = 'FirstName,LastName,StudentId\n';
							angular.forEach(data, function (item) {
								text += item.FirstName + ',' + item.LastName + ',' + item.UserName;

								text += ' \n';
							});
							download(text);
						});
					};

					/******** MANAGE AEC Absence **********/
					// for the next submit functions remove student from list self-reducing list.
					// To avoid duplicate profile entries only 1 entry should be created in
					// useractions table and all referrals must be changed in referrals 
					// table (see backend implementation)
					/**
					 * PUT API call to change the referral status to referred (ReferralStatus 0)
					 * as well as loggin it in the user actions for the profile 
					 * @param {object} data: information returned by modal 
					 * 	(noShow,walkOut, SentOut, schoolAbsent, disciplinary, clear,comment )
					 */
					var submitComment = function (data) {// data:{comment, noShow, walkOut, sentOut}
						var student = $scope.selected.student;
						var status = data.noShow ? 0 : data.walkOut ? 1 : data.sentOut ? 2 : data.schoolAbsent ? 3 : data.disciplinary ? 4 : data.clear ? 5 : -1;

						// submit info of student '$scope.selected.student' to database
						var dataToSent = {param: 'AbsentComment', comment: data.comment, status: status};
						referrals.update({id: student.id}, dataToSent);

						var indexOfStudent = $scope.refTable.indexOf($scope.selected.student);
						$scope.refTable.splice(indexOfStudent, 1);
						$scope.selected.student = null;
					};

					/********** MODALS   **********/
					/** Comment Modal
					 * Opens the Comment modal and passes in the student selected to be available
					 * in the modal context, calls the SubmitComment function when modal
					 * submit button is clicked, does nothing otherwise
					 */
					$scope.openComment = function (student) {

						var commentModal = $modal.open({
							templateUrl: 'views/modals/CommentAbsenceModal.html',
							size: 'md',
							controller: ["$scope", "student", function ($scope, student) {
								$scope.title = "Reteach Followup Attendance";
								$scope.student = student;
							}],
							resolve: {
								student: function () {
									return student;
								}
							}
						});// End commentModal

						commentModal.result.then(function (data) {
							// present or clear
							if (student.radioModel == 51 || student.radioModel == 52) { // one request
								var referralIds = student.referred.map(function (o) {
									return o.Id;
								});
								
								var payload = {
									ActionType: student.radioModel,
									Comment: student.comment,
									Date: $scope.currentDate,
									referrals: referralIds,
									referred: student.referred
								};
								aec.update({id: student.id}, payload, function (data) {
									notify(data.msg);
									clearInputAndRemoveFromTable();
								}, function (error) {
									notify('error, Before continuing please contact a System Administrator');
								});
							} else {
								var referred = student.referred.map(function(o){
									return {Id: o.Id, Folders:o.selected?true:false};
								});
								var urlEncoded  = {id:student.id};
								var payload = {
									param:'attendance',
									Referrals : referred,
									ActionType:student.radioModel,
									Comment:student.comment,
									Date: $scope.currentDate
								};
								aec.update(urlEncoded, payload, function(data){
									notify(data.msg);
									clearInputAndRemoveFromTable();
								},function(){
									notify('error');
								});
//								angular.forEach(student.referred, function (item) { // multiple requests
//									var urlEncoded = {id: item.Id};
//									var payload = {
//										param: 'attendance',
//										Folders: item.selected ? true : false,
//										ActionType: student.radioModel,
//										Comment: student.comment,
//										Date: $scope.currentDate,
//										Referrals: referred
//									};
//									aec.update(urlEncoded, payload, function (data) {
//										//notify(data.msg);
//										clearInputAndRemoveFromTable()
//									}, function (error) {
//										notify('error, Before continuing please contact an admin');
//									});
//								});
							}
						});
//
//						var indexOfStudent = $scope.refTable.indexOf($scope.selected.student);
//						$scope.refTable.splice(indexOfStudent, 1);
//						$scope.selected.student = null;
					};
					
					function clearInputAndRemoveFromTable(){
						var indexOfSelected = $scope.refTable.indexOf($scope.selected.student);
						$scope.refTable.splice(indexOfSelected,1);
						$scope.selected.student = null;
					}
					
				}]);
}(angular.module('Argus')));
/* global angular, URL */

(function (app) {
	"use strict";
	app
		.controller("manageAECController", ["$scope", "$filter", "$modal", "referrals", "PassesService",
			"StudentsService", "notify", "AECListService",
			function ($scope, $filter, $modal, referrals, passes, students, notify, aec) {
				$scope.selected = {student: null};
				$scope.refTable = [];// table model
				$scope.currentDate = new Date();

				/**
				 * Watch for changes in the datepicker then load the AECList 
				 * For the selected Date. Also adjusts data received
				 * to be easily shown in the view
				 */
				$scope.$watch('form.date.$viewValue', function (newVal) {

					if (newVal) {//when date has a valid date request the List from that date
						$scope.currentDate = newVal;
						console.log("newVal = " + $scope.form.date.$viewValue);
						aec.query({id: newVal}, function (data) {
							var someFoldersMarked = false;
							angular.forEach(data, function (student) {
								var assignments = {completed: [], incomplete: []};
								student.status = {classs: '', action: ''};
								student.ActivityTypeId = 0;
								angular.forEach(student.referred, function (ref) {
									var counters = student.counters;

									if (counters && counters.ORoomsToBeServed > 0) {
										student.overlap = {place: 'Has Oroom', class: 'bg-danger'};
									}
									if (counters && counters.ISSDays > 0) {
										student.overlap = {place: 'Has ISS', class: 'bg-danger'};
									}
									// check for present

									student.ActivityTypeId = ref.ActivityTypeId;
									ref.HasFolder = ref.HasFolder === 1 ? true : false;
									if (ref.HasFlder) {
										someFoldersMarked = true;
									}
									if (ref.ActivityTypeId === 49) {// present , check what assignments were completed
										//
										ref.AssignmentCompleted = ref.AssignmentCompleted === 1 ? true : false;
										if (ref.AssignmentCompleted)
											assignments.completed.push(ref);
										else
											assignments.incomplete.push(ref);

										student.status.action = 'Present: ';
									}

								});

								if (student.ActivityTypeId === 49) {// present , check what assignments were completed
									if (assignments.incomplete.length === 0) {
										student.status.class = 'bg-green';
										student.status.action += 'complete';
									} else {
										student.status.class = 'bg-warning';
										student.status.action += 'incomplete';
									}
								} else if (student.ActivityTypeId === 55) { // sent out
									student.status.action = 'Sent Out: Oroom-today';
									student.status.class = 'bg-danger';


								} else if (student.ActivityTypeId === 56) { // walked out
									console.log('walked out');
									student.status.action = 'Walked Out: Oroom-tomorrow';
									student.status.class = 'bg-danger';
								} else if (student.ActivityTypeId === 50) { // rescheduled
									student.status = {action: 'Rescheduled', class: 'bg-green'};
								} else if (student.ActivityTypeId === 51) {
									student.status = {action: 'Cleared', class: 'bg-green'};
								}
								if (someFoldersMarked) {
									console.log('marked');
									student.status.action = 'Folders Marked';
								}

							});



							if (!data.length) {
								$scope.refTable = [];
								notify({message: "No students for current date",
									classes: 'alert-warning', templateUrl: 'views/common/notify.html'});
							} else {
								$scope.refTable = data;
							}
						});
					}
				});


				$scope.onSelectedStude = function (student) {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/attendanceAECModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", "$timeout", "$modalInstance", function ($scope, student, $timeout, $modalInstance) {
							$scope.student = student;
							$timeout(function () {
								$modalInstance.dismiss('cancel');
							}, 2000);
						}],
						resolve: {
							student: function () {
								return student;
							}
						}
					});
					modalInstance.result.then(function () {
					},
						function () {
							$scope.selected.student = null;
						});

				};

				/**
				 * Makes API call to get a pdf of the AEC passes for the students
				 * assigned AEC for the current date
				 */
				$scope.getPasses = function () {
					notify({message: "Now Generating Passes",
						classes: 'alert-successs', templateUrl: 'views/common/notify.html'});
					passes.pdf({date: $scope.currentDate, param: 'AECList'}, function (data) {
						console.log(data);
						var fileURL = URL.createObjectURL(data.response);
						window.open(fileURL);
					});

				};

				/**
				 * Select the student that is clicked in the table so that the user doesn't 
				 * have to type it 
				 * @param {int} $index: reftable index of the clicked student 
				 */
				$scope.onSelect = function ($index) {
					$scope.selected.student = $scope.refTable[$index];
				};


				/**
				 * Makes a download prompt of the current AEC list as a csv file
				 * @param {string} text
				 */
				var download = function (text) {

					//console.log(text);
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
					element.setAttribute('download', 'AECList-' + $scope.currentDate + '.csv');
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				};

				/**
				 * Converts the current AEC list into a csv text format so it can
				 * be passed to the download method 
				 */
				$scope.AECListCSV = function () {
					var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Assignment,Overlap, Attendance\n';
					angular.forEach($scope.refTable, function (item) {
						angular.forEach(item.referred, function (referred) {
							text += referred.teacher.FirstName + ',' + referred.teacher.LastName + ","
								+ item.user.FirstName + ',' + item.user.LastName + ',' + item.StudentId + ','
								+ item.Grade + ',' + referred.assignment.Name + ','
								+ (item.overlap ? item.overlap.place : 'N/A')
								+ ',' + item.status.action
								+ ' \n';
						});
					});
					download(text);
				};


				/******** MANAGE AEC **********/
				// To avoid duplicate profile entries only 1 entry should be created in
				// useractions table and all referrals must be changed in referrals 
				// table (see backend implementation)


				/**
				 * PUT API call to change the referral status to reschedule (ReferralStatus 2), 
				 * rescheduling all the referrals as well as loggin the reschedule 
				 * into user actions for the profile 
				 * @param {object} data: information returned by modal (date,comment,student,excused)
				 */
				var submitReschedule = function (data) {
					var student = data.student;
					// get info from comment box and DatePicker       
					// submit information of student '$scope.selected.student' to the database
					student.status = {action: 'Rescheduled',
						class: 'bg-green'};

					var referrals = student.referred.map(function (o) {
						return o.Id;
					});
					var urlEncoded = {id: student.Id};
					var payload = {
						param: 'reschedule',
						Comment: data.comment,
						newDate: data.date,
						Date: $scope.currentDate,
						ReferralIds: referrals,
						excused: data.excused
					};

					aec.update(urlEncoded, payload, function (data) {
						notify(data.msg);
					}, function (err) {
						notify({message: "Reschedule Failed, Please Contact The Admin",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});

					removeSelectedStudentFromTableAndClear();
				};

				/**
				 * PUT API call to change the referral status to clear(ReferralStatus 3), 
				 * rescheduling all the referrals as well as loggin the reschedule 
				 * into user actions for the profile 
				 * @param {object} data: information returned by modal (comment, student)
				 */
				var submitClear = function (data) {
					var student = data.student;
					student.status = {action: 'Cleared',
						class: 'bg-green'};

					// submit information of student '$scope.selected.student' to the database

					var referralsIds = student.referred.map(function (o) {
						return o.Id;
					});
					var urlEncoded = {id: student.Id};
					var payload = {
						param: 'clear',
						Comment: data.comment,
						ReferralIds: referralsIds
					};
					aec.update(urlEncoded, payload, function (data) {
						notify(data.msg);
					}, function (data) {
						notify({message: "Clear Failed, Please Contact The System Admin",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});

					removeSelectedStudentFromTableAndClear();
				};

				/**
				 * PUT API call to log parent notified information for current student
				 * into user actions for the profile. 
				 * In the case that parent requested a reschedule $scope.selected student 
				 * is changed to the current student and submit reschedule is 
				 * on that student, preprocess of data needed(line 193)
				 * to provide necessary info for sumit Reschedule 
				 * @param {object} data: information returned by modal (student,reschedule,newDate)
				 */
				var submitParentNotified = function (data) {
					var rescheduleComment = "Parent Requested Reschedule";
					console.log(data.student);

					// Remove Student if reschedule
					if (data.reschedule) {
						// sent a post to the reschedule api point
						angular.extend(data, {comment: rescheduleComment, excused: true, oldDate: $scope.currentDate, date: data.newDate});
						$scope.selected.student = data.student;
						submitReschedule(data);

					} else {
						// Make A post to update the student parent's information 
						var student = data.student.student;

						students.update({id: data.student.id}, {
							ParentNotified: student.ParentNotified ? 1 : 0,
							ParentNotifiedComment: student.ParentNotifiedComment,
							ValidNumber: student.ValidNumber ? 1 : 0,
							ParentSupportive: student.ParentSupportive ? 1 : 0,
							GuardianPhone: student.GuardianPhone
						}, function (response) {

						}, function (response) {
							notify({message: "Parent Notified Failed, Please Contact The Admin",
								classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
						});

					}

				};



				/**
				 * PUT API call to log student notified information for student clicked
				 * 
				 * @param {object} ref: student selected
				 * @param {int} $index: refTable index of student selected
				 */
				$scope.submitStudentNotified = function (ref, $index) {

					var studentNotified = ref.student.Notified;
					students.update({id: ref.id}, {Notified: !studentNotified ? 1 : 0}, function (response) {
						console.log(response);
					});
					console.log($scope.refTable[$index]);
				};

				/**
				 * PUT API call to change the all unprocessed referrals to absent(ReferralStatus 4)
				 * as well as logging the absent into user actions for the profile 
				 */
				$scope.finishManageAEC = function () {
					angular.forEach($scope.refTable, function (student) {
						if (student.ActivityTypeId === 0 && !student.overlap) {


							angular.forEach(student.referred, function (ref) {
								referrals.update({'id': ref.Id},
								{'param': 'absent', Date: $scope.currentDate},
								function (response) {

								}, function (response) {
									notify({message: "Finish Failed, Please Contact The Admin",
										classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
								});
							});
						}
					});
					$scope.refTable = [];
				};

				function isOverlap(student) {
					var overlap = false;
					var overlapPlace = '';

					if (student.counters.ORoomsToBeServed > 0) {
						overlapPlace = 'O-Room';
						overlap = true;
					}
					if (student.counters.ISSDays > 0) {
						overlapPlace = 'ISS';
						overlap = true;
					}
					if (student.counters.OSSPMP > 0) {
						overlapPlace = 'OSS';
						overlap = true;
					}

					if (overlap) {

						if (overlapPlace === 'OSS') {
							var modalInstance = $modal.open({
								templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
								//template:'<div> MODAL : true in Referral IN </div>',
								size: 'lg',
								controller: ["$scope", "student", "activity", function ($scope, student, activity) {
									$scope.student = student;
									console.log(student);
									$scope.activity = activity;
								}],
								resolve: {
									student: function () {
										return student;
									},
									activity: function () {
										return overlapPlace;
									}
								}
							});
							return true;
						} else {
							var modalInstance = $modal.open({
								templateUrl: 'views/modals/attendanceAECFoldersModal.html',
								//template:'<div> MODAL : true in Referral IN </div>',
								size: 'lg',
								controller: ["$scope", "student", "activity", function ($scope, student, activity) {
									$scope.student = student;
									console.log(student);
									$scope.activity = activity;
								}],
								resolve: {
									student: function () {
										return student;
									},
									activity: function () {
										return overlapPlace;
									}
								}
							});

							modalInstance.result.then(function () {
								var referrals = student.referred.map(function (o) {
									return {Id: o.Id, HasFolder: o.HasFolder || false};
								});
								var payload = {
									param: 'attendance',
									param2: 'hasFolders',
									ActionType: student.radioModel,
									Comment: student.comment,
									Date: $scope.currentDate,
									Referrals: referrals
								};
								var urlEncoded = {id: student.Id};
								aec.update(urlEncoded, payload, function (data) {
									notify(data.msg);
									var status = {class: 'bg-warning', action: 'foldersMarked'};
									student.status = status;
								}, function (err) {
									notify('error, Before continuing please contact an admin');
								});

							});
							return true;
						}

						return false;
					}
				}
				/********************************************** MODALS   **************************/

				/** Attendance Modal
				 * opens the attendance modal with 3 buttons (present, sent out, walked out 
				 * 
				 */
				$scope.AECAttendance = function (student, $index) {

					if (isOverlap(student)) {
						return;
					}

					console.log(student);
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/attendanceAECModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
						}],
						resolve: {
							student: function () {
								return student;
							}
						}
					});
					modalInstance.result.then(function (data) {// on SUBMIT
						var student = data.student;
						// check what buttons were present  and what assignments were completed
						// to set the color and the attendance 
						var assignments = {completed: [], incomplete: []};
						var status = {class: '', action: ''};
						if (student.radioModel == 49) {// present , check what assignments were completed
							//
							angular.forEach(student.referred, function (ref) {
								if (ref.AssignmentCompleted)
									assignments.completed.push(ref);
								else
									assignments.incomplete.push(ref);
							});
							status.action = 'Present: ';
							var aecComplete = false;

							if (assignments.incomplete.length === 0) {
								status.class = 'bg-green';
								status.action += 'complete';
								aecComplete = true;

							} else {
								status.class = 'bg-warning';
								status.action += 'incomplete';
							}

						} else if (student.radioModel == 55) {
							console.log('sent out');
							status.action = 'Sent Out: Oroom-today';
							status.class = 'bg-danger';
						} else if (student.radioModel == 56) {
							console.log('walked out');
							status.action = 'Walked Out: Oroom-tomorrow';
							status.class = 'bg-danger';
						}
						student.assignments = assignments;
						student.status = status;



						// post the comment and other things to the database 

						console.log(student);
						// sent when present
						var referrals = student.referred.map(function (o) {
							return {Id: o.Id, AssignmentCompleted: o.AssignmentCompleted};
						});
						// sent otherwhise
						var referralIds = student.referred.map(function (o) {
							return o.Id;
						});
						var urlEncoded = {id: student.Id};
						var payload = {
							param: 'attendance',
							ActionType: student.radioModel,
							Comment: student.comment,
							Date: $scope.currentDate,
							Referrals: student.radioModel == 49 ? referrals : referralIds,
							aecComplete: aecComplete
						};

						aec.update(urlEncoded, payload, function (data) {
							notify(data.msg);
						}, function (err) {
							notify('error, Before continuing please contact an admin');
						});



						// Do Not Remove From List
//						if ($index)
//							$scope.refTable.splice($index, 1);
//						else
//						
						// only clears the field
						$scope.selected.student = null;
					}, function () {// on modal DISMISS

					});

				};


				/** Reschedule Modal
				 * Opens the Reschedule modal and passes in the student selected to be available
				 * in the modal context, calls submitReschedule function when modal 
				 * submit button is clicked,does nothing otherwise
				 */
				$scope.openReschedule = function () {
					var resModal = $modal.open({
						templateUrl: 'views/modals/RescheduleModal.html',
						size: 'md',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
							$scope.date = new Date();

							$scope.$watch('form.date.$viewValue', function (newValue, oldValue) {
								if (newValue) { //when date has a valid date request the List from that date
									$scope.date = newValue;
									console.log('date changed');
								}
							});

						}],
						resolve: {
							student: function () {
								return $scope.selected.student;
							}
						}
					});// end modalInstance

					resModal.result.then(submitReschedule);
				};

				/** Clear Modal
				 * Opens the Clear modal and passes in the student selected to be available
				 * in the modal context, calls submitClear function when modal 
				 * submit button is clicked,does nothing otherwise
				 */
				$scope.openClear = function (studentInfo) {

					var clrModal = $modal.open({
						templateUrl: 'views/modals/ClearModal.html',
						size: 'md',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
							$scope.title = 'clear';
						}],
						resolve: {
							student: function () {
								return $scope.selected.student;
							}
						}
					});// End clrModal

					clrModal.result.then(submitClear);
				};

				/** Parent Notified Modal
				 * Opens the Parent Notified modal and passes in the student selected to be 
				 * available in the modal context, as well as the current date. 
				 * calls submitParentNotified function when modal submit 
				 * button is clicked,does nothing otherwise
				 * @param {object} stu: student selected for parent notified
				 */
				$scope.parentNotifiedModal = function (stu) {
					var parentModal = $modal.open({
						templateUrl: "views/modals/ParentModal.html",
						size: 'md',
						controller: ["$scope", "$modalInstance", "student", "date", function ($scope, $modalInstance, student, date) {
							$scope.student = student;
							$scope.date = date;

							$scope.$watch('form.date.$viewValue', function (newValue) {
								if (newValue) { //when date has a valid date request the List from that date
									$scope.date = newValue;
								}
							});
						}],
						resolve: {
							student: function () {
								return stu;
							},
							date: function () {
								return $scope.currentDate;
							}
						}
					});// end modal

					parentModal.result.then(submitParentNotified,
						function () {
							// change parent notified button it back to what it was
							stu.student.ParentNotified = !stu.student.ParentNotified;
						});

				};

				/**
				 * Removes $scope.selected student from the refTable and then
				 * sets it to null (clear field)
				 * 
				 */
				var removeSelectedStudentFromTableAndClear = function () {
//					for (var i = 0; i < $scope.refTable.length; i++)
//						if ($scope.selected.student.id === $scope.refTable[i].id) {
//							$scope.refTable.splice(i, 1);
//							break;
//						}
					$scope.selected.student = null;
				};
			}]);

}(angular.module('Argus')));						
/* global angular */

(function (app) {
	"use strict";
	app.controller("admin1referalController",
		["$scope", "assignmentsListService", "teachers", "AECListService", "StudentsService", '$modal', 'notify', '$http', '$localStorage',
			function ($scope, assignmentsService, teachers, aec, students, $modal, notify, $http, $localStorage) {
				$scope.selected = {}; // model for the possible selections (selected.student,   or seleted.assignments)
				$scope.currentDate = new Date(); // date on the datepicker
				$scope.teacherStudents = []; // model for autocomplete  

				$scope.$storage = $localStorage;

				// set ref table
				$scope.$storage.refTable = $scope.$storage.refTable || [];

				$scope.refTable = $scope.$storage.refTable; // model for dynamic table 
				$scope.edits = [];
				$scope.$storage.eightPeriods = $scope.$storage.eightPeriods || [];
				$scope.eightPeriods = $scope.$storage.eightPeriods;

				$scope.$storage.ninethPeriods = $scope.$storage.ninethPeriods || [];
				$scope.ninethPeriods = $scope.$storage.ninethPeriods;

				$scope.teachers = teachers.query();

				/**
				 * Watch for changes in the datepicker to add students to that date's
				 * AEC List
				 */
				$scope.$watch('form.date.$viewValue', function (newVal, oldVal) {
					if (newVal) {//when date has a valid date request the List from that date	
						$scope.currentDate = newVal;
					}
				});

				/* REFER A STUDENT LOGIC */


				/**
				 * Called when a student is selected or deselected 
				 * no action for now 
				 */
				$scope.onSelectedStudent = function () {
					return;
					// add to the list
					var alreadyInList = false;
					for (var i = 0; i < $scope.refTable.length; i++) {
						if ($scope.refTable[i].id === $scope.selected.student.user.id) {
							alreadyInList = true;
						}
					}
					if (!alreadyInList)
						$scope.refTable.push($scope.selected.student.user);
					else
						alert('student is already in the list');
					// clear the field
					//$scope.selected.student = null;
				};

				/**
				 * Called when teacher is selected or deselected. Retrieves the selected
				 * teacher's students if a teacher is selected.  If deselected
				 * set teacherStudents to null
				 */
				$scope.onSelectedTeacher = function () {
					if (!$scope.selected.teacher) {// if teacher deselected 
						$scope.teacherStudents = null;
						return;
					}
					var teacherId = $scope.selected.teacher.id;
					students.query({teacherId: teacherId}, function (results) {
						console.log("Teacher students");
						console.log(results);

						$scope.teacherStudents = results;
					}, function (error) {
						console.log(error);
					});

				};


				/** New Assignment Modal
				 * Opens the New Assignment modal and passes in the teacher selected to be available
				 * in the modal context, on submit makes a post call to assignments
				 * to add the current assignment to the teacher 
				 */
				$scope.openCreateNewAssignment = function () {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/addNewAssignmentModal.html',
						size: 'md',
						controller: ["$scope", "teacher", function ($scope, teacher) {
							$scope.teacher = teacher;
						}],
						resolve: {// variables that get injected into the controller (taken from current $scope)
							teacher: function () {
								return $scope.selected.teacher;
							}
						}
					}); // End modalInstace

					modalInstance.result.then(function (data) {
						assignmentsService.save({teacher: $scope.selected.teacher, assignment: data}, function (response) {
							var teacher = $scope.selected.teacher;
							response.assignment.Id = response.assignment.Id + "";
							$scope.selected.teacher.assignments.push(response.assignment);
							
							var assign = $scope.selected.assignments ;
							assign = assign? assign : [];
							assign.push(response.assignment);
						}, function (response) {
						});
					});
				};

				/**
				 * Adds selected.student with selected.assignments to the refTable
				 * then clears selected.student
				 */
				$scope.addToList = function () {
					var selectedAssignments = $scope.selected.assignments;
					var referralToAdd = $scope.selected.student;
					var selectedTeacher = $scope.selected.teacher;
					console.log($scope.selected.student);
					$http.get('api/classes/' + $scope.selected.student.id).then(function (response) {
						var last = response.data[7];
						var lastlast = response.data[8];
						$scope.eightPeriods.push(last);
						$scope.ninethPeriods.push(lastlast);
						console.log($scope.eightPeriods);
						console.log($scope.ninethPeriods);
					});

					addAssignmentsToStudent(selectedAssignments, referralToAdd);
					referralToAdd.teacher = $scope.selected.teacher;
					$scope.refTable.push(referralToAdd);
					console.log($scope.refTable);
					$scope.selected.student = null;
				};

				/**
				 * Adds assignments to the student object 
				 * @param  {[objects]} assignments	: list of assignment objects to be added
				 * @param 	{object} 	student		: 
				 */
				function addAssignmentsToStudent(assignments, student) {

					if (!student.referred) {// current student doesnt have any assignments, add all the selected assignments	
						//  copy assignments into referred
						student.referred = assignments.slice();
						return;
					}

					for (var i = 0; i < assignments.length; i++) {
						var j = false;
						for (j = 0; j < student.referred.length; j++) {
							if (student.referred[j].Id === assignments[i].Id)
								break;
						}

						if (j === student.referred.length)// assignment is not already in the student
							student.referred.unshift(assignments[i]);
					}


					delete student.selected; // delete the selected property;

				}

				/**
				 * POST API call to referrals. adds all the students in the refTable to the 
				 * current date's AEC list.
				 * Despite the number of assignmets only 1 entry should be loged in 
				 * into user activities with information containig the assignments
				 */
				$scope.submitReferedStudents = function () {
					// format the data so it an be easily insterted in the database
					var studentsReferred = [];
					angular.forEach($scope.refTable, function (student) {
						angular.forEach(student.referred, function (assignment) {


							var referral = {
								StudentId: student.id,
								TeacherId: assignment.TeacherId,
								AssignmentId: assignment.Id,
								Date: $scope.currentDate
							};
							studentsReferred.push(referral);
						});
					});
					if (studentsReferred.length)
						aec.save({data: studentsReferred, date: $scope.currentDate},
						function (response) {
							notify({message: "AEC List Was Submitted Successfully",
								classes: 'alert-success', templateUrl: 'views/common/notify.html'});
						}, function (response) {
							notify({message: "Submit Failed, Please Contact The Admin",
								classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
						});
					$scope.refTable = [];

				};

			}]);

}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('oRoomActivityLogAdminCtrl',
		['$scope', 'notify', 'StudentsService', 'teachers', '$modal', 'PeriodsService', '$interval', 'OroomService', 'ActivitiesService', 'referrals', 'ISSService','$rootScope','DevService','CountersService',
			function ($scope, notify, students, teachers, $modal, periods, $interval, orooms, activities, referrals, isss,$rootScope, dev, counters) {
				function footable_redraw(){
					$('.footable').trigger('footable_redraw');
				}
				
				$rootScope.$on('studentsUpdated', function(stu){
					$scope.schoolStudents = students.students;
				});
				var intervalPromise = $interval(interval, 2000);
				$scope.$on('$destroy', function () {
					$interval.cancel(intervalPromise); 
				});
				
				$scope.mouseOnTable = false;
				function interval() {
					var now = new Date();
					$scope.currentTime = formatAMPM(now);
					$scope.currentDate = formatDate(now);
					$scope.currentPeriod = getPeriod(now);
					if (!$scope.mouseOnTable) {
						orooms.get({}, function (data) {
							angular.forEach(data.reftable, function (item) {
								item.ReferralIn = item.ReferralIn === 1 ? true : false;
								
							});
							angular.forEach(data.OroomList, function(item){
								if(item.counters.ISSDays > 0){
									item.class =  'bg-danger';
								}
							});
							$scope.refTable2 = data.OroomList;
							$scope.refTable1 = data.reftable;
							footable_redraw();
						});
					}

					//console.log($scope.currentPeriod)
					// check time and change period accordingly 
//				if ($scope.currentPeriod) {// period changed programatically
//					getORoomLists($scope.currentPeriod);
//				}

				}
				;
				
				$scope.refresh = getORoomLists;
				$scope.selected = {student: null};
				$scope.refTable1 = [];
				$scope.refTable2 = [];
				$scope.activities = [
					{Name: "In O-Room", Id: 1},
					{Name: "Assign ISS", Id: 2},
					{Name: "Walked-Out", Id: 3},
					{Name: "No Show", Id: 4},
					{Name: "Other", Id: 5}
				];


				$scope.periods = periods.query(function (data) {
					$scope.currentPeriod = data[6];

					interval();
				});

				$scope.schoolStudents = students.students;
				$scope.teachers = teachers.query();



				$scope.changePeriodTables = function (newPeriod) {
					$scope.currentPeriod = newPeriod;

				};




				$scope.onSelectedStudent = function () {
					// default activity to In O-Room
					$scope.selected.student.activity = $scope.activities[0];

					// preprocess the data to send
					var date = formatDate(new Date);
					var dataToSend = {
						"StudentId": $scope.selected.student.user.id,
						"PeriodId": $scope.currentPeriod ? $scope.currentPeriod.Id : 14,
						"ActivityId": $scope.selected.student.activity.Id,
						"Date": date
					};

					//post data to oroomactivity 
					orooms.save({reftable: true}, dataToSend, function (data) {
						console.log('data saved');
						console.log(data);

						// add too the left table
						$scope.refTable1.unshift(data);
					}, function (error) {
						notify('Error');
					});

					// clear field
					$scope.selected.student = null;

				};

				$scope.onTeacherChanged = function (item) {
					updateTable1Record(item);
				};

				$scope.onActivitySelected = function (student, oldActivity) {
					//console.log(student.activity);
					//console.log(angular.fromJson(oldActivity));
					if (student.activity.Id !== 2) {
						updateTable1Record(student);
						return;
					}
					// go here if Assign ISS is not selected
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/ISSReferralModal.html',
						//template: '<div> MODAL: assignISS selected</div>',
						size: 'lg',
						controller: ["$scope", "student", "currentUser", function ($scope, student, currentUser) {
							$scope.student = student;
							$scope.currentUser = currentUser;
						}],
						resolve: {
							student: function () {
								return student;
							},
							currentUser: function () {
								return JSON.parse(localStorage.getItem('user'));
							}
						}
					});

					modalInstance.result.then(function () {//on SUBMIT
						// post the ISS referral to the database 
						isss.save({
							StudentId: student.student.id,
							ReferralTypeId: 5,
							ActionType: 20,
							Comment: student.comment
						},function(data){
							notify('success');
						}, dev.openError);

						updateTable1Record(student);

						// change row to non removable
						student.nonRemovable = true;

						student.staticActivity = true;

					}, function () {// modal dismissed
						// change the activity back to what it was
						student.activity = angular.fromJson(oldActivity);
						//updateTable1Record(student);
						
					});
				};

				$scope.onReferralInTrue = function (student) {
					if (student.ReferralIn === false) {
						updateTable1Record(student);
						return;
					}
					if (!student.teacher || student.teacher.id == 0) {
						notify({message: 'Please Select A Teacher First'});
						student.ReferralIn = false;
						return;
					}
					// check referral type 
					students.get({id: student.student.id}, function (data) {
						var oroomsToBeSeved = data.counters.ORoomsToBeServed;
//					if(oroomsToBeSeved === 0)
						student.referralType = "First Time - Teacher";
//					else{
//						student.referralType = ""
//					}

						angular.forEach(data.activitiesAffected, function (item) {
							if (item.Date === $scope.currentDate)
								student.referralType = "O-Room Referral → ISS";
						});
					});

					var modalInstance = $modal.open({
						templateUrl: 'views/modals/oRoomReferralModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
						}],
						resolve: {
							student: function () {
								return student;
							}
						}
					});



					modalInstance.result.then(function () {// on SUBMIT
						// post the comment and other things to the database 


						// put reftable
						updateTable1Record(student);
						var dataToSend = {
							Date: $scope.currentDate,
							PeriodId: $scope.currentPeriod? $scope.currentPeriod.Id:0 ,
							StudentId: student.StudentId,
							TeacherId: student.teacher.id,
							ReferralType: student.referralType,
							Comment: student.comment
						};
						orooms.save({ormlist: true}, dataToSend, function (data) {
							notify('success');
							$scope.refTable2.unshift(data);
						}, function (error) {
							notify('error');
						});

						//change switch  to static 
						student.staticRef = true;
						// change teacher to static
						student.staticTeacher = true;
						// change row to non removable
						student.nonRemovable = true;

					}, function () {// on modal DISMISS
						student.ReferralIn = false;
					});

				};

				$scope.onDeleteTable1 = function ($index) {
					// perform a DELETE request
					var obj = $scope.refTable1[$index];
					orooms.delete({id: obj.Id, reftable: true}, function (data) {
						notify('success');
						$scope.refTable1.splice($index, 1);
					}, function (error) {
						notify('error');
					});
				};

				$scope.onDeleteTable2 = function ($index) {
					var item = $scope.refTable2[$index];
					//checks before opening the modal 

					var modalInstance = $modal.open({
						templateUrl: 'views/modals/oRoomCoordinatorUpdateModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: ["$scope", "student", function ($scope, student) {
							$scope.student = student;
						}],
						resolve: {
							student: function () {
								return $scope.refTable2[$index];
							}
						}
					});

					modalInstance.result.then(function () {// on SUBMIT
						// post the comment and other things to the database 
						var payload = {
							counters: item.counters,
							Comment: item.comment
						};
						counters.update({id:item.Id}, payload,function(data){
							
						}, dev.openError);

						//add student to the list on the right
						$scope.refTable2.splice($index, 1);

					}, function () {// on modal DISMISS
					});
				};


				function formatAMPM(date) {
					var hours = date.getHours();
					var minutes = date.getMinutes();
					var seconds = date.getSeconds();
					var ampm = hours >= 12 ? 'pm' : 'am';
					hours = hours % 12;
					hours = hours ? hours : 12; // the hour '0' should be '12'
					hours = hours < 10 ? '0' + hours : hours;
					minutes = minutes < 10 ? '0' + minutes : minutes;
					seconds = seconds < 10 ? '0' + seconds : seconds;
					var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
					return strTime;
				}

				function formatTime24(date) {
					var hours = date.getHours();
					var minutes = date.getMinutes();
					var seconds = '00';
					hours = hours < 10 ? '0' + hours : hours;
					minutes = minutes < 10 ? '0' + minutes : minutes;
					var strTime = hours + ":" + minutes + ":" + seconds;
					return strTime;
				}

				function formatDate(date) {
					var month = date.getMonth() + 1;
					var day = date.getDate();
					var year = date.getFullYear();
					var strDate = month + '/' + day + "/" + year;
					return strDate;
				}

				function getPeriod(date) {
					var currentPeriod = null;
					var datestr = formatTime24(date);
					//console.log(datestr);
					angular.forEach($scope.periods, function (item) {
						if (datestr > item.StartTime) {
							//console.log('datestr < ' + item.StartTime);
							if (datestr < item.EndTime) {
								//console.log('datestr < ' + item.EndTime);
								currentPeriod = item;
							}
						}


					});
					return currentPeriod;
				}

				function updateTable1Record(item) {
					console.log(item);
					var dataToSent = {
						SentOutById: item.teacher ? item.teacher.id : 0,
						ActivityId: item.activity ? item.activity.Id : 0,
						ReferralIn: item.ReferralIn ? 1 : 0
					};
					orooms.update({id: item.Id, reftable: true}, dataToSent);
				}

				function getORoomLists(period) {
					orooms.get({}, function (data) {
						angular.forEach(data.reftable, function (item) {
							item.ReferralIn = item.ReferralIn === 1 ? true : false;
						});

						$scope.refTable1 = data.reftable;
						$scope.refTable2 = data.OroomList;
					});
				}
				getORoomLists();
			}]);
}(angular.module('Argus')));
/* global angular */

(function(app){
	"use strict";
	app
	.controller("studentInfoCtrl", ["$scope", "StudentsService",  function ($scope, students) {
		$scope.students;  // model for autocomplete
		$scope.toShow = []; //list of profiles to show on the view
		//student information from the database 
		
		$scope.students = students.query({admin:true, light:true});
		
		
		$scope.max = 4;
		$scope.profiles = ['', '', '', ''];
		$scope.selected = {};
		$scope.active = 0;
		$scope.onEnter = function () {
			// get more information of the selected student 
			students.get({id:$scope.selected.student.Id}, function(data){
				$scope.selected.student = data;
				$scope.toShow.push($scope.selected.student);
				$scope.active++; // increase number of active profiles
				$scope.selected.student = null; // clear search field
			});
			
			//$scope.profiles[$scope.active] = $item; //
			
			
			
		};
		$scope.remove = function ($index) {
			$scope.toShow.splice($index, 1);
			//$scope.profiles[$index] = '';
			$scope.active--;
		};
		
		
		
	}]);	
}(angular.module('Argus')));