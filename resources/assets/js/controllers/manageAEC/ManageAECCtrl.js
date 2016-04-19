/* global angular, URL */

(function (app) {
    "use strict";
    app
        .controller("manageAECController", ["$scope", "$filter", "$modal", "referrals", "PassesService",
            "StudentsService", "notify", "AECListService", 'UtilService',
            function ($scope, $filter, $modal, referrals, passes, students, notify, aec, utils) {
                $scope.selected = {student: null};
                $scope.refTable = [];// table model
                $scope.currentDate = new Date();


                function getListSuccessCallback(data) {
                    if (!data.length) {
                        notify({
                            message: "No students for current date",
                            classes: 'alert-warning', templateUrl: 'views/common/notify.html'
                        });
                    }
                };

                $scope.getList = function(date){
                    date = date || $scope.currentDate;
                    $scope.refTable = aec.getList(date, getListSuccessCallback);
                };
                /**
                 * Watch for changes in the datepicker then load the AECList
                 * For the selected Date. Also adjusts data received
                 * to be easily shown in the view
                 */
                $scope.$watch('form.date.$viewValue', function (newVal) {
                    if (newVal) {//when date has a valid date request the List from that date
                        $scope.currentDate = newVal;
                        console.log("newVal = " + $scope.form.date.$viewValue);
                        $scope.getList($scope.currentDate);
                    }
                });

                /**
                 * Makes API call to get a pdf of the AEC passes for the students
                 * assigned AEC for the current date
                 */
                $scope.getPasses = function () {
                    notify({
                        message: "Now Generating Passes",
                        classes: 'alert-successs', templateUrl: 'views/common/notify.html'
                    });
                    passes.pdf({date: $scope.currentDate, param: 'AECList'}, function (data) {
                        console.log(data);
                        var fileURL = URL.createObjectURL(data.response);
                        window.open(fileURL);
                    });

                };

                /**
                 * Select the student that is clicked in the table so that the user doesn't
                 * have to type it
                 * @param {int} $index: reftable index of the clicked student
                 */
                $scope.onSelect = function ($index) {
                    $scope.selected.student = $scope.refTable[$index];
                };

                /**
                 * Converts the current AEC list into a csv text format so it can
                 * be passed to the download method
                 */
                $scope.AECListToCSV = function () {
                    var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Assignment,Overlap, Attendance\n';
                    angular.forEach($scope.refTable, function (item) {
                        angular.forEach(item.referred, function (referred) {
                            text += referred.teacher.FirstName + ',' + referred.teacher.LastName + ","
                                + item.user.FirstName + ',' + item.user.LastName + ',' + item.StudentId + ','
                                + item.Grade + ',' + referred.assignment.Name + ','
                                + (item.overlap.msg ? item.overlap.msg : 'N/A') + ','
                                + item.referred[0].activity.Name + ','
                                + ' \n';
                        });
                    });
                    utils.downloadCSV(text, 'AEC-List_' + $scope.currentDate);
                };


                /************************************** MANAGE AEC ***********************************/
                // To avoid duplicate profile entries only 1 entry should be created in
                // useractions table and all referrals must be changed in referrals
                // table (see backend implementation)


                /**
                 * PUT API call to change the referral status to reschedule (ReferralStatus 2),
                 * rescheduling all the referrals as well as login the reschedule
                 * into user actions for the profile
                 * @param {object} data: information returned by modal (date,comment,student,excused)
                 */
                function submitReschedule(data) {
                    aec.updateReschedule($scope.currentDate, data).then(function (data) {
                        clearSelectStudentField();
                        notify(data.msg);
                    }, function (err) {
                        notify({
                            message: "Reschedule Failed, Please Contact The Admin Before Continuing",
                            classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                        });
                    });

                };

                /**
                 * PUT API call to change the referral status to clear(ReferralStatus 3),
                 * rescheduling all the referrals as well as loggin the reschedule
                 * into user actions for the profile
                 * @param {object} data: information returned by modal (comment, student)
                 */
                function submitClear(data) {
                    var student = data.student;
                    debugger;
                    aec.updateClear($scope.currentDate, student, data.comment).then(function (data) {
                        clearSelectStudentField();
                        notify(data.msg);
                    }, function (data) {
                        notify({
                            message: "Clear Failed, Please Contact The System Admin Before Continuing",
                            classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                        });
                    });


                };

                /**
                 * PUT API to change the referral attendance to whatever the user choses.
                 * The referral is marked with an status of 2 (attendance taken)
                 *
                 */
                function submitAttendance(data) {// on SUBMIT
                    var student = data.student;
                    aec.updateAttendance($scope.currentDate, student).then(function (data) {
                        clearSelectStudentField();
                        notify(data.msg);
                    }, function (err) {
                        notify({
                            message: "Present  Failed, Please Contact The System Admin Before Continuing",
                            classes: 'alert-danger', templateUrl: 'views/common/notify.html'
                        });
                    });

                };

                /**
                 * PUT API call to change the all unprocessed referrals to absent(ReferralStatus 4)
                 * as well as logging the absent into user actions for the profile
                 */
                $scope.finishManageAEC = function () {
                    // confirm before submit
                    var submit = confirm("IF YOU SUBMIT THIS LIST ALL THE CHANGES MADE WILL BE RECORDED AND YOU WILL BE UNABLE TO CHANGE THEM AGAIN");
                    if (!submit)
                        return;
                    var prom = aec.submitList($scope.refTable, $scope.currentDate);
                    prom.then(function (data) {
                        notify(data.msg, 'success');
                    }, function (err) {
                        notify("error submitting,  Please Contact the System Admin before continuing ", 'danger')
                    });

                };

                /********************************************** MODALS   **************************/

                /** Attendance Modal
                 * opens the attendance modal with 3 buttons (present, sent out, walked out
                 */
                $scope.AECAttendance = function (student, $index) {
                    //if (isOverlap(student)) {
                    //    return;
                    //}
                    // can only change if not changed before
                    if (student.referred[0].RefferalStatus === 2 || student.referred[0].RefferalStatus === 4) {
                        notify('Action Unavailable : Attendance  Already taken and submitted.','warning');
                        return;
                    }

                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/attendanceAECModal.html',
                        size: 'lg',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            $scope.rescheduleDate = new Date();

                            $scope.$watch('rescheduleForm.date.$viewValue', function (n, o) {
                                student.rescheduleDate = n || student.rescheduleDate;
                                console.log('new_reschedule_date',n);
                            });
                            $scope.$watch('clearForm.date.$viewValue', function (n, o) {
                                student.moveDate = n || student.moveDate;
                                console.log('new_clear_move_date',n);
                            });
                            $scope.selectedReferralToRemove = function () {
                                var selectedCount = 0;
                                angular.forEach(student.referred, function (item) {
                                    if (item.remove)
                                        selectedCount++;
                                });
                                console.log('removing ', selectedCount);
                                student.removingAll = selectedCount == student.referred.length;
                            }
                        },
                        resolve: {
                            student: function () {
                                return student;
                            }
                        }
                    });
                    modalInstance.result.then(submitAttendance);

                };


                /** Reschedule Modal
                 * Opens the Reschedule modal and passes in the student selected to be available
                 * in the modal context, calls submitReschedule function when modal
                 * submit button is clicked,does nothing otherwise
                 */
                $scope.openReschedule = function () {

                    console.log('AEC Reschedule: student\n', $scope.selected.student);

                    var resModal = $modal.open({
                        templateUrl: 'views/modals/RescheduleModal.html',
                        size: 'md',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            $scope.date = new Date();

                            $scope.$watch('form.date.$viewValue', function (newValue, oldValue) {
                                if (newValue) { //when date has a valid date request the List from that date
                                    $scope.date = newValue;
                                    console.log('date changed');
                                }
                            });

                        },
                        resolve: {
                            student: function () {
                                return $scope.selected.student;
                            }
                        }
                    });// end modalInstance

                    resModal.result.then(submitReschedule);
                };

                /** Clear Modal
                 * Opens the Clear modal and passes in the student selected to be available
                 * in the modal context, calls submitClear function when modal
                 * submit button is clicked,does nothing otherwise
                 */
                $scope.openClear = function () {

                    console.log('AEC Clear: student\n', $scope.selected.student);

                    var clrModal = $modal.open({
                        templateUrl: 'views/modals/ClearModal.html',
                        size: 'md',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            $scope.title = 'clear';
                        },
                        resolve: {
                            student: function () {
                                return $scope.selected.student;
                            }
                        }
                    });// End clrModal

                    clrModal.result.then(submitClear);
                };


                /**
                 * clear select student field
                 */
                function clearSelectStudentField() {
                    $scope.selected.student = null;
                };

                function isOverlap(student) {
                    var overlap = false;
                    var overlapPlace = '';
                    if (!student.overlap)
                        return false;
                    if (student.overlap.hasorm && ! student.overlap.ormcleared) {
                        overlapPlace = 'O-Room';
                        overlap = true;
                    }
                    if (student.overlap.hasiss && ! student.overlap.isscleared) {
                        overlapPlace = 'ISS';
                        overlap = true;
                    }
                    if (student.overlap.hasoss) {
                        overlapPlace = 'OSS';
                        overlap = true;
                    }

                    if (overlap) {

                        if (overlapPlace === 'OSS') {
                            var modalInstance = $modal.open({
                                templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
                                //template:'<div> MODAL : true in Referral IN </div>',
                                size: 'lg',
                                controller: function ($scope, student, activity) {
                                    $scope.student = student;
                                    $scope.activity = activity;

                                },
                                resolve: {
                                    student: function () {
                                        return student;
                                    },
                                    activity: function () {
                                        return overlapPlace;
                                    }
                                }
                            });
                            return true;
                        } else {
                            var modalInstance = $modal.open({
                                templateUrl: 'views/modals/attendanceAECFoldersModal.html',
                                //template:'<div> MODAL : true in Referral IN </div>',
                                size: 'lg',
                                controller: function ($scope, student, activity) {
                                    $scope.student = student;
                                    console.log(student);
                                    $scope.activity = activity;

                                },
                                resolve: {
                                    student: function () {
                                        return student;
                                    },
                                    activity: function () {
                                        return overlapPlace;
                                    }
                                }
                            });

                            modalInstance.result.then(function () {
                                aec.updateOverlapAttendance($scope.currentDate, student).then(
                                    function (data) {
                                        notify(data.msg);
                                        //var status = {class: 'bg-warning', action: 'foldersMarked'};
                                        //student.status = status;
                                    }, function (err) {
                                        notify('error, Before continuing please contact an admin');
                                    });
                            });
                            return true;
                        }

                        return false;
                    }
                }
            }]);

}(angular.module('Argus')));						