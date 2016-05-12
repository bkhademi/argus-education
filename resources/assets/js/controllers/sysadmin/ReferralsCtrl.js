/* global angular */

(function (app) {
	app.controller('ReferralsCtrl',
		['$scope', 'AdminReferralsService', 'UserActionsService', 'SchoolsService', 'StudentsService', 'ActivitiesService','CountersService', '$http', 'notify','$q',
			function ($scope, referrals, actions, schools, students, activities, counters, $http, notify, $q) {
				$scope.selected = {};
				$scope.referral = {};
				$scope.action = {};
				$scope.schools = schools.query();
				$scope.activities = activities.query();

				$scope.getSchoolStudents = function (school) {
					$scope.students = students.query({schoolId: school.Id});
				};

				$scope.getAll = function () {
					var student = $scope.selected.student;
					$scope.referrals = referrals.query({id: student.Id});
					$scope.actions = actions.query({id: student.Id});
					$scope.counters = counters.get({id:student.Id});
				};

				$scope.getReferrals = function () {
					var student = $scope.selected.student;
					$scope.referrals = referrals.query({id: student.Id});
				};
				$scope.getActions = function () {
					var student = $scope.selected.student;
					$scope.actions = actions.query({id: student.Id});
				};
				$scope.getCounter = function(){
					var student = $scope.selected.student;
					$scope.counters = counters.get({id:student.Id});
				};

				$http.get('api/referraltypes').then(function (response) {
					$scope.referraltypes = response.data;
				});

				$scope.referralUpdate = function (referral) {
					console.log(referral); 

					// do an update request
				};
				$scope.actionUpdate = function (action) {
					console.log(action);
					// do an update request
				};

				$scope.selectItem = function (item) {
					$scope.referral = item;
				};

				$scope.onDeleteReferral = function ($index, showNotification,remove) {
					var item = $scope.referrals[$index];
					return referrals.remove({id: item.Id}, function () {
						remove && $scope.referrals.splice($index, 1);
						showNotification && notify('successfully deleted');
					}, function () {
						notify('error');
					});
				};
				$scope.deleteAllReferrals = function () {
					var promises = [];
					angular.forEach($scope.referrals, function (item, $index) {
						var promise = $scope.onDeleteReferral($index, false,false).$promise;
						
						promises.push(promise);
					});
					
					$q.all(promises).then(function (){
						$scope.referrals = [];
					});
					

				};
				$scope.deleteAllActions = function () {
					var promises = [];
					angular.forEach($scope.actions, function (item, $index) {
						var promise = $scope.onDeleteAction($index, false, false).$promise;
						debugger;
						promises.push(promise);
					});
					$q.all(promises).then(function (){
						$scope.actions = [];
					});
					
				};

				$scope.onDeleteAction = function ($index, showNotification,remove) {
					var item = $scope.actions[$index];
					return actions.remove({id: item.Id}, function () {
						remove && $scope.actions.splice($index, 1);
						showNotification && notify('successfully deleted');
					}, function () {
						notify('error');
					});
				};


				$scope.checkMissingORMStudents = function(){
					if(!$scope.selected.school){
						notify('Select a school first');
						return;
					}
					var schoolId = $scope.selected.school.Id;
					$scope.missingORMStudents = referrals.query({CheckOroomMissing:true,SchoolId:schoolId, Date:$scope.missing.date.$viewValue})
				}
			}]);
}(angular.module('Argus')));
