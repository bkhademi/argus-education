/* global angular */

(function (app) {
    "use strict";
//	O-Room Coordinator
    app.controller('NavigationAdmin3Ctrl', function () {
        var path = "../Client/Views/dashItems/";
        var vm = this;
        /**
         * Navigation bar places with their links and icons
         */
        vm.tabs = [
            {
                id: 'Dashboard',
                link: "admin3.dashboard",
                icon: 'dashboard fa-2x'
            }, {
                id: 'Activity Log',
                link: 'admin3.oroomActivityLogAdmin',
                icon: 'tasks fa-2x'
            }, {
                id: 'Create Referral',
                link: "admin3.CoordinatorReferralSystem",
                icon: 'pencil-square-o fa-2x'
            }, {
                id: 'Attendance Rosters',
                link: "admin3.attendanceRosters.oroom",
                icon: 'list-alt fa-2x'
            }, {
                id: 'Reports',
                link: 'admin3.reports.eod',
                icon: 'area-chart fa-2x'
            }

        ];
    });
}(angular.module('Argus')));

