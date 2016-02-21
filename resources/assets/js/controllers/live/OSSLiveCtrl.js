/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global angular */

(function (app) {
	app.controller('OSSLiveCtrl', ['$scope', '$interval','notify', 'OSSService',
		function ($scope, $interval, notify, osss) {
			
			var intervalPromise = $interval(function () {
				getOSSList(); 
			}, 2000);
			
			$scope.$on('$destroy', function(){
				$interval.cancel(intervalPromise);
			});
			
			function getOSSList(date){
				osss.query({date:date}, function (data) {
					$scope.oss = data;
				});
			};
			
		}]);
}(angular.module('Argus')));