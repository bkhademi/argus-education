/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global angular */

(function (app) {
    app.controller('oRoomActivityLogAdminCtrl',
        ['$scope', 'notify', 'StudentsService', 'teachers', '$modal', 'PeriodsService', '$interval', 'OroomService', 'ActivitiesService', 'ReferralsService', 'ISSService', '$rootScope', 'DevService', 'CountersService','$filter',
            function ($scope, notify, students, teachers, $modal, periods, $interval, orooms, activities, referrals, isss, $rootScope, dev, counters, $filter) {
                function footable_redraw() {
                    $('.footable').trigger('footable_redraw');
                }

                $rootScope.$on('studentsUpdated', function (stu) {
                    $scope.schoolStudents = students.students;
                });
                var intervalPromise = $interval(interval, 2000);
                $scope.$on('$destroy', function () {
                    $interval.cancel(intervalPromise);
                });

                $scope.mouseOnTable = false;
                function interval() {
                    var now = new Date();
                    $scope.currentTime = formatAMPM(now);
                    $scope.currentDate = formatDate(now);
                    $scope.currentPeriod = getPeriod(now);
                    if (!$scope.mouseOnTable) {
                        orooms.get({}, function (data) {
                            angular.forEach(data.reftable, function (item) {
                                item.ReferralIn = item.ReferralIn === 1 ? true : false;

                            });
                            angular.forEach(data.OroomList, function (item) {
                                if (item.counters.ISSDays > 0) {
                                    item.class = 'bg-danger';
                                }
                            });
                            $scope.refTable2 = data.OroomList;
                            $scope.refTable1 = data.reftable;
                            footable_redraw();
                        });
                    }

                    //console.log($scope.currentPeriod)
                    // check time and change period accordingly
//				if ($scope.currentPeriod) {// period changed programatically
//					getORoomLists($scope.currentPeriod);
//				}

                }
                ;

                $scope.refresh = getORoomLists;
                $scope.selected = {student: null};
                $scope.refTable1 = [];
                $scope.refTable2 = [];
                $scope.activities = [
                    {Name: "In O-Room", Id: 1},
                    {Name: "Assign ISS", Id: 2},
                    {Name: "Walked-Out", Id: 3},
                    {Name: "No Show", Id: 4},
                    {Name: "Other", Id: 5}
                ];


                $scope.periods = periods.query(function (data) {
                    $scope.currentPeriod = data[6];

                    interval();
                });

                $scope.schoolStudents = students.students;
                $scope.teachers = teachers.query();


                $scope.changePeriodTables = function (newPeriod) {
                    $scope.currentPeriod = newPeriod;

                };


                $scope.onSelectedStudent = function () {
                    // default activity to In O-Room
                    $scope.selected.student.activity = $scope.activities[0];

                    // preprocess the data to send
                    var date = formatDate(new Date);
                    var dataToSend = {
                        "StudentId": $scope.selected.student.user.id,
                        "PeriodId": $scope.currentPeriod ? $scope.currentPeriod.Id : 14,
                        "ActivityId": $scope.selected.student.activity.Id,
                        "Date": date
                    };

                    //post data to oroomactivity
                    orooms.save({reftable: true}, dataToSend, function (data) {
                        console.log('data saved');
                        console.log(data);

                        // add too the left table
                        $scope.refTable1.unshift(data);
                    }, function (error) {
                        notify('Error');
                    });

                    // clear field
                    $scope.selected.student = null;

                };

                $scope.onTeacherChanged = function (item) {
                    updateTable1Record(item);
                };

                $scope.onActivitySelected = function (student, oldActivity) {
                    //console.log(student.activity);
                    //console.log(angular.fromJson(oldActivity));
                    if (student.activity.Id !== 2) {
                        updateTable1Record(student);
                        return;
                    }
                    // go here if Assign ISS is not selected
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/ISSReferralModal.html',
                        //template: '<div> MODAL: assignISS selected</div>',
                        size: 'lg',
                        controller: function ($scope, student, currentUser) {
                            $scope.student = student;
                            $scope.currentUser = currentUser;
                        },
                        resolve: {
                            student: function () {
                                return student;
                            },
                            currentUser: function () {
                                return JSON.parse(localStorage.getItem('user'));
                            }
                        }
                    });

                    modalInstance.result.then(function () {//on SUBMIT
                        // post the ISS referral to the database
                        isss.save({
                            StudentId: student.student.id,
                            ReferralTypeId: 5,
                            ActionType: 20,
                            Comment: student.comment
                        }, function (data) {
                            notify('success');
                        }, dev.openError);

                        updateTable1Record(student);

                        // change row to non removable
                        student.nonRemovable = true;

                        student.staticActivity = true;

                    }, function () {// modal dismissed
                        // change the activity back to what it was
                        student.activity = angular.fromJson(oldActivity);
                        //updateTable1Record(student);

                    });
                };

                $scope.onReferralInTrue = function (student) {
                    if (student.ReferralIn === false) {
                        updateTable1Record(student);
                        return;
                    }
                    if (!student.teacher || student.teacher.id == 0) {
                        notify({message: 'Please Select A Teacher First'});
                        student.ReferralIn = false;
                        return;
                    }
                    // check referral type
                    students.get({id: student.student.id}, function (data) {
                        var oroomsToBeSeved = data.counters.ORoomsToBeServed;
//					if(oroomsToBeSeved === 0)
                        student.referralType = "First Time - Teacher";
//					else{
//						student.referralType = ""
//					}

                        angular.forEach(data.activitiesAffected, function (item) {
                            if (item.Date === $scope.currentDate)
                                student.referralType = "O-Room Referral → ISS";
                        });
                    });

                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/oRoomReferralModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student) {
                            $scope.student = student;
                        },
                        resolve: {
                            student: function () {
                                return student;
                            }
                        }
                    });


                    modalInstance.result.then(function () {// on SUBMIT
                        // post the comment and other things to the database


                        // put reftable

                        var oRoomReferralTypeId = 1;
                        var oRoomActivityTypeId = 1;
                        var payLoad = {
                            Date: $scope.currentDate,
                            PeriodId: $scope.currentPeriod ? $scope.currentPeriod.Id : 0,
                            StudentId: student.StudentId,
                            TeacherId: student.teacher.id,
                            ReferralTypeId: oRoomReferralTypeId,
                            ActivityTypeId: oRoomActivityTypeId,
                            Comment: (student.comment || '') + '[From O-Room During Day(System)]'
                        };
                        orooms.save({ormlist: true}, payLoad, function (data) {
                            notify('success');
                            updateTable1Record(student);
                            $scope.refTable2.unshift(data);
                        }, function (error) {
                            notify('error');
                            student.ReferralIn = false;
                        });

                        //change switch  to static
                        student.staticRef = true;
                        // change teacher to static
                        student.staticTeacher = true;
                        // change row to non removable
                        student.nonRemovable = true;

                    }, function () {// on modal DISMISS
                        student.ReferralIn = false;
                    });

                };

                $scope.onDeleteTable1 = function ($index) {
                    // perform a DELETE request
                    var obj = $scope.refTable1[$index];
                    orooms.delete({id: obj.Id, reftable: true}, function (data) {
                        notify('success');
                        $scope.refTable1.splice($index, 1);
                    }, function (error) {
                        notify('error');
                    });
                };

                $scope.onDeleteTable2 = function ($index) {
                    var item = $scope.refTable2[$index];
                    //checks before opening the modal

                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/oRoomCoordinatorUpdateModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student) {
                            $scope.student = student;
                        },
                        resolve: {
                            student: function () {
                                return $scope.refTable2[$index];
                            }
                        }
                    });

                    modalInstance.result.then(function () {// on SUBMIT
                        // post the comment and other things to the database
                        var payload = {
                            counters: item.counters,
                            Comment: item.comment
                        };
                        counters.update({id: item.Id}, payload, function (data) {

                        }, dev.openError);

                        //add student to the list on the right
                        $scope.refTable2.splice($index, 1);

                    }, function () {// on modal DISMISS
                    });
                };


                $scope.onClear = function (student) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/ClearReferralsModal.html',
                        size: 'lg',
                        controller: function ($scope, PeriodsService, student) {
                            $scope.student = student;
                            $scope.onReferralRemove = function ($index) {

                            }
                        },
                        resolve: {
                            student: function () {
                                referrals.query({StudentId: student.Id}, function (data) {
                                    student.referred = $filter('filter')(data, function (o) {
                                        return o.ReferralTypeId === 1 || o.ReferralTypeId === 2
                                            || o.ReferralTypeId === 3 || o.ReferralTypeId === 16
                                            || o.ReferralTypeId === 19;
                                    });
                                    return student;
                                });
                                return student;

                            }
                        }
                    });
                    modalInstance.result.then(function () {// on SUBMIT
                        debugger;
                        referrals.deleteReferralsFromStudent($scope.currentDate, student).then(function (data) {
                            notify(data.msg, 'success');
                        }, dev.openError);

                        $scope.selected.student = null;
                    });
                };


                function formatAMPM(date) {
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    hours = hours < 10 ? '0' + hours : hours;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    seconds = seconds < 10 ? '0' + seconds : seconds;
                    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
                    return strTime;
                }

                function formatTime24(date) {
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = '00';
                    hours = hours < 10 ? '0' + hours : hours;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    var strTime = hours + ":" + minutes + ":" + seconds;
                    return strTime;
                }

                function formatDate(date) {
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var year = date.getFullYear();
                    var strDate = month + '/' + day + "/" + year;
                    return strDate;
                }

                function getPeriod(date) {
                    var currentPeriod = null;
                    var datestr = formatTime24(date);
                    //console.log(datestr);
                    angular.forEach($scope.periods, function (item) {
                        if (datestr > item.StartTime) {
                            //console.log('datestr < ' + item.StartTime);
                            if (datestr < item.EndTime) {
                                //console.log('datestr < ' + item.EndTime);
                                currentPeriod = item;
                            }
                        }


                    });
                    return currentPeriod;
                }

                function updateTable1Record(item) {
                    console.log(item);
                    var dataToSent = {
                        SentOutById: item.teacher ? item.teacher.id : 0,
                        ActivityId: item.activity ? item.activity.Id : 0,
                        ReferralIn: item.ReferralIn ? 1 : 0
                    };
                    orooms.update({id: item.Id, reftable: true}, dataToSent);
                }

                function getORoomLists(period) {
                    orooms.get({}, function (data) {
                        angular.forEach(data.reftable, function (item) {
                            item.ReferralIn = item.ReferralIn === 1 ? true : false;
                        });

                        $scope.refTable1 = data.reftable;
                        $scope.refTable2 = data.OroomList;
                    });
                }

                getORoomLists();
            }]);
}(angular.module('Argus')));