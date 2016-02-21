
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