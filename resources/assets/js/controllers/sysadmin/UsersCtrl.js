/* global angular */

(function (app) {
	app.controller('UsersCtrl',
		['$scope', 'UsersService', 'RolesService','StudentsService', 'notify','$modal','$rootScope', 
			function ($scope, users, roles,students, notify, $modal, $rootScope) {
				$scope.selected = {};
				$scope.userInfo = {};
				$scope.roles = roles.query();
				$scope.showLoginFields = false;
				$scope.schools = [
					{Id: 1, Name: 'Estacado High School'},
					{Id: 2, Name: 'Dunbar College Preparatory Academy'},
					{Id: 3, Name: 'Ervin Elementary School'},
					{Id: 4, Name: 'Adrian School'}
				];
				var openCreateNewStudent = function () {
					var student = {UserInfo: {}, StuInfo: {}, ProfessorClasses: []};
					var modalInstance = $modal.open({
						templateUrl: 'views/modals/CreateStudentModal.html',
						//template:'<div> MODAL : true in Referral IN </div>',
						size: 'lg',
						controller: function ($scope, student, ProfessorClassesService) {
							$scope.schools = [
								{Id: 1, Name: 'Estacado High School'},
								{Id: 2, Name: 'Dunbar College Preparatory Academy'},
								{Id: 3, Name: 'Ervin Elementary School'},
								{Id: 4, Name: 'Adrian School'}
							];
							$scope.classes = ProfessorClassesService.query();
							$scope.student = student;
						},
						resolve: {
							student: function () {
								return student;
							}
						}
					});
					modalInstance.result.then(function () {// on SUBMIT
							student.StuInfo.StudentId = student.UserInfo.UserName;
							student.UserInfo.SchoolId = student.UserInfo.SchoolId.Id;
							angular.forEach(student.ProfessorClasses, function (item) {
								console.log(item);
								item.ProfessorClassId = item.ProfessorClass.Id;
								delete item.ProfessorClass;
							});
							student.userInfo = student.UserInfo;
							students.save(student, function (data) {
								students.query({admin: true, light: true}, function (data) {
									students.students = data;
									$rootScope.$broadcast('studentsUpdated', {students: data});
								});



							});
						}, function () {// on modal DISMISS

						});
				};
				$scope.onRoleChanged = function () {
					var role = $scope.selected.role;
					if (!(role.Name === "Teacher" || role.Name === "Student")) {
						$scope.showLoginFields = true;
						$scope.showStudentFields = false;
					}
					else if (role.Name === "Student") {
						openCreateNewStudent();
					}
					else {
						$scope.showLoginFields = false;
					}
				};
				$scope.createUser = function () {
					// remove objects/arrays from userInfo
					$scope.userInfo.SchoolId = $scope.userInfo.SchoolId.Id;
					
					users.save({
						userInfo: $scope.userInfo,
						role: $scope.selected.role
					}, function (data) {
						notify('user successfully Saved');
						$scope.userInfo = {};
					});
				};
			}]); 
}(angular.module('Argus')));


