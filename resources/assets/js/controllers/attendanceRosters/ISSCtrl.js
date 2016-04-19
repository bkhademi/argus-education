/* global angular */

(function (app) {
    app.controller('ISSRosterController', ['$scope', 'MyNotify', '$modal', 'ISSService','UtilService',
        function ($scope, notify, $modal, isss, utils) {
            $scope.currentDate = new Date();
            $scope.selected = {};
            $scope.$watch('form.date.$viewValue', function (newVal) {
                if (newVal) {//when date has a valid date request the List from that date
                    $scope.currentDate = newVal;
                    $scope.getList();
                }
            });

            $scope.getList = function () {
                $scope.refTable = isss.getList($scope.currentDate, function(data){
                    $scope.count.iss = data.length;
                });
            };

            $scope.onSelect = function ($index) {
                $scope.selected.student = $scope.refTable[$index];
            };

            $scope.issAttendance = function (student) {


                if(student.referred[0].RefferalStatus === 1 || student.referred[0].RefferalStatus === 16 ) {
                    notify('Action Unavailable : Attendance  Already taken. ');
                    return;
                }

                var overlap = false;
                var overlapPlace = '';

                if (student.overlap.hasoss) {
                    overlapPlace = 'OSS';
                    overlap = true;
                }
                if (student.overlap.hasaec) {
                    // show present for AEC
                }


                if (overlap) {
                    modalInstance = $modal.open({
                        templateUrl: 'views/modals/AttendanceUnavailableModal2.html',
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

                var modalInstance = $modal.open({
                    templateUrl: 'views/modals/attendanceISSModal.html',
                    //template:'<div> MODAL : true in Referral IN </div>',
                    size: 'lg',
                    controller: function ($scope, student) {
                        $scope.student = student;

                        $scope.$watch('form.date.$viewValue', function(n,o){
                            console.log(n);
                            student.moveDate = n;
                        });
                        $scope.selectedReferralToRemove = function(){
                            var selectedCount = 0;
                            angular.forEach(student.referred,function(item){
                                if(item.remove)
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

                modalInstance.result.then(function () {// on SUBMIT
                    // post the comment and other things to the database
                    isss.updateAttendance($scope.currentDate, student)
                        .then(function (data) {
                            notify(data.msg);
                            $scope.selected.student = null;
                        }, function (error) {
                            notify('error, Before continuing please contact the system admin');
                        });
                });


            };

            $scope.printList = function () {
                var heading = 'First Name, Last Name, Student ID, 1st Per., 2nd Per., Referral Type, '
                    + 'ISS Days, ORM Days, Overlap, Attendance,  \n';
                var text = heading;
                angular.forEach($scope.refTable, function (item) {
                    text += item.user.FirstName + ', ' + item.user.LastName + ', ';
                    text += item.StudentId + ',' + item.classes[0].professor_class.room.Name + ',' + item.classes[1].professor_class.room.Name + ',';
                    text += item.referred[0].referral_type.Name + ', ';
                    text += item.counters.ISSDays + ', ';
                    text += item.counters.ORoomsToBeServed + ', ';
                    text += item.overlap.msg + ',';
                    text += item.referred[0].activity.Name;

                    text += '\n';
                });

                utils.downloadCSV(text, 'ISS-List_'+ $scope.currentDate);
            };

        }]);
}(angular.module('Argus')));