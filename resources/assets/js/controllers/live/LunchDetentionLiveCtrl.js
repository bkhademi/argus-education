
/* global angular */

(function (app) {
	app.controller('LunchDetentionLiveCtrl', ['$scope', '$interval',  'DevService', 'LunchService',
		function ($scope, $interval, dev, lunchs) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function(date) {
				lunchs.getList(date).then(function (data) {
					// separate the lists by the lunch type of the students
					$scope.lunchTableA = [];
					$scope.lunchTableB = [];
					$scope.lunchTableC = [];
					$scope.lunchTable = data.lunchStudents;
					$scope.count.lunch = data.lunchStudentsCount;
					angular.forEach(data.lunchStudents, function (item) {
						if (item.LunchType && item.LunchType.search(/a/i) != -1)
							$scope.lunchTableA.push(item);
						else if (item.LunchType && item.LunchType.search(/b/i) != -1)
							$scope.lunchTableB.push(item);
						else
							$scope.lunchTableC.push(item);

					});

				});
			};
			$scope.getList($scope.currentDate);


		}]);
}(angular.module('Argus')));