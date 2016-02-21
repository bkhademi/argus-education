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