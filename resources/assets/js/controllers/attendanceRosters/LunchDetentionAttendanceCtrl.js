/* global angular */

(function (app) {
    app.controller('LunchDetentionRosterCtrl', ['$scope', 'MyNotify', '$modal', 'LunchService', '$rootScope',
        function ($scope, notify, $modal, lunchs, $rootScope) {
            $scope.selected = {};
            $scope.currentDate = new Date();


            $scope.getList = function(date) {
                date = date || $scope.currendDate;
                lunchs.getList($scope.currentDate).then( function (data) {
                    $scope.lunchTableA = [];
                    $scope.lunchTableB = [];
                    $scope.lunchTableC = [];
                    $scope.lunchTable = data.lunchStudents;
                    $scope.count.lunch = data.lunchStudentsCount;

                    angular.forEach(data.lunchStudents, function (item, $index) {
                        if (item.LunchType && item.LunchType.search(/A/i) != -1 )
                            $scope.lunchTableA.push(item);
                        else if (item.LunchType && item.LunchType.search(/B/i) != -1 )
                            $scope.lunchTableB.push(item);
                        else
                            $scope.lunchTableC.push(item);

                    });

                }, function () {
                    notify('error');
                });
            };

            $scope.$watch('form.date.$viewValue', function (newVal) {
                if (newVal) {
                    //when date has a valid date request the List from that date
                    $scope.currentDate = newVal;
                    $scope.getList();
                }
            });

            $scope.onSelect = function (item) {
                $scope.selected.student = item;
            };

            $scope.lunchAttendance = function (student, $index) {
                if (student.referred[0].RefferalStatus === 1) {
                    notify('Action Unavailable : Attendance  Already taken. ');
                    return;
                }
                var modalInstance;

                var overlap = false;
                var overlapPlace = '';


                if (student.overlap.hasoss) {
                    overlapPlace = 'OSS';
                    overlap = true;
                } else if (student.overlap.hasiss && !student.overlap.isscleared) {
                    overlapPlace = 'ISS';
                    overlap = true;
                }


                if (overlap) {
                    modalInstance = $modal.open({
                        templateUrl: 'views/modals/AttendanceUnavailableModal.html',
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
                    return;
                }


                modalInstance = $modal.open({
                    templateUrl: 'views/modals/attendanceLunchModal.html',
                    //template:'<div> MODAL : true in Referral IN </div>',
                    size: 'lg',
                    controller: function ($scope, student, PeriodsService) {
                        $scope.periods = PeriodsService.query();
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
                    lunchs.updateAttendance($scope.currentDate, student, function (data) {
                            notify(data.msg);
                            $scope.selected.student = null;
                        }, function (data) {
                            notify('error');
                        }
                    );
                    return;


                });


            };
            $scope.printListAll = function () {
                var heading = 'First Name,' + 'Last Name,' + 'Student ID, ' +
                    'Grade, ' + 'Attendance' + ', ' + 'Progression, Overlap\n';
                var text = heading;
                angular.forEach($scope.lunchTable, function (item) {
                    text += item.user.FirstName + ', ' + item.user.LastName + ', ';
                    text += item.StudentId + ',' + item.Grade + ', ';
                    text += item.activity ? item.activity.Name : '' + ', ' + (item.referred[0] ? item.referred[0].referral_type.Name : '');
                    text += ',' + (item.overlap ? item.overlap.msg : '');
                    text += '\n';
                });
                notify('printing');
                $scope.download(text);
            };

            $scope.printEstacado = function () {

            };
        }]);
}(angular.module('Argus')));