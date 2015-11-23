(function (app) {
	"use strict";
	app.controller('NavigationCtrl', function () {
			var path = "../Client/Views/dashItems/";
			var vm = this;
			/**
			 * Navigation bar places with their links and icons
			 */
			vm.tabs = [ 
				{
					id: 'Dashboard',
					text: ['Dashboard', 'System'],
					route: path + 'referal.html',
					link: "admin1.dashboard",
					icon: 'dashboard fa-2x'
				}, {
					id: 'Referral System',
					text: ['Referral', 'System'],
					route: path + 'referral.html',
					link: "admin1.referral",
					icon: 'eye fa-2x'
				},
				{
					id: 'AEC List',
					text: ['AEC', 'List'],
					route: path + 'manageAEC.html',
					link: "admin1.AECList",
					icon: 'list-alt fa-2x'
				}, {
					id: 'Absence List',
					text: ['Absence', 'List'],
					route: path + 'manageAECAbsence.html',
					link: "admin1.pending",
					icon: 'exclamation fa-2x'
				}, {
					id: 'Student Data',
					text: ['Student', 'Data'],
					route: path + 'studentInfo.html',
					link: "admin1.studentData",
					icon: 'user fa-2x'
				}
				//		, {
				//            id: 'Create Student Pass',
				//            text: ['Create', 'Pass'],
				//            route: path + "multiplePasses.html",
				//            link: "admin1.createStudentPass",
				//            icon: 'file fa-2x'
				//        }
			];
		});
}(angular.module('Argus')));