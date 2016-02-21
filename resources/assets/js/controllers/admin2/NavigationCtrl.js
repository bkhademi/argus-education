/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationAdmin2Ctrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin2.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'Referral System',
				link: "admin2.referral",
				icon: 'eye fa-2x'
			},
			{
				id: 'AEC List',
				link: "admin2.AECList",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Follow-up List',
				link: "admin2.pending",
				icon: 'exclamation fa-2x'
			}, {
				id: 'Student Data',
				link: "admin2.studentData",
				icon: 'user fa-2x'
			}
		];
	});
}(angular.module('Argus')));

