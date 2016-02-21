/* global angular */

(function(app){
	"use strict";  
	app.controller('DashAdmin2Ctrl', ['$scope', '$modal', 'referrals', 'notify',
	function($scope, $modal, referrals, notify){
		
		 
		$scope.studentsToday =0;
		var date = Date();
		$scope.counters = {};
		var dateStr = date.substring(4,7) + ' '+date.substring(8,10) + ' '+date.substring(11,15);
		referrals.query({id:dateStr},function(data){
			$scope.counters.aec = data.length;
		});
		referrals.query({id:dateStr, absence:true},function(data){
			$scope.counters.aecAbsent = data.length;
		});
		
		$scope.downloadEODReport =function(){
			//notify({message:'t'});
			return;
		};
		
		/**
		 * Opens modal for average attendance
		 */
		$scope.openAverageAttendance = function () {
			$scope.studentsToday  = 0;
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
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
				resolve: {
					graphOptions : function () { return $scope.lineOptions ;},
					graphData: function () { return $scope.lineData; }
				}
			});// End assignmentsModal
		};
		/**
		 * Opens Modal for Rating's Modal
		 */
		$scope.openRating = function () {
			var ratingsModal = $modal.open({
				templateUrl: 'ratingsModal.html',
				size: 'lg',
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
				},
				resolve: {
					graphOptions : function () { return $scope.lineOptions; },
					graphData: function () { return $scope.lineData; }
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
		/**
		 * Data for Doughnut chart
		 */
		$scope.doughnutData = [
			{
				value: 300,
				color: "#2f4050",
				highlight: "#1ab394",
				label: "App"
			},
			{
				value: 50,
				color: "#2f4060",
				highlight: "#1ab394",
				label: "Software"
			},
			{
				value: 100,
				color: "#2f4070",
				highlight: "#1ab394",
				label: "Laptop"
			}
		];
		
		/**
		 * Options for Doughnut chart
		 */
		$scope.doughnutOptions = {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 45, // This is 0 for Pie charts
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false
		};
		

		
	}]);
}(angular.module('Argus')));