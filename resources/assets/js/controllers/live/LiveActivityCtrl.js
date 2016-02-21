/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global angular */

(function (app) {
	app.controller('oRoomActivityLogCtrl',
		['$scope', 'notify','$interval','FormatTimeService',
			function ($scope, notify, $interval, time) {
				$scope.currentList = 'oroom';
				$scope.currentList = 'oroom';
				$scope.refTable = [];
				$scope.lunchTableA = [];
				$scope.lunchTableB = [];
				$scope.iss = [];
				$scope.oss = [];
				$scope.currentDate = formatDate(new Date());
				
				$interval(function(){
					$scope.currentTime = time.formatAMPM(new Date());
				}, 1000);
				
				
			}]);
}(angular.module('Argus')));