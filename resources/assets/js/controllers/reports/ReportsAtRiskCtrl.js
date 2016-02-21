/* global angular */

(function (app) {
	app.controller('ReportsAtRiskCtrl', ['$scope', 'notify','$modal', function ($scope, notify,$modal) {
			notify('ReportsAtRiskCtrl');
			$scope.eodReports = [
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'Reteach', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			$scope.eod.selected = {name:0, value:0 };
			
			angular.forEach($scope.eod.issStudents, function(item){
				item.class = 'bg-danger';
			});
		}]);
}(angular.module('Argus')));
