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