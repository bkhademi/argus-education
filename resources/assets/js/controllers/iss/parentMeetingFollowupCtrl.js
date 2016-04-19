
(function(app){
    app.controller('ParentMeetingFollowupCtrl',['$scope','OSSFollowupService','notify','$modal', function($scope, ossfs, notify,$modal){
        $scope.refTable = ossfs.getList();

        $scope.setParentMeeting = function(referral,$index){
            // some checks

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/ParentMeetingInfoModal.html',
                //template:'<div> MODAL : true in Referral IN </div>',
                size: 'lg',
                controller: function ($scope, student, teachers) {
                    $scope.student = student;
                    $scope.currentDate = new Date();
                    $scope.teachers = teachers.query();
                    $scope.$watch('suspension.date.$viewValue', function (newV, oldV) {
                        student.dateOfSuspension = newV ? newV : oldV;
                    });
                    $scope.$watch('meeting.date.$viewValue', function (newV, oldV) {
                        student.meetingDate = newV ? newV : oldV;
                    });
                },
                resolve: {
                    student: function () {
                        return referral;
                    }
                }
            }); // end modal instance

            modalInstance.result.then(function(data){ // on modal submit
                ossfs.updateParentMeetingInformation(referral).then(function(data){
                    notify(data.msg);
                    $scope.refTable.splice($index,1);
                }, function(data){
                    notify('error');
                })
            });
        };
    }]);
}(angular.module('Argus')));