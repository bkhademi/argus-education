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
				$scope.iss = [];
				$scope.oss = [];
				$scope.currentDate = formatDate(new Date());

				$scope.activities = [
					{name: "Present", Id: 38},
					{name: "No Show", Id: 39},
					{name: "Left School", Id: 40},
					{name: "School Absent", Id: 41},
					{name: "Sent Out", Id: 42},
					{name: "Walked Out", Id: 42},
					{name: "Other", Id: 44}
				];
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
				
				lunchs.get({count:true, roster:true},function(data){ $scope.count.lunch = data.lunchStudentsCount;});
				orooms.get({count:true, roster:true}, function(data){ $scope.count.oroom = data.OroomList;});
				isss.get({count:true, roster:true}, function(data){$scope.count.iss = data.count;});
				osss.get({count:true, param:'ossList', }, function(data){$scope.count.oss = data.count;});
			}]);
}(angular.module('Argus')));