(function (app) {
	app.controller('AECLiveCtrl', ['$scope', 'AECListService',
		function ($scope, aec) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function (date) {
				aec.getList(date, function (data) {
					$scope.refTable = data;
					$scope.count.aec = data.length;
				});
			};
			$scope.getList($scope.currentDate);

		}]);
}(angular.module('Argus')));