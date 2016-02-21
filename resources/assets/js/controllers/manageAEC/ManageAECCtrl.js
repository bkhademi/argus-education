/* global angular, URL */

(function (app) {
	"use strict";
	app
		.controller("manageAECController", ["$scope", "$filter", "$modal", "referrals", "PassesService",
			"StudentsService", "notify", "AECListService",'UtilService',
			function ($scope, $filter, $modal, referrals, passes, students, notify, aec,utils) {
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
						$scope.refTable =aec.query({id: newVal}, function (data) {
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
								notify({message: "No students for current date",
									classes: 'alert-warning', templateUrl: 'views/common/notify.html'});
							} else {
								
							}
						});
					}
				});


				$scope.onSelectedStude = function (student) {
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/attendanceAECModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: function ($scope, student, $timeout, $modalInstance) {
							$scope.student = student;
							$timeout(function () {
								$modalInstance.dismiss('cancel');
							}, 2000);
						},
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
								+ (item.overlap ? item.overlap.place : 'N/A')+',' 
								+  item.status.action
								+ ' \n';
						});
					});
					utils.downloadCSV(text, 'AEC-List_' + $scope.currentDate );
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
						controller: function ($scope, student) {
							$scope.student = student;
						},
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
							});
						},
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