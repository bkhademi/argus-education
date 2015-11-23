(function (app) {
	"use strict";
	app
	.controller("manageAECController", ["$scope",  "$filter", "$modal", "referrals", "PassesService", "StudentsService", "notify",
		function ($scope,  $filter, $modal,  referrals,  passes, students, notify) {
			$scope.selected = {};
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
					
					var valids = [];
					$scope.refTable = referrals.query({id:newVal},function(data){
						// adjust the returned referrals 
						for(var i = 0; i < data.length ; i++){
							for(var j = 0 ; j < data[i].referred.length ; j++){
								data[i].referred[j].id = data[i].referred[j].Id;
								angular.extend(data[i].referred[j], data[i].referred[j].assignment);
								
							}
							if(data[i].referred.length !== 0 ){
								valids.push(data[i])
							}
							
							data[i].student.ParentNotified = data[i].student.ParentNotified==="1"?true:false;
							data[i].student.Notified = data[i].student.Notified==="1"?true:false;
							
						}
						console.log(valids);
						valids.$promise = data.$promise;
						valids.$resolved = data.$resolved;
						data = valids;
						if (!data.length) {
							$scope.refTable = [];
							alert("No students for current date");
							
							} else {
							console.log(data);
							$scope.refTable = data;
							$scope.passesTable = data;
							angular.forEach($scope.refTable, function (student) {
								student.status = [false,true];
							})
						}
					});
				}
			});
			
			
			/**
				* Makes API call to get a pdf of the AEC passes for the students
				* assigned AEC for the current date
			*/
			$scope.getPasses = function(){
				passes.pdf({date:$scope.currentDate, param:'AECList'}, function(data){
					console.log(data);
					var fileURL = URL.createObjectURL(data.response);
					window.open(fileURL);
				})
				
			};
			
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
				
				//console.log(text);
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				element.setAttribute('download', 'info.csv');
				element.style.display = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			};
			
			/**
				* Converts the current AEC list into a csv text format so it can
				* be passed to the download method 
			*/
			$scope.AECListCSV = function(){		
				var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Assignment\n';
				angular.forEach($scope.refTable,  function(item){
					angular.forEach(item.referred, function(referred){
						text +=    referred.user.FirstName +', ' + referred.user.LastName+","+item.FirstName + ',' + item.LastName + ',' + item.student.StudentId;
						text +=   item.student.Grade +', '+ referred.assignment.Name;  
						text +=  ' \n';
					});
				})
				download(text);
			};
			
			
			/******** MANAGE AEC **********/
			// for the next submit functions remove student from list self-reducing list.
			// To avoid duplicate profile entries only 1 entry should be created in
			// useractions table and all referrals must be changed in referrals 
			// table (see backend implementation)
			/**
				* PUT API call to change the referral status to present (ReferralStatus 2)
				* as well as loggin it in the user actions for the profile 
				* @param {object} data: information returned by modal (student)
			*/
			var submitPresent = function (data) {
				// get assignments info from the checkboxes
				var student = data.student;
				//            var completedAssignments = [];
				//            angular.forEach(student.referred, function (item) {
				//                if (item.selected)
				//                    completedAssignments.push({ assignmentId: item.Id, referralId:item.id });
				//            })
				// submit information of student  '$scope.selected.student'  to the database
				angular.forEach(student.referred, function(item){
					referrals.update({'param':'present','id':item.id, 'Reprint':item.reprint, 'Completed':item.selected},{data:item}, function(response){
						
						}, function(response){
						notify({message: "Present Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});
				})
				//referrals.update({'param':'present','id':student.id},{ data:completedAssignments });
				
				//remove element from table; backend works the logic for completeness and incompleteness
				// and to put the student in AEC Absence list// here or on backend
				removeSelectedStudentFromTableAndClear();
			};
			
			/**
				* PUT API call to change the referral status to reschedule (ReferralStatus 2), 
				* rescheduling all the referrals as well as loggin the reschedule 
				* into user actions for the profile 
				* @param {object} data: information returned by modal (date,comment,student,excused)
			*/
			var submitReschedule = function (data) {
				// get info from comment box and DatePicker       
				// submit information of student '$scope.selected.student' to the database
				var student = data.student;
				angular.forEach(student.referred, function(item){
					referrals.update({
						param:'reschedule',
						comment:data.comment,
						excused:data.excused,
						newDate:data.date,
						oldDate:$scope.currentDate,
						id:item.id},{data:item}, function(response){
						console.log(response);
					}, function (response){
						notify({message: "Reschedule Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});
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
				
				// submit information of student '$scope.selected.student' to the database
				referrals.update({param:'clear', comment:data.comment, id:data.student.referred[0].id}, data,
				function(response){
					
				}, function(response){
						notify({message: "Clear Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
				});
				//remove element from table; backend works the logic for completeness and incompleteness
				// and to put the student in AEC Absence list// here or on backend
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
					angular.extend(data,{comment:rescheduleComment,excused:true, oldDate:$scope.currentDate, date:data.newDate});
					$scope.selected.student = data.student;
					submitReschedule(data);
					
					}else{
					// Make A post to update the student parent's information 
					var student = data.student.student;
					
					students.update({id:data.student.id}, {
						ParentNotified:student.ParentNotified?1:0,
						ParentNotifiedComment:student.ParentNotifiedComment,
						ValidNumber:student.ValidNumber?1:0,
						ParentSupportive:student.ParentSupportive?1:0,
						GuardianPhone : student.GuardianPhone
					},function(response){
						
					}, function(response){
						notify({message: "Parent Notified Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});
					
					
				}
				
				
			}
			
			/**
				* PUT API call to log student notified information for student clicked
				* 
				* @param {object} ref: student selected
				* @param {int} $index: refTable index of student selected
			*/
			$scope.submitStudentNotified = function(ref, $index){
				
				var studentNotified =ref.student.Notified;
				students.update({id:ref.id}, {Notified:!studentNotified?1:0},function(response){
					console.log(response);
				})
				console.log($scope.refTable[$index]);
			};
			
			/**
				* PUT API call to change the all unprocessed referrals to absent(ReferralStatus 4)
				* as well as logging the absent into user actions for the profile 
			*/
			$scope.finishManageAEC = function(){
				angular.forEach($scope.refTable, function(student){
					angular.forEach(student.referred, function(assignment){
						referrals.update({'id':assignment.id},
						{'param':'absent' }, function(response){
							
						}, function(response){
						notify({message: "Finish Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					})
					});
				});
				$scope.refTable = [];
			}
			/********************************************** MODALS   **************************/
			
			/** Present Modal
				* Opens the present modal and passes in the student selected to be available
				* in the modal context, calls the submitPresent function when modal
				* submit button is clicked, does nothing otherwise
			*/
			$scope.openPresent = function () {
				var modalInstance = $modal.open({
					templateUrl: 'views/modals/PresentModal.html',
					size: 'md',
					controller: function ($scope, student) {
						$scope.student = student;
						$scope.changedStatus = function(){
							alert(item.accepted);
						}
					},
					resolve: { // variables that get injected into the controller (taken from current $scope)
						student: function () { return $scope.selected.student; },
					}
				}) // End modalInstace
				
				modalInstance.result.then(submitPresent, function(){
					
				});
				
			}
			
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
							if (newValue){ //when date has a valid date request the List from that date
								$scope.date = newValue;
								console.log('date changed');
							}
						})
						
					},
					resolve: {
						student: function () { return $scope.selected.student; },
					}
				});// end modalInstance
				
				resModal.result.then(submitReschedule);
			}
			
			/** Clear Modal
				* Opens the Clear modal and passes in the student selected to be available
				* in the modal context, calls submitClear function when modal 
				* submit button is clicked,does nothing otherwise
			*/
			$scope.openClear = function (studentInfo) {
				
				var clrModal = $modal.open({
					templateUrl: 'views/modals/ClearModal.html',
					size: 'md',
					controller: function ($scope, student ) {
						$scope.student = student;
						$scope.title = 'clear'
					},
					resolve: {
						student: function () { return $scope.selected.student; }
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
					controller: function ($scope, $modalInstance, student,date) {
						$scope.student = student;
						$scope.date = date;
						
						$scope.$watch('form.date.$viewValue', function (newValue) {
							if (newValue) { //when date has a valid date request the List from that date
								$scope.date = newValue;
							}
						})
					},
					resolve: {
						student: function () { return stu },
						date: function(){return $scope.currentDate}
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
			var removeSelectedStudentFromTableAndClear = function(){
				for (var i = 0; i < $scope.refTable.length; i++)
				if ($scope.selected.student.id === $scope.refTable[i].id){
					$scope.refTable.splice(i, 1);
					break;
				}
				$scope.selected.student = null;
			}
			}]);
	
}(angular.module('Argus')));						