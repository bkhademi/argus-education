/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (app) {
	app.controller('oRoomActivityLogAdminCtrl', ['$scope', 'notify', 'StudentsService', 'teachers', '$modal', '$interval',
		function ($scope, notify, students, teachers, $modal, $interval) {
			$scope.selected = {student: null};
			$scope.refTable1 = [];
			$scope.refTable2 = [];
			$scope.activities = [
				{name: "In O-Room", value: 0},
				{name: "Assign ISS", value: 1},
				{name: "Walked-Out", value: 2},
				{name: "Other", value: 3},
			];
			
			
			
			$interval(function(){
				var now = new Date();
				$scope.currentTime = formatAMPM(now);
				$scope.currentDate = formatDate(now);
				// check time and change period accordingly 
				$scope.currentPeriod = 3;
				
			},1000);
			
			
			
			 

			students.query({admin: true, light: true}, function (results) {
				console.log("Teacher students");
				console.log(results);

				$scope.schoolStudents = results;
				//testing 
				$scope.selected.student = results[0];
				$scope.onSelectedStudent();
			}, function (error) {
				console.log(error);
			});

			$scope.teachers = teachers.query(function (data) {
				console.log('the teachers');
				console.log(data);
			});

			$scope.onSelectedStudent = function () {
				$scope.selected.student.activity = $scope.activities[0];
				$scope.refTable1.unshift($scope.selected.student);
				$scope.selected.student = null;
				//request the teachers of this student: no

			};
			$scope.onActivitySelected = function (student, oldActivity) {
				console.log(student.activity);
				console.log(oldActivity);
				if (student.activity.value !== 1) {
					return;
				}
				var modalInstance = $modal.open({
					templateUrl: 'views/modals/ISSReferralModal.html'  ,
					//template: '<div> MODAL: assignISS selected</div>',
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
				
				modalInstance.result.then(function () {//on SUBMIT
					// post the ISS referral to the database 

					//change switch  to static 
					//student.staticRef = true;
					
					// change teacher to static
					//student.staticTeacher = true;
					
					// change row to non removable
					student.nonRemovable = true;
					
					student.staticActivity = true;

				});
			};
			$scope.onReferralInTrue = function (student) {
				if (student.referralIn === false) {
					return;
				}
				if (!student.sentOutBy) {
					notify({message: 'Please Select A Teacher First'});
					student.referralIn = false;
					return;
				}

				var modalInstance = $modal.open({
					templateUrl: 'views/modals/oRoomReferralModal.html',
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

				modalInstance.result.then(function () {// on SUBMIT
					// post the comment and other things to the database 

					//add student to the list on the right
					$scope.refTable2.unshift(student);

					//change switch  to static 
					student.staticRef = true;
					// change teacher to static
					student.staticTeacher = true;
					// change row to non removable
					student.nonRemovable = true;

				});

			}

			function formatAMPM(date) {
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();
				var ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var strTime = hours + ':' + minutes +':'+seconds+ ' ' + ampm;
				return strTime;
			}
			
			function formatDate(date){
				var month = date.getMonth();
				var day = date.getDate();
				var year = date.getFullYear();
				var strDate = month + '/'+ day + "/" + year;
				return strDate;
			}
			
		}]);
}(angular.module('Argus')));