/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global angular */

(function (app) {
	app.controller('OSSLiveCtrl', ['$scope', '$interval', 'OSSService',
		function ($scope, $interval, osss) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;
			$scope.getList = function(date) {
				$scope.oss = osss.getOSSList(date);
			};
			$scope.getList($scope.currentDate);
		}]);
}(angular.module('Argus')));