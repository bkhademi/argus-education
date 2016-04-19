(function (app) {
    app.controller('ParentMeetingCtrl', ['$scope', 'OSSService', '$modal', 'ISSFollowupService', 'notify',
        function ($scope, osss, $modal, issfs, notify) {
            $scope.refTable = osss.getParentMeetingList();


            $scope.ossAttendance = function (referral, $index) {
                if (!referral.Date || !referral.NewDate) {
                    promptForParentMeetingInfo(referral, $index);
                } else {


                    var modalInstance = $modal.open({
                        templateUrl: 'views/modals/parentMeetingAttendaceModal.html',
                        //template:'<div> MODAL : true in Referral IN </div>',
                        size: 'lg',
                        controller: function ($scope, referral, teachers) {
                            $scope.referral = referral;
                            $scope.currentDate = new Date();
                            $scope.teachers = teachers.query();
                            $scope.$watch('form.date.$viewValue', function (newV, oldV) {
                                referral.date = newV ? newV : oldV;
                                console.log(newV);
                            });
                        },
                        resolve: {
                            referral: function () {
                                return referral;
                            }
                        }
                    });

                    modalInstance.result.then(function (data) {// submit attendance modal
                        osss.updateParentMeetingAttendance(referral).then(function(data){
                            notify(data.msg);
                            //$scope.refTable.splice($index,1);
                        }, function(data){
                            notify(data.msg);
                        });
                            return;
                        switch (referral.ActivityTypeId) {


                            case '1':
                                osss.update
                                counters.update({id: referral.student_user.id},
                                    {
                                        counters: referral.student_user.student.counters,
                                        Comment: referral.comment
                                    }, function () {
                                        notify('success');
                                        osss.update({id: referral.Id},
                                            {OssPresent: true});

                                    }, function (error) {
                                        notify('error');
                                    });
                                break;
                            case '2':
                                osss.update({id: referral.Id},
                                    {
                                        Comment: referral.comment
                                    }, function (data) {
                                        notify(data.msg);
                                    }, function (error) {
                                        notify('error');
                                    });
                                break;
                            case '3':
                                isss.update({id: referral.Id, followup: true}, {
                                    Date: referral.date,
                                    Time: referral.time,
                                    ActionType: 46,
                                    Comment: referral.comment,
                                    StudentId: referral.StudentId,
                                    TeacherId: referral.teacher.id
                                }, function (data) {
                                    notify(data.msg);
                                    $scope.oss.splice($index, 1);
                                }, function (error) {
                                    notify('error');
                                });
                                break;
                        }
                        $scope.oss.splice($index, 1);
                    });
                }

            };

            function promptForParentMeetingInfo(referral, $index) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/modals/ParentMeetingInfoModal.html',
                    size: 'lg',
                    controller: function ($scope, student, teachers) {
                        $scope.student = student;
                        $scope.currentDate = new Date();
                        $scope.teachers = teachers.query();
                        $scope.$watch('suspension.date.$viewValue', function (newV, oldV) {
                            student.dateOfSuspension = newV ? newV : oldV;
                            console.log('suspensionDate', newV);
                        });
                        $scope.$watch('meeting.date.$viewValue', function (newV, oldV) {
                            student.meetingDate = newV ? newV : oldV;
                            console.log('meetingDate', newV);
                        });
                    },
                    resolve: {
                        student: function () {
                            return referral;
                        }
                    }
                });
                modalInstance.result.then(function (data) {// on modal submit
                    //debugger;
                    osss.updateParentMeetingInformation(referral).then(function (data) {
                        notify(data.msg);
                    }, function (data) {
                        notify(data.msg || 'error');
                    });
                });
            }

        }])

}(angular.module('Argus')));
