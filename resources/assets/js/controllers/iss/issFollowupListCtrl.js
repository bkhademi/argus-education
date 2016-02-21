/* global angular */

(function (app) {
	app.controller('IssFollowupListCtrl', 
	['$scope', 'notify','ISSService','$modal', function ($scope, notify, isss, $modal) {
			$scope.iss = isss.query({followup:true});
			
			$scope.issFollowupAttendance = function (student,$index) {
				var modalInstance = $modal.open({
					templateUrl: 'views/modals/ISSFollowupModal.html',
					//template:'<div> MODAL : true in Referral IN </div>',
					size: 'lg',
					controller: function ($scope, student, teachers) {
						$scope.student = student;
						$scope.currentDate = new Date();
						$scope.teachers = teachers.query();
						$scope.$watch('form.date.$viewValue', function(newV, oldV){
							student.date = newV?newV:oldV;
							console.log(newV);
						});
					},
					resolve: {
						student: function () {
							return student;
						}
					}
				});

				modalInstance.result.then(function () {// on SUBMIT
					// post the comment and other things to the database 
					isss.update({id:student.Id ,followup:true },{
						Date: student.date,
						Time: student.time,
						ActionType: 46,
						Comment: student.comment,
						StudentId: student.StudentId,
						TeacherId: student.teacher.id
					}, function(data){
						notify(data.msg);
						$scope.iss.splice($index,1);
					}, function(error){
						notify('error');
					});

					 
					//$scope.selected.student = null;
				}, function () {// on modal DISMISS

				});
				
				
				
			};
		}]);
}(angular.module('Argus')));

