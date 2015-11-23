(function(app){
	"use strict";
	app
	.controller("manageAECAbsenceController", 
	["$scope",  "$modal", "referrals","PassesService","UserActionsService",'BbyArgusGeneralDBService',
		function ($scope, $modal,referrals, passes, useractions, generaldb) {
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
					
					referrals.query({id:newVal, absence:true},function(data){
						
						if (!data.length) {
							$scope.refTable = [];
							alert("No students for current date");
							
							} else {
							$scope.refTable = data;
							$scope.passesTable = data;
							angular.forEach($scope.refTable, function (student) {
								
								student.status = [false, true];
								
							})
						}
						
						generaldb.query(function(data){
							console.log(data);
						})
					})
				}
			});
			
			/**
			 * Makes API call to get a pdf of the AECAbsence passes for the students
			 * assigned AEC for the current date
			 */
			$scope.getPasses = function(){
				$scope.getPasses = function(){
					passes.pdf({date:$scope.currentDate, param:'absence'}, function(data){
						var fileURL = URL.createObjectURL(data.response);
						window.open(fileURL);
					})
				};
			}
			
			/**
			 * Select the student that is clicked in the table so that the user doesn't 
			 * have to type it 
			 * @param {int} $index: reftable index of the clicked student 
			 */
			$scope.onSelect = function($index){
				$scope.selected.student = $scope.refTable[$index];
			};
			
			/**
			 * Makes a download prompt of the current AEC list as a csv file
			 * @param {string} text
			 */
			var download = function (text) {
				
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				element.setAttribute('download', 'info.csv');
				element.style.display = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			};
			
			/**
			 * Converts the Kids that were marked with SentOut or Walkout  into a csv text 
			 * format so it can downloaded and Referred to O-Room
			 * be passed to the download method 
			 */
			$scope.oRoomListCSV = function(){
				useractions.query({param:'ORoom'}, function(data){
					//headings
					var text = 'FirstName,LastName,StudentId\n';
					angular.forEach(data,  function(item){
						text +=  item.student.FirstName + ',' + item.student.LastName + ',' + item.student.UserName;
						
						text +=  ' \n';
					})
					download(text);
				})
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
				var student = $scope.selected.student;
				var status = data.noShow?0:data.walkOut?1:data.sentOut?2:data.schoolAbsent?3:data.disciplinary?4:data.clear?5:-1;
				
				// submit info of student '$scope.selected.student' to database
				var dataToSent = {param:'AbsentComment', comment:data.comment, status:status}
				referrals.update({id:student.id}, dataToSent);
				
				var indexOfStudent = $scope.refTable.indexOf($scope.selected.student);
				$scope.refTable.splice(indexOfStudent, 1);
				$scope.selected.student = null;
			}
			
			/********** MODALS   **********/		
			/** Comment Modal
			 * Opens the Comment modal and passes in the student selected to be available
			 * in the modal context, calls the SubmitComment function when modal
			 * submit button is clicked, does nothing otherwise
			 */
			$scope.openComment = function (studentInfo) {
				var commentModal = $modal.open({
					templateUrl: 'views/modals/CommentAbsenceModal.html',
					size: 'md',
					controller: function ($scope, student) {
						$scope.title = "Comment";
						$scope.student = student;
					},
					resolve: {
						student: function () { return $scope.selected.student; },
					}
				})// End commentModal
				
				commentModal.result.then(submitComment)
			}
			
		}])	
}(angular.module('Argus')));