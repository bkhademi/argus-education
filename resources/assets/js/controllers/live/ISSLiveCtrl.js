/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('ISSLiveCtrl', ['$scope', '$interval', 'ISSService',
		function ($scope, $interval, isss) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function (date) {
				isss.getList(date, function (data) {
					$scope.refTable = data;
					$scope.count.iss = data.length;
				});
			};
			$scope.getList($scope.currentDate);


		}]);
}(angular.module('Argus')));