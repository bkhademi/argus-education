/**
 * Created by Brandon on 5/19/2016.
 */
(function (app) {

   app.controller("CompiledListCtrl",function($scope,referrals,StudentsService){
       $scope.refTable = referrals.getList();
       $scope.refTable.then(processlist,error)
       function processlist(list){
           $scope.refTable = list.list;
           angular.forEach(list.list,StudentsService.addTodaysAct);
       }
       function error (){
           console.log("error");
       }
   })

}(angular.module("Argus")));
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
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
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
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
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
	app.controller('NavigationAdmin1Ctrl', ['ISSFollowupService', 'ISSService', 'LunchService', 'OroomService', 'AECListService', 'AECAbsenceListService','ReteachListService', 'ReteachAbsenceListService','OSSService',
		function (issfs, isss, lunchs, orooms, aecs, aecfs ,reteachs, reteachfs, osss) {
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
				, {
					id: 'ORoom Coordinator Referral',
					link: "admin1.CoordinatorReferralSystem",
					icon: 'pencil-square-o fa-2x'
				}, {
					id: 'Attendance Rosters',
					link: "admin1.attendanceRosters.oroom",
					icon: 'list-alt fa-2x'
				}, {
					id: 'ISS Followup List',
					link: "admin1.issFollowup",
					icon: 'list-alt fa-2x'
				}, {
					id: 'Parent Meeting List',
					link: "admin1.parentMeetingList",
					icon: 'list-alt fa-2x'
				}, {
					id: 'Reports',
					link: 'admin1.reports.eod',
					icon: 'area-chart fa-2x'
				},{
					id: 'Schedule',
					link: 'admin1.schedule',
					icon: 'area-chart fa-2x'
				}
			];

			vm.count = {};
			issfs.get({roster: true, count: true}, function (data) { vm.count.issFollowup = parseInt(data[0]); });
			isss.get({roster: true, count: true}, function (data) { vm.count.iss = parseInt(data.count); });

			lunchs.get({count: true, roster: true}, function (data) { vm.count.lunch = data.lunchStudentsCount; });
			orooms.get({count: true, roster: true}, function (data) { vm.count.oroom = data.OroomList; });

			aecs.get({roster: true, count: true}, function (data) { vm.count.aec = data.aecCount; });
			aecfs.get({roster: true, count: true}, function (data) { vm.count.aecFollowup = data.aecAbsentCount; });

			reteachs.get({roster: true, count: true}, function (data) { vm.count.reteach = data.reteachCount; });
			reteachfs.get({roster: true, count: true}, function (data) { vm.count.reteachFollowup = data.reteachAbsentCount; });
			osss.get({count:true, param:'ossList' }, function(data){vm.count.oss = data.count;});
		}]);
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
                                }, {
                                    name: 'datePicker',
                                    files: ['css/plugins/datapicker/angular-datapicker.min.css', 'js/plugins/datapicker/angular-datepicker.min.js']
                                },
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

                //update schedules
                .state('admin1.schedule', {
                    url: '/schedule',
                    templateUrl: 'views/admin1/schedule.html',
                    data: {pageTitle: 'Reports'},
                    controller: 'ScheduleController',
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
                .state('admin1.compList', {
                    url: '/compList',
                    templateUrl: 'views/admin1/compList.html',
                    data: {pageTitle: 'Compiled List'},
                    controller: 'CompiledListCtrl',
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
                                },
                            ]);
                        }
                    }
                })
            ;


        }]);

}(angular.module('Argus')));
(function (app) {
	"use strict";
	app.
		controller("ScheduleController",
			["$scope", '$modal', 'notify', '$http',
				function ($scope, assignmentsService, teachers, referrals, students, $modal, notify, $http, reteach, ProfessorClassesService) {
					$scope.currentDate = new Date(); // date on the datepicker

					$scope.dropzoneConfig = {
						maxFileSize:1,

						options: {// passed into the Dropzone constructor
							url: api+'schedule',
							paramName:"file",
							acceptedFiles: ".xlsx",
							uploadMultiple: false,
							headers: { 'Authorization':'Bearer '+ localStorage.getItem('satellizer_token') }

						},
						eventHandlers: {
							success: function (file, response) {
							},
						},

					}; // end dropzoneConfig


				}])

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
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
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
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
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
            }, {
                id: 'Reports',
                link: 'admin2.reports.eod',
                icon: 'area-chart fa-2x'
            }

        ];
    });
}(angular.module('Argus')));


/* global angular */

