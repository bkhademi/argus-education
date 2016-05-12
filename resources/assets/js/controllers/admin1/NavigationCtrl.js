/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationAdmin1Ctrl', ['ISSFollowupService', 'ISSService', 'LunchService', 'OroomService', 'AECListService', 'AECAbsenceListService','ReteachListService', 'ReteachAbsenceListService','OSSService',
		function (issfs, isss, lunchs, orooms, aecs, aecfs ,reteachs, reteachfs, osss) {
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
				, {
					id: 'ORoom Coordinator Referral',
					link: "admin1.CoordinatorReferralSystem",
					icon: 'pencil-square-o fa-2x'
				}, {
					id: 'Attendance Rosters',
					link: "admin1.attendanceRosters.oroom",
					icon: 'list-alt fa-2x'
				}, {
					id: 'ISS Followup List',
					link: "admin1.issFollowup",
					icon: 'list-alt fa-2x'
				}, {
					id: 'Parent Meeting List',
					link: "admin1.parentMeetingList",
					icon: 'list-alt fa-2x'
				}, {
					id: 'Reports',
					link: 'admin1.reports.eod',
					icon: 'area-chart fa-2x'
				},{
					id: 'Schedule',
					link: 'admin1.schedule',
					icon: 'area-chart fa-2x'
				}
			];

			vm.count = {};
			issfs.get({roster: true, count: true}, function (data) { vm.count.issFollowup = parseInt(data[0]); });
			isss.get({roster: true, count: true}, function (data) { vm.count.iss = parseInt(data.count); });

			lunchs.get({count: true, roster: true}, function (data) { vm.count.lunch = data.lunchStudentsCount; });
			orooms.get({count: true, roster: true}, function (data) { vm.count.oroom = data.OroomList; });

			aecs.get({roster: true, count: true}, function (data) { vm.count.aec = data.aecCount; });
			aecfs.get({roster: true, count: true}, function (data) { vm.count.aecFollowup = data.aecAbsentCount; });

			reteachs.get({roster: true, count: true}, function (data) { vm.count.reteach = data.reteachCount; });
			reteachfs.get({roster: true, count: true}, function (data) { vm.count.reteachFollowup = data.reteachAbsentCount; });
			osss.get({count:true, param:'ossList' }, function(data){vm.count.oss = data.count;});
		}]);
}(angular.module('Argus')));
