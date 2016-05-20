/* global angular */

(function (app) {
    app
        .controller("ProfileCtrl",
            ["$scope", "StudentsService", "$http", '$rootScope', 'ProfessorClassesService', 'RoomsService', 'ClassStudentsService', 'notify',
                function ($scope, students, $http, $rootScope, professorclasses, rooms, ClassStuSer, notify) {
                    $scope.schedule = []; // holds  student's schedule
                    $scope.activities = []; // holds student'activities
                    $scope.checks = [];
                    $scope.currentDate = new Date();
                    $scope.classes = professorclasses.query();

                    $scope.$watch('checks', function (n, o) {
//			console.log(n);
                    }, true);
                    $scope.role = $rootScope.currentUser.role;
                    $scope.downloadActivity = function () {
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


                        download(text, $scope.student);
                    };
                    var download = function (text, student) {

                        //console.log(text);
                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURI(text));
                        element.setAttribute('download', 'ActivityFor-' + student.user.FirstName + '_' + student.user.LastName + '.csv');
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    };


                    //console.log($scope.student)// contains the student to display

                    $scope.$watch('student', function (newVal, oldVal) {

                        $scope.schedule = newVal.classes;
                        var parentName = newVal.GuardianName ? newVal.GuardianName.split(',') : ["No", " name"];
                        $scope.parents = [{
                            fn: parentName[0],
                            ln: parentName[1],
                            phone: newVal.GuardianPhone || "none",
                            mphone: 'None',
                            email: 'None'
                        }];

                        $scope.activities = newVal.user.activities_affected;

                    });

                    /*******************  Right Side Controllers*********************/
                    $scope.currentDate;
                    $scope.$watch("profileForm.date.$modelValue", function (newVal, oldVal) {
                        //console.info("date changedto :" + newVal)
                    });


                    $scope.showDetail = false;
                    $scope.toggleShowDetail = function (index) {
                        $scope.showDetail = !$scope.showDetail;
                        $scope.selected = $scope.activities[index];
                    };

                    $scope.showComment = false;
                    $scope.toggleShowComment = function (index) {
                        $scope.showComment = !$scope.showComment;
                        $scope.selected = $scope.activities[index];
                    };

                    $scope.addComment = function () {
                        var entry =
                        {
                            date: formatDate(new Date),
                            activity: "comment",
                            Comment: $scope.comment,
                            staff: $rootScope.currentUser.FirstName + ' ' + $rootScope.currentUser.LastName
                        };
                        $scope.activities.push(entry);
                        $scope.comment = '';
                    };

                    $scope.graduationYear = 2015 + (12 - parseInt($scope.student.Grade, 10));

                    function formatDate(date) {
                        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }

                    $scope.filter = [];
                    $scope.getActivities = function () {
                        return ($scope.activities || []).map(function (w) {
                            return w.activity.Name;
                        }).filter(function (w, idx, arr) {
                            return arr.indexOf(w) === idx;
                        });
                    };

                    $scope.filterByCategory = function (act) {
                        return $scope.filter[act.activity.Name] || noFilter($scope.filter);
                    };
                    // date selected on the checkboxes;
                    function noFilter(filterObj) {
                        for (var key in filterObj) {
                            if (filterObj[key]) {
                                return false;
                            }
                        }
                        return true;
                    }

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
                    $scope.submitContactChange = function(){
                        students.update({id: $scope.student.Id, updateStudent: true}, {
                            GuardianName: $scope.student.GuardianNameCopy,
                            GuardianPhone: $scope.student.GuardianPhoneCopy,
                            GuardianMPhone: $scope.student.GuardianMPhoneCopy

                        },function(){
                            notify("Hooray! Parent Contact Updated!");
                            $scope.student.GuardianName = $scope.student.GuardianNameCopy;
                            $scope.student.GuardianPhone = $scope.student.GuardianPhoneCopy;
                            $scope.student.GuardianMPhone = $scope.student.GuardianMPhoneCopy;
                            $scope.student.contactEdit = false;
                        },function(error){
                            notify("Ops! Something went wrong, please try again");
                        });
                    };
                    $scope.cancelContactChange = function(){
                        $scope.student.contactEdit = false;
                    };
                }]);

}(angular.module('Argus')));