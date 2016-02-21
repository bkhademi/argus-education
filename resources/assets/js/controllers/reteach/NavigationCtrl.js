(function (app) {
	"use strict";
	app.controller('NavigationReteachCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "reteach.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'Referral System',
				link: "reteach.referral",
				icon: 'eye fa-2x'
			},
			{
				id: 'Reteach List',
				link: "reteach.reteachlist",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Reteach Follow-up List',
				link: "reteach.pending",
				icon: 'exclamation fa-2x'
			}, {
				id: 'Student Data',
				link: "reteach.studentData",
				icon: 'user fa-2x'
			}
		];
	});
}(angular.module('Argus')));

