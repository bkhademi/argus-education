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

