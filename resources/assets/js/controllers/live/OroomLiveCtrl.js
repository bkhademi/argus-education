/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
	app.controller('OroomLiveCtrl', ['$scope', '$interval',  'OroomService', 'FormatTimeService','PeriodsService',
		function ($scope, $interval,  orooms, time, periods) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			var intervalPromise = $interval(interval, 5000);
			
			$scope.$on('$destroy',function(){
				$interval.cancel(intervalPromise); 
			});

			function interval() {
				var now = new Date();
				$scope.currentPeriod = getPeriod(now);
			}

			$scope.changePeriodTables = function (newPeriod, manual) {
				$scope.currentPeriod = newPeriod;
			};


			$scope.periods = periods.query(function (data) {
				$scope.currentPeriod = getPeriod(new Date());
				interval();
			});

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


			$scope.getList = function(date) {
				orooms.get({Date:date}, function (data) {
					angular.forEach(data.reftable, function (item) {
						item.ReferralIn = item.ReferralIn === 1 ;
					});
					$scope.refTable = data.reftable;
					$scope.oroomlist = data.OroomList;
				});
			};
			$scope.getList($scope.currentDate);


		}]);
}(angular.module('Argus')));