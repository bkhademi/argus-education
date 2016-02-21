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