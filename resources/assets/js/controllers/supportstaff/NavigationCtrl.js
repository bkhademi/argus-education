(function (app) {
	"use strict";
	app.controller('NavigationSupportStaffCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
//			{
//				id: 'Dashboard',
//				text: ['Dashboard', 'System'],
//				route: path + 'referal.html',
//				link: "supportstaff.dashboard",
//				icon: 'dashboard fa-2x'
//			}, 
{
				id: 'ORoom Activity Log',
				text: ['Oroom', 'Activity', 'log'],
				link: "supportstaff.oroomActivitiLog",
				icon: 'user fa-2x'
			}
		];
	});
}(angular.module('Argus')));

