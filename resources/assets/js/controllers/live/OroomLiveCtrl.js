/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('OroomLiveCtrl', ['$scope', '$interval', 'notify', 'OroomService', 'PeriodsService', 'FormatTimeService', '$timeout','$rootScope',
		function ($scope, $interval, notify, orooms, periods, time, $timeout, $rootScope) {
			var intervalPromise = $interval(interval, 2000);
			
			$scope.$on('$destroy',function(){
				$interval.cancel(intervalPromise); 
			});

			function interval() {

				var now = new Date();
				$scope.currentTime = formatAMPM(now);
				$scope.currentDate = formatDate(now);
				$scope.currentPeriod = getPeriod(now);
				//var newPeriod = getPeriod(now);
				
				getORoomLists($scope.currentPeriod);
				
			}

			$scope.changePeriodTables = function (newPeriod, manual) {
				$scope.currentPeriod = newPeriod;
				
			};


			$scope.periods = periods.query(function (data) {
				$scope.currentPeriod = getPeriod(new Date());
				interval();
			});

			var formatAMPM = time.formatAMPM;
			var formatDate = time.formatDate;
			var formatTime24 = time.formatTime24;

			function getPeriod(date) {
				var currentPeriod = null;
				var datestr = formatTime24(date);

				angular.forEach($scope.periods, function (item) {
					if (datestr > item.StartTime) {
						//console.log('datestr < ' + item.StartTime);
						if (datestr < item.EndTime) {
							//console.log('datestr < ' + item.EndTime);
							currentPeriod = item;
						}
					}
				});
				return currentPeriod;
			}


			function getORoomLists(period) {
				orooms.get({}, function (data) {
					var ormList = [];
					angular.forEach(data.OroomList, function(item,$index){
						if(item.user.SchoolId === $rootScope.currentUser.SchoolId){
							ormList.push(item);
						}
					});
					$scope.refTable = data.reftable;
					$scope.oroomlist = ormList;
				});
			}
			getORoomLists();


		}]);
}(angular.module('Argus')));