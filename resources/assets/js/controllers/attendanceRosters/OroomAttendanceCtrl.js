/* global angular */

(function (app) {
    app.controller('OroomRosterCtrl', ['$scope', 'MyNotify', '$modal', 'OroomService', "AECListService", 'UtilService',
        function ($scope, notify, $modal, orooms, aec, utils) {
            $scope.currentDate = new Date();
            $scope.selected = {};
            $scope.$watch('form.date.$viewValue', function (newVal) {
                if (newVal) {//when date has a valid date request the List from that date
                    console.log('new', newVal)
                    $scope.currentDate = newVal;
                    $scope.getList();
                }
            });

            $scope.getList = function () {
                var periodIds = [8];
                orooms.getList($scope.currentDate,periodIds).then(function (data) {
                    $scope.refTable = data.OroomList;
                    $scope.count.oroom = data.OroomListCount;
                });
            };

            $scope.onSelect = function ($index) {
                $scope.selected.student = $scope.refTable[$index];
            };

            $scope.oRoomAttendance = function (student) {
                if(student.referred[0].RefferalStatus === 1  ) {
                    notify('Action Unavailable : Attendance  Already taken. ');
                    return;
                }
                var modalInstance;
                console.log('o-room attendance');

                var overlap = false;
                var overlapPlace = '';

                if (student.overlap.hasiss && !student.overlap.isscleared ) {
                    overlapPlace = 'ISS';
                    overlap = true;
                }
                if (student.overlap.hasoss) {
                    overlapPlace = 'OSS';
                    overlap = true;
                }
                overlap = false;
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

                //
                modalInstance = $modal.open({
                    templateUrl: 'views/modals/attendanceOroomModal.html',
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
                    orooms.updateAttendance($scope.currentDate, student).then(function (data) {
                        notify(data.msg);
                        $scope.selected.student = null;
                    });


                }, function () {// on modal DISMISS

                });

            };

            $scope.printList = function () {
                var heading = 'First Name, Last Name, Student ID, Pending Days, Referral Type, 8th period, Attendance\n';
                var text = heading;
                angular.forEach($scope.refTable, function (item) {
                    debugger;
                    if((item.overlap.hasiss && !item.overlap.isscleared) || item.overlap.hasoss || item.referred[0].ActivityTypeId == 88)
                        return;
                    text += item.user.FirstName + ', ' + item.user.LastName + ', ';
                    text += item.user.UserName + ', ' + item.counters.ORoomsToBeServed + ', ';
                    text += item.referred[0].referral_type.Name + ', ';
                    text += (item.classes[0] ? item.classes[0].professor_class.room.Name : 'N/A')+', ';
                    text += item.referred[0].activity.Name;
                    text += '\n';
                });

                utils.downloadCSV(text, 'O-Room-List'+$scope.currentDate);
            };
        }]);
}(angular.module('Argus')));
