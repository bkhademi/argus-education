/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('attendanceRostersCtrl',
		['$scope', '$modal', 'notify',  'StudentsService','OroomService', 'LunchService','ISSService','OSSService',
			function ($scope, $modal, notify, students, orooms, lunchs, isss, osss) {
				$scope.currentList = 'oroom';
				$scope.count =  {};
				$scope.refTable = [];
				$scope.lunchTableA = [];
				$scope.lunchTableB = [];
				$scope.iss = {};
				$scope.oss = {};
				$scope.currentDate = formatDate(new Date());

				$scope.download = function (text,type) {
					type = type? type:'';
					//console.log(text);
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
					element.setAttribute('download', 'roster'+type+'.csv');
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				};

				$scope.oroom = orooms;
				$scope.lunch = lunchs;
				$scope.iss = isss;
				$scope.oss = osss;
				lunchs.getCount();
				orooms.getCount();
				isss.getCount();
				osss.getCount();
			}]);
}(angular.module('Argus')));