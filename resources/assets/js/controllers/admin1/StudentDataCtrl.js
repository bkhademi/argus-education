(function(app){
	"use strict";
	app
	.controller("studentInfoCtrl", ["$scope", "students",  function ($scope, students) {
		$scope.students;  // model for autocomplete
		$scope.toShow = []; //list of profiles to show on the view
		//student information from the database 
		students.getAllStudents(function(data){
			$scope.students = data;
		});
		
		$scope.studentInfo = { name: 'naomi', address: '1600ffdf' }
		;
		$scope.max = 4;
		$scope.profiles = ['', '', '', ''];
		$scope.selected = {};
		$scope.active = 0;
		$scope.onEnter = function () {
			// get more information of the selected student 
			students.getStudent({id:$scope.selected.student.Id}, function(data){
				$scope.selected.student = data;
				$scope.toShow.push($scope.selected.student)
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
		
		
		
	}])	
}(angular.module('Argus')));