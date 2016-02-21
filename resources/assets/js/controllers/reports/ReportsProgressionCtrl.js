/* global angular */

(function (app) {
	app.controller('ReportsProgressionCtrl', ['$scope', 'notify', '$modal', function ($scope, notify, $modal) {
			notify('ReportsProgressionCtrl');
			$scope.startingPoints = [
				{name: 'Reteach', value: 1},
				{name: 'AEC', value: 1},
				{name: 'O-Room', value: 2},
				{name: 'O-Room+1', value: 3},
				{name: 'ISS', value: 4},
				{name: 'OSS PMP', value: 5}
			];



			$scope.starting = undefined;
			$scope.eod.issStudents1 = [
				{StudentId: '100109607', FirstName: 'Mark', LastName: 'Gonzales', Date: '12/10/2015'},
				{StudentId: '100131423', FirstName: 'Adrian ', LastName: 'Black', Date: '12/10/2015', class: 'bg-warning'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/10/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/10/2015'},
				{StudentId: '102234384', FirstName: 'Henry ', LastName: 'Lopez', Date: '12/10/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/10/2015'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/10/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/10/2015'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/10/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/10/2015'}];

			$scope.eod.issStudents2 = [
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/11/2015'},
				{StudentId: '102234384', FirstName: 'Henry ', LastName: 'Lopez', Date: '12/11/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/11/2015'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/11/2015'},
				{StudentId: '100344318', FirstName: 'Adrian ', LastName: 'Black', Date: '12/11/2015', class: 'bg-warning'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/11/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/11/2015'}];


			$scope.eod.issStudents3 = [
				{StudentId: '100109607', FirstName: 'Mark', LastName: 'Gonzales', Date: '12/12/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/12/2015'},
				{StudentId: '100131834', FirstName: 'Adrian ', LastName: 'Black', Date: '12/12/2015', class: 'bg-warning'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/12/2015'},
				{StudentId: '102234384', FirstName: 'Henry ', LastName: 'Lopez', Date: '12/12/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/12/2015'}];


			$scope.eod.issStudents4 = [
				{StudentId: '100109607', FirstName: 'Mark', LastName: 'Gonzales', Date: '12/13/2015'},
				{StudentId: '100131423', FirstName: 'Tyron ', LastName: 'Black', Date: '12/13/2015'},
				{StudentId: '100131834', FirstName: 'Adrian ', LastName: 'Black', Date: '12/13/2015', class: 'bg-warning'},
				{StudentId: '100131834', FirstName: 'Sara ', LastName: 'Marquez', Date: '12/13/2015'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/13/2015'}];

			$scope.eod.issStudents5 = [
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/14/2015'},
				{StudentId: '100131834', FirstName: 'Adrian ', LastName: 'Black', Date: '12/14/2015', class: 'bg-warning'},
				{StudentId: '100344318', FirstName: 'David ', LastName: 'White', Date: '12/14/2015'}];
			$scope.selected = $scope.eod.issStudents1[1];
		}]);
}(angular.module('Argus')));
