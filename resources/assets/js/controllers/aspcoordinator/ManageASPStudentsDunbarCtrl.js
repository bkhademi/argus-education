/* global angular */

(function (app) {
	"use strict";
	app
		.controller("ManageASPStudentsDunbarCtrl", ["$scope", "$modal","notify","ASPService", "$timeout", '$rootScope',
			function ($scope,  $modal,  notify,  asp, $timeout, $rootScope) {
				$scope.selected = {student: null};
				$scope.refTable = [];// table model
				$scope.currentDate = new Date();

				$scope.refTable = asp.query();

			

				

				$scope.getStudents = function () {
					$scope.refTable = asp.query({Date: $scope.currentDate});
				};

				

			}]);

}(angular.module('Argus')));						