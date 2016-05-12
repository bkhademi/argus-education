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