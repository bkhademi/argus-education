/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global angular */

(function (app) {
	app.controller('oRoomActivityLogCtrl',
		['$scope', '$interval','FormatTimeService','OroomService', 'LunchService','ISSService','OSSService','ReteachListService','AECListService',
			function ($scope,  $interval, time, orooms, lunchs, isss, osss,reteach,aec) {

				$scope.currentDate = formatDate(new Date());
				$scope.child = {};
				$scope.count  = {};
				$scope.$watch('form.date.$viewValue',function(n,o){
					if(n){
						$scope.currentDate = n;
						console.log('new date ',n);
						$scope.child.getList($scope.currentDate);
					}

				});

					var intervalPromise = $interval(function () {
						$scope.child.getList($scope.currentDate);
					}, 5000);
					$scope.$on('$destroy', function(){
						$interval.cancel(intervalPromise);
					});


				// clock
				var intervalPromise2 = $interval(function(){
					$scope.currentTime = time.formatAMPM(new Date());
				}, 1000);
				$scope.$on('$destroy', function(){
					$interval.cancel(intervalPromise2);
				});

				lunchs.get({count:true, roster:true},function(data){ $scope.count.lunch = data.lunchStudentsCount;});
				orooms.get({count:true, roster:true}, function(data){ $scope.count.oroom = data.OroomList;});
				isss.get({count:true, roster:true}, function(data){$scope.count.iss = data.count;});
				osss.get({count:true, param:'ossList', }, function(data){$scope.count.oss = data.count;});
				reteach.get({count:true,roster:true},function(data){$scope.count.reteach = data.reteachCount;});
				aec.get({count:true,roster:true},function(data){$scope.count.aec = data.aecCount;});

				
			}]);
}(angular.module('Argus')));