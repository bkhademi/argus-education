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
					$scope.edits = [];
					$scope.eightPeriods = [];


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