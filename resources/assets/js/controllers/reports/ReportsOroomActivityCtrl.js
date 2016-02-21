/* global angular */

(function (app) {
	app.controller('ReportsOroomActivityCtrl', ['$scope', 'notify', '$modal', '$http', 'FormatTimeService', '$rootScope',
		function ($scope, notify, $modal, $http, time, $rootScope) {
			$scope.currentDate = new Date();
			$scope.list = [];
			$scope.counters = {};
			$scope.activities = [{Name: "In O-Room", Id: 1},
				{Name: "Assign ISS", Id: 2},
				{Name: "Walked-Out", Id: 3},
				{Name: "No Show", Id: 4},
				{Name: "Other", Id: 5}
			];
			$scope.$watch('date.date.$viewValue', function (newValue, oldValue) {
				if (newValue) {
					var date = time.formatDate(new Date(newValue));
					$http.get('/api/report-oroomactivity' + '/?date=' + date).then(function (response) {

						$scope.counters = {
							students: 0,
							referredIn: 0,
							inOroom: 0,
							assignISS: 0,
							walkedOuts: 0,
							noShows: 0,
							other: 0
						};
						$scope.list = response.data;
						$scope.counters.students = response.data.length;
						angular.forEach($scope.list, function (item) {

							if (item.ReferralIn === 1) {
								$scope.counters.referredIn++;
							}
							switch (item.activity.Id) {
								case 1:
									$scope.counters.inOroom++;
									break;
								case 2:
									$scope.counters.assignISS++;
									break;
								case 3:
									$scope.counters.walkedOuts++;
									break;
								case 4:
									$scope.counters.noShows++;
									break;
								case 5:
									$scope.counters.other++;
									break;
							}
						});
						var i = 0;
						angular.forEach($scope.counters, function (item, key) {
							if (key !== 'students' && key !== 'referredIn')
								$scope.flotPieData[i++].data = item;
							else if (key === 'referredIn' ){
								$scope.flotPieDataReferralIn[0].data = item;
								$scope.flotPieDataReferralIn[1].data=  $scope.counters.students-item;
							}
						});
					});

				}
			});

			$scope.flotPieData = [
				{
					label: "In Oroom",
					data: 5,
					color: "#bababa"
				},
				{
					label: "Assign ISS",
					data: 5,
					color: "#79d2c0"
				},
				{
					label: "Walked Out's",
					data: 5,
					color: "#1ab394"
				},
				{
					label: "No Show",
					data: 5,
					color: "#1ab394"
				},
				{
					label: "Other",
					data: 5,
					color: "#1ab394"
				}
			];
			$scope.flotPieDataReferralIn = [
				{
					label: "YES",
					data: 5,
					color: "#bababa"
				},
				{
					label: "NO",
					data: 5,
					color: "#79d2c0"
				}
			];

			/**
			 * Pie Chart Options
			 */
			$scope.flotPieOptions = {
				series: {
					pie: {
						show: true
					}
				},
				grid: {
					hoverable: true
				},
				tooltip: true,
				tooltipOpts: {
					content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
					shifts: {
						x: 20,
						y: 0
					},
					defaultTheme: true
				}
			};




		}]);
}(angular.module('Argus')));