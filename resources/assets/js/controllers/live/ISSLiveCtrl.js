/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('ISSLiveCtrl', ['$scope', '$interval','notify','ISSService',
		function ($scope, $interval, notify, isss) {
			
			var intervalPromise = $interval(function () {
				getISSList();
			}, 2000);
			
			$scope.$on('$destroy', function(){
				$interval.cancel(intervalPromise);
			});
			
			function getISSList(date){
				isss.query({date:date}, function (data) {
					$scope.iss = data;
				});
			};
			
		}]);
}(angular.module('Argus')));