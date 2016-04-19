/* global angular */

(function (app) {
    app.controller('IssFollowupListCtrl',
        ['$scope', 'notify', 'ISSService', 'ISSFollowupService', '$modal', function ($scope, notify, isss, issfs, $modal) {
            $scope.iss = issfs.getList();

            $scope.issFollowupAttendance = function (student, $index) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/modals/ISSFollowupModal.html',
                    size: 'lg',
                    controller: function ($scope, student, teachers) {
                        $scope.student = student;
                        $scope.currentDate = new Date();
                        $scope.teachers = teachers.query();
                        $scope.$watch('suspension.startDate.$viewValue', function (newV, oldV) {
                            student.dateOfSuspensionStart = newV ? newV : oldV;
                        });
                        $scope.$watch('suspension.endDate.$viewValue', function (newV, oldV) {
                            student.dateOfSuspensionEnd = newV ? newV : oldV;
                        });
                        $scope.$watch('meeting.date.$viewValue', function (newV, oldV) {
                            student.meetingDate = newV ? newV : oldV;
                        });
                    },
                    resolve: {
                        student: function () {
                            return student;
                        }
                    }
                });

                modalInstance.result.then(function () {// on SUBMIT
                    issfs.updateAttendance(student).then(function (data) {
                        notify(data.msg);
                        $scope.iss.splice($index, 1);
                    }, function (data) {
                        notify(data.msg || 'error');
                    });

                });


            };
        }]);
}(angular.module('Argus')));

