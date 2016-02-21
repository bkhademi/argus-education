(function (app) {
	"use strict";
	app.controller('NavigationSysAdminCtrl', function () {
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "sysadmin.dashboard",
				icon: 'dashboard fa-2x'
			}, {
				id: 'Referrals',
				link: "sysadmin.referrals",
				icon: 'eye fa-2x'
			}, {
				id: 'User Activities',
				link: "sysadmin.activities",
				icon: 'eye fa-2x'
			}, {
				id: 'Users',
				link: "sysadmin.users",
				icon: 'eye fa-2x'
			},{
				id: 'AEC Referral System',
				link: "sysadmin.referral",
				icon: 'eye fa-2x'
			},{
				id: 'AEC List',
				link: "sysadmin.AECList",
				icon: 'list-alt fa-2x'
			}, {
				id: 'Follow-up List',
				link: "sysadmin.pending",
				icon: 'exclamation fa-2x'
			}
//			{
//				id: 'Student Data',
//				link: "sysadmin.studentData",
//				icon: 'user fa-2x'
//			}
			, {
				id: 'ORoom Activity Log',
				link: "sysadmin.oroomActivityLogAdmin",
				icon: 'tasks fa-2x'
			}, {
				id: 'Live Activity Log',
				link: "sysadmin.oroomActivitiLog.oroom",
				icon: 'user fa-2x'
			}, {
				id: 'ORoom Coordinator Referral',
				link: "sysadmin.CoordinatorReferralSystem",
				icon: 'pencil-square-o fa-2x'
			},{
				id: 'Attendance Rosters',
				link: "sysadmin.attendanceRosters.oroom",
				icon: 'list-alt fa-2x'
			},{
				id: 'Reports',
				link: 'sysadmin.reports',
				icon: 'area-chart fa-2x'
			}
		];
	});
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsController', ['$scope', function ($scope) {

		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsEODController', ['$scope', "$timeout", function ($scope, $timeout) {

		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsProgressionController', ['$scope', '$timeout', function ($scope, $timeout) {

		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsAtRiskController', ['$scope', function ($scope) {

		}]);
}(angular.module('Argus')));