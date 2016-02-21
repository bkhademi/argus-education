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
						templateUrl: 'views/modals/attendaceModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: function ($scope, student, teachers) {
							$scope.student = student;
							$scope.currentDate = new Date();
							$scope.teachers = teachers.query();
							$scope.$watch('form.date.$viewValue', function (newV, oldV) {
								student.date = newV ? newV : oldV;
								console.log(newV);
							});
						},
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