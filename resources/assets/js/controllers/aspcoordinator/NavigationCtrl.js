/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationASPCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
//			{
//				id: 'Dashboard',
//				link: "asp.dashboard",
//				icon: 'dashboard fa-2x'
//			}, 
{
				id: 'Attendance',
				link: "asp.manage",
				icon: 'eye fa-2x'
			},
			{
				id: 'Manage Students',
				link: "asp.manageStudents",
				icon: 'list-alt fa-2x'
			}
//			, {
//				id: 'Follow-up List',
//				link: "asp.pending",
//				icon: 'exclamation fa-2x'
//			}, {
//				id: 'Student Data',
//				link: "asp.studentData",
//				icon: 'user fa-2x'
//			}
		];
	});
}(angular.module('Argus')));