/* global angular */

(function (app) {
    app
        .controller("ProfileCtrl",
            ["$scope", "StudentsService", 'ProfessorClassesService','ClassStudentsService', 'notify', 'ProfileCounters',
                'OroomService', 'AECListService', 'ReteachListService', 'ISSService', 'LunchService','UtilService',
                function ($scope, students, professorclasses, ClassStuSer, notify, ProfileCounters, oser, aecser,
                          retser, issser, ldser, utils) {
                    $scope.schedule = []; // holds  student's schedule
                    $scope.activities = []; // holds student'activities
                    $scope.currentDate = new Date();
                    $scope.classes = professorclasses.query();

                    // TODO : change to adapt to new table. used to be useractions, now referrals
                    $scope.downloadActivity = function () {
                        // create csv content
                        var text = '';
                        var heading = 'Date,ActionBy,Activity,Comment \n';
                        text += heading;
                        angular.forEach($scope.activities, function (act) {
                            text += '"' + act.ActionDate.split(' ')[0] + '",';
                            text += '"' + (act.user && act.user.FirstName ) + ', ' + (act.user && act.user.LastName ) + '",';
                            text += '"' + act.activity.Name + '",';
                            text += '"' + (act.Comment || '') + '",';
                            text += "\n";
                        });
                        // download as csv
                        var stu = $scope.student.user;
                        utils.download(text, 'HistoryFor-'+stu.FirstName+'_'+stu.LastName);
                    };


                    $scope.$watch('student', function (newVal, oldVal) {
                        $scope.schedule = newVal.classes;
                        $scope.activities = newVal.user.activities_affected;
                        $scope.referrals = newVal.referred;
                        oser.markActionsToReferrals($scope.referrals);
                        aecser.markActionsToReferrals($scope.referrals);
                        retser.markActionsToReferrals($scope.referrals);
                        issser.markActionsToReferrals($scope.referrals);
                        ldser.markActionsToReferrals($scope.referrals);
                        for (var i = 0; i < $scope.referrals.length; i++) {
                            if ($scope.referrals[i].ReferralTypeId === 1 || $scope.referrals[i].ReferralTypeId === 2
                                || $scope.referrals[i].ReferralTypeId === 3 || $scope.referrals[i].ReferralTypeId === 16
                                || $scope.referrals[i].ReferralTypeId === 19) {
                                var oldRefName = $scope.referrals[i].referral_type.Name;
                                $scope.referrals[i].referral_type.Name = "O-Room: ";
                                var newRefName = $scope.referrals[i].referral_type.Name + oldRefName;
                                $scope.referrals[i].referral_type.Name = newRefName;
                            }
                            if ($scope.referrals[i].ReferralTypeId === 5 || $scope.referrals[i].ReferralTypeId === 6
                                || $scope.referrals[i].ReferralTypeId === 7 || $scope.referrals[i].ReferralTypeId === 10
                                || $scope.referrals[i].ReferralTypeId === 15 || $scope.referrals[i].ReferralTypeId === 17) {
                                var oldRefName = $scope.referrals[i].referral_type.Name;
                                $scope.referrals[i].referral_type.Name = "ISS: ";
                                var newRefName = $scope.referrals[i].referral_type.Name + oldRefName;
                                $scope.referrals[i].referral_type.Name = newRefName;
                            }
                        }
                    });

                    /*******************  Right Side Controllers*********************/
                    $scope.filter = []; // array stores status of filter buttons. eg. filter['LDT'] = true.
                    $scope.counters = ProfileCounters;

                    // TODO: what to do when date picker is changed?
                    $scope.$watch("profileForm.date.$modelValue", function (newVal, oldVal) {
                        //console.info("date changedto :" + newVal) 
                    });


                    $scope.showDetail = false;
                    $scope.toggleShowDetail = function (referral) {
                        $scope.showDetail = !$scope.showDetail;
                        $scope.selected = referral;
                    };

                    $scope.graduationYear = 2015 + (12 - parseInt($scope.student.Grade, 10));

                    $scope.enableClassEdit = function ($index, classes) {
                        classes[$index].editing = true
                    };
                    $scope.submitClassChange = function ($index, classes) {
                        var newClass = $scope.student.ProfessorClass;
                        var classToBeModified = classes[$index];
                        ClassStuSer.update({id: classToBeModified.Id}, {professorClassId: newClass.Id}, function (data) {
                            console.log('success');
                            notify("Hooray! Class Successfully Changed!");
                            classToBeModified.professor_class = newClass;
                            classes[$index].editing = false;
                        }, function (error) {
                            notify("Ops! Something went wrong, please try again")
                        });

                    };
                    $scope.cancelClassChange = function ($index, classes) {
                        classes[$index].editing = false
                    };

                    $scope.enableContactEdit = function () {
                        $scope.student.GuardianNameCopy = $scope.student.GuardianName;
                        $scope.student.GuardianPhoneCopy = $scope.student.GuardianPhone;
                        $scope.student.GuardianMPhoneCopy = $scope.student.GuardianMPhone;
                        $scope.student.contactEdit = true;
                    };
                    $scope.submitContactChange = function () {
                        students.update({id: $scope.student.Id, updateStudent: true}, {
                            GuardianName: $scope.student.GuardianNameCopy,
                            GuardianPhone: $scope.student.GuardianPhoneCopy,
                            GuardianMPhone: $scope.student.GuardianMPhoneCopy

                        }, function () {
                            notify("Hooray! Parent Contact Updated!");
                            $scope.student.GuardianName = $scope.student.GuardianNameCopy;
                            $scope.student.GuardianPhone = $scope.student.GuardianPhoneCopy;
                            $scope.student.GuardianMPhone = $scope.student.GuardianMPhoneCopy;
                            $scope.student.contactEdit = false;
                        }, function (error) {
                            notify("Ops! Something went wrong, please try again");
                        });
                    };
                    $scope.cancelContactChange = function () {
                        $scope.student.contactEdit = false;
                    };


                    $scope.filterSelect = function () {
                        var activeButtons = [];
                        if ($scope.filter['LDT'] == true) {
                            activeButtons.push('LDT');
                        }
                        if ($scope.filter['ORM'] === true) {
                            activeButtons.push('ORM');
                        }
                        if ($scope.filter['AEC'] === true) {
                            activeButtons.push('AEC');
                        }
                        if ($scope.filter['RET'] === true) {
                            activeButtons.push('RET');
                        }
                        if ($scope.filter['ISS'] === true) {
                            activeButtons.push('ISS');
                        }
                        if ($scope.filter['OSS'] === true) {
                            activeButtons.push('OSS');
                        }
                        $scope.selectedButtons = activeButtons;

                    };

                }])//End of Profile Controller
        // TODO: use ReferralTypes factory to simplify checking referral type
        .filter("buttonFilter", function (ProfileCounters) {
            return function (listActivities, selectedButtons) {
                if (!selectedButtons) {
                    return listActivities;
                }
                // 0 = Referrals, 1 = Present, 2= Truant, 3 = ReChdl, 4 = Cleared
                var ormCounters = [0, 0, 0, 0, 0];
                var ldtCounters = [0, 0, 0, 0, 0];
                var aecCounters = [0, 0, 0, 0, 0];
                var retCounters = [0, 0, 0, 0, 0];
                var issCounters = [0, 0, 0, 0, 0];
                var ossCounters = [0];
                var filteredList = [];
                var ormtypes = [1, 2, 3, 16, 19];
                var isstypes = [5, 6, 7, 10, 15, 17];
                for (var i = 0; i < listActivities.length; i++) {
                    if (ormtypes.indexOf(listActivities[i].ReferralTypeId) !== -1 && selectedButtons.indexOf('ORM') > -1) {
                        ormCounters[0]++;
                        filteredList.push(listActivities[i]);
                        if (listActivities[i].ActivityTypeId == 24) {
                            ormCounters[1]++;
                        }
                        if (listActivities[i].ActivityTypeId == 25 || listActivities[i].ActivityTypeId == 28 ||
                            listActivities[i].ActivityTypeId == 29) {
                            ormCounters[2]++;
                        }
                        if (listActivities[i].ActivityTypeId == 27 || listActivities[i].ActivityTypeId == 30) {
                            ormCounters[3]++;
                        }
                        if (listActivities[i].ActivityTypeId == 88) {
                            ormCounters[4]++;
                        }
                    }
                    if (listActivities[i].ReferralTypeId == 12 && selectedButtons.indexOf('AEC') > -1) {
                        aecCounters[0]++;
                        filteredList.push(listActivities[i]);
                        if (listActivities[i].ActivityTypeId == 49) {
                            aecCounters[1]++;
                        }
                        if (listActivities[i].ActivityTypeId == 52 || listActivities[i].ActivityTypeId == 55 ||
                            listActivities[i].ActivityTypeId == 56) {
                            aecCounters[2]++;
                        }
                        if (listActivities[i].ActivityTypeId == 50 || listActivities[i].ActivityTypeId == 54 ||
                            listActivities[i].ActivityTypeId == 57) {
                            aecCounters[3]++;
                        }
                        if (listActivities[i].ActivityTypeId == 51) {
                            aecCounters[4]++;
                        }
                    }
                    if (listActivities[i].ReferralTypeId == 18 && selectedButtons.indexOf('RET') > -1) {
                        filteredList.push(listActivities[i]);
                        retCounters[0]++;
                        if (listActivities[i].ActivityTypeId == 64) {
                            retCounters[1]++;
                        }
                        if (listActivities[i].ActivityTypeId == 67 || listActivities[i].ActivityTypeId == 70 ||
                            listActivities[i].ActivityTypeId == 75) {
                            retCounters[2]++;
                        }
                        if (listActivities[i].ActivityTypeId == 65 || listActivities[i].ActivityTypeId == 69 ||
                            listActivities[i].ActivityTypeId == 71) {
                            retCounters[3]++;
                        }
                        if (listActivities[i].ActivityTypeId == 66) {
                            retCounters[4]++;
                        }
                    }
                    if (listActivities[i].ReferralTypeId == 9 && selectedButtons.indexOf('LDT') > -1) {
                        filteredList.push(listActivities[i]);
                        ldtCounters[0]++;
                        if (listActivities[i].ActivityTypeId == 31) {
                            ldtCounters[1]++;
                        }
                        if (listActivities[i].ActivityTypeId == 32 || listActivities[i].ActivityTypeId == 35 ||
                            listActivities[i].ActivityTypeId == 36) {
                            ldtCounters[2]++;
                        }
                        if (listActivities[i].ActivityTypeId == 34 || listActivities[i].ActivityTypeId == 37) {
                            ldtCounters[3]++;
                        }
                    }
                    if (listActivities[i].ReferralTypeId == 11 && selectedButtons.indexOf('OSS') > -1) {
                        filteredList.push(listActivities[i]);
                        ossCounters[0]++;
                    }
                    if (isstypes.indexOf(listActivities[i].ReferralTypeId) !== -1 && selectedButtons.indexOf('ISS') > -1) {
                        filteredList.push(listActivities[i]);
                        issCounters[0]++;
                        if (listActivities[i].ActivityTypeId == 38) {
                            issCounters[1]++;
                        }
                        if (listActivities[i].ActivityTypeId == 39 || listActivities[i].ActivityTypeId == 42 ||
                            listActivities[i].ActivityTypeId == 43) {
                            issCounters[2]++;
                        }
                        if (listActivities[i].ActivityTypeId == 41 || listActivities[i].ActivityTypeId == 47 ||
                            listActivities[i].ActivityTypeId == 86) {
                            issCounters[3]++;
                        }
                        if (listActivities[i].ActivityTypeId == 87) {
                            issCounters[4]++;
                        }
                    }
                }
                ProfileCounters.ormCounters = ormCounters;
                ProfileCounters.aecCounters = aecCounters;
                ProfileCounters.retCounters = retCounters;
                ProfileCounters.ldtCounters = ldtCounters;
                ProfileCounters.issCounters = issCounters;
                ProfileCounters.ossCounters = ossCounters;
                if (filteredList.length == 0) {
                    return listActivities
                }
                return filteredList;
            }
        })
        .factory('ProfileCounters', function () {
            var factory = {};
            factory.ormCounters = [];
            factory.aecCounters = [];
            factory.retCounters = [];
            factory.ldtCounters = [];
            factory.issCounters = [];
            factory.ossCounters = [];
            return factory;
        })

}(angular.module('Argus')));