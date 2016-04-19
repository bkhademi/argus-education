(function (app) {
	app.controller('ReteachCtrl', ['$scope', 'ReteachListService',
		function ($scope, reteach) {
			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.getList = function (date) {
				reteach.getList(date, function (data) {
					$scope.refTable = data;
					$scope.count.reteach = data.length;
				});
			};
			$scope.getList($scope.currentDate);

		}]);
}(angular.module('Argus')));