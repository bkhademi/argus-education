/* global angular */

(function (app) {
	app
		.controller("ProfileCtrl",
			["$scope", "StudentsService", "$http", '$rootScope', 'ProfessorClassesService', 'RoomsService', function ($scope, students, $http, $rootScope, professorclasses, rooms) {
					$scope.schedule = []; // holds  student's schedule
					$scope.activities = []; // holds student'activities
					$scope.checks = [];
					$scope.currentDate = new Date();

					$scope.$watch('checks', function (n, o) {
//			console.log(n);
					}, true);
					$scope.role = $rootScope.currentUser.role;
					$scope.updateStudent = function () {
						students.update({id: $scope.student.Id, updateStudent: true}, {
							GuardianName: $scope.student.GuardianName,
							GuardianPhone: $scope.student.GuardianPhone,
							GuardianMPhone: $scope.student.GuardianMPhone,
							GuardianEmail: $scope.student.GuardianEmail
						});
					};
					$scope.rooms = rooms.query();

					$scope.onRoomChanged = function (professorclass) {
						console.log(professorclass);
						professorclasses.update({id: professorclass.Id}, {RoomId: professorclass.room.Id}, function (data) {
							console.log('success');
						});
					};

					$scope.downloadActivity = function () {
						var text = '';
						var heading = 'Date,ActionBy,Activity,Comment \n';
						text += heading;
						angular.forEach($scope.activities, function (act) {
							text += '"' + act.ActionDate.split(' ')[0] + '",';
							text += '"' + (act.user && act.user.FirstName )+ ', ' + (act.user && act.user.LastName )+ '",';
							text += '"' + act.activity.Name + '",';
							text += '"' + (act.Comment || '')  + '",';
							text += "\n";
						});


						download(text, $scope.student);
					};
					var download = function (text, student) {

						//console.log(text);
						var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURI(text));
						element.setAttribute('download', 'ActivityFor-' + student.user.FirstName + '_' + student.user.LastName + '.csv');
						element.style.display = 'none';
						document.body.appendChild(element);
						element.click();
						document.body.removeChild(element);
					};


					//console.log($scope.student)// contains the student to display 

					$scope.$watch('student', function (newVal, oldVal) {

						$scope.schedule = newVal.classes;
						var parentName = newVal.GuardianName ? newVal.GuardianName.split(',') : ["No", " name"];
						$scope.parents = [{
								fn: parentName[0],
								ln: parentName[1],
								phone: newVal.GuardianPhone || "none",
								mphone: 'None',
								email: 'None'}];

						$scope.activities = newVal.user.activities_affected;

					});

					/*******************  Right Side Controllers*********************/
					$scope.currentDate;
					$scope.$watch("profileForm.date.$modelValue", function (newVal, oldVal) {
						//console.info("date changedto :" + newVal)
					});


					$scope.showDetail = false;
					$scope.toggleShowDetail = function (index) {
						$scope.showDetail = !$scope.showDetail;
						$scope.selected = $scope.activities[index];
					};

					$scope.showComment = false;
					$scope.toggleShowComment = function (index) {
						$scope.showComment = !$scope.showComment;
						$scope.selected = $scope.activities[index];
					};

					$scope.addComment = function () {
						var entry =
							{date: formatDate(new Date),
								activity: "comment",
								Comment: $scope.comment,
								staff: $rootScope.currentUser.FirstName + ' ' + $rootScope.currentUser.LastName};
						$scope.activities.push(entry);
						$scope.comment = '';
					};

					$scope.graduationYear = 2015 + (12 - parseInt($scope.student.Grade, 10));

					function formatDate(date) {
						return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
					}

					$scope.filter = [];
					$scope.getActivities = function () {
						return ($scope.activities || []).map(function (w) {
							return w.activity.Name;
						}).filter(function (w, idx, arr) {
							return arr.indexOf(w) === idx;
						});
					};

					$scope.filterByCategory = function (act) {
						return $scope.filter[act.activity.Name] || noFilter($scope.filter);
					};
					// date selected on the checkboxes;
					function noFilter(filterObj) {
						for (var key in filterObj) {
							if (filterObj[key]) {
								return false;
							}
						}
						return true;
					}


				}]);

}(angular.module('Argus')));