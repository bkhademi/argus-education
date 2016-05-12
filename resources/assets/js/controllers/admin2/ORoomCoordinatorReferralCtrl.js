/* global angular */

(function (app) {
    app.controller('ORoomCoordinatorReferralCtrl',
        ['$scope', '$modal', 'MyNotify', 'StudentsService', 'teachers', 'DevService', 'LunchService', 'OroomService', 'ISSService', 'CountersService', 'ReferralsService',
            function ($scope, $modal, notify, students, teachers, dev, lunchs, orooms, isss, counters, referrals) {
                $scope.currentDate = new Date();
                $scope.selected = {};
                $scope.$watch('form.date.$viewValue', function (newVal) {
                    if (newVal) //when date has a valid date request the List from that date
                        $scope.currentDate = newVal;
                });


                $scope.currentDate = new Date();
                $scope.schoolStudents = students.query({admin: true, light: true}, function () {
                }, function (error) {
                    dev.openError(error);
                });

                $scope.teachers = teachers.query();

                $scope.assignLunch = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/lunchDetentionModal.html',
                        size: 'lg',
                        controller: function ($scope, student, PeriodsService) {
                            $scope.periods = PeriodsService.query();
                            $scope.student = student;
                        },
                        resolve: {
                            student: function () {
                                return $scope.selected.student;
                            }
                        }
                    });

                    modalInstance.result.then(function () {// on SUBMIT
                        // post the comment and other things to the database
                        lunchs.saveReferral($scope.currentDate,$scope.selected.student).then(function (data) {
                            notify(data.msg,'success');
                            $scope.selected.student = null;
                        }, dev.openError);

                    });
                };

                $scope.assignORoom = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/assignOroomModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student, teachers) {
                            $scope.student = student;
                            $scope.teachers = teachers;
                        },
                        resolve: {
                            student: function () {
                                return $scope.selected.student;
                            },
                            teachers: function () {
                                return $scope.teachers;
                            }
                        }
                    });

                    modalInstance.result.then(function () {// on SUBMIT
                        var student = $scope.selected.student;
                        console.log(student);
                        // post the comment and other things to the database

                        var payload = {
                            //Date:$scope.currentDate,
                            StudentId: student.Id,
                            TeacherId: student.teacher ? student.teacher.id : 0,
                            ActivityTypeId: 1,
                            ReferralTypeId: 1,
                            Comment: student.comment,
                            Date: $scope.currentDate
                        };

                        orooms.save({ormlist: true}, payload, function () {
                            notify('success','success');
                            orooms.count++;
                        }, dev.openError);

                        $scope.selected.student = null;
                    });
                };

                $scope.assignISS = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/ISSReferralAdminModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, student, PeriodsService) {
                            $scope.periods = PeriodsService.query();
                            $scope.student = student;
                        },
                        resolve: {
                            student: function () {
                                return $scope.selected.student;
                            }
                        }
                    });

                    modalInstance.result.then(function () {// on SUBMIT
                        var student = $scope.selected.student;
                        // post the comment and other things to the database
                        isss.save({
                            StudentId: student.Id,
                            ReferralTypeId: 10,
                            ActionType: 21,
                            Comment: student.comment,
                            Date: $scope.currentDate
                        }, function (data) {
                            notify(data.msg,'success');
                        }, dev.openError);

                        $scope.selected.student = null;
                    });
                };

                $scope.changeAndComment = function () {
                    var selected = $scope.selected;
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/oRoomCoordinatorUpdateAdminModal.html',
                        size: 'lg',
                        controller: function ($scope, student) {
                            $scope.student = student;
                            console.log(student);
                        },
                        resolve: {
                            student: function () {
                                counters.get({id: $scope.selected.student.Id}, function (data) {
                                    $scope.selected.student.counters = data;
                                    return $scope.selected.student;
                                });

                                return $scope.selected.student;

                            }
                        }
                    });

                    modalInstance.result.then(function (data) {// on SUBMIT
                        var item = $scope.selected.student;
                        // post the comment and other things to the database
                        var urlParams = {
                            id: item.Id
                        };

                        counters.update(urlParams,
                            {
                                counters: item.counters,
                                Comment: data.comment
                            }, function () {
                                notify('success','success');
                            }, function (error) {
                                dev.openError(error);
                            });
                        $scope.selected.student = null;
                    });
                };

                $scope.clear = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/ClearReferralsModal.html',
                        size: 'lg',
                        controller: function ($scope, PeriodsService, student, teachers) {
                            $scope.student = student;
                            $scope.teachers = teachers;
                            $scope.onReferralRemove = function ($index) {

                            }
                        },
                        resolve: {
                            student: function () {
                                referrals.query({StudentId: $scope.selected.student.Id}, function (data) {

                                    $scope.selected.student.referred = data;
                                    return $scope.selected.student;
                                });
                                return $scope.selected.student;
                            },
                            teachers: function () {
                                return $scope.teachers;
                            }
                        }
                    });

                    modalInstance.result.then(function () {// on SUBMIT
                        var student = $scope.selected.student;


                        referrals.deleteReferralsFromStudent($scope.currentDate, student).then(function (data) {
                            notify(data.msg, 'success');
                        }, dev.openError);

                        $scope.selected.student = null;
                    });
                };

            }]);
}(angular.module('Argus')));

