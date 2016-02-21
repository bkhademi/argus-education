/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('LunchDetentionLiveCtrl', ['$scope', '$interval', 'notify', 'DevService', 'LunchService',
		function ($scope, $interval, notify, dev, lunchs) {

			$scope.lunchTableA = [];
			$scope.lunchTableB = [];

			var intervalPromise = $interval(function () {
				getLunchLists();
			}, 2000);


			$scope.$on('$destroy', function () {
				$interval.cancel(intervalPromise);
			});

			function getLunchLists(date) {
				lunchs.query({date: date}, function (data) {
					// separate the lists by the lunch type of the students
					$scope.lunchTableA = [];
					$scope.lunchTableB = [];
					$scope.lunchTableC = [];
					$scope.lunchTable = data;
					angular.forEach(data, function (item) {
						if (item.LunchType === 'A Lunch')
							$scope.lunchTableA.push(item);
						else if (item.LunchType === 'B Lunch')
							$scope.lunchTableB.push(item);
						else
						$scope.lunchTableC.push(item);

					});

				});
			}
			;
		}]);
}(angular.module('Argus')));