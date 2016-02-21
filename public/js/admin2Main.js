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
					$scope.graphData = graphData
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); }
				},
				resolve: {
					graphOptions : function () { return $scope.lineOptions },
					graphData: function () { return $scope.lineData }
				}
			})// End assignmentsModal
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
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); }
				},
				resolve: {
					graphOptions : function () { return $scope.lineOptions },
					graphData: function () { return $scope.lineData }
				}
			})// End assignmentsModal
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
			{fn:"Jose", ln:"Martinez", subjects:["Math", "Physics","Computer Science"], days:["M","W", "Sat"], rate:2.1},
		]
		
	}]);
}(angular.module('Argus')));
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
						controller: function ($scope, PeriodsService, student, teachers) {
							$scope.periods = PeriodsService.query();
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
						controller: function ($scope, student) {
							$scope.student = student;
							console.log(student);
						},
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
					}

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
					})
				}

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
						counters.update({id:item.Id}, payload,function(data){
							
						}, dev.openError);

						//add student to the list on the right
						$scope.refTable2.splice($index, 1);

					}, function () {// on modal DISMISS
					});
				}


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
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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




		}])


}(angular.module('Argus')));
//# sourceMappingURL=admin2Main.js.map
