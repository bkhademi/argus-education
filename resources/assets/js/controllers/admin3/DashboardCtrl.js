/* global angular */

(function (app) {
	"use strict";
	app.controller('DashAdmin3Ctrl', ['$scope', '$modal', 'notify', 'OroomService', "LunchService", "ISSService", "OSSService",
		function ($scope, $modal, notify, orooms, lunchs, isss, osss) {
			$scope.counters = {oroom: 0, average: 'N/A'};
			orooms.get({roster: true}, function (data) {
				$scope.counters.oroom += data.OroomList.length;
				angular.forEach(data.OroomList, function (item) {
					if (item.counters.ISSDays > 0) {
						$scope.counters.oroom--;
					}
				});

			});

			lunchs.query({roster: true}, function (data) {
				$scope.counters.oroom += data.length;

			});

			isss.query({roster: true}, function (data) {
				$scope.counters.oroom += data.length;


			});

			osss.query({roster: true}, function (data) {
				$scope.counters.oroom += data.length;

			});

			var date = Date();


			$scope.downloadEODReport = function () {
				//notify({message:'t'});
				return;
			};

			/**
			 * Opens modal for average attendance
			 */
			$scope.openAverageAttendance = function () {
				$scope.studentsToday = 0;
				$scope.FollowUp = 0;
				$scope.averageAttendance = 0;
				$scope.rating = 0;

				var averageAttendanceModal = $modal.open({
					templateUrl: 'averageAttendanceModal.html',
					size: 'lg',
					controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
						$scope.graphOptions = graphOptions;
						$scope.graphData = graphData;

						$timeout(function () {
							$scope.drawGraph = true;
						}, 100);


						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};
					},
					resolve: {
						graphOptions: function () {
							return $scope.lineOptions;
						},
						graphData: function () {
							return $scope.lineData;
						}
					}
				});// End assignmentsModal
			};

			/**
			 * Data for Line chart
			 */
			$scope.lineData = {
				labels: ["January", "February", "March", "April", "May", "June", "July"],
				datasets: [
					{
						label: "Example dataset",
						fillColor: "rgba(185, 35, 34, .5)",
						strokeColor: "rgba(185, 35, 34, .8)",
						pointColor: "#B92322",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: [0, 0, 0, 0, 0, 0, 0]
					}
				]
			};

			/**
			 * Options for Line chart
			 */
			$scope.lineOptions = {
				scaleShowGridLines: true,
				scaleGridLineColor: "rgba(0,0,0,.05)",
				scaleGridLineWidth: 1,
				bezierCurve: false,
				bezierCurveTension: 0.4,
				pointDot: true,
				pointDotRadius: 4,
				pointDotStrokeWidth: 1,
				pointHitDetectionRadius: 20,
				datasetStroke: true,
				datasetStrokeWidth: 2,
				datasetFill: true
			};

		}]);
}(angular.module('Argus')));