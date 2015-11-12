/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/teacher/dashboard");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        /* welcome wizard */
        .state('welcome', {
            abstract: true,
            url: "/welcome",
            templateUrl: "views/common/contentWelcome.html",
            controller: "welcomeWizardController",
        })
        .state('welcome.wizard', {
            url: "/wizard",
            templateUrl: "views/otherItems/welcomeWizard.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css','css/plugins/dropzone/basic.css','css/plugins/dropzone/dropzone.css','js/plugins/dropzone/dropzone.js']
                        }
                    ]);
                }
            }

        })
        .state('welcome.wizard.step_one', {
            url: '/step_one',
            templateUrl: 'views/wizardWelcome/step_one.html',
            data: { pageTitle: 'Welcome' }
        })
        .state('welcome.wizard.step_two', {
            url: '/step_two',
            templateUrl: 'views/wizardWelcome/step_two.html',
            data: { pageTitle: 'File Upload' },
        })
        .state('welcome.wizard.step_three', {
            url: '/step_three',
            templateUrl: 'views/wizardWelcome/step_three.html',
            data: { pageTitle: 'Finish' }
        })

        /* Teacher  Stuff*/
        .state('teacher', {
           abstract: true,
           url: "/teacher",
           templateUrl: "views/common/contentArgus.html",
           controller: "DashTeacherCtrl",

        })
        .state('teacher.dashboard', {
            url: "/dashboard",
            templateUrl: "views/teacher/dashboard.html",
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/chartJs/Chart.min.js','js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        },{
                            insertBefore: '#loadBefore',
                            files: ['css/plugins/fullcalendar/fullcalendar.css','js/plugins/fullcalendar/fullcalendar.min.js','js/plugins/fullcalendar/gcal.js']
                        },
                        {
                            name: 'ui.calendar',
                            files: ['js/plugins/fullcalendar/calendar.js']
                        },
						{
							insertBefore: '#loadBefore',
							name: 'localytics.directives',
							files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
						}
                    ]);
                }
            }
        })
        .state('teacher.referral', {
            url: "/referral",
            templateUrl: "views/teacher/referral.html",
            data: { pageTitle: 'Referral' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                          {
                              insertBefore: '#loadBefore',
                              name: 'localytics.directives',
                              files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                          },
                          {
                              files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                          },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ])
                }
            }
        })
        .state('teacher.assignments', {
            url: "/assignments",
            templateUrl: "views/teacher/assignments.html",
            data: { pageTitle: 'Assignments' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: [ 'css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        }
                    ]);
                }
            },
           
        })
        .state('teacher.statistics', {
            url: "/statistics",
            templateUrl: "views/teacher/statistics.html",
            data: { pageTitle: 'Statistics' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        },
                        {
                           
                            files:['js/plugins/d3/d3.min.js']
                        }

                    ]);
                }
            }
            
        })
        .state('teacher.saturdaySchool', {
            url: "/saturdaySchool",
            templateUrl: "views/teacher/saturdaySchool.html",
            data: { pageTitle: 'Saturday School' },
        })
        .state('teacher.manageSaturdaySchool', {
            url: "/manageSaturdaySchool",
            templateUrl: "views/teacher/manageSaturdaySchool.html",
            data: { pageTitle: 'Manage Saturday' },
        })
        .state('teacher.gradebook', {
            url: "/gradebook",
            templateUrl: "views/teacher/gradebook.html",
            data: { pageTitle: 'Gradebook' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        }
                    ]);
                }
            }
        })
        
        /* Admin1 Stuff */
        .state('admin1', {
            abstract: true,
            url: "/admin1",
            templateUrl: "views/common/contentArgus.html",
            controller: "DashAdmin1Ctrl",
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
                        },  {
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
						}
                    ]);
                }
            }
        })
        .state('admin1.dashboard', {
             url: "/dashboard",
             templateUrl: 'views/admin1/dashboard.html',
             data: { pageTitle: 'Dashboard' },
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
		.state('admin1.referral',{
			url:"/adminReferral",
			templateUrl:'views/admin1/Referral.html',
			data: { pageTitle: 'Referral' },
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
        .state('admin1.AECList', {
             url: "/AECList",
             templateUrl: 'views/sharedItems/manageAEC.html',
             data: { pageTitle: 'AEC List' },
             resolve: {
                 loadPlugin: function ($ocLazyLoad) {
                     return $ocLazyLoad.load([
                         {
                             name: 'datePicker',
                             files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                         },
                         {
                            name:'BarcodeGenerator',
                             files:['css/plugins/barcode/barcode.css', 'js/plugins/barcode/barcode.js']
                         }
                     ]);
                 }
             }

         })
        .state('admin1.pending', {
             url: "/pending",
             templateUrl: 'views/sharedItems/manageAECabsence.html',
             data: { pageTitle: 'Pending' },
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
        .state('admin1.studentData', {
             url: "/studentData",
             templateUrl: 'views/sharedItems/studentInfo.html',
             data: { pageTitle: 'Student Data' },
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
        .state('admin1.createStudentPass', {
             url: "/createStudentPass",
             templateUrl: 'views/sharedItems/multiplePasses.html',
             data: { pageTitle: 'Create Pass' }
         })
        /* Admin2 Stuff */
        .state('admin2', {
            abstract: true,
            url: "/admin2",
            templateUrl: "views/common/contentArgus.html",
            controller: "DashAdmin2Ctrl",
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
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }, {
                            insertBefore: '#loadBefore',
                            files: ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js', 'js/plugins/fullcalendar/gcal.js']
                        },
                        {
                            name: 'ui.calendar',
                            files: ['js/plugins/fullcalendar/calendar.js']
                        }
                    ]);
                }
            }
        })
        .state('admin2.dashboard', {
            url: "/dashboard",
            templateUrl: 'views/admin2/dashboard.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
                        }
                    ]);
                }
            },
        })
        .state('admin2.ARCList', {
            url: "/ARCList",
            templateUrl: 'views/sharedItems/ManageARC.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        }
                    ])
                }
            },
        })
        .state('admin2.pending', {
            url: "/pending",
            templateUrl: 'views/sharedItems/ManageARCabsence.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        }
                    ])
                }
            },
        })
        .state('admin2.studentData', {
            url: "/studentData",
            templateUrl: 'views/sharedItems/studentInfo.html',
            data: { pageTitle: 'Dashboard' },
        })
        .state('admin2.createStudentPass', {
            url: "/createStudentPass",
            templateUrl: 'views/sharedItems/multiplePasses.html',
            data: { pageTitle: 'Dashboard' },
        })
        .state('admin2.assignARC', {
            url: "/AssignO-Room",
            templateUrl: 'views/sharedItems/referalARC.html',
            data: { pageTitle: "O-Room Referral" },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                          {
                              insertBefore: '#loadBefore',
                              name: 'localytics.directives',
                              files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                          },
                    ])
                }
            },
        })
        /* Admin3 Stuff */
        .state('admin3', {
            abstract: true,
            url: "/admin3",
            templateUrl: "views/common/contentArgus.html",
            controller: "DashAdmin3Ctrl",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'js/plugins/morris/raphael.js','js/plugins/morris/morris.js', 'js/plugins/morris/morris.directives.js', 'css/plugins/morris/morris.css', ]
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
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
                        }
                    ]);
                }
            }
        })
        .state('admin3.dashboard', {
            url: "/dashboard",
     
            templateUrl: 'views/admin3/dashboard.html',
           
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
                        }
                    ])
                }
            }

        })
        .state('admin3.dashboard.DFPercentages', {
            url: "/DFsPercentages",
            data: {pageTitle:'DFs Percentage'}
        })
        .state('admin3.studentData', {
             url: "/studentData",
             templateUrl: 'views/sharedItems/studentInfo.html',
             data: { pageTitle: 'Dashboard' },
             resolve: {
                 loadPlugin: function ($ocLazyLoad) {
                     return $ocLazyLoad.load([
                         {
                             name: 'datePicker',
                             files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                         }
                     ])
                 }
             }
         })
        .state('admin3.assignARC', {
             url: "/assignARC",
             templateUrl: 'views/sharedItems/referalARC.html',
             data: { pageTitle: 'Dashboard' },
             resolve: {
                 loadPlugin: function ($ocLazyLoad) {
                     return $ocLazyLoad.load([
                         {
                             name: 'datePicker',
                             files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                         }
                     ])
                 }
             },
         })
            /* Data Scrapping*/  
        .state('admin3.dataScrapping', {
             url: "/dataScrapping",
             templateUrl: 'views/admin3/pdfExtraction.html',
             data: { pageTitle: 'dataScrapping' },
             controller: "PdfExtractionController",
             resolve: {
                 loadPlugin: function ($ocLazyLoad) {
                     return $ocLazyLoad.load([
                         {
                             files: ['css/plugins/steps/jquery.steps.css', 'css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                         }
                     ]);
                 }
             }
         })
        .state('admin3.dataScrapping.step_one', {
            url: '/step_one',
            templateUrl: 'views/wizardDataScrapping/step_one.html',
            data: { pageTitle: 'Choose Your Report' }
        })
        .state('admin3.dataScrapping.step_two', {
            url: '/step_two',
            templateUrl: 'views/wizardDataScrapping/step_two.html',
            data: { pageTitle: 'File Upload' },
        })
        .state('admin3.dataScrapping.step_three', {
            url: '/step_three',
            templateUrl: 'views/wizardDataScrapping/step_three.html',
            data: { pageTitle: 'Finish' }
        })


        .state('admin3.APTesting', {
             url: "/APTesting",
             templateUrl: 'views/admin3/APTesting.html',
             data: { pageTitle: 'Dashboard' },
         })
        .state('admin3.A-G', {
             url: "/A-G",
             templateUrl: 'views/admin3/sampleA-GStuProfile.html',
             data: { pageTitle: 'Dashboard' },
             resolve: {
             loadPlugin: function ($ocLazyLoad) {
                 return $ocLazyLoad.load([
                   {
                       serie: true,
                       name: 'angular-chartist',
                       files: ['js/plugins/chartist/chartist.min.js', 'css/plugins/chartist/chartist.min.css', 'js/plugins/chartist/angular-chartist.min.js',"css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
                   },
                   {
                       files:['js/plugins/d3/d3.min.js']
                   }
                 ]);
             }
             },
        })
        /* Admin4 Stuff */
        .state('admin4', {
            abstract: true,
            url: "/admin4",
            templateUrl: "views/common/contentArgus.html",
            controller: "DashAdmin4Ctrl"
        })
        .state('admin4.dashboard', {
            url: "/dashboard",
            templateUrl: 'views/admin4/dashboard.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
                        },
                         {
                             files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                         },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        },  {
                            insertBefore: '#loadBefore',
                            files: ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js', 'js/plugins/fullcalendar/gcal.js']
                        },
                        {
                            name: 'ui.calendar',
                            files: ['js/plugins/fullcalendar/calendar.js']
                        }
                    ]);
                }
            },
        })
        .state('admin4.AECList', {
            url: "/AECList",
            templateUrl: 'views/sharedItems/manageAEC.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            name:'BarcodeGenerator',
                            files: ['css/plugins/barcode/barcode.css', 'js/plugins/barcode/barcode.js']
                        }
                    ])
                }
            },
        })
        .state('admin4.ARCList', {
            url: "/ARCList",
            templateUrl: 'views/sharedItems/manageARC.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        }
                    ])
                }
            },
        })
        .state('admin4.pending', {
            url: "/pending",
            templateUrl: 'views/sharedItems/manageAECabsence.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        }
                    ])
                }
            },
        })
        .state('admin4.studentData', {
            url: "/studentData",
            templateUrl: 'views/sharedItems/studentInfo.html',
            data: { pageTitle: 'Dashboard' },
        })
        .state('admin4.createStudentPasses', {
            url: "/createStudentPasses",
            templateUrl: 'views/sharedItems/multiplePasses.html',
            data: { pageTitle: 'Dashboard' },
        })
        .state('admin4.assignARC', {
            url: "/assignARC",
            templateUrl: 'views/sharedItems/referalARC.html',
            data: { pageTitle: 'Dashboard' },
        })
               
        
       
        
     

}
angular
    .module('inspinia')
    .config(config)
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });
