(function(app){
	app.controller('ASPAttendancesCtrl',['$scope','ASPService',function($scope,asp){
		$scope.currentDate = new Date();
		$scope.creationResults = [];

		$scope.createASPAlderson = function(){
			createASP(5);
		};
		$scope.createASPDunbar = function(){
			createASP(2)
		};
		$scope.createASPErvin = function(){
			createASP(3)
		};

		$scope.createASPAll = function(){
			createASP(0,true);
		};

		$scope.clearTable = function(){
			$scope.creationResults = [];
		};

		var createASP = function(schoolId,all){
			var date = $scope.attendance.date.$viewValue;
			console.log('date',date);
			console.log('schoolId',schoolId);
			$scope.loading=true;
			$scope.creationResults =  asp.save({SchoolId:schoolId, WeekStart:date,all:all},function(){
				$scope.loading = false;
			});
		};




	}])
}(angular.module('Argus')));
