/* global angular */

(function (app) {
    "use strict";
    app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {
//			var user = JSON.parse(localStorage.getItem('user'));
//			var schoolId = user.SchoolId;
            $stateProvider
                .state('asp', {
                    abstract: true,
                    url: "/asp",
                    templateUrl: "views/common/contentArgus.html",
                    controller: "NavigationASPCtrl",
                    controllerAs: 'navigation',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                                },
                                {
                                    name: 'angles',
                                    files: ['js/plugins/chartJs/angles.js']
                                },
                                {
                                    files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                                },
                                {
                                    name: 'ui.footable',
                                    files: ['js/plugins/footable/angular-footable.js']
                                }, {
                                    insertBefore: '#loadBefore',
                                    files: ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js', 'js/plugins/fullcalendar/gcal.js']
                                },
                                {
                                    name: 'ui.calendar',
                                    files: ['js/plugins/fullcalendar/calendar.js']
                                },
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                                },
                                {
                                    name: 'cgNotify',
                                    files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
                                },
                                {
                                    name: 'ui.slimscroll',
                                    files: ['js/plugins/slimscroll/angular.slimscroll.js']
                                }

                            ]);
                        }
                    }
                })
                .state('asp.dashboard', {
                    url: "/dashboard",
                    templateUrl: 'views/aspcoordinator/dashboard.html',
                    data: {pageTitle: 'Dashboard'},
                    controller: "DashAdmin2Ctrl",
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
                                },
                                {
                                    name: 'datePicker',
                                    files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                                }
                            ]);
                        }
                    }
                })
                .state('asp.manage', {
                    url: "/manage",
                    templateUrl: 'views/aspcoordinator/manage.html',
                    data: {pageTitle: 'Attendance'},
                    controller: 'ManageCtrl',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'datePicker',
                                    files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                                }
                            ]);
                        }
                    }

                })
                .state('asp.manageStudents', {
                    url: "/ManageStudents",
                    templateUrl: /*schoolId === 2? 'views/aspcoordinator/manageStudentsDunbar.html':*/'views/aspcoordinator/manageStudentsEstacado.html',
                    data: {pageTitle: 'ASP Students'},
                    controller: /*schoolId === 2? 'ManageASPStudentsDunbarCtrl':*/'ManageASPStudentsEstacadoCtrl',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([]);
                        }
                    }

                })
                /*				.state('asp.pending', {
                 url: "/pending",
                 templateUrl: 'views/sharedItems/manageAECabsence.html',
                 data: {pageTitle: 'Pending'},
                 controller: 'manageAECAbsenceController',
                 resolve: {
                 loadPlugin: function ($ocLazyLoad) {
                 return $ocLazyLoad.load([
                 {
                 name: 'datePicker',
                 files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                 }
                 ]);
                 }
                 }
                 })*/


            ;

        }]);


}(angular.module('Argus')));