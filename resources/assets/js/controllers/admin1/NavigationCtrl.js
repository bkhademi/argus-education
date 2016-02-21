/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationAdmin1Ctrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin1.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'AEC Referral System',
				link: "admin1.referral",
				icon: 'eye fa-2x'
			},
			{
				id: 'AEC List',
				link: "admin1.AECList",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Follow-up List',
				link: "admin1.pending",
				icon: 'exclamation fa-2x'
			} 
//			{
//				id: 'Student Data',
//				link: "admin1.studentData",
//				icon: 'user fa-2x'
//			}
			, {
				id: 'ORoom Activity Log',
				link: "admin1.oroomActivityLogAdmin",
				icon: 'tasks fa-2x'
			}
//			, {
//				id: 'Live Activity Log',
//				link: "admin1.oroomActivitiLog.oroom",
//				icon: 'user fa-2x'
//			}
			,{
				id: 'ORoom Coordinator Referral',
				link: "admin1.CoordinatorReferralSystem",
				icon: 'pencil-square-o fa-2x'
			},{
				id: 'Attendance Rosters',
				link: "admin1.attendanceRosters.oroom",
				icon: 'list-alt fa-2x'
			},{
				id: 'Parent Meeting Followup List',
				link: "admin1.issFollowup",
				icon: 'list-alt fa-2x'
			},
			 {
				id: 'Reports',
				link: 'admin1.reports',
				icon: 'area-chart fa-2x'
			}
		];
	});
}(angular.module('Argus')));
