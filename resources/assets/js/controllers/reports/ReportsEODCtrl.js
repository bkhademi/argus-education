/* global angular */

(function (app) {
	app.controller('ReportsEODCtrl',
		['$scope', 'notify', '$modal', '$http', 'FormatTimeService', '$rootScope', 'OroomService',
			'LunchService', 'ISSService', 'OSSService', 'ReteachListService', 'AECListService', 'ReportsService','PrintHtmlService',
			function ($scope, notify, $modal, $http, time, $rootScope, orooms, lunchs, isss, osss, reteach, aec, reports,print) {
				$scope.reportTypes = [
					{name: 'EOD', value: 1},
					{name: 'ORoom Conversion', value: 2}
				];
				$scope.selected = {reportType: $scope.reportTypes[0]};

				$scope.eodTypes = [
					{name: 'Single Day', value: 1},
					{name: 'Multiple - Date Range', value: 2}
				];

				$scope.eodReports = [
					{name: 'AEC', value: 1, url: 'report-eod-aec'},
					{name: 'O-Room', value: 2, url: 'report-eod-oroom'},
					{name: 'Reteach', value: 3, url: 'report-eod-reteach'},
					{name: 'ISS', value: 4, url: 'report-eod-iss'},
					{name: 'OSS', value: 5, url: 'report-eod-oss'},
					{name: 'Lunch', value: 6, url: 'report-eod-lunchd'}
				];
				$scope.eod = {selected: $scope.eodReports[1], type: $scope.eodTypes[0]};

				$scope.percentages = {
					todays: 0,
					averageThusFar: 0,
					difference: 0
				};

				$scope.date = new Date();

				$scope.eodDateCounters = [];

				var colorShades = ['#6FA45A', '#FFB757', '#CA423F', '#57325E', '#3C6C9D'];

				function applyColorsToData(data) {
					angular.forEach(data, function (item, $index) {
						item.color = colorShades[$index];
					});
				}


				function clearCounters() {
					$scope.eodCounters = {
						expected: 0,
						assigned: 0,
						present: 0,
						noShows: 0,
						sentOuts: 0,
						walkedOuts: 0,
						schoolAbsent: 0,
						leftSchool: 0,
						other: 0,
						reschedules: 0,
						clears: 0,
						absents: 0,
						overlaps: 0,
						pendingFollowups:0
					};
				}

				// counters constructor to create counter objects
				function Counters() {
					this.expected = 0;
					this.assigned = 0;
					this.present = 0;
					this.noShows = 0;
					this.sentOuts = 0;
					this.walkedOuts = 0;
					this.schoolAbsent = 0;
					this.leftSchool = 0;
					this.other = 0;
					this.reschedules = 0;
					this.clears = 0;
					this.absents = 0;
					this.overlaps = 0;
					this.pendingFollowups = 0;
				}

				$scope.$watch('start.date.$viewValue', function (newValue, oldValue) {
					if (newValue) {
						$scope.currentDate = newValue;//time.formatDate(new Date(newValue));
						$scope.reportChanged();
					}
				});

				$scope.$watch('end.date.$viewValue', function (newValue, oldValue) {
					if (newValue) {
						$scope.endDate = newValue; //time.formatDate(new Date(newValue));
						$scope.reportChanged();
					}
				});

				$scope.reportChanged = function () {
					var urlEncoded = $scope.eod.selected.url + '?Date=' + $scope.currentDate;
					if ($scope.eod.type.value == 2)
						urlEncoded += '&DateRange=true&DateEnd=' + $scope.endDate;
					$http.get('api/' + urlEncoded).then(processResponse, function () {
						notify('error');
					});
				};

				$scope.getPdfReport = function () {
					reports.EODAll(function (data) {
						console.log(data);
						var fileURL = URL.createObjectURL(data.response);
						window.open(fileURL)
					});
				};

				function processResponse(response) {
					if ($scope.eod.type.value == 2)
						processResponseDateRange(response);
					else
						$scope.eodCounters = processResponseSingle(response);
				}

				function processResponseSingle(response) {
					$scope.orooms = response.data;
					var counters = new Counters();
					counters.assigned = $scope.orooms.length;


					switch ($scope.eod.selected.value) {
						case 1: // aec
							aec.markOverlapsReport($scope.orooms);
							aec.markActions($scope.orooms);
							var pendingFollowups = 0;
							angular.forEach($scope.orooms, function (stu) {
								if (stu.referred[0].RefferalStatus == 4) {
									pendingFollowups++;
									stu.referred[0].activity.Name = 'Pending Followup';

								}
								counters.pendingFollowups = pendingFollowups;
							});

							break;
						case 2:
							orooms.markOverlapsReport($scope.orooms);
							orooms.markActions($scope.orooms);
							angular.forEach($scope.orooms, function (stu) {
								switch (stu.referred[0].ReferralTypeId) {
									case 3: // orm + 1
										$scope.oroomPieData[3].data++;
										break;
									case 1: // first time teacher
										$scope.oroomPieData[4].data++;
										break;
									case 16: // aec->orm
										$scope.oroomPieData[1].data++;
										break;
									case 2:// LD->orm
										$scope.oroomPieData[0].data++;
										break;
									case 19:// reteach->orm
										$scope.oroomPieData[2].data++;
										break;
									default:
										console.log('not of ORM type');

								};
							});
							applyColorsToData($scope.oroomPieData);
							break;
						case 3:
							reteach.markOverlapsReport($scope.orooms);
							reteach.markActions($scope.orooms);
							var pendingFollowups = 0;
							angular.forEach($scope.orooms, function (stu) {
								if (stu.referred[0].RefferalStatus == 8) {
									pendingFollowups++;
									stu.referred[0].activity.Name = 'Pending Followup';

								}
								counters.pendingFollowups = pendingFollowups;
							});
							break;
						case 4:
							isss.markOverlapsReport($scope.orooms);
							isss.markActions($scope.orooms);
							break;
						case 5:
							osss.markOverlapsReport($scope.orooms);
							osss.markActions($scope.orooms);
							break;
						case 6:
							lunchs.markOverlapsReport($scope.orooms);
							lunchs.markActions($scope.orooms);
							break;
					}

					createConsequencesData($scope.orooms);

					angular.forEach($scope.orooms, function (item) {
						//if (item.student.SchoolId !== $rootScope.currentUser.SchoolId)
						//	console.log(item);
						switch ($scope.eod.selected.value) {
							case 1:
								checkAEC(item.referred[0].ActivityTypeId,counters);
								break;
							case 2:
								checkOroom(item.referred[0].ActivityTypeId,counters);
								if ((item.overlap.hasiss && !item.overlap.isscleared)|| item.overlap.hasoss)
									counters.overlaps++;
								break;
							case 3:
								checkReteach(item.referred[0].ActivityTypeId,counters);
								break;
							case 4:
								checkISS(item.referred[0].ActivityTypeId,counters);
								break;
							case 5:
								checkOSS(item.referred[0].ActivityTypeId,counters);
								break;
							case 6:
								checkLunchD(item.referred[0].ActivityTypeId,counters);
								break;
						}
					});

					var cnt = counters;
					$scope.flotPieData[0].data = cnt.present;
					$scope.flotPieData[1].data = cnt.noShows + cnt.sentOuts + cnt.walkedOuts;
					$scope.flotPieData[2].data = cnt.schoolAbsent + cnt.leftSchool + cnt.other
						+ cnt.reschedules + cnt.clears + cnt.absents;
					$scope.flotPieData[3].data = cnt.pendingFollowups;

					counters.expected = cnt.assigned - (cnt.schoolAbsent + cnt.leftSchool + cnt.other + (cnt.pendingFollowups || 0) + cnt.clears + cnt.reschedules + cnt.overlaps);
					console.log(counters);
					return counters;

				};

				function processResponseDateRange(response) {
					$scope.eodDateCounters = [];
					var array = response.data;
					angular.forEach(array , function (singleDateData) {
						var date = singleDateData.Date;
						var counters = processResponseSingle({data:singleDateData.students});
						$scope.eodDateCounters.push(angular.extend({Date:date},counters));
					});

					totalCounters = new Counters();
					angular.forEach($scope.eodDateCounters, function(singleCounter){

						for(key in singleCounter){
							totalCounters[key] += singleCounter[key];
						}

					});
					totalCounters.Date = 'Totals';
					$scope.eodDateCounters.totals = totalCounters;
					var cnt = totalCounters;
					$scope.flotPieDataRange[0].data = cnt.present;
					$scope.flotPieDataRange[1].data = cnt.noShows + cnt.sentOuts + cnt.walkedOuts;
					$scope.flotPieDataRange[2].data = cnt.schoolAbsent + cnt.leftSchool + cnt.other
						+ cnt.reschedules + cnt.clears + cnt.absents;
					$scope.flotPieDataRange[3].data = cnt.pendingFollowups;


				};

				function checkAEC(actionTypeId, counters) {
					switch (actionTypeId) {
						case 49:
							counters.present++;
							break;
						case 52:
							counters.noShows++;
							break;
						case 55:
							counters.sentOuts++;
							break;
						case 56:
							counters.walkedOuts++;
							break;
						case 54:
							counters.schoolAbsent++;
							break;
						case 53:
							counters.leftSchool++;
							break;
						case 57:
							counters.other++;
							break;
						case 50:
							counters.reschedules++;
							break;
						case 51:
							counters.clears++;
							break;
						case 58:
							counters.absents++;
					}
				}

				function checkOroom(actionTypeId, counters) {
					switch (actionTypeId) {
						case 24:
							counters.present++;
							break;
						case 25:
							counters.noShows++;
							break;
						case 28:
							counters.sentOuts++;
							break;
						case 29:
							counters.walkedOuts++;
							break;
						case 27:
							counters.schoolAbsent++;
							break;
						case 26:
							counters.leftSchool++;
							break;
						case 30:
							counters.other++;
							break;
					}
				}

				function checkReteach(actionTypeId, counters) {
					switch (actionTypeId) {
						case 64:
							counters.present++;
							break;
						case 67:
							counters.noShows++;
							break;
						case 75:
							counters.sentOuts++;
							break;
						case 70:
							counters.walkedOuts++;
							break;
						case 69:
							counters.schoolAbsent++;
							break;
						case 68:
							counters.leftSchool++;
							break;
						case 71:
							counters.other++;
							break;
						case 65:
							counters.reschedules++;
							break;
						case 66:
							counters.clears++;
							break;
						case 72:
							counters.absents++;
							break;
					}
				}

				function checkISS(actionTypeId, counters) {
					switch (actionTypeId) {
						case 38:
							counters.present++;
							break;
						case 39:
							counters.noShows++;
							break;
						case 42:
							counters.sentOuts++;
							break;
						case 43:
							counters.walkedOuts++;
							break;
						case 41:
							counters.schoolAbsent++;
							break;
						case 40:
							counters.leftSchool++;
							break;
						case 47:
						case 91:
							counters.other++;
							break;
					}
				}

				function checkOSS(actionTypeId, counters) {
					switch (actionTypeId) {
						case 25:
							counters.noShows++;
							break;
						case 28:
							counters.sentOuts++;
							break;
						case 29:
							counters.walkedOuts++;
							break;
						case 27:
							counters.schoolAbsent++;
							break;
						case 26:
							counters.leftSchool++;
							break;
						case 30:
							counters.other++;
							break;
					}
				}

				function checkLunchD(actionTypeId, counters) {
					switch (actionTypeId) {
						case 31:
							counters.present++;
							break;
						case 32:
							counters.noShows++;
							break;
						case 35:
							counters.sentOuts++;
							break;
						case 36:
							counters.walkedOuts++;
							break;
						case 34:
							counters.schoolAbsent++;
							break;
						case 33:
							counters.leftSchool++;
							break;
						case 37:
							counters.other++;
							break;
					}
				}

				function createConsequencesData(list) {
					// use a hash table to count how many different consequences exists
					var consequenceHash = [];
					angular.forEach(list, function (student) {
						if (!student.referred[0].consequence) return;
						var consequenceType = student.referred[0].consequence.referral_type.Name;

						if (consequenceHash[consequenceType])
							consequenceHash[consequenceType]++;
						else
							consequenceHash[consequenceType] = 1
					});
					// use hash to built data for the pie chart
					var flotData = [];


					var i = 0;
					for (key in consequenceHash) {
						var dataObj = {
							label: key,
							data: consequenceHash[key],
							color: colorShades[i++]

						};
						flotData.push(dataObj);
					}
					$scope.flotPieDataConsequences = flotData;
				}

				$scope.flotPieData = [
					{
						label: "Present",
						data: 0,
						color: "#6FA45A"
					}, {
						label: "No Show, Sent-Out, Walked-Out",
						data: 0,
						color: "#CA423F"
					}, {
						label: "School Absent, Cleared,  Overlap, Other",
						data: 0,
						color: "#C2C3C5"
					},{
						label: 'Pending Followup',
						data: 0,
						color: '#FFB757'}
				];

				$scope.flotPieDataRange = [
					{
						label: "Present",
						data: 0,
						color: "#6FA45A"
					}, {
						label: "No Show, Sent-Out, Walked-Out",
						data: 0,
						color: "#CA423F"
					}, {
						label: "School Absent, Cleared,  Overlap, Other",
						data: 0,
						color: "#C2C3C5"
					},{
						label: 'Pending Followup',
						data: 0,
						color: '#FFB757'}
				];

				$scope.flotPieDataConsequences = [];

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

				$scope.oroomPieData = [
					{
						label: "LD → ORM",
						data: 0,
						color: "#C3ECC8"
					}, {
						label: "AEC → ORM ",
						data: 0,
						color: "#999"
					}, {
						label: "Reteach → ORM ",
						data: 0,
						color: "#f2dede"
					}, {
						label: "ORM → ORM + 1",
						data: 0,
						color: "#C3ECC8"
					}, {
						label: "First Time - Teacher ",
						data: 0,
						color: "#999"
					},
				];

				$scope.printDiv = function(){
					print.printDiv("totals",'list');
				};

			}]);
}(angular.module('Argus')));