(function (app) {
    app.controller('ORoomCoordinatorReferralCtrl',
        ['$scope', '$modal', 'MyNotify', 'StudentsService', 'teachers', 'DevService', 'LunchService', 'OroomService', 'ISSService', 'CountersService', 'ReferralsService',
            function ($scope, $modal, notify, students, teachers, dev, lunchs, orooms, isss, counters, referrals) {
                $scope.currentDate = new Date();
                $scope.selected = {};
                $scope.$watch('form.date.$viewValue', function (newVal) {
                    if (newVal) //when date has a valid date request the List from that date
                        $scope.currentDate = newVal;
                });


                $scope.currentDate = new Date();
                $scope.schoolStudents = students.query({admin: true, light: true}, function () {
                }, function (error) {
                    dev.openError(error);
                });

                $scope.teachers = teachers.query();

                $scope.assignLunch = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/lunchDetentionModal.html',
                        size: 'lg',
                        controller: function ($scope, student, PeriodsService) {
                            $scope.periods = PeriodsService.query();
                            $scope.student = student;
                        },
                        resolve: {
                            student: function () {
                                return $scope.selected.student;
                            }
                        }
                    });

                    modalInstance.result.then(function () {// on SUBMIT
                        // post the comment and other things to the database
                        lunchs.saveReferral($scope.currentDate,$scope.selected.student).then(function (data) {
                            notify(data.msg,'success');
                            $scope.selected.student = null;
                        }, dev.openError);

                    });
                };

                $scope.assignORoom = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/assignOroomModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student, teachers) {
                            $scope.student = student;
                            $scope.teachers = teachers;
                        },
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
                            ActivityTypeId: 1,
                            ReferralTypeId: 1,
                            Comment: student.comment,
                            Date: $scope.currentDate
                        };

                        orooms.save({ormlist: true}, payload, function () {
                            notify('success','success');
                            orooms.count++;
                        }, dev.openError);

                        $scope.selected.student = null;
                    });
                };

                $scope.assignISS = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/ISSReferralAdminModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student, PeriodsService) {
                            $scope.periods = PeriodsService.query();
                            $scope.student = student;
                        },
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
                            Comment: student.comment,
                            Date: $scope.currentDate
                        }, function (data) {
                            notify(data.msg,'success');
                        }, dev.openError);

                        $scope.selected.student = null;
                    });
                };

                $scope.changeAndComment = function () {
                    var selected = $scope.selected;
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/oRoomCoordinatorUpdateAdminModal.html',
                        size: 'lg',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            console.log(student);
                        },
                        resolve: {
                            student: function () {
                                counters.get({id: $scope.selected.student.Id}, function (data) {
                                    $scope.selected.student.counters = data;
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
                            {
                                counters: item.counters,
                                Comment: data.comment
                            }, function () {
                                notify('success','success');
                            }, function (error) {
                                dev.openError(error);
                            });
                        $scope.selected.student = null;
                    });
                };

                $scope.clear = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/ClearReferralsModal.html',
                        size: 'lg',
                        controller: function ($scope, PeriodsService, student, teachers) {
                            $scope.student = student;
                            $scope.teachers = teachers;
                            $scope.onReferralRemove = function ($index) {

                            }
                        },
                        resolve: {
                            student: function () {
                                referrals.query({StudentId: $scope.selected.student.Id}, function (data) {

                                    $scope.selected.student.referred = data;
                                    return $scope.selected.student;
                                });
                                return $scope.selected.student;
                            },
                            teachers: function () {
                                return $scope.teachers;
                            }
                        }
                    });

                    modalInstance.result.then(function () {// on SUBMIT
                        var student = $scope.selected.student;


                        referrals.deleteReferralsFromStudent($scope.currentDate, student).then(function (data) {
                            notify(data.msg, 'success');
                        }, dev.openError);

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
                    templateUrl: "views/common/contentArgusAECCoordinator.html",
                    controller: "NavigationAdmin2Ctrl",
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
                .state('admin2.referral', {
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
                .state('admin2.AECList', {
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
                .state('admin2.pending', {
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
                .state('admin2.studentData', {
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
                .state('admin2.createStudentPass', {
                    url: "/createStudentPass",
                    templateUrl: 'views/sharedItems/multiplePasses.html',
                    data: {pageTitle: 'Create Pass'}
                })

                .state('admin2.reports', {
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
                .state('admin2.reports.eod', {
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

			lunchs.query({roster: true,count:true}, function (data) {
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
					controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
						$scope.graphOptions = graphOptions;
						$scope.graphData = graphData;

						$timeout(function () {
							$scope.drawGraph = true;
						}, 100);


						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};
					},
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
	app.controller('NavigationAdmin3Ctrl', ['LunchService', 'OroomService','$scope',
		function (lunchs, orooms,$scope) {
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
				}, {
					id: 'Activity Log',
					link: 'admin3.oroomActivityLogAdmin',
					icon: 'tasks fa-2x'
				}, {
					id: 'Create Referral',
					link: "admin3.CoordinatorReferralSystem",
					icon: 'pencil-square-o fa-2x'
				}, {
					id: 'Attendance Rosters',
					link: "admin3.attendanceRosters.oroom",
					icon: 'list-alt fa-2x'
				}, {
					id: 'Reports',
					link: 'admin3.reports.eod',
					icon: 'area-chart fa-2x'
				}

			];
			vm.oroom = orooms;
			vm.lunch = lunchs;
			orooms.getCount();
			lunchs.getCount();
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
(function (app) {
	app.controller('AECLiveCtrl', ['$scope', 'AECListService',
		function ($scope, aec) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function (date) {
				aec.getList(date, function (data) {
					$scope.refTable = data;
					$scope.count.aec = data.length;
				});
			};
			$scope.getList($scope.currentDate);

		}]);
}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('ISSLiveCtrl', ['$scope', '$interval', 'ISSService',
		function ($scope, $interval, isss) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function (date) {
				isss.getList(date, function (data) {
					$scope.refTable = data;
					$scope.count.iss = data.length;
				});
			};
			$scope.getList($scope.currentDate);


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
		['$scope', '$interval','FormatTimeService','OroomService', 'LunchService','ISSService','OSSService','ReteachListService','AECListService',
			function ($scope,  $interval, time, orooms, lunchs, isss, osss,reteach,aec) {

				$scope.currentDate = formatDate(new Date());
				$scope.child = {};
				$scope.count  = {};
				$scope.$watch('form.date.$viewValue',function(n,o){
					if(n){
						$scope.currentDate = n;
						console.log('new date ',n);
						$scope.child.getList($scope.currentDate);
					}

				});

					var intervalPromise = $interval(function () {
						$scope.child.getList($scope.currentDate);
					}, 5000);
					$scope.$on('$destroy', function(){
						$interval.cancel(intervalPromise);
					});


				// clock
				var intervalPromise2 = $interval(function(){
					$scope.currentTime = time.formatAMPM(new Date());
				}, 1000);
				$scope.$on('$destroy', function(){
					$interval.cancel(intervalPromise2);
				});

				lunchs.get({count:true, roster:true},function(data){ $scope.count.lunch = data.lunchStudentsCount;});
				orooms.get({count:true, roster:true}, function(data){ $scope.count.oroom = data.OroomList;});
				isss.get({count:true, roster:true}, function(data){$scope.count.iss = data.count;});
				osss.get({count:true, param:'ossList', }, function(data){$scope.count.oss = data.count;});
				reteach.get({count:true,roster:true},function(data){$scope.count.reteach = data.reteachCount;});
				aec.get({count:true,roster:true},function(data){$scope.count.aec = data.aecCount;});

				
			}]);
}(angular.module('Argus')));

/* global angular */

(function (app) {
	app.controller('LunchDetentionLiveCtrl', ['$scope', '$interval',  'DevService', 'LunchService',
		function ($scope, $interval, dev, lunchs) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function(date) {
				lunchs.getList(date).then(function (data) {
					// separate the lists by the lunch type of the students
					$scope.lunchTableA = [];
					$scope.lunchTableB = [];
					$scope.lunchTableC = [];
					$scope.lunchTable = data.lunchStudents;
					$scope.count.lunch = data.lunchStudentsCount;
					angular.forEach(data.lunchStudents, function (item) {
						if (item.LunchType && item.LunchType.search(/a/i) != -1)
							$scope.lunchTableA.push(item);
						else if (item.LunchType && item.LunchType.search(/b/i) != -1)
							$scope.lunchTableB.push(item);
						else
							$scope.lunchTableC.push(item);

					});

				});
			};
			$scope.getList($scope.currentDate);


		}]);
}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('OroomLiveCtrl', ['$scope', '$interval',  'OroomService', 'FormatTimeService','PeriodsService',
		function ($scope, $interval,  orooms, time, periods) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			var intervalPromise = $interval(interval, 5000);
			
			$scope.$on('$destroy',function(){
				$interval.cancel(intervalPromise); 
			});

			function interval() {
				var now = new Date();
				$scope.currentPeriod = getPeriod(now);
			}

			$scope.changePeriodTables = function (newPeriod, manual) {
				$scope.currentPeriod = newPeriod;
			};


			$scope.periods = periods.query(function (data) {
				$scope.currentPeriod = getPeriod(new Date());
				interval();
			});

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


			$scope.getList = function(date) {
				orooms.get({Date:date}, function (data) {
					angular.forEach(data.reftable, function (item) {
						item.ReferralIn = item.ReferralIn === 1 ;
					});
					$scope.refTable = data.reftable;
					$scope.oroomlist = data.OroomList;
				});
			};
			$scope.getList($scope.currentDate);


		}]);
}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global angular */

(function (app) {
	app.controller('OSSLiveCtrl', ['$scope', '$interval', 'OSSService',
		function ($scope, $interval, osss) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;
			$scope.getList = function(date) {
				$scope.oss = osss.getOSSList(date);
			};
			$scope.getList($scope.currentDate);
		}]);
}(angular.module('Argus')));
(function (app) {
	app.controller('ReteachCtrl', ['$scope', 'ReteachListService',
		function ($scope, reteach) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function (date) {
				reteach.getList(date, function (data) {
					$scope.refTable = data;
					$scope.count.reteach = data.length;
				});
			};
			$scope.getList($scope.currentDate);

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
            ["$scope", "StudentsService", "$http", '$rootScope', 'ProfessorClassesService', 'RoomsService', 'ClassStudentsService', 'notify',
                function ($scope, students, $http, $rootScope, professorclasses, rooms, ClassStuSer, notify) {
                    $scope.schedule = []; // holds  student's schedule
                    $scope.activities = []; // holds student'activities
                    $scope.checks = [];
                    $scope.currentDate = new Date();
                    $scope.classes = professorclasses.query();

                    $scope.$watch('checks', function (n, o) {
//			console.log(n);
                    }, true);
                    $scope.role = $rootScope.currentUser.role;
                    $scope.downloadActivity = function () {
                        var text = '';
                        var heading = 'Date,ActionBy,Activity,Comment \n';
                        text += heading;
                        angular.forEach($scope.activities, function (act) {
                            text += '"' + act.ActionDate.split(' ')[0] + '",';
                            text += '"' + (act.user && act.user.FirstName ) + ', ' + (act.user && act.user.LastName ) + '",';
                            text += '"' + act.activity.Name + '",';
                            text += '"' + (act.Comment || '') + '",';
                            text += "\n";
                        });


                        download(text, $scope.student);
                    };
                    var download = function (text, student) {

                        //console.log(text);
                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURI(text));
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
                            email: 'None'
                        }];

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
                        {
                            date: formatDate(new Date),
                            activity: "comment",
                            Comment: $scope.comment,
                            staff: $rootScope.currentUser.FirstName + ' ' + $rootScope.currentUser.LastName
                        };
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

                    $scope.enableClassEdit = function ($index, classes) {
                        classes[$index].editing = true
                    };

                    $scope.submitClassChange = function ($index, classes) {
                        var newClass = $scope.student.ProfessorClass;
                        var classToBeModified = classes[$index];
                        ClassStuSer.update({id: classToBeModified.Id}, {professorClassId: newClass.Id}, function (data) {
                            console.log('success');
                            notify("Hooray! Class Successfully Changed!");
                            classToBeModified.professor_class = newClass;
                            classes[$index].editing = false;
                        }, function (error) {
                            notify("Ops! Something went wrong, please try again")
                        });

                    };
                    $scope.cancelClassChange = function ($index, classes) {
                        classes[$index].editing = false
                    };
                    $scope.enableContactEdit = function () {
                        $scope.student.GuardianNameCopy = $scope.student.GuardianName;
                        $scope.student.GuardianPhoneCopy = $scope.student.GuardianPhone;
                        $scope.student.GuardianMPhoneCopy = $scope.student.GuardianMPhone;
                        $scope.student.contactEdit = true;
                    };
                    $scope.submitContactChange = function(){
                        students.update({id: $scope.student.Id, updateStudent: true}, {
                            GuardianName: $scope.student.GuardianNameCopy,
                            GuardianPhone: $scope.student.GuardianPhoneCopy,
                            GuardianMPhone: $scope.student.GuardianMPhoneCopy

                        },function(){
                            notify("Hooray! Parent Contact Updated!");
                            $scope.student.GuardianName = $scope.student.GuardianNameCopy;
                            $scope.student.GuardianPhone = $scope.student.GuardianPhoneCopy;
                            $scope.student.GuardianMPhone = $scope.student.GuardianMPhoneCopy;
                            $scope.student.contactEdit = false;
                        },function(error){
                            notify("Ops! Something went wrong, please try again");
                        });
                    };
                    $scope.cancelContactChange = function(){
                        $scope.student.contactEdit = false;
                    };
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
				.state('student.dashboard', {
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
				.state('teacher.dashboard', {
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

				$scope.oroom = orooms;
				$scope.lunch = lunchs;
				lunchs.getCount();
				orooms.getCount();
				isss.get({count:true, roster:true}, function(data){$scope.count.iss = data.count;});
				osss.get({count:true, param:'ossList', }, function(data){$scope.count.oss = data.count;});
			}]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
    app.controller('ISSRosterController', ['$scope', 'MyNotify', '$modal', 'ISSService','UtilService',
        function ($scope, notify, $modal, isss, utils) {
            $scope.currentDate = new Date();
            $scope.selected = {};
            $scope.$watch('form.date.$viewValue', function (newVal) {
                if (newVal) {//when date has a valid date request the List from that date
                    $scope.currentDate = newVal;
                    $scope.getList();
                }
            });

            $scope.getList = function () {
                $scope.refTable = isss.getList($scope.currentDate, function(data){
                    $scope.count.iss = data.length;
                });
            };

            $scope.onSelect = function ($index) {
                $scope.selected.student = $scope.refTable[$index];
            };

            $scope.issAttendance = function (student) {


                if(student.referred[0].RefferalStatus === 1 || student.referred[0].RefferalStatus === 16 ) {
                    notify('Action Unavailable : Attendance  Already taken. ');
                    return;
                }

                var overlap = false;
                var overlapPlace = '';

                if (student.overlap.hasoss) {
                    overlapPlace = 'OSS';
                    overlap = true;
                }
                if (student.overlap.hasaec) {
                    // show present for AEC
                }


                if (overlap) {
                    modalInstance = $modal.open({
                        templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student, activity) {
                            $scope.student = student;
                            console.log(student);
                            $scope.activity = activity;
                        },
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
                    controller: function ($scope, student) {
                        $scope.student = student;

                        $scope.$watch('form.date.$viewValue', function(n,o){
                            console.log(n);
                            student.moveDate = n;
                        });
                        $scope.selectedReferralToRemove = function(){
                            var selectedCount = 0;
                            angular.forEach(student.referred,function(item){
                                if(item.remove)
                                    selectedCount++;
                            });
                            console.log('removing ', selectedCount);
                            student.removingAll = selectedCount == student.referred.length;
                        }


                    },
                    resolve: {
                        student: function () {
                            return student;
                        }
                    }
                });

                modalInstance.result.then(function () {// on SUBMIT
                    // post the comment and other things to the database
                    isss.updateAttendance($scope.currentDate, student)
                        .then(function (data) {
                            notify(data.msg);
                            $scope.selected.student = null;
                        }, function (error) {
                            notify('error, Before continuing please contact the system admin');
                        });
                });


            };

            $scope.printList = function () {
                var heading = 'First Name, Last Name, Student ID, 1st Per., 2nd Per., Referral Type, '
                    + 'ISS Days, ORM Days, Overlap, Attendance,  \n';
                var text = heading;
                angular.forEach($scope.refTable, function (item) {
                    text += item.user.FirstName + ', ' + item.user.LastName + ', ';
                    text += item.StudentId + ',' + item.classes[0].professor_class.room.Name + ',' + item.classes[1].professor_class.room.Name + ',';
                    text += item.referred[0].referral_type.Name + ', ';
                    text += item.counters.ISSDays + ', ';
                    text += item.counters.ORoomsToBeServed + ', ';
                    text += item.overlap.msg + ',';
                    text += item.referred[0].activity.Name;

                    text += '\n';
                });

                utils.downloadCSV(text, 'ISS-List_'+ $scope.currentDate);
            };

        }]);
}(angular.module('Argus')));
/* global angular */

(function (app) {
    app.controller('LunchDetentionRosterCtrl', ['$scope', 'MyNotify', '$modal', 'LunchService', '$rootScope',
        function ($scope, notify, $modal, lunchs, $rootScope) {
            $scope.selected = {};
            $scope.currentDate = new Date();


            $scope.getList = function(date) {
                date = date || $scope.currendDate;
                lunchs.getList($scope.currentDate).then( function (data) {
                    $scope.lunchTableA = [];
                    $scope.lunchTableB = [];
                    $scope.lunchTableC = [];
                    $scope.lunchTable = data.lunchStudents;
                    $scope.count.lunch = data.lunchStudentsCount;

                    angular.forEach(data.lunchStudents, function (item, $index) {
                        if (item.LunchType && item.LunchType.search(/A/i) != -1 )
                            $scope.lunchTableA.push(item);
                        else if (item.LunchType && item.LunchType.search(/B/i) != -1 )
                            $scope.lunchTableB.push(item);
                        else
                            $scope.lunchTableC.push(item);

                    });

                }, function () {
                    notify('error');
                });
            };

            $scope.$watch('form.date.$viewValue', function (newVal) {
                if (newVal) {
                    //when date has a valid date request the List from that date
                    $scope.currentDate = newVal;
                    $scope.getList();
                }
            });

            $scope.onSelect = function (item) {
                $scope.selected.student = item;
            };

            $scope.lunchAttendance = function (student, $index) {
                if (student.referred[0].RefferalStatus === 1) {
                    notify('Action Unavailable : Attendance  Already taken. ');
                    return;
                }
                var modalInstance;

                var overlap = false;
                var overlapPlace = '';


                if (student.overlap.hasoss) {
                    overlapPlace = 'OSS';
                    overlap = true;
                } else if (student.overlap.hasiss && !student.overlap.isscleared) {
                    overlapPlace = 'ISS';
                    overlap = true;
                }


                if (overlap) {
                    modalInstance = $modal.open({
                        templateUrl: 'views/modals/AttendanceUnavailableModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student, activity) {
                            $scope.student = student;
                            console.log(student);
                            $scope.activity = activity;
                        },
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
                    controller: function ($scope, student, PeriodsService) {
                        $scope.periods = PeriodsService.query();
                        $scope.student = student;
                    },
                    resolve: {
                        student: function () {
                            return student;
                        }
                    }
                });

                modalInstance.result.then(function () {// on SUBMIT
                    // post the comment and other things to the database
                    lunchs.updateAttendance($scope.currentDate, student, function (data) {
                            notify(data.msg);
                            $scope.selected.student = null;
                        }, function (data) {
                            notify('error');
                        }
                    );
                    return;


                });


            };

            $scope.markAllPresent = function(){
                angular.forEach($scope.lunchTable,function(stu){
                    stu.ActivityTypeId = 31;
                    stu.comment = '';
                    if(stu.overlap.hasiss)
                        return;
                    lunchs.updateAttendance($scope.currentDate,stu,function(data){
                        debugger;
                    },function(data){
                        debugger;
                    });
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
    app.controller('OroomRosterCtrl', ['$scope', 'MyNotify', '$modal', 'OroomService', "AECListService", 'UtilService',
        function ($scope, notify, $modal, orooms, aec, utils) {
            $scope.currentDate = new Date();
            $scope.selected = {};
            $scope.$watch('form.date.$viewValue', function (newVal) {
                if (newVal) {//when date has a valid date request the List from that date
                    console.log('new', newVal)
                    $scope.currentDate = newVal;
                    $scope.getList();
                }
            });

            $scope.getList = function () {
                var periodIds = [8];
                orooms.getList($scope.currentDate,periodIds).then(function (data) {
                    $scope.refTable = data.OroomList;
                    $scope.count.oroom = data.OroomListCount;
                });
            };

            $scope.onSelect = function ($index) {
                $scope.selected.student = $scope.refTable[$index];
            };

            $scope.oRoomAttendance = function (student) {
                if(student.referred[0].RefferalStatus === 1  ) {
                    notify('Action Unavailable : Attendance  Already taken. ');
                    return;
                }
                var modalInstance;
                console.log('o-room attendance');

                var overlap = false;
                var overlapPlace = '';

                if (student.overlap.hasiss && !student.overlap.isscleared ) {
                    overlapPlace = 'ISS';
                    overlap = true;
                }
                if (student.overlap.hasoss) {
                    overlapPlace = 'OSS';
                    overlap = true;
                }
                overlap = false;
                if (overlap) {
                    modalInstance = $modal.open({
                        templateUrl: 'views/modals/AttendanceUnavailableModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student, activity) {
                            $scope.student = student;
                            console.log(student);
                            $scope.activity = activity;
                        },
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
                    size: 'lg',
                    controller: function ($scope, student) {
                        $scope.student = student;
                        $scope.$watch('form.date.$viewValue', function(n,o){
                            console.log(n);
                            student.moveDate = n;
                        });
                        $scope.selectedReferralToRemove = function(){
                            var selectedCount = 0;
                            angular.forEach(student.referred,function(item){
                                if(item.remove)
                                    selectedCount++;
                            });
                            console.log('removing ', selectedCount);
                            student.removingAll = selectedCount == student.referred.length;
                        }
                    },
                    resolve: {
                        student: function () {
                            return student;
                        }
                    }
                });

                modalInstance.result.then(function () {// on SUBMIT
                    // post the comment and other things to the database
                    orooms.updateAttendance($scope.currentDate, student).then(function (data) {
                        notify(data.msg);
                        $scope.selected.student = null;
                    });


                }, function () {// on modal DISMISS

                });

            };

            $scope.printList = function () {
                var heading = 'First Name, Last Name, Student ID, Pending Days, Referral Type, 8th period, Attendance\n';
                var text = heading;
                angular.forEach($scope.refTable, function (item) {
                    debugger;
                    if((item.overlap.hasiss && !item.overlap.isscleared) || item.overlap.hasoss || item.referred[0].ActivityTypeId == 88)
                        return;
                    text += item.user.FirstName + ', ' + item.user.LastName + ', ';
                    text += item.user.UserName + ', ' + item.counters.ORoomsToBeServed + ', ';
                    text += item.referred[0].referral_type.Name + ', ';
                    text += (item.classes[0] ? item.classes[0].professor_class.room.Name : 'N/A')+', ';
                    text += item.referred[0].activity.Name;
                    text += '\n';
                });

                utils.downloadCSV(text, 'O-Room-List'+$scope.currentDate);
            };
        }]);
}(angular.module('Argus')));

/* global angular */

(function (app) {
    app.controller('OSSRosterController',
        ['$scope', 'notify', '$modal', 'OSSService', 'FormatTimeService', 'ISSService', 'CountersService',
            function ($scope, notify, $modal, osss, time, isss, counters) {
                $scope.currentDate = new Date();
                $scope.$watch('form.date.$viewValue', function (newV, oldV) {
                    if (newV) {
                        $scope.currentDate = newV;
                        $scope.oss = osss.getOSSList($scope.currentDate, function(data){
                            $scope.count.oss = data.length;
                        });
                    }
                });




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
		['$scope', 'notify', '$modal', '$http', 'FormatTimeService', '$rootScope', 'OroomService',
			'LunchService', 'ISSService', 'OSSService', 'ReteachListService', 'AECListService', 'ReportsService', 'PrintHtmlService',
			function ($scope, notify, $modal, $http, time, $rootScope, orooms, lunchs, isss, osss, reteach, aec, reports, print) {
				$scope.reportTypes = [
					{name: 'EOD', value: 1},
					{name: 'ORoom Conversion', value: 2}
				];
				$scope.selected = {reportType: $scope.reportTypes[0]};

				$scope.eodTypes = [
					{name: 'Single Day', value: 1},
					{name: 'Multiple - Date Range', value: 2}
				];

				$scope.eodReports = [
					{name: 'AEC', value: 1, url: 'report-eod-aec'},
					{name: 'O-Room', value: 2, url: 'report-eod-oroom'},
					{name: 'Reteach', value: 3, url: 'report-eod-reteach'},
					{name: 'ISS', value: 4, url: 'report-eod-iss'},
					{name: 'OSS', value: 5, url: 'report-eod-oss'},
					{name: 'Lunch', value: 6, url: 'report-eod-lunchd'}
				];
				$scope.eod = {selected: $scope.eodReports[1], type: $scope.eodTypes[0]};

				$scope.percentages = {
					todays: 0,
					averageThusFar: 0,
					difference: 0
				};

				$scope.date = new Date();

				$scope.eodDateCounters = [];

				var colorShades = ['#6FA45A', '#FFB757', '#CA423F', '#57325E', '#3C6C9D'];

				function applyColorsToData(data) {
					angular.forEach(data, function (item, $index) {
						item.color = colorShades[$index];
					});
				}


				function clearCounters() {
					$scope.eodCounters = {
						expected: 0,
						assigned: 0,
						present: 0,
						noShows: 0,
						sentOuts: 0,
						walkedOuts: 0,
						schoolAbsent: 0,
						leftSchool: 0,
						other: 0,
						reschedules: 0,
						clears: 0,
						absents: 0,
						overlaps: 0,
						pendingFollowups: 0
					};
				}

				// counters constructor to create counter objects
				function Counters() {
					this.expected = 0;
					this.assigned = 0;
					this.present = 0;
					this.noShows = 0;
					this.sentOuts = 0;
					this.walkedOuts = 0;
					this.schoolAbsent = 0;
					this.leftSchool = 0;
					this.other = 0;
					this.reschedules = 0;
					this.clears = 0;
					this.absents = 0;
					this.overlaps = 0;
					this.pendingFollowups = 0;
				}

				$scope.$watch('start.date.$viewValue', function (newValue, oldValue) {
					if (newValue) {
						$scope.currentDate = newValue;//time.formatDate(new Date(newValue));
						$scope.reportChanged();
					}
				});

				$scope.$watch('end.date.$viewValue', function (newValue, oldValue) {
					if (newValue) {
						$scope.endDate = newValue; //time.formatDate(new Date(newValue));
						$scope.reportChanged();
					}
				});

				$scope.reportChanged = function () {
					var urlEncoded = $scope.eod.selected.url + '?Date=' + $scope.currentDate;
					if ($scope.eod.type.value == 2)
						urlEncoded += '&DateRange=true&DateEnd=' + $scope.endDate;
					$http.get('api/' + urlEncoded).then(processResponse, function () {
						notify('error');
					});
				};

				$scope.getPdfReport = function () {
					reports.EODAll(function (data) {
						console.log(data);
						var fileURL = URL.createObjectURL(data.response);
						window.open(fileURL)
					});
				};

				function processResponse(response) {
					if ($scope.eod.type.value == 2)
						processResponseDateRange(response);
					else
						$scope.eodCounters = processResponseSingle(response);
				}

				function processResponseSingle(response) {
					$scope.orooms = response.data;
					var counters = new Counters();
					counters.assigned = $scope.orooms.length;


					switch ($scope.eod.selected.value) {
						case 1: // aec
							aec.markOverlapsReport($scope.orooms);
							aec.markActions($scope.orooms);
							var pendingFollowups = 0;
							angular.forEach($scope.orooms, function (stu) {
								if (stu.referred[0].RefferalStatus == 4) {
									pendingFollowups++;
									stu.referred[0].activity.Name = 'Pending Followup';

								}
								counters.pendingFollowups = pendingFollowups;
							});

							break;
						case 2:
							orooms.markOverlapsReport($scope.orooms);
							orooms.markActions($scope.orooms);
							angular.forEach($scope.orooms, function (stu) {
								switch (stu.referred[0].ReferralTypeId) {
									case 3: // orm + 1
										$scope.oroomPieData[3].data++;
										break;
									case 1: // first time teacher
										$scope.oroomPieData[4].data++;
										break;
									case 16: // aec->orm
										$scope.oroomPieData[1].data++;
										break;
									case 2:// LD->orm
										$scope.oroomPieData[0].data++;
										break;
									case 19:// reteach->orm
										$scope.oroomPieData[2].data++;
										break;
									default:
										console.log('not of ORM type');

								}
								;
							});
							applyColorsToData($scope.oroomPieData);
							break;
						case 3:
							reteach.markOverlapsReport($scope.orooms);
							reteach.markActions($scope.orooms);
							var pendingFollowups = 0;
							angular.forEach($scope.orooms, function (stu) {
								if (stu.referred[0].RefferalStatus == 8) {
									pendingFollowups++;
									stu.referred[0].activity.Name = 'Pending Followup';

								}
								counters.pendingFollowups = pendingFollowups;
							});
							break;
						case 4:
							isss.markOverlapsReport($scope.orooms);
							isss.markActions($scope.orooms);
							break;
						case 5:
							osss.markOverlapsReport($scope.orooms);
							osss.markActions($scope.orooms);
							break;
						case 6:
							lunchs.markOverlapsReport($scope.orooms);
							lunchs.markActions($scope.orooms);
							break;
					}

					createConsequencesData($scope.orooms);

					angular.forEach($scope.orooms, function (item) {
						//if (item.student.SchoolId !== $rootScope.currentUser.SchoolId)
						//	console.log(item);
						switch ($scope.eod.selected.value) {
							case 1:
								checkAEC(item.referred[0].ActivityTypeId, counters);
								break;
							case 2:
								checkOroom(item.referred[0].ActivityTypeId, counters);
								if ((item.overlap.hasiss && !item.overlap.isscleared) || item.overlap.hasoss)
									counters.overlaps++;
								break;
							case 3:
								checkReteach(item.referred[0].ActivityTypeId, counters);
								break;
							case 4:
								checkISS(item.referred[0].ActivityTypeId, counters);
								break;
							case 5:
								checkOSS(item.referred[0].ActivityTypeId, counters);
								break;
							case 6:
								checkLunchD(item.referred[0].ActivityTypeId, counters);
								break;
						}
					});

					var cnt = counters;
					$scope.flotPieData[0].data = cnt.present;
					$scope.flotPieData[1].data = cnt.noShows + cnt.sentOuts + cnt.walkedOuts;
					$scope.flotPieData[2].data = cnt.schoolAbsent + cnt.leftSchool + cnt.other
						+ cnt.reschedules + cnt.clears + cnt.absents;
					$scope.flotPieData[3].data = cnt.pendingFollowups;

					counters.expected = cnt.assigned - (cnt.schoolAbsent + cnt.leftSchool + cnt.other + (cnt.pendingFollowups || 0) + cnt.clears + cnt.reschedules + cnt.overlaps);
					console.log(counters);
					return counters;

				};

				function processResponseDateRange(response) {
					$scope.eodDateCounters = [];
					var array = response.data;
					angular.forEach(array, function (singleDateData) {
						var date = singleDateData.Date;
						var counters = processResponseSingle({data: singleDateData.students});
						$scope.eodDateCounters.push(angular.extend({Date: date}, counters));
					});

					totalCounters = new Counters();
					angular.forEach($scope.eodDateCounters, function (singleCounter) {

						for (key in singleCounter) {
							totalCounters[key] += singleCounter[key];
						}

					});
					totalCounters.Date = 'Totals';
					$scope.eodDateCounters.totals = totalCounters;
					var cnt = totalCounters;
					$scope.flotPieDataRange[0].data = cnt.present;
					$scope.flotPieDataRange[1].data = cnt.noShows + cnt.sentOuts + cnt.walkedOuts;
					$scope.flotPieDataRange[2].data = cnt.schoolAbsent + cnt.leftSchool + cnt.other
						+ cnt.reschedules + cnt.clears + cnt.absents;
					if ($scope.eod.selected.value == 1 || $scope.eod.selected.value == 3) {

						if(!$scope.flotPieDataRange)
						$scope.flotPieDataRangepush({
							label: 'Pending Followup',
							data: cnt.pendingFollowups,
							color: '#FFB757'
						});
						else
							$scope.flotPieDataRange[3].data = cnt.pendingFollowups;
					}else
						$scope.flotPieDataRange.splice(3,1);

				};

				function checkAEC(actionTypeId, counters) {
					switch (actionTypeId) {
						case 49:
							counters.present++;
							break;
						case 52:
							counters.noShows++;
							break;
						case 55:
							counters.sentOuts++;
							break;
						case 56:
							counters.walkedOuts++;
							break;
						case 54:
							counters.schoolAbsent++;
							break;
						case 53:
							counters.leftSchool++;
							break;
						case 57:
							counters.other++;
							break;
						case 50:
							counters.reschedules++;
							break;
						case 51:
							counters.clears++;
							break;
						case 58:
							counters.absents++;
					}
				}

				function checkOroom(actionTypeId, counters) {
					switch (actionTypeId) {
						case 24:
							counters.present++;
							break;
						case 25:
							counters.noShows++;
							break;
						case 28:
							counters.sentOuts++;
							break;
						case 29:
							counters.walkedOuts++;
							break;
						case 27:
							counters.schoolAbsent++;
							break;
						case 26:
							counters.leftSchool++;
							break;
						case 30:
							counters.other++;
							break;
					}
				}

				function checkReteach(actionTypeId, counters) {
					switch (actionTypeId) {
						case 64:
							counters.present++;
							break;
						case 67:
							counters.noShows++;
							break;
						case 75:
							counters.sentOuts++;
							break;
						case 70:
							counters.walkedOuts++;
							break;
						case 69:
							counters.schoolAbsent++;
							break;
						case 68:
							counters.leftSchool++;
							break;
						case 71:
							counters.other++;
							break;
						case 65:
							counters.reschedules++;
							break;
						case 66:
							counters.clears++;
							break;
						case 72:
							counters.absents++;
							break;
					}
				}

				function checkISS(actionTypeId, counters) {
					switch (actionTypeId) {
						case 38:
							counters.present++;
							break;
						case 39:
							counters.noShows++;
							break;
						case 42:
							counters.sentOuts++;
							break;
						case 43:
							counters.walkedOuts++;
							break;
						case 41:
							counters.schoolAbsent++;
							break;
						case 40:
							counters.leftSchool++;
							break;
						case 47:
						case 91:
							counters.other++;
							break;
					}
				}

				function checkOSS(actionTypeId, counters) {
					switch (actionTypeId) {
						case 25:
							counters.noShows++;
							break;
						case 28:
							counters.sentOuts++;
							break;
						case 29:
							counters.walkedOuts++;
							break;
						case 27:
							counters.schoolAbsent++;
							break;
						case 26:
							counters.leftSchool++;
							break;
						case 30:
							counters.other++;
							break;
					}
				}

				function checkLunchD(actionTypeId, counters) {
					switch (actionTypeId) {
						case 31:
							counters.present++;
							break;
						case 32:
							counters.noShows++;
							break;
						case 35:
							counters.sentOuts++;
							break;
						case 36:
							counters.walkedOuts++;
							break;
						case 34:
							counters.schoolAbsent++;
							break;
						case 33:
							counters.leftSchool++;
							break;
						case 37:
							counters.other++;
							break;
					}
				}

				function createConsequencesData(list) {
					// use a hash table to count how many different consequences exists
					var consequenceHash = [];
					angular.forEach(list, function (student) {
						if (!student.referred[0].consequence) return;
						var consequenceType = student.referred[0].consequence.referral_type.Name;

						if (consequenceHash[consequenceType])
							consequenceHash[consequenceType]++;
						else
							consequenceHash[consequenceType] = 1
					});
					// use hash to built data for the pie chart
					var flotData = [];


					var i = 0;
					for (key in consequenceHash) {
						var dataObj = {
							label: key,
							data: consequenceHash[key],
							color: colorShades[i++]

						};
						flotData.push(dataObj);
					}
					$scope.flotPieDataConsequences = flotData;
				}

				$scope.flotPieData = [
					{
						label: "Present",
						data: 0,
						color: "#6FA45A"
					}, {
						label: "No Show, Sent-Out, Walked-Out",
						data: 0,
						color: "#CA423F"
					}, {
						label: "School Absent, Cleared,  Overlap, Other",
						data: 0,
						color: "#C2C3C5"
					}, {
						label: 'Pending Followup',
						data: 0,
						color: '#FFB757'
					}
				];

				$scope.flotPieDataRange = [
					{
						label: "Present",
						data: 0,
						color: "#6FA45A"
					}, {
						label: "No Show, Sent-Out, Walked-Out",
						data: 0,
						color: "#CA423F"
					}, {
						label: "School Absent, Cleared,  Overlap, Other",
						data: 0,
						color: "#C2C3C5"
					}, {
						label: 'Pending Followup',
						data: 0,
						color: '#FFB757'
					}
				];

				$scope.flotPieDataConsequences = [];

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

				$scope.oroomPieData = [
					{
						label: "LD → ORM",
						data: 0,
						color: "#C3ECC8"
					}, {
						label: "AEC → ORM ",
						data: 0,
						color: "#999"
					}, {
						label: "Reteach → ORM ",
						data: 0,
						color: "#f2dede"
					}, {
						label: "ORM → ORM + 1",
						data: 0,
						color: "#C3ECC8"
					}, {
						label: "First Time - Teacher ",
						data: 0,
						color: "#999"
					},
				];

				$scope.printDiv = function () {
					print.printDiv("totals", 'list');
				};

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
        ['$scope', 'notify', 'ISSService', 'ISSFollowupService', '$modal', function ($scope, notify, isss, issfs, $modal) {
            $scope.iss = issfs.getList();

            $scope.issFollowupAttendance = function (student, $index) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/modals/ISSFollowupModal.html',
                    size: 'lg',
                    controller: function ($scope, student, teachers) {
                        $scope.student = student;
                        $scope.currentDate = new Date();
                        $scope.teachers = teachers.query();
                        $scope.$watch('suspension.startDate.$viewValue', function (newV, oldV) {
                            student.dateOfSuspensionStart = newV ? newV : oldV;
                        });
                        $scope.$watch('suspension.endDate.$viewValue', function (newV, oldV) {
                            student.dateOfSuspensionEnd = newV ? newV : oldV;
                        });
                        $scope.$watch('meeting.date.$viewValue', function (newV, oldV) {
                            student.meetingDate = newV ? newV : oldV;
                        });
                    },
                    resolve: {
                        student: function () {
                            return student;
                        }
                    }
                });

                modalInstance.result.then(function () {// on SUBMIT
                    issfs.updateAttendance(student).then(function (data) {
                        notify(data.msg);
                        $scope.iss.splice($index, 1);
                    }, function (data) {
                        notify(data.msg || 'error');
                    });

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


(function (app) {
    app.controller('ParentMeetingCtrl', ['$scope', 'OSSService', '$modal', 'ISSFollowupService', 'notify',
        function ($scope, osss, $modal, issfs, notify) {
            $scope.refTable = osss.getParentMeetingList();


            $scope.ossAttendance = function (referral, $index) {
                if (!referral.Date || !referral.NewDate) {
                    promptForParentMeetingInfo(referral, $index);
                } else {


                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/parentMeetingAttendaceModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, referral, teachers) {
                            $scope.referral = referral;
                            $scope.currentDate = new Date();
                            $scope.teachers = teachers.query();
                            $scope.$watch('form.date.$viewValue', function (newV, oldV) {
                                referral.date = newV ? newV : oldV;
                                console.log(newV);
                            });
                        },
                        resolve: {
                            referral: function () {
                                return referral;
                            }
                        }
                    });

                    modalInstance.result.then(function (data) {// submit attendance modal
                        osss.updateParentMeetingAttendance(referral).then(function(data){
                            notify(data.msg);
                            //$scope.refTable.splice($index,1);
                        }, function(data){
                            notify(data.msg);
                        });
                            return;
                        switch (referral.ActivityTypeId) {


                            case '1':
                                osss.update
                                counters.update({id: referral.student_user.id},
                                    {
                                        counters: referral.student_user.student.counters,
                                        Comment: referral.comment
                                    }, function () {
                                        notify('success');
                                        osss.update({id: referral.Id},
                                            {OssPresent: true});

                                    }, function (error) {
                                        notify('error');
                                    });
                                break;
                            case '2':
                                osss.update({id: referral.Id},
                                    {
                                        Comment: referral.comment
                                    }, function (data) {
                                        notify(data.msg);
                                    }, function (error) {
                                        notify('error');
                                    });
                                break;
                            case '3':
                                isss.update({id: referral.Id, followup: true}, {
                                    Date: referral.date,
                                    Time: referral.time,
                                    ActionType: 46,
                                    Comment: referral.comment,
                                    StudentId: referral.StudentId,
                                    TeacherId: referral.teacher.id
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
                }

            };

            function promptForParentMeetingInfo(referral, $index) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/modals/ParentMeetingInfoModal.html',
                    size: 'lg',
                    controller: function ($scope, student, teachers) {
                        $scope.student = student;
                        $scope.currentDate = new Date();
                        $scope.teachers = teachers.query();
                        $scope.$watch('suspension.date.$viewValue', function (newV, oldV) {
                            student.dateOfSuspension = newV ? newV : oldV;
                            console.log('suspensionDate', newV);
                        });
                        $scope.$watch('meeting.date.$viewValue', function (newV, oldV) {
                            student.meetingDate = newV ? newV : oldV;
                            console.log('meetingDate', newV);
                        });
                    },
                    resolve: {
                        student: function () {
                            return referral;
                        }
                    }
                });
                modalInstance.result.then(function (data) {// on modal submit
                    //debugger;
                    osss.updateParentMeetingInformation(referral).then(function (data) {
                        notify(data.msg);
                    }, function (data) {
                        notify(data.msg || 'error');
                    });
                });
            }

        }])

}(angular.module('Argus')));


(function(app){
    app.controller('ParentMeetingFollowupCtrl',['$scope','OSSFollowupService','notify','$modal', function($scope, ossfs, notify,$modal){
        $scope.refTable = ossfs.getList();

        $scope.setParentMeeting = function(referral,$index){
            // some checks

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/ParentMeetingInfoModal.html',
                //template:'<div> MODAL : true in Referral IN </div>',
                size: 'lg',
                controller: function ($scope, student, teachers) {
                    $scope.student = student;
                    $scope.currentDate = new Date();
                    $scope.teachers = teachers.query();
                    $scope.$watch('suspension.date.$viewValue', function (newV, oldV) {
                        student.dateOfSuspension = newV ? newV : oldV;
                    });
                    $scope.$watch('meeting.date.$viewValue', function (newV, oldV) {
                        student.meetingDate = newV ? newV : oldV;
                    });
                },
                resolve: {
                    student: function () {
                        return referral;
                    }
                }
            }); // end modal instance

            modalInstance.result.then(function(data){ // on modal submit
                ossfs.updateParentMeetingInformation(referral).then(function(data){
                    notify(data.msg);
                    $scope.refTable.splice($index,1);
                }, function(data){
                    notify('error');
                })
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
(function (app) {
	app.controller('ActivitiesCtrl', ['$scope', function ($scope) {
			
		}]);
}(angular.module('Argus')));

(function(app){
	app.controller('ASPAttendancesCtrl',['$scope','ASPService',function($scope,asp){
		$scope.currentDate = new Date();
		$scope.creationResults = [];

		$scope.createASPAlderson = function(){
			createASP(5);
		};
		$scope.createASPDunbar = function(){
			createASP(2)
		};
		$scope.createASPErvin = function(){
			createASP(3)
		};

		$scope.createASPAll = function(){
			createASP(0,true);
		};

		$scope.clearTable = function(){
			$scope.creationResults = [];
		};

		var createASP = function(schoolId,all){
			var date = $scope.attendance.date.$viewValue;
			console.log('date',date);
			console.log('schoolId',schoolId);
			$scope.loading=true;
			$scope.creationResults =  asp.save({SchoolId:schoolId, WeekStart:date,all:all},function(){
				$scope.loading = false;
			});
		};




	}])
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
			}, {
				id: 'ASP Attendances',
				link: "sysadmin.aspAttendances",
				icon: 'list fa-2x'
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
		['$scope', 'AdminReferralsService', 'UserActionsService', 'SchoolsService', 'StudentsService', 'ActivitiesService','CountersService', '$http', 'notify','$q',
			function ($scope, referrals, actions, schools, students, activities, counters, $http, notify, $q) {
				$scope.selected = {};
				$scope.referral = {};
				$scope.action = {};
				$scope.schools = schools.query();
				$scope.activities = activities.query();

				$scope.getSchoolStudents = function (school) {
					$scope.students = students.query({schoolId: school.Id});
				};

				$scope.getAll = function () {
					var student = $scope.selected.student;
					$scope.referrals = referrals.query({id: student.Id});
					$scope.actions = actions.query({id: student.Id});
					$scope.counters = counters.get({id:student.Id});
				};

				$scope.getReferrals = function () {
					var student = $scope.selected.student;
					$scope.referrals = referrals.query({id: student.Id});
				};
				$scope.getActions = function () {
					var student = $scope.selected.student;
					$scope.actions = actions.query({id: student.Id});
				};
				$scope.getCounter = function(){
					var student = $scope.selected.student;
					$scope.counters = counters.get({id:student.Id});
				};

				$http.get('api/referraltypes').then(function (response) {
					$scope.referraltypes = response.data;
				});

				$scope.referralUpdate = function (referral) {
					console.log(referral); 

					// do an update request
				};
				$scope.actionUpdate = function (action) {
					console.log(action);
					// do an update request
				};

				$scope.selectItem = function (item) {
					$scope.referral = item;
				};

				$scope.onDeleteReferral = function ($index, showNotification,remove) {
					var item = $scope.referrals[$index];
					return referrals.remove({id: item.Id}, function () {
						remove && $scope.referrals.splice($index, 1);
						showNotification && notify('successfully deleted');
					}, function () {
						notify('error');
					});
				};
				$scope.deleteAllReferrals = function () {
					var promises = [];
					angular.forEach($scope.referrals, function (item, $index) {
						var promise = $scope.onDeleteReferral($index, false,false).$promise;
						
						promises.push(promise);
					});
					
					$q.all(promises).then(function (){
						$scope.referrals = [];
					});
					

				};
				$scope.deleteAllActions = function () {
					var promises = [];
					angular.forEach($scope.actions, function (item, $index) {
						var promise = $scope.onDeleteAction($index, false, false).$promise;
						debugger;
						promises.push(promise);
					});
					$q.all(promises).then(function (){
						$scope.actions = [];
					});
					
				};

				$scope.onDeleteAction = function ($index, showNotification,remove) {
					var item = $scope.actions[$index];
					return actions.remove({id: item.Id}, function () {
						remove && $scope.actions.splice($index, 1);
						showNotification && notify('successfully deleted');
					}, function () {
						notify('error');
					});
				};


				$scope.checkMissingORMStudents = function(){
					if(!$scope.selected.school){
						notify('Select a school first');
						return;
					}
					var schoolId = $scope.selected.school.Id;
					$scope.missingORMStudents = referrals.query({CheckOroomMissing:true,SchoolId:schoolId, Date:$scope.missing.date.$viewValue})
				}
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
								},

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
				.state('sysadmin.aspAttendances', {
					url: "/ASP-Attendances",
					templateUrl: 'views/sysadmin/aspAttendance.html',
					data: {pageTitle: 'ASP ATT'},
					controller: 'ASPAttendancesCtrl',
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
/* global angular */

(function (app) {
	app.controller('UsersCtrl',
		['$scope', 'UsersService', 'RolesService','StudentsService', 'notify','$modal','$rootScope', 
			function ($scope, users, roles,students, notify, $modal, $rootScope) {
				$scope.selected = {};
				$scope.userInfo = {};
				$scope.roles = roles.query();
				$scope.showLoginFields = false;
				$scope.schools = [
					{Id: 1, Name: 'Estacado High School'},
					{Id: 2, Name: 'Dunbar College Preparatory Academy'},
					{Id: 3, Name: 'Ervin Elementary School'},
					{Id: 4, Name: 'Adrian School'}
				];
				var openCreateNewStudent = function () {
					var student = {UserInfo: {}, StuInfo: {}, ProfessorClasses: []};
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/CreateStudentModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: function ($scope, student, ProfessorClassesService) {
							$scope.schools = [
								{Id: 1, Name: 'Estacado High School'},
								{Id: 2, Name: 'Dunbar College Preparatory Academy'},
								{Id: 3, Name: 'Ervin Elementary School'},
								{Id: 4, Name: 'Adrian School'}
							];
							$scope.classes = ProfessorClassesService.query();
							$scope.student = student;
						},
						resolve: {
							student: function () {
								return student;
							}
						}
					});
					modalInstance.result.then(function () {// on SUBMIT
							student.StuInfo.StudentId = student.UserInfo.UserName;
							student.UserInfo.SchoolId = student.UserInfo.SchoolId.Id;
							angular.forEach(student.ProfessorClasses, function (item) {
								console.log(item);
								item.ProfessorClassId = item.ProfessorClass.Id;
								delete item.ProfessorClass;
							});
							student.userInfo = student.UserInfo;
							students.save(student, function (data) {
								students.query({admin: true, light: true}, function (data) {
									students.students = data;
									$rootScope.$broadcast('studentsUpdated', {students: data});
								});



							});
						}, function () {// on modal DISMISS

						});
				};
				$scope.onRoleChanged = function () {
					var role = $scope.selected.role;
					if (!(role.Name === "Teacher" || role.Name === "Student")) {
						$scope.showLoginFields = true;
						$scope.showStudentFields = false;
					}
					else if (role.Name === "Student") {
						openCreateNewStudent();
					}
					else {
						$scope.showLoginFields = false;
					}
				};
				$scope.createUser = function () {
					// remove objects/arrays from userInfo
					$scope.userInfo.SchoolId = $scope.userInfo.SchoolId.Id;
					
					users.save({
						userInfo: $scope.userInfo,
						role: $scope.selected.role
					}, function (data) {
						notify('user successfully Saved');
						$scope.userInfo = {};
					});
				};
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
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
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
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
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
            ["$scope", "$modal", "referrals", "PassesService", "UserActionsService", 'notify', 'ReteachAbsenceListService', 'UtilService',
                function ($scope, $modal, referrals, passes, useractions, notify, aec, utils) {
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

                            $scope.refTable = aec.getList($scope.currentDate);
                            return;
                            $scope.refTable = aec.query({id: newVal, absence: true}, function (data) {

                                if (!data.length) {
                                    notify({
                                        message: "No students for current date",
                                        classes: 'alert-warning', templateUrl: 'views/common/notify.html'
                                    });

                                } else {
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
                        notify({
                            message: "Now Generating Passes",
                            classes: 'alert-successs', templateUrl: 'views/common/notify.html'
                        });
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


                    $scope.reteachListToCSV = function () {
                        //headings
                        var text = 'Teacher FirstName, Teacher LastName, Student FirstName,Student LastName,StudentId, Grade, Date\n';
                        angular.forEach($scope.refTable, function (item) {
                            text += item.referred[0].teacher.FirstName + ',' + item.referred[0].teacher.LastName + ',';
                            text += item.FirstName + ',' + item.LastName + ',' + item.UserName + ',';
                            text += item.student.Grade + ',' + item.referred[0].Date;
                            text += ' \n';
                        });
                        utils.downloadCSV(text, 'Reteach-Followup-List_' + $scope.currentDate);
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
                     *    (noShow,walkOut, SentOut, schoolAbsent, disciplinary, clear,comment )
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

                        console.log(student);
                        var commentModal = $modal.open({
                            templateUrl: 'views/modals/ReteachCommentAbsenceModal.html',
                            size: 'md',
                            controller: function ($scope, student) {
                                $scope.title = "Reteach Followup Attendance";
                                $scope.student = student;
                            },
                            resolve: {
                                student: function () {
                                    return student;
                                }
                            }
                        })// End commentModal

                        commentModal.result.then(function (data) {
                            aec.updateAttendance($scope.currentDate, student).then(function(data){
                                notify(data.msg);
                                clearInputAndRemoveFromTable();
                            },function(){
                                notify('error, Before continuing please contact a System Administrator');
                            });
                        });


                    };
                    function clearInputAndRemoveFromTable() {
                        var indexOfSelected = $scope.refTable.indexOf($scope.selected.student);
                        $scope.refTable.splice(indexOfSelected, 1);
                        $scope.selected.student = null;
                    }
                }])
}(angular.module('Argus')));
/* global angular */

(function (app) {
	"use strict";
	app
		.controller("ManageReteachCtrl", ["$scope", "$filter", "$modal", "referrals", "PassesService",
			"StudentsService", "notify", "ReteachListService",'UtilService','$rootScope',
			function ($scope, $filter, $modal, referrals, passes, students, notify, aec,utils, $rootScope) {
				$scope.selected = {};
				$scope.refTable = [];// table model
				$scope.currentDate = new Date();

				function getListSuccessCallback(data){
					if (!data.length) {
						notify({message: "No students for current date",
							classes: 'alert-warning', templateUrl: 'views/common/notify.html'});
					}
				};

				$scope.getList = function(date){
					date = date || $scope.currentDate;
					$scope.refTable = aec.getList(date, getListSuccessCallback);
				};
				/**
				 * Watch for changes in the datepicker then load the AECList 
				 * For the selected Date. Also adjusts data received
				 * to be easily shown in the view
				 */
				$scope.$watch('form.date.$viewValue', function (newVal) {

					if (newVal) {//when date has a valid date request the List from that date
						$scope.currentDate = newVal;
						console.log("newVal = " + $scope.form.date.$viewValue);
						$scope.getList($scope.currentDate)
					}
				});


				/**
				 * Makes API call to get a pdf of the AEC passes for the students
				 * assigned AEC for the current date
				 */
				$scope.getPasses = function () {
					notify({message: "Now Generating Passes",
						classes: 'alert-success', templateUrl: 'views/common/notify.html'});
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
				 * Converts the current AEC list into a csv text format so it can
				 * be passed to the download method 
				 */
				$scope.AECListCSV = function () {
					var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Overlap, Attendance\n';
					angular.forEach($scope.refTable, function (item) {
						angular.forEach(item.referred, function (referred) {
							text += referred.teacher.FirstName + ',' + referred.teacher.LastName + ","
								+ item.user.FirstName + ',' + item.user.LastName + ',' + item.StudentId + ','
								+ item.Grade + ',' + referred.Name + ','
								+ (item.overlap ? item.overlap.place : 'N/A')
								+ ',' + item.status.action
								+ ' \n';
						});
					})
					utils.downloadCSV(text,'Reteach-List_' + $scope.currentDate);
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
				var submitReschedule = function (student) {
					var data;
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
						Comment: student.comment,
						newDate: student.rescheduleDate,
						ReferralIds: referrals,
						excused: student.excused
					};

					aec.update(urlEncoded, payload, function (data) {
						notify(data.msg);
					}, function (err) {
						notify({message: "Reschedule Failed, Please Contact The Admin",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});

					clearSelectStudentField();
				};

				/**
				 * PUT API call to change the referral status to clear(ReferralStatus 3), 
				 * rescheduling all the referrals as well as loggin the reschedule 
				 * into user actions for the profile 
				 * @param {object} data: information returned by modal (comment, student)
				 */
				var submitClear = function (student) {
					student.status = {action: 'Cleared', class: 'bg-green'};

					// submit information of student '$scope.selected.student' to the database

					var referralsIds = student.referred.map(function (o) {
						return o.Id;
					});
					var urlEncoded = {id: student.Id};
					var payload = {
						param: 'clear',
						Comment: student.comment,
						ReferralIds: referralsIds,
						Date: $scope.currentDate
					};
					aec.update(urlEncoded, payload, function (data) {
						notify(data.msg);
					}, function (data) {
						notify({message: "Clear Failed, Please Contact The System Admin",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});

					clearSelectStudentField();
				};

				function submitAttendance(data){
					var student = data.student;
					debugger;
					aec.updateAttendance($scope.currentDate, student).then(function (data) {
						clearSelectStudentField();
						notify(data.msg);
					}, function (err) {
						notify({
							message: "Present  Failed, Please Contact The System Admin Before Continuing",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'
						});
					});
				}

				/**
				 * PUT API call to change the all unprocessed referrals to absent(ReferralStatus 4)
				 * as well as logging the absent into user actions for the profile 
				 */
				$scope.finishManageAEC = function () {
					// confirm before submit
					var submit = confirm("IF YOU SUBMIT THIS LIST ALL THE CHANGES MADE WILL BE RECORDED AND YOU WILL BE UNABLE TO CHANGE THEM AGAIN");
					if(!submit)
						return;
					debugger;
					var prom = aec.submitList($scope.refTable, $scope.currentDate);
					prom.then(function(data){
						notify(data.msg);
					}, function(err){
						notify("Error Submitting,  Please Contact the System Admin before continuing ")
					});
					return;
				};

				function isOverlap(student) {
					var overlap = false;
					var overlapPlace = '';

					if (student.overlap.hasorm ) {
						overlapPlace = 'O-Room';
						overlap = true;
					}
					if (student.hasiss ) {
						overlapPlace = 'ISS';
						overlap = true;
					}
					if (student.overlap.hasoss) {
						overlapPlace = 'OSS';
						overlap = true;
					}
					//
					overlap = false;
					if (overlap) {
						var modalInstance = $modal.open({
							templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
							//template:'<div> MODAL : true in Referral IN </div>',
							size: 'lg',
							controller: function ($scope, student, activity) {
								$scope.student = student;
								console.log(student);
								$scope.activity = activity;
							},
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


					if(student.referred[0].RefferalStatus === 2 ||  student.referred[0].RefferalStatus  == 8) {
						notify('Action Unavailable : Attendance  Already taken and submitted.','warning');
						return;
					}

					if (isOverlap(student)) {
						return;
					}

					console.log('Reteach attendance: student \n', student);
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/attendanceReteachModal.html',
						size: 'lg',
						controller: function ($scope, student) {
							$scope.student = student;
							$scope.$watch('form.date.$viewValue', function (newValue, oldValue) {
								student.rescheduleDate = newValue || student.rescheduleDate;

							});
						},
						resolve: {
							student: function () {
								return student;
							}
						}
					});
					modalInstance.result.then(function(data){
						if(student.ActivityTypeId == 66)
							return submitClear(student);
						else if(student.ActivityTypeId ==65 )
							return submitReschedule(student);
						submitAttendance(data);
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
						controller: function ($scope, student) {
							$scope.student = student;
							$scope.date = new Date();

							$scope.$watch('form.date.$viewValue', function (newValue, oldValue) {
								if (newValue) { //when date has a valid date request the List from that date
									$scope.date = newValue;
								console.log('date changed');
							}
							});

						},
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
						controller: function ($scope, student) {
							$scope.student = student;
							$scope.title = 'clear'
						},
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
						controller: function ($scope, $modalInstance, student, date) {
							$scope.student = student;
							$scope.date = date;

							$scope.$watch('form.date.$viewValue', function (newValue) {
								if (newValue) { //when date has a valid date request the List from that date
									$scope.date = newValue;
								}
							})
						},
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
				var clearSelectStudentField = function () {
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
			}, {
				id: 'Reports',
				link: 'reteach.reports.eod',
				icon: 'area-chart fa-2x'
			}
		];
	});
}(angular.module('Argus')));


(function (app) {
	"use strict";
	app.
		controller("ReteachReferralCtrl",
			["$scope", "assignmentsListService", "teachers", "referrals", "StudentsService", '$modal', 'notify', '$http', 'ReteachListService', 'ProfessorClassesService',
				function ($scope, assignmentsService, teachers, referrals, students, $modal, notify, $http, reteach, ProfessorClassesService) {
					$scope.selected = {}; // model for the possible selections (selected.student,   or seleted.assignments)
					$scope.currentDate = new Date(); // date on the datepicker
					$scope.teacherStudents = []; // model for autocomplete  
					$scope.refTable = []; // model for dynamic table

					$scope.dropzoneConfig = {
						maxFileSize:1,

						options: {// passed into the Dropzone constructor
							url: api+'reteachlist',
							paramName:"file",
							acceptedFiles: ".csv",
							uploadMultiple: false,
							headers: { 'Authorization':'Bearer '+ localStorage.getItem('satellizer_token') }

						},
						eventHandlers: {
							success: function (file, response) {
							},
						},

					}; // end dropzoneConfig


					$scope.teachers = teachers.query();
					$scope.schoolStudents = students.query({admin: true, light: true}, function () {
					}, function (error) {
						dev.openError(error);
					});


					$scope.classes = ProfessorClassesService.query();



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

		


					/** New Assignment Modal
					 * Opens the New Assignment modal and passes in the teacher selected to be available
					 * in the modal context, on submit makes a post call to assignments
					 * to add the current assignment to the teacher 
					 */
					$scope.openCreateNewAssignment = function () {
						var modalInstance = $modal.open({
							templateUrl: 'views/modals/addNewAssignmentModal.html',
							size: 'md',
							controller: function ($scope, teacher) {
								$scope.teacher = teacher;
							},
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
							referralToAdd.eightPeriod = response.data[7];
							referralToAdd.ninethPeriod = response.data[8];
						});

						//addAssignmentsToStudent(selectedAssignments, referralToAdd);
						referralToAdd.teacher = $scope.selected.teacher;
						$scope.refTable.unshift(referralToAdd);
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
								ProfessorClassId: student.ProfessorClassId ? student.ProfessorClassId.Id : 0,
								Date: $scope.currentDate
							};
							studentsReferred.push(referral);

						});
						if (studentsReferred.length) {
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
					templateUrl: "views/common/contentArgusReteachCoordinator.html",
					controller: "NavigationReteachCtrl",
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
				.state('reteach.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/reteach/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashReteachCtrl",
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
				.state('reteach.reteachReferral', {
					url: "/ReteachReferral",
					templateUrl: 'views/reteach/Referral.html',
					data: {pageTitle: 'Referral'},
					controller: 'ReteachReferralCtrl',
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
				.state('reteach.reteachList', {
					url: "/ReteachList",
					templateUrl: 'views/reteach/manageReteach.html',
					data: {pageTitle: 'List'},
					controller: 'ManageReteachCtrl',
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
				.state('reteach.reteachPending', {
					url: "/ReteachFollowup",
					templateUrl: 'views/reteach/manageReteachabsence.html',
					data: {pageTitle: 'Pending'},
					controller: 'ManageReteachAbsenceCtrl',
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
				.state('reteach.studentData', {
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

				.state('reteach.reports', {
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
				.state('reteach.reports.eod', {
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
		.controller("ManageASPStudentsEstacadoCtrl", ["$scope", "$modal","notify","ASPService", "$timeout", '$rootScope','ReferralTypesService',
			function ($scope,  $modal,  notify,  asp, $timeout, $rootScope,utils) {
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
						if ($rootScope.currentUser.schoolId === 2 || $rootScope.currentUser.schoolId === 5) {
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
							stu.overlap = {class: 'bg-danger', msg: 'Has ORoom'};
							
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
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {
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
                .state('asp.dashboard', {
                    url: "/dashboard",
                    templateUrl: 'views/aspcoordinator/dashboard.html',
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
                .state('asp.manage', {
                    url: "/manage",
                    templateUrl: 'views/aspcoordinator/manage.html',
                    data: {pageTitle: 'Attendance'},
                    controller: 'ManageCtrl',
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
                .state('asp.manageStudents', {
                    url: "/ManageStudents",
                    templateUrl: /*schoolId === 2? 'views/aspcoordinator/manageStudentsDunbar.html':*/'views/aspcoordinator/manageStudentsEstacado.html',
                    data: {pageTitle: 'ASP Students'},
                    controller: /*schoolId === 2? 'ManageASPStudentsDunbarCtrl':*/'ManageASPStudentsEstacadoCtrl',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([]);
                        }
                    }

                })
                /*				.state('asp.pending', {
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
                 })*/


            ;

        }]);


}(angular.module('Argus')));
/* global angular, URL */

(function (app) {
	"use strict";
	app
		.controller("manageAECAbsenceController",
			["$scope", "$modal", "referrals", "PassesService", "UserActionsService", 'notify', 'AECAbsenceListService','UtilService','$rootScope',
				function ($scope, $modal, referrals, passes, useractions, notify, aec,utils, $rootScope) {
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

							$scope.refTable = aec.getList($scope.currentDate);
							return;
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
					 * Converts the Kids that were marked with SentOut or Walkout  into a csv text 
					 * format so it can downloaded and Referred to O-Room
					 * be passed to the download method 
					 */
					$scope.AECFollowupToCSV = function () {
						
							//headings
							var text = 'Teacher FirstName, Teacher LastName, FirstName,LastName,StudentId, Grade, Assignment\n';
							angular.forEach($scope.refTable, function (student) {
								
								angular.forEach(student.referred, function(ref){
									text += ref.teacher.FirstName + ',' + ref.teacher.LastName + ',' ;
									text += student.FirstName + ','+student.LastName +',';
									text += student.student.StudentId + ',' + student.student.Grade + ',';
									text += ref.assignment.Name
									text += ' \n';
								});

							});
							utils.downloadCSV(text, 'AEC-Followup-List_'+$scope.currentDate);
						
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
							controller: function ($scope, student) {
								$scope.title = "AEC Followup ";
								$scope.student = student;
							},
							resolve: {
								student: function () {
									return student;
								}
							}
						});// End commentModal

						commentModal.result.then(function () {
							aec.updateAttendance($scope.currentDate, student).then(function(data){
								notify(data.msg);
								clearInputAndRemoveFromTable();
							},function(){
								notify('error, Before continuing please contact a System Administrator');
							});
						});

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
            "StudentsService", "notify", "AECListService", 'UtilService',
            function ($scope, $filter, $modal, referrals, passes, students, notify, aec, utils) {
                $scope.selected = {student: null};
                $scope.refTable = [];// table model
                $scope.currentDate = new Date();


                function getListSuccessCallback(data) {
                    if (!data.length) {
                        notify({
                            message: "No students for current date",
                            classes: 'alert-warning', templateUrl: 'views/common/notify.html'
                        });
                    }
                };

                $scope.getList = function(date){
                    date = date || $scope.currentDate;
                    $scope.refTable = aec.getList(date, getListSuccessCallback);
                };
                /**
                 * Watch for changes in the datepicker then load the AECList
                 * For the selected Date. Also adjusts data received
                 * to be easily shown in the view
                 */
                $scope.$watch('form.date.$viewValue', function (newVal) {
                    if (newVal) {//when date has a valid date request the List from that date
                        $scope.currentDate = newVal;
                        console.log("newVal = " + $scope.form.date.$viewValue);
                        $scope.getList($scope.currentDate);
                    }
                });

                /**
                 * Makes API call to get a pdf of the AEC passes for the students
                 * assigned AEC for the current date
                 */
                $scope.getPasses = function () {
                    notify({
                        message: "Now Generating Passes",
                        classes: 'alert-successs', templateUrl: 'views/common/notify.html'
                    });
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
                 * Converts the current AEC list into a csv text format so it can
                 * be passed to the download method
                 */
                $scope.AECListToCSV = function () {
                    var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Assignment,Overlap, Attendance\n';
                    angular.forEach($scope.refTable, function (item) {
                        angular.forEach(item.referred, function (referred) {
                            text += referred.teacher.FirstName + ',' + referred.teacher.LastName + ","
                                + item.user.FirstName + ',' + item.user.LastName + ',' + item.StudentId + ','
                                + item.Grade + ',' + referred.assignment.Name + ','
                                + (item.overlap.msg ? item.overlap.msg : 'N/A') + ','
                                + item.referred[0].activity.Name + ','
                                + ' \n';
                        });
                    });
                    utils.downloadCSV(text, 'AEC-List_' + $scope.currentDate);
                };


                /************************************** MANAGE AEC ***********************************/
                // To avoid duplicate profile entries only 1 entry should be created in
                // useractions table and all referrals must be changed in referrals
                // table (see backend implementation)


                /**
                 * PUT API call to change the referral status to reschedule (ReferralStatus 2),
                 * rescheduling all the referrals as well as login the reschedule
                 * into user actions for the profile
                 * @param {object} data: information returned by modal (date,comment,student,excused)
                 */
                function submitReschedule(data) {
                    aec.updateReschedule($scope.currentDate, data).then(function (data) {
                        clearSelectStudentField();
                        notify(data.msg);
                    }, function (err) {
                        notify({
                            message: "Reschedule Failed, Please Contact The Admin Before Continuing",
                            classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                        });
                    });

                };

                /**
                 * PUT API call to change the referral status to clear(ReferralStatus 3),
                 * rescheduling all the referrals as well as loggin the reschedule
                 * into user actions for the profile
                 * @param {object} data: information returned by modal (comment, student)
                 */
                function submitClear(data) {
                    var student = data.student;
                    debugger;
                    aec.updateClear($scope.currentDate, student, data.comment).then(function (data) {
                        clearSelectStudentField();
                        notify(data.msg);
                    }, function (data) {
                        notify({
                            message: "Clear Failed, Please Contact The System Admin Before Continuing",
                            classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                        });
                    });


                };

                /**
                 * PUT API to change the referral attendance to whatever the user choses.
                 * The referral is marked with an status of 2 (attendance taken)
                 *
                 */
                function submitAttendance(data) {// on SUBMIT
                    var student = data.student;
                    aec.updateAttendance($scope.currentDate, student).then(function (data) {
                        clearSelectStudentField();
                        notify(data.msg);
                    }, function (err) {
                        notify({
                            message: "Present  Failed, Please Contact The System Admin Before Continuing",
                            classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                        });
                    });

                };

                /**
                 * PUT API call to change the all unprocessed referrals to absent(ReferralStatus 4)
                 * as well as logging the absent into user actions for the profile
                 */
                $scope.finishManageAEC = function () {
                    // confirm before submit
                    var submit = confirm("IF YOU SUBMIT THIS LIST ALL THE CHANGES MADE WILL BE RECORDED AND YOU WILL BE UNABLE TO CHANGE THEM AGAIN");
                    if (!submit)
                        return;
                    var prom = aec.submitList($scope.refTable, $scope.currentDate);
                    prom.then(function (data) {
                        notify(data.msg, 'success');
                    }, function (err) {
                        notify("error submitting,  Please Contact the System Admin before continuing ", 'danger')
                    });

                };

                /********************************************** MODALS   **************************/

                /** Attendance Modal
                 * opens the attendance modal with 3 buttons (present, sent out, walked out
                 */
                $scope.AECAttendance = function (student, $index) {
                    //if (isOverlap(student)) {
                    //    return;
                    //}
                    // can only change if not changed before
                    if (student.referred[0].RefferalStatus === 2 || student.referred[0].RefferalStatus === 4) {
                        notify('Action Unavailable : Attendance  Already taken and submitted.','warning');
                        return;
                    }

                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/attendanceAECModal.html',
                        size: 'lg',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            $scope.rescheduleDate = new Date();

                            $scope.$watch('rescheduleForm.date.$viewValue', function (n, o) {
                                student.rescheduleDate = n || student.rescheduleDate;
                                console.log('new_reschedule_date',n);
                            });
                            $scope.$watch('clearForm.date.$viewValue', function (n, o) {
                                student.moveDate = n || student.moveDate;
                                console.log('new_clear_move_date',n);
                            });
                            $scope.selectedReferralToRemove = function () {
                                var selectedCount = 0;
                                angular.forEach(student.referred, function (item) {
                                    if (item.remove)
                                        selectedCount++;
                                });
                                console.log('removing ', selectedCount);
                                student.removingAll = selectedCount == student.referred.length;
                            }
                        },
                        resolve: {
                            student: function () {
                                return student;
                            }
                        }
                    });
                    modalInstance.result.then(submitAttendance);

                };


                /** Reschedule Modal
                 * Opens the Reschedule modal and passes in the student selected to be available
                 * in the modal context, calls submitReschedule function when modal
                 * submit button is clicked,does nothing otherwise
                 */
                $scope.openReschedule = function () {

                    console.log('AEC Reschedule: student\n', $scope.selected.student);

                    var resModal = $modal.open({
                        templateUrl: 'views/modals/RescheduleModal.html',
                        size: 'md',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            $scope.date = new Date();

                            $scope.$watch('form.date.$viewValue', function (newValue, oldValue) {
                                if (newValue) { //when date has a valid date request the List from that date
                                    $scope.date = newValue;
                                    console.log('date changed');
                                }
                            });

                        },
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
                $scope.openClear = function () {

                    console.log('AEC Clear: student\n', $scope.selected.student);

                    var clrModal = $modal.open({
                        templateUrl: 'views/modals/ClearModal.html',
                        size: 'md',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            $scope.title = 'clear';
                        },
                        resolve: {
                            student: function () {
                                return $scope.selected.student;
                            }
                        }
                    });// End clrModal

                    clrModal.result.then(submitClear);
                };


                /**
                 * clear select student field
                 */
                function clearSelectStudentField() {
                    $scope.selected.student = null;
                };

                function isOverlap(student) {
                    var overlap = false;
                    var overlapPlace = '';
                    if (!student.overlap)
                        return false;
                    if (student.overlap.hasorm && ! student.overlap.ormcleared) {
                        overlapPlace = 'O-Room';
                        overlap = true;
                    }
                    if (student.overlap.hasiss && ! student.overlap.isscleared) {
                        overlapPlace = 'ISS';
                        overlap = true;
                    }
                    if (student.overlap.hasoss) {
                        overlapPlace = 'OSS';
                        overlap = true;
                    }

                    if (overlap) {

                        if (overlapPlace === 'OSS') {
                            var modalInstance = $modal.open({
                                templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
                                //template:'<div> MODAL : true in Referral IN </div>',
                                size: 'lg',
                                controller: function ($scope, student, activity) {
                                    $scope.student = student;
                                    $scope.activity = activity;

                                },
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
                                controller: function ($scope, student, activity) {
                                    $scope.student = student;
                                    console.log(student);
                                    $scope.activity = activity;

                                },
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
                                aec.updateOverlapAttendance($scope.currentDate, student).then(
                                    function (data) {
                                        notify(data.msg);
                                        //var status = {class: 'bg-warning', action: 'foldersMarked'};
                                        //student.status = status;
                                    }, function (err) {
                                        notify('error, Before continuing please contact an admin');
                                    });
                            });
                            return true;
                        }

                        return false;
                    }
                }
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
                    $scope.selected.assignments = null;
                    $scope.teacherStudents = null;
                    var teacherId = $scope.selected.teacher.id;
                    students.query({teacherId: teacherId}, function (results) {
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
                        controller: function ($scope, teacher) {
                            $scope.teacher = teacher;
                        },
                        resolve: {// variables that get injected into the controller (taken from current $scope)
                            teacher: function () {
                                return $scope.selected.teacher;
                            }
                        }
                    }); // End modalInstace

                    modalInstance.result.then(function (data) {
                        assignmentsService.save({
                            teacher: $scope.selected.teacher,
                            assignment: data
                        }, function (response) {
                            var teacher = $scope.selected.teacher;
                            response.assignment.Id = response.assignment.Id + "";
                            $scope.selected.teacher.assignments.push(response.assignment);

                            var assign = $scope.selected.assignments;
                            assign = assign ? assign : [];
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
                    if(!$scope.selected.assignments){
                        notify({
                            message: "Hold your horses, to add a student you need to select an assignment first.",
                            classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                        });

                    }
                    console.log($scope.selected.student);
                    $http.get('api/classes/' + $scope.selected.student.id).then(function (response) {
                        referralToAdd.eightPeriod = response.data[7];
                        referralToAdd.ninethPeriod = response.data[8];
                    });

                    addAssignmentsToStudent(selectedAssignments, referralToAdd);
                    referralToAdd.teacher = $scope.selected.teacher;
                    $scope.refTable.unshift(referralToAdd);
                    console.log($scope.refTable);
                    $scope.selected.student = null;
                };

                /**
                 * Adds assignments to the student object
                 * @param  {[objects]} assignments    : list of assignment objects to be added
                 * @param    {object}    student        :
                 */
                function addAssignmentsToStudent(assignments, student) {

                    if (!student.referred) {// current student doesnt have any assignments, add all the selected assignments
                        //  copy assignments into referred
                        student.referred = assignments.slice();
                        return;
                    }

                    for (var i = 0; i < assignments.length; i++) {
                        var j = false;
                        for (j = 0; j < student.referred.length; j++) {// check if assignment is already in the student's list
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
                                notify({
                                    message: "AEC List Was Submitted Successfully",
                                    classes: 'alert-success', templateUrl: 'views/common/notify.html'
                                });
                            }, function (response) {
                                notify({
                                    message: "Submit Failed, Please Contact The Admin",
                                    classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                                });
                            });
                    $scope.$storage.refTable = [];
                    $scope.refTable = $scope.$storage.refTable;
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
        ['$scope', 'notify', 'StudentsService', 'teachers', '$modal', 'PeriodsService', '$interval', 'OroomService', 'ActivitiesService', 'ReferralsService', 'ISSService', '$rootScope', 'DevService', 'CountersService','$filter',
            function ($scope, notify, students, teachers, $modal, periods, $interval, orooms, activities, referrals, isss, $rootScope, dev, counters, $filter) {
                $scope.currentDate = new Date();
                function footable_redraw() {
                    $('.footable').trigger('footable_redraw');
                }

                $scope.$watch('form.date.$viewValue',function(n){
                    $scope.currentDate =  n? n:$scope.currentDate;
                    interval();
                });

                $rootScope.$on('studentsUpdated', function (stu) {
                    $scope.schoolStudents = students.students;
                });
                var intervalPromise = $interval(interval, 2000);
                $scope.$on('$destroy', function () {
                    $interval.cancel(intervalPromise);
                });

                $scope.mouseOnTable = false;
                function interval() {
                    var now = new Date($scope.currentDate);
                    $scope.currentTime = formatAMPM(new Date());
                    $scope.currentDate = formatDate(now);
                    $scope.currentPeriod = getPeriod(new Date());
                    if (!$scope.mouseOnTable) {
                        orooms.get({Date:$scope.currentDate}, function (data) {
                            angular.forEach(data.reftable, function (item) {
                                item.ReferralIn = item.ReferralIn === 1 ? true : false;

                            });
                            angular.forEach(data.OroomList, function (item) {
                                if (item.counters.ISSDays > 0) {
                                    item.class = 'bg-danger';
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
                        "Date": $scope.currentDate
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
                        controller: function ($scope, student, currentUser) {
                            $scope.student = student;
                            $scope.currentUser = currentUser;
                        },
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
                        }, function (data) {
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
                        controller: function ($scope, student) {
                            $scope.student = student;
                        },
                        resolve: {
                            student: function () {
                                return student;
                            }
                        }
                    });


                    modalInstance.result.then(function () {// on SUBMIT
                        // post the comment and other things to the database


                        // put reftable

                        var oRoomReferralTypeId = 1;
                        var oRoomActivityTypeId = 1;
                        var payLoad = {
                            Date: $scope.currentDate,
                            PeriodId: $scope.currentPeriod ? $scope.currentPeriod.Id : 0,
                            StudentId: student.StudentId,
                            TeacherId: student.teacher.id,
                            ReferralTypeId: oRoomReferralTypeId,
                            ActivityTypeId: oRoomActivityTypeId,
                            Comment: (student.comment || '') + '[From O-Room During Day(System)]'
                        };
                        orooms.save({ormlist: true}, payLoad, function (data) {
                            notify('success');
                            updateTable1Record(student);
                            $scope.refTable2.unshift(data);
                        }, function (error) {
                            notify('error');
                            student.ReferralIn = false;
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
                        controller: function ($scope, student) {
                            $scope.student = student;
                        },
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
                        counters.update({id: item.Id}, payload, function (data) {

                        }, dev.openError);

                        //add student to the list on the right
                        $scope.refTable2.splice($index, 1);

                    }, function () {// on modal DISMISS
                    });
                };


                $scope.onClear = function (student) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/ClearReferralsModal.html',
                        size: 'lg',
                        controller: function ($scope, PeriodsService, student) {
                            $scope.student = student;
                            $scope.onReferralRemove = function ($index) {

                            }
                        },
                        resolve: {
                            student: function () {
                                referrals.query({StudentId: student.Id}, function (data) {
                                    student.referred = $filter('filter')(data, function (o) {
                                        return o.ReferralTypeId === 1 || o.ReferralTypeId === 2
                                            || o.ReferralTypeId === 3 || o.ReferralTypeId === 16
                                            || o.ReferralTypeId === 19;
                                    });
                                    return student;
                                });
                                return student;

                            }
                        }
                    });
                    modalInstance.result.then(function () {// on SUBMIT
                        debugger;
                        referrals.deleteReferralsFromStudent($scope.currentDate, student).then(function (data) {
                            notify(data.msg, 'success');
                        }, dev.openError);

                        $scope.selected.student = null;
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
                        ReferralIn: item.ReferralIn ? 1 : 0,
                        ReferredInAt:item.ReferralIn ? true:null
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