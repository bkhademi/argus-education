(function (app) {
	"use strict";
	app.controller('NavigationStudentCtrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin1.dashboard",
				icon: 'dashboard fa-2x'
			},
			{
				id: 'Student Data',
				link: "admin1.studentData",
				icon: 'user fa-2x'
			}

		];
	});
}(angular.module('Argus')));
