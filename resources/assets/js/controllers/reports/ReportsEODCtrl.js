/* global angular */

(function (app) {
	app.controller('ReportsEODCtrl',
		['$scope', 'notify', '$modal', '$http', 'FormatTimeService', '$rootScope',
			function ($scope, notify, $modal, $http, time, $rootScope) {
				$scope.eodReports = [
					{name: 'AEC', value: 1, url: 'report-eod-aec'},
					{name: 'O-Room', value: 2, url: 'report-eod-oroom'},
//					{name: 'Reteach', value: 3, url:'report-eod-reteach'},
					{name: 'ISS', value: 4, url: 'report-eod-iss'},
					{name: 'OSS PMP', value: 5, url: 'report-edo-oss'},
					{name: 'Lunch', value: 6, url: 'report-eod-lunchd'}
				];
				$scope.eod = {};
				$scope.eod.selected = $scope.eodReports[1];
				$scope.eodCounters = {
					expected: 0,
					present: 0,
					noShows: 0,
					sentOuts: 0,
					walkedOuts: 0,
					schoolAbsent: 0,
					leftSchool: 0,
					other: 0,
					reschedules:0,
					clears:0,
					absents:0
				};
				$scope.percentages = {
					todays: 0,
					averageThusFar: 0,
					difference: 0
				};
				$scope.currentDate = new Date();
				$scope.$watch('date.date.$viewValue', function (newValue, oldValue) {
					if (newValue) {
						date = time.formatDate(new Date(newValue));
						$scope.reportChanged();
					}
				});
				$scope.reportChanged = function () {
					$http.get('api/' + $scope.eod.selected.url + '?date=' + date).then(processResponse, function () {
						notify('error');
					});
				};

				function processResponse(response) {
					var list = response.data;
					$scope.orooms = list;
					//$scope.eodCounters.expected = list.length;
					angular.forEach(list, function (item) {
						if (item.student.SchoolId !== $rootScope.currentUser.SchoolId)
							console.log(item);
						switch ($scope.eod.selected.value) {
							case 1:
								checkAEC(item.ActionType);
								break;
							case 2:
								checkOroom(item.ActionType);
								break;
							case 4:
								checkISS(item.ActionType);
								break;
							case 5:
								checkOSS(item.ActionType);
								break;
							case 6:
								checkLunchD(item.ActionType);
								break;
						}



					});
					var i = 0;
//					angular.forEach($scope.eodCounters, function (item, key) {
//						if (item !== list.length)
//							$scope.flotPieData[i++].data = item;
//					});
					console.log($scope.eodCounters);
				}

				function checkOroom(actionTypeId) {
					switch (actionTypeId) {
						case 1:
						case 7:
						case 44:
						case 59:
						case 73:
						$scope.eodCounters.expected++;
							break;
						case 24:
							break;
						$scope.eodCounters.present++;
							break;
						case 25:
							$scope.eodCounters.noShows++;
							break;
						case 28:
							$scope.eodCounters.sentOuts++;
							break;
						case 29:
							$scope.eodCounters.walkedOuts++;
							break;
						case 27:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 26:
							$scope.eodCounters.leftSchool++;
							break;
						case 30:
							$scope.eodCounters.other++;
							break;
					}
				}
				function checkAEC(actionTypeId) {
					switch (actionTypeId) {
						
						case 48:
						$scope.eodCounters.expected++;
							break;
						case 49:
							$scope.eodCounters.present++;
							break;
						case 52:
							$scope.eodCounters.noShows++;
							break;
						case 55:
							$scope.eodCounters.sentOuts++;
							break;
						case 56:
							$scope.eodCounters.walkedOuts++;
							break;
						case 54:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 53:
							$scope.eodCounters.leftSchool++;
							break;
						case 57:
							$scope.eodCounters.other++;
							break;
						case 50:
							$scope.eodCounters.reschedules++;
							break;
						case 51:
							$scope.eodCounters.clears++;
							break;
						case 58:
							$scope.eodCounters.absents++;
					}
				}
				function checkISS(actionTypeId) {
					switch (actionTypeId) {
						case 20: //ORMD->ISS
						case 21: // Ref ISS
						case 45: //  ORM->ISS
							$scope.eodCounters.expected++;
							break;
						case 38:
							$scope.eodCounters.present++;
							break;
						case 39:
							$scope.eodCounters.noShows++;
							break;
						case 42:
							$scope.eodCounters.sentOuts++;
							break;
						case 43:
							$scope.eodCounters.walkedOuts++;
							break;
						case 41:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 40:
							$scope.eodCounters.leftSchool++;
							break;
						case 47:
							$scope.eodCounters.other++;
							break;
					}
				}
				function checkOSS(actionTypeId) {
					switch (actionTypeId) {
						case 24:
							$scope.eodCounters.present++;
							break;
						case 25:
							$scope.eodCounters.noShows++;
							break;
						case 28:
							$scope.eodCounters.sentOuts++;
							break;
						case 29:
							$scope.eodCounters.walkedOuts++;
							break;
						case 27:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 26:
							$scope.eodCounters.leftSchool++;
							break;
						case 30:
							$scope.eodCounters.other++;
							break;
					}
				}
				function checkLunchD(actionTypeId) {
					switch (actionTypeId) {
						case 31:
							$scope.eodCounters.present++;
							break;
						case 32:
							$scope.eodCounters.noShows++;
							break;
						case 35:
							$scope.eodCounters.sentOuts++;
							break;
						case 36:
							$scope.eodCounters.walkedOuts++;
							break;
						case 34:
							$scope.eodCounters.schoolAbsent++;
							break;
						case 33:
							$scope.eodCounters.leftSchool++;
							break;
						case 37:
							$scope.eodCounters.other++;
							break;
					}
				}

				$scope.flotPieData = [
//				{
//					label: "Expected",
//					data: 5,
//					color: "#d3d3d3"
//				},
					{
						label: "Present",
						data: 5,
						color: "#bababa"
					},
					{
						label: "No Show's",
						data: 5,
						color: "#79d2c0"
					},
					{
						label: "Sent Out's",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "Walked Out's",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "School Absent",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "Left School",
						data: 5,
						color: "#1ab394"
					},
					{
						label: "Other",
						data: 5,
						color: "#1ab394"
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
				angular.forEach($scope.eod.issStudents, function (item) {
					if (item.Attendance === 'Absent')
						item.class = 'bg-gray';
					else if (item.Attendance === 'Sent-Out')
						item.class = 'bg-danger';
					else
						item.class = 'bg-green';
				});
			}]);
}(angular.module('Argus')));

