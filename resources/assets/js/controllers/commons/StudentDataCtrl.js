/* global angular */

(function(app){
	"use strict";
	app
	.controller("studentInfoCtrl", ["$scope", "StudentsService",  function ($scope, students) {
		$scope.students;  // model for autocomplete
		$scope.toShow = []; //list of profiles to show on the view
		//student information from the database 
		
		$scope.students = students.query({admin:true, light:true});
		
		
		$scope.max = 4;
		$scope.profiles = ['', '', '', ''];
		$scope.selected = {};
		$scope.active = 0;
		$scope.onEnter = function () {
			// get more information of the selected student 
			students.get({id:$scope.selected.student.Id}, function(data){
				$scope.selected.student = data;
				$scope.toShow.push($scope.selected.student);
				$scope.active++; // increase number of active profiles
				$scope.selected.student = null; // clear search field
			});
			
			//$scope.profiles[$scope.active] = $item; //
			
			
			
		};
		$scope.remove = function ($index) {
			$scope.toShow.splice($index, 1);
			//$scope.profiles[$index] = '';
			$scope.active--;
		};
		
		
		
	}]);	
}(angular.module('Argus')));