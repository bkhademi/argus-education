/* A-G Controller */
(function (app) {
    app.controller("A-GCtrl", ["$scope", "$http", function ($scope, $http) {
        $scope.tabs = [
			{ id: 'Referal System', text: ['Referal', 'System'], route: 'views/tables/referal.html', icon: 'eye' },
			{ id: 'Referal System', text: ['Referal', 'System'], route: 'views/tables/referal.html', icon: 'eye' },
			{ id: 'Referal System', text: ['Referal', 'System'], route: 'views/tables/referal.html', icon: 'eye' }
		];
        $scope.tog = -1;
        $scope.navShow = false;
        $scope.click = function (index) {
            $scope.tog = index;
            $scope.navShow = true;
        };
        $scope.toggleNav = function () {
            $scope.navShow = !$scope.navShow;
        };
    }])

}(angular.module("Argus")));
/*  A-GProfile Controller */
(function (app) {
    app
    .controller("A-GProfileCtrl", ["$scope","$modal", function ($scope,$modal) {
        /*  Grab All information from database */
        $scope.showMain = true;
        // left-side
        $scope.schedule = [
            { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'A' },
            { period: 1, className: "Advanced Math II", teacher: "Mr. Brandon", room: 'A' },
            { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'B' },
            { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'B+' },
            { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'C' },
            { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'C-' }
        ];
        $scope.colors = ['bg-green', 'bg-warning', 'bg-danger'];
        $scope.parents = [
            { Fn: "Max", ln: "Quinteros", phone: "6192451818", mphone: "", email: "parent@argus.com" },
            { Fn: "Max", ln: "Quinteros", phone: "6192451818", mphone: "", email: "max@argus.com" }
        ];
   
        $scope.showComment = false;
        $scope.toggleShowComment = function () {
            $scope.showComment = !$scope.showComment;
        };

        $scope.filter = [];
        $scope.getActivities = function () {
            return ($scope.activities || []).map(function (w) {
                return w.activity;
            }).filter(function (w, idx, arr) {
                return arr.indexOf(w) === idx;
            });
        };
        $scope.filterByCategory = function (act) {
            return $scope.filter[act.activity] || noFilter($scope.filter);
        }// date selected on the checkboxes;
        function noFilter(filterObj) {
            for (var key in filterObj) {
                if (filterObj[key]) {
                    return false;
                }
            }
            return true;
        }

     

        $scope.delightScore = 4;//???

        $scope.adminComments = [
            { date: "05-15-2015", comment: "brandon is misbehaving", author: "adrian" },
            { date: "05-15-2015", comment: "brandon is misbehaving", author: "adrian" },
            { date: "05-15-2015", comment: "brandon is misbehaving", author: "adrian" },
            { date: "05-15-2015", comment: "brandon is misbehaving", author: "adrian" },
            { date: "05-15-2015", comment: "brandon is misbehaving", author: "adrian" },
        ];
    }])
    .controller('RadialGaugeA-G1', ['$scope', function ($scope) {
        $scope.overallScore = 45;
        $scope.gpaScore = 55;
        $scope.agScore = 78;
        $scope.satActScore = 10;
        $scope.extraScore = 25;
        $scope.value = 3.5;
        $scope.upperLimit = 4;
        $scope.lowerLimit = 0;
        $scope.unit = " pts ";
        $scope.precision = 2;
        $scope.ranges = [
            {
                min: 0,
                max: 1.5,
                color: '#DEDEDE'
            },
            {
                min: 1.5,
                max: 2.5,
                color: '#8DCA2F'
            },
            {
                min: 2.5,
                max: 3.5,
                color: '#FDC702'
            },
            {
                min: 3.5,
                max: 4.0,
                color: '#FF7700'
            },

        ];
    }])
       
}(angular.module("Argus")));
/*  APTesting Controller */
(function (app) {
    app
    .controller("APTestingCtrl", ["$scope", "$http", function ($scope, $http) {

    }])
}(angular.module("Argus")));
/*  PrintAssignments Controller */
(function (app) {
    app
    .controller("printAssignmentsController", ["$scope","$http", function ($scope, $http) {
            $scope.printAssignments = function(){
                var ids =[];
                var date = $scope.currentDate;
                for(var i = 0; i < $scope.refTable.length; i++)
                    ids.push($scope.refTable[i].ID);
            $http.post(api+'printAssignments/', {'ids': ids, 'date':date}).then(function(response){
                console.log(response);
            },function(response){
                console.log(response);
            })
        }

    }])

}(angular.module("Argus")));
/*  FileManager Controller */
(function (app) {
    var fileManagerController = function ($scope,fileUpload, assignmentsService) {
        $scope.dropzoneConfig = {
            maxFileSize:10,
            
            options: {// passed into the Dropzone constructor
                url: api+'assignments',
                paramName:"file",
                acceptedFiles: "application/pdf",
                uploadMultiple: false,
                headers: { 'UserID': '00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b' }

            },
            eventHandlers: {
                success: function (file, response) {
                    $scope.refreshFiles();
                },
            },
            
        }; // end dropzoneConfig


        $scope.refreshFiles = function () {
           $scope.files = assignmentsService.query();
        }

        $scope.deleteFile = function (file) {
            assignmentsService.remove({id:file.Name}, function(){
                for(var i = 0; i < $scope.files.length; i++){
                    if(file.Name === $scope.files[i].Name){
                        $scope.files.splice(i,1);
                        break;
                    }
                }
            });
        }

        $scope.openFile = function (file) {
            assignmentsService.pdf({id:file.Name}, function(data){
                console.log(data);
                var fileURL = URL.createObjectURL(data.response);
                window.open(fileURL);
            })
            
        }

        $scope.submitSingleFile = function () {
            //alert(submiting);
            var file = $scope.myFile;
            console.log($scope.myFile);
            return;
            var uploadUrl = api+"assignments";
            fileUpload.uploadFileToUrl(file, uploadUrl);

        };

        $scope.refreshFiles();
    };

    fileManagerController.$inject = ["$scope","fileUploadService", "assignmentsService"];

    app
        .controller("fileManagerController", fileManagerController)



}(angular.module("Argus")));
/*  ManageAEC Controller */
(function (app) {
    app
    .controller("manageAECController", ["$scope",  "$filter", "$modal", "referrals","PassesService","StudentsService","notify",
	function ($scope,  $filter, $modal,  referrals,  passes,students, notify) {
        $scope.AEC = true;
		$scope.selected = {};
        $scope.selected2; // student input field model
        $scope.selected3; // 
        $scope.refTable = [];// table model
        $scope.currentDate = new Date();
        $scope.currentUser = "Montes"
        $scope.selectedStudent;

		$scope.getPasses = function(){
			passes.pdf({date:$scope.currentDate}, function(data){
				console.log(data);
				var fileURL = URL.createObjectURL(data.response);
				window.open(fileURL);
			})
			
		};

        $scope.$watch('form.date.$viewValue', function (newVal) {
            
            if (newVal) {//when date has a valid date request the List from that date
                $scope.currentDate = newVal;
                console.log("newVal = " + $scope.form.date.$viewValue);
				
				//var data = ServerDataModel.getAECList(formatDate(newVal));
				var valids = [];
                $scope.refTable = referrals.query({id:newVal},function(data){
					// adjust the returned referrals 
				   for(var i = 0; i < data.length ; i++){
					   for(var j = 0 ; j < data[i].referred.length ; j++){
						   data[i].referred[j].id = data[i].referred[j].Id;
						   angular.extend(data[i].referred[j], data[i].referred[j].assignment);
						
					   }
					   if(data[i].referred.length !== 0 ){
							valids.push(data[i])
					   }
					   
					   data[i].student.ParentNotified = data[i].student.ParentNotified==="1"?true:false;
					   data[i].student.Notified = data[i].student.Notified==="1"?true:false;
					   
				   }
				   console.log(valids);
				   valids.$promise = data.$promise;
				   valids.$resolved = data.$resolved;
				   data = valids;
					 if (!data.length) {
						$scope.refTable = [];
						alert("No students for current date");

					} else {
						console.log(data);
						$scope.refTable = data;
						$scope.passesTable = data;
						angular.forEach($scope.refTable, function (student) {
							student.status = [false,true];
						})
					}
				});
            }
        });

		
		var download = function (text) {
			
            //console.log(text);
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'info.csv');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
		$scope.AECListCSV = function(){		
			var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Assignment\n';
			angular.forEach($scope.refTable,  function(item){
				angular.forEach(item.referred, function(referred){
					text +=    referred.user.FirstName +', ' + referred.user.LastName+","+item.FirstName + ',' + item.LastName + ',' + item.student.StudentId;
					text +=   item.student.Grade +', '+ referred.assignment.Name;  
					text +=  ' \n';
				});
			})
			download(text);
		};
		
		
        /******** MANAGE AEC **********/
        // for the next submit functions remove student from list self-reducing list
        var submitPresent = function (data) {
            // get assignments info from the checkboxes
			var student = data.student;
//            var completedAssignments = [];
//            angular.forEach(student.referred, function (item) {
//                if (item.selected)
//                    completedAssignments.push({ assignmentId: item.Id, referralId:item.id });
//            })
            // submit information of student  '$scope.selected.student'  to the database
			angular.forEach(student.referred, function(item){
				referrals.update({'param':'present','id':item.id, 'Reprint':item.reprint, 'Completed':item.selected},{data:item}, function(response){
					
				}, function(response){
					notify({message: "Present Submited Successfully",
					classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
				});
			})
			//referrals.update({'param':'present','id':student.id},{ data:completedAssignments });
            
            //remove element from table; backend works the logic for completeness and incompleteness
            // and to put the student in AEC Absence list// here or on backend
			removeSelectedStudentFromTableAndClear();
        };

        var submitReschedule = function (data) {
            // get info from comment box and DatePicker       
            // submit information of student '$scope.selected.student' to the database
			var student = data.student;
			angular.forEach(student.referred, function(item){
				referrals.update({
					param:'reschedule',
					comment:data.comment,
					excused:data.excused,
					newDate:data.date,
					oldDate:$scope.currentDate,
					id:item.id},{data:item}, function(response){
					console.log(response);
				});
			});

            removeSelectedStudentFromTableAndClear();
        };

		var submitClear = function (data) {
			
			// submit information of student '$scope.selected.student' to the database
			referrals.update({param:'clear', comment:data.comment, id:data.student.referred[0].id}, data)
            //remove element from table; backend works the logic for completeness and incompleteness
            // and to put the student in AEC Absence list// here or on backend
			removeSelectedStudentFromTableAndClear();
        };

        var submitParentNotified = function (data) {
            var rescheduleComment = "Parent Requested Reschedule";
            console.log(data.student);
			

            // Remove Student if reschedule
            if (data.reschedule) {
                // sent a post to the reschedule api point
				angular.extend(data,{comment:rescheduleComment,excused:true, oldDate:$scope.currentDate})
				$scope.selected.student = data.student;
				submitReschedule(data);
				
            }else{
				// Make A post to update the student parent's information 
				var student = data.student.student;
				
				students.update({id:data.student.id}, {
					ParentNotified:student.ParentNotified?1:0,
					ParentNotifiedComment:student.ParentNotifiedComment,
					ValidNumber:student.ValidNumber?1:0,
					ParentSupportive:student.ParentSupportive?1:0,
					GuardianPhone : student.GuardianPhone
				});
				
				
			}
            
           
        }
		
		$scope.submitStudentNotified = function(ref, $index){
			
			var studentNotified =ref.student.Notified;
			students.update({id:ref.id}, {Notified:!studentNotified?1:0},function(response){
				console.log(response);
			})
			console.log($scope.refTable[$index]);
		};
		
		$scope.finishManageAEC = function(){
			angular.forEach($scope.refTable, function(student){
				angular.forEach(student.referred, function(assignment){
					referrals.update({'id':assignment.id},
					{'param':'absent' })
				});
			});
			$scope.refTable = [];
		}
        /********** MODALS   **********/
		/*** select the student that's clicked so that user doesn't have to type *******/
		$scope.onSelect = function($index){
			$scope.selected.student = $scope.refTable[$index];
		};
		
        /* Present Modal  */
        $scope.openPresent = function () {
            var modalInstance = $modal.open({
                templateUrl: 'views/modals/PresentModal.html',
                size: 'md',
                controller: function ($scope, student) {
                    $scope.student = student;
					$scope.changedStatus = function(){
						alert(item.accepted);
					}
                },
                resolve: { // variables that get injected into the controller (taken from current $scope)
                    student: function () { return $scope.selected.student; },
                }
            }) // End modalInstace

            modalInstance.result.then(submitPresent, function(){
				
			});

        }

        /* Reschedule Modal */
        $scope.openReschedule = function () {
            var resModal = $modal.open({
                templateUrl: 'views/modals/RescheduleModal.html',
                size: 'md',
                controller: function ($scope, student) {
                    $scope.student = student;
                    $scope.date = new Date();
                    
                    $scope.$watch('form.date.$viewValue', function (newValue, oldValue) {
                        if (newValue){ //when date has a valid date request the List from that date
                            $scope.date = newValue;
                            console.log('date changed');
                        }
                    })

                },
                resolve: {
                    student: function () { return $scope.selected.student; },
                }
            });// end modalInstance

            resModal.result.then(submitReschedule);
        }

        /* Clear Modal */
        $scope.openClear = function (studentInfo) {
           
            var clrModal = $modal.open({
                templateUrl: 'views/modals/ClearModal.html',
                size: 'md',
                controller: function ($scope, student ) {
                    $scope.student = student;
                    $scope.title = 'clear'
                },
                resolve: {
                    student: function () { return $scope.selected.student; }
                }
            })// End clrModal

            clrModal.result.then(submitClear)
        }

		/* Parent Notified Modal */
        $scope.parentNotifiedModal = function (stu) {
            var parentModal = $modal.open({
                templateUrl: "views/modals/ParentModal.html",
                size: 'md',
                controller: function ($scope, $modalInstance, student,date) {
                    $scope.student = student;
                    $scope.date = date;

                    $scope.$watch('form.date.$viewValue', function (newValue) {
                        if (newValue) { //when date has a valid date request the List from that date
                            $scope.date = newValue;
                        }
                    })
                    

                    // Restore the parent notified button 
                    $scope.cancel = function () {
						debugger;
                        $scope.student.student.parentNotified = false;
                        $modalInstance.dismiss('cancel');
                    }
                    $scope.submit = function () {
                        
                        $modalInstance.close(
							{student:$scope.student,
							reschedule:$scope.reschedule,
							newDate:$scope.date});
                    }
                },
                resolve: {
                    student: function () { return stu },
                    date: function(){return $scope.currentDate}
                }
            })// end modal

            parentModal.result.then(submitParentNotified,
				function () {
					// change parent notified button it back to what it was
					stu.student.ParentNotified = !stu.student.ParentNotified;
				});

        }
		
		var removeSelectedStudentFromTableAndClear = function(){
				for (var i = 0; i < $scope.refTable.length; i++)
					if ($scope.selected.student.id === $scope.refTable[i].id){
						$scope.refTable.splice(i, 1);
						break;
					}
				$scope.selected.student = null;
			}
    
	}])
}(angular.module("Argus")));
/*  ManageAECAbsence Controller */
(function (app) {
    app
    .controller("manageAECAbsenceController", 
	["$scope",  "$modal", "referrals","PassesService","UserActionsService",
	function ($scope, $modal,referrals, passes, useractions) {
        $scope.selected = {};
        $scope.refTable = [];// table model
        $scope.currentDate = new Date(); // date on the date picker

        $scope.$watch('form.date.$viewValue', function (newVal, oldVal) {

            if (newVal) {//when date has a valid date request the List from that date
                $scope.currentDate = newVal;
                console.log("newVal = " + $scope.form.date.$viewValue);
				
                referrals.query({id:newVal, absence:true},function(data){
					
					if (!data.length) {
						$scope.refTable = [];
						alert("No students for current date");

					} else {
						$scope.refTable = data;
						$scope.passesTable = data;
						angular.forEach($scope.refTable, function (student) {

							student.status = [false, true];

						})
					}
				})
            }
        });
      

		$scope.getPasses = function(){
			$scope.getPasses = function(){
				passes.pdf({date:$scope.currentDate, param:'absence'}, function(data){
					console.log(data);
					var fileURL = URL.createObjectURL(data.response);
					window.open(fileURL);
				})
			};
		}
 
	 /*** select the student that's clicked so that user doesn't have to type *******/
		$scope.onSelect = function($index){
			$scope.selected.student = $scope.refTable[$index];
		};
		var download = function (text) {
			
            //console.log(text);
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'info.csv');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
		$scope.oRoomListCSV = function(){
			useractions.query({param:'ORoom'}, function(data){
				//headings
				var text = 'FirstName,LastName,StudentId\n';
				angular.forEach(data,  function(item){
					text +=  item.student.FirstName + ',' + item.student.LastName + ',' + item.student.UserName;
					
					text +=  ' \n';
				})
				download(text);
			})
		};
		
        /******** MANAGE AEC Absence **********/
        var submitReschedule = function (data) {
            console.log(data);

            AECListService.reschedule(data.comment, data.dateOld, data.dateNew, $scope.selected2);
            // get info from comment box and DatePicker       
            var indexOfStudent = $scope.refTable.indexOf($scope.selected2);
            $scope.refTable.splice( indexOfStudent,1)
            $scope.selected2 = '';
            $scope.comment = '';
        };

        var submitComment = function (data) {// data:{comment, noShow, walkOut, sentOut}
		debugger;
			var student = $scope.selected.student;
			var status = data.noShow?0:data.walkOut?1:data.sentOut?2:data.schoolAbsent?3:data.disciplinary?4:data.clear?5:-1;
			
            // submit info of student '$scope.selected.student' to database
			var dataToSent = {param:'AbsentComment', comment:data.comment, status:status}
			referrals.update({id:student.id}, dataToSent);
			
            var indexOfStudent = $scope.refTable.indexOf($scope.selected.student);
            $scope.refTable.splice(indexOfStudent, 1);
            $scope.selected.student = null;
        }

        /********** MODALS   **********/
        /* Reschedule Modal */
        $scope.openReschedule = function (studentInfo) {
            var resModal = $modal.open({
                templateUrl: 'views/modals/RescheduleModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, date) {
                    $scope.student = student;
                    $scope.date = date;
                    $scope.$watch('form.date.$modelValue', function (newValue, oldValue) {
                        if (newValue) {
                            $scope.date2 = newValue;
                            console.log("dateupdated");
                        }
                    })

                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ dateOld: $scope.date ,dateNew:$scope.date2, comment: $scope.comment });
                    }
                },
                resolve: {
                    student: function () { return $scope.selected2; },
                    date: function () { return $scope.currentDate; }
                }
            });// end modalInstance

            resModal.result.then(submitReschedule, function () {
                console.info('Modal dismised at:' + new Date());
            });
        }

        /* Comment Modal */
        $scope.openComment = function (studentInfo) {
            var commentModal = $modal.open({
                templateUrl: 'views/modals/CommentAbsenceModal.html',
                size: 'md',
                controller: function ($scope, student) {
					console.log(student)
                    $scope.title = "Comment";
                    $scope.student = student;
                },
                resolve: {
                    student: function () { return $scope.selected.student; },
                }
            })// End commentModal

            commentModal.result.then(submitComment)
        }

    }])
}(angular.module("Argus")));
/*  ManageARC Controller */
(function (app) {
    app
    .controller("ManageARCCtrl", ["$scope", "$modal", "ARCListService", "ARCAbsenceListService", "studentsService", "ServerDataModel", function ($scope, $modal, ARCListService, ARCAbsenceListService, studentsService, ServerDataModel) {
        $scope.selected2; // student input field model
        $scope.selectedStudent; // object of the student selected in the input field
        $scope.currentDate = new Date(); // date selected on the datePicker
        $scope.refTable = []; //model for table
        $scope.presentList = []; // list containing the students that were present the first time
        $scope.currentUser = "Corona";

        $scope.currentDate = new Date(); // date on the date picker

        $scope.$watch('form.date.$modelValue', function (newVal, oldVal) {

            if (newVal) {//when date has a valid date request the List from that date
                $scope.currentDate = newVal;
                console.log("newVal = " + $scope.form.date.$viewValue);
                var data = ServerDataModel.getARCList(formatDate(newVal));
                if (!data) {
                    $scope.refTable = [];
                    alert("No students for current date");

                } else {
                    $scope.refTable = data
					angular.forEach($scope.refTable, function (student) {

                        student.status = [false, true];
                    })
                }
            }
        });


        /*************** get Initial Page Data From Server **************/
        // get today's ARC List
        /*
        ARCListService.get()
            .success(function (data) {
                if (data == null)
                    console.warn("no ARC List for current date" + $scope.currentDate);
                else
                    $scope.refTable = data;
            });
        */
        //$scope.refTable = ServerDataModel.getARCList(formatDate(new Date));
   



        $scope.secondAttendance = false;
        $scope.lastSubmit = false;

        $scope.onSelect2 = function (item, model, label) {
            $scope.selectedStudent = item;
            $scope.selected2 = item.fn + '   ' + item.ln + '   ' + item.ID + '   ' + item.GR
        }
        /******** MANAGE ARC **********/
        $scope.submit = function () {
            if ($scope.secondAttendance) {
                $scope.secondSubmit();
                $scope.lastSubmit = true;
            } else {
                $scope.firstSubmit();
                $scope.secondAttendance = true;
            }
        }

        $scope.firstSubmit = function () {
            /// do somehing with the data for the first present (move students that were not present to the absent list
            for (var i = 0; i < $scope.refTable.length; i++)
                ARCAbsenceListService.save($scope.currentDate, $scope.refTable[i])

            // now list shown should be the students thatt were present the first time
            $scope.refTable = $scope.presentList.concat();
            $scope.presentList = [];

        }

        $scope.secondSubmit = function () {
            //send students that were cleared to the database ? or send 1 by 1 as they are being selected
            for (var i = 0; i < $scope.presentList.length; i++) {
                ARCListService.clear("ARC Completed", $scope.currentDate, $scope.currentUser, $scope.presentList[i]);
            }
        }

        $scope.reset = function () {// demo purposes
            $scope.secondAttendance = false;
            $scope.lastSubmit = false;
        }

        $scope.present = function (student) {
            var indexOfStudent = $scope.refTable.indexOf(student);
            if (indexOfStudent == -1) {
                alert("please input a valid student ")
                return; s
            }
            $scope.presentList.push(student);
            $scope.refTable.splice(indexOfStudent, 1);
            $scope.selected2 = ''

        }

        // reschedule for tomorrow ?
        $scope.ditched = function () {
            var newDate = new Date();
            newDate.setDate(newDate.getDate + 1);

            ARCListService.reschedule("Student Ditched ARC - automatic Reschedule for " + newDate.getDate(), $scope.currentDate, newDate, $scope.currentDate, $scope.selectedStudent);

            var idx = $scope.refTable.indexOf($scope.selectedStudent);
            $scope.refTable.splice(idx, 1);
            $scope.selected2 = '';
        }


        var submitReschedule = function (data) {
            // get info from comment box and DatePicker       
            // submit information of student 'selected2' to the database
            ARCListService.reschedule(data.comment, $scope.currentDate, data.date, $scope.currentUser, $scope.selectedStudent);

            var idx = $scope.refTable.indexOf($scope.selectedStudent);
            $scope.refTable.splice(idx, 1);

            $scope.selected2 = '';
        };

        var submitClear = function (data) {

            // submit info of student 'selected2' to database
            ARCListService.clear(data.comment, $scope.currentDate, $scope.currentUser, $scope.selectedStudent)

            var idx = $scope.refTable.indexOf($scope.selectedStudent);
            $scope.refTable.splice(idx, 1);

            $scope.selected2 = '';
        }

        var other = function (data) {
            var newDate = new Date();
            newDate.setDate(newDate.getDate + 1)

            ARCListService.reschedule(data.comment, $scope.currentDate, newDate, $scope.currentUser, $scope.selectedStudent)

            var idx = $scope.refTable.indexOf($scope.selectedStudent);
            $scope.refTable.splice(idx, 1);
            $scope.selected2 = '';
        }

        var submitParentNotified = function (data) {
            var rescheduleComment = "Parent Requested Reschedule";
            console.log(data.student);



            // Remove Student if reschedule
            if (data.reschedule) {
                alert("rescheduled")
                // sent a post to the reschedule api point

                // this works because student in the modal was just a reference to the same object
                var idx = $scope.refTable.indexOf(data.student);
                $scope.refTable.splice(idx, 1);
            }


        }

        /********** MODALS   **********/
        /* Reschedule Modal */
        $scope.openReschedule = function (studentInfo) {
            var resModal = $modal.open({
                templateUrl: 'views/modals/RescheduleModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, date) {
                    $scope.student = student;
                    $scope.date = date;
                    $scope.$watch('form.date.$modelValue', function (newValue, oldValue) {
                        if (newValue) {
                            $scope.date2 = newValue;
                            console.log("dateupdated");
                        }
                    })

                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ date: $scope.date,date2:$scope.date2, comment: $scope.comment });
                    }
                },
                resolve: {
                    student: function () { return $scope.selectedStudent; },
                    date: function () { return $scope.currentDate; }
                }
            });// end modalInstance

            resModal.result.then(submitReschedule, function () {
                console.info('Modal dismised at:' + new Date());
            });
        }



        /* Clear Modal */
        $scope.openClear = function (studentInfo) {
            var clrModal = $modal.open({
                templateUrl: 'views/modals/ClearModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, title) {
                    $scope.student = student;
                    $scope.title = title

                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ comment: $scope.comment });
                    }
                },
                resolve: {
                    student: function () { return $scope.selectedStudent; },
                    title: function () { return "Clear" }
                }
            })// End clrModal

            clrModal.result.then(submitClear, function () {
                console.info('modal dismissed at' + new Date());
            })
        }

        /* Other Modal */
        $scope.openOther = function (studentInfo) {
            var clrModal = $modal.open({
                templateUrl: '/Client/Views/modals/ClearModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, title) {
                    $scope.student = student;
                    $scope.title = title

                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ comment: $scope.comment });
                    }
                },
                resolve: {
                    student: function () { return $scope.selectedStudent; },
                    title: function () { return "Other" }
                }
            })// End clrModal

            clrModal.result.then(other, function () {
                console.info('modal dismissed at' + new Date());
            })
        }

        /* Parent Notified Modal */
        $scope.parentNotifiedModal = function (stu) {
            var parentModal = $modal.open({
                templateUrl: "views/modals/ParentModal.html",
                size: 'md',
                controller: function ($scope, $modalInstance, student, date) {
                    $scope.student = student;
                    $scope.date = date;

                    $scope.$watch('form.date.$modelValue', function (newValue, oldValue) {
                        if (newValue) { //when date has a valid date request the List from that date
                            $scope.currentDate = newValue;
                            console.log('date changed');
                        }
                    })


                    // Restore the parent notified button 
                    $scope.cancel = function () {
                        $scope.student.status[0] = false;
                        $modalInstance.dismiss('cancel');
                    }
                    $scope.submit = function () {

                        $modalInstance.close({ student: $scope.student, reschedule: $scope.reschedule, newDate: $scope.date });
                    }
                },
                resolve: {
                    student: function () { return stu },
                    date: function () { return $scope.currentDate }
                }
            })// end modal

            parentModal.result.then(submitParentNotified, function () { console.log("dismiss"); });

        }

    }])
}(angular.module("Argus")));
/*  ManageARCAbsence Controller */
(function (app) {
    app
    .controller("manageARCAbsenceController", ["$scope", "studentsService", "ARCListService", "$filter", "$modal", "ServerDataModel", function ($scope, studentsService, ARCListService, $filter, $modal, ServerDataModel) {
        $scope.selected2; // student input field model
        $scope.selected3; // 
        $scope.refTable = [];// table model
        $scope.currentDate = new Date(); // date on the date picker

        $scope.$watch('form.date.$modelValue', function (newVal, oldVal) {

            if (newVal) {//when date has a valid date request the List from that date
                $scope.currentDate = newVal;
                console.log("newVal = " + $scope.form.date.$viewValue);
                var data = ServerDataModel.getARCList(formatDate(newVal));
                if (!data) {
                    $scope.refTable = [];
                    alert("No students for current date");

                } else {
                    $scope.refTable = data
					angular.forEach($scope.refTable, function (student) {

                        student.status = [false, true];
                    })
                }
            }
        });


             // get today's ARC List 
        /*
        ARCListService.get()
            .success(function (data) {
                //console.log(data);
                if (data === null) {
                    console.warn("no ARC Absence List for current date:  " + new Date)
                    
                    return;
                }
                $scope.refTable = data;
            })
        */
        //$scope.refTable = ServerDataModel.getARCList(formatDate(new Date));
        /******** MANAGE ARC **********/
        var submitReschedule = function (data) {
            console.log(data);

            ARCListService.reschedule(data.comment, data.date,data.date2, $scope.selected2);
            // get info from comment box and DatePicker       
            // submit information of student 'selected2' to the database
            $scope.selected2 = '';
            $scope.comment = '';
        };

        var submitComment = function (data) {
            console.log(data);// data,comment to obtain inputed comment

            // submit info of student 'selected2' to database
            $scope.selected2 = '';
        }

        /********** MODALS   **********/
        /* Reschedule Modal */
        $scope.openReschedule = function (studentInfo) {
            var resModal = $modal.open({
                templateUrl: 'views/modals/RescheduleModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, date) {
                    $scope.student = student;
                    $scope.date = date;

                    $scope.$watch('form.date.$modelValue', function (newValue, oldValue) {
                        if (newValue) {
                            $scope.date2 = newValue;
                            console.log("dateupdated");
                        }
                   })

                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ date: $scope.date, date2:$scope.data2, comment: $scope.comment });
                    }
                },
                resolve: {
                    student: function () { return $scope.selected2; },
                    date: function () { return $scope.currentDate; }
                }
            });// end modalInstance

            resModal.result.then(submitReschedule, function () {
                console.info('Modal dismised at:' + new Date());
            });
        }

        /* Comment Modal */
        $scope.openComment = function (studentInfo) {
            var commentModal = $modal.open({
                templateUrl: 'views/modals/ClearModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, title) {
                    $scope.title = title
                    $scope.student = student;

                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ comment: $scope.comment });
                    }
                },
                resolve: {
                    student: function () { return $scope.selected2; },
                    title: function () { return "Comment" }
                }
            })// End commentModal

            commentModal.result.then(submitComment, function () {
                console.info('modal dismissed at' + new Date());
            })
        }



    }])
}(angular.module("Argus")));
/*  ManageSaturdaySchool Controller */
(function (app) {
    app
    .controller("manageSaturdaySchoolController", ["$scope", "studentsService", "$http", function ($scope, studentsService, $http) {
        $scope.refTable = []

        studentsService.getAll()
            .success(function (data) {
                $scope.refTable = data;
                putDates($scope.refTable);
                fillSD($scope.refTable);
            })
        $scope.refTable = [
          { ID: 1061201, fn: "ABARCA", ln: " ANTHONY", GR: 9 },
           { ID: 1044728, fn: "ABDULKADIR", ln: " FATIMA", GR: 10 },
            { ID: 1023650, fn: "ACEVES DOMINGUEZ", ln: " ROSALBA AIMEE", GR: 12 },
             { ID: 1024511, fn: "ACKERMAN", ln: " JASON EDWARD", GR: 12 },
             { ID: 1064877, fn: "ACOSTA ", ln: " ALEXXIS MARIE", GR: 10 },
             { ID: 1040249, fn: "ACUNA", ln: " ARLINE", GR: 11 },
             { ID: 1024574, fn: "ADAIR", ln: " JORDAN MARIE", GR: 12 },
        ];

        $scope.clearStudent = function (index) {
            $scope.refTable.splice(index, 1);

        }
        putDates($scope.refTable);
        fillSD($scope.refTable);

        $scope.printSheet = function () {
            $http.post("/pdf/PrintSaturdaySheet", '', { responseType: 'arraybuffer' })

            .success(function (data) {
                var file = new Blob([data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                $scope.content = fileURL;
            })
            .error(function (err) {
                alert(err);
            })
        }

        function fillSD(table) {
            angular.forEach(table, function (item) {
                item.SD = formatDate(new Date());
            })
        }


        // populate table cd with random dates 
        function putDates(table) {
            angular.forEach(table, function (item) {
                item.CD = formatDate(randomDate(new Date(2014, 0, 1), new Date));
            })
        }

        function formatDate(date) {
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        }

        function randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }




        // randomDate(new Date(2014, 0, 1), new Date())
    }])


}(angular.module("Argus")));
/*  MultiplePassesController Controller */
(function (app) {
    app
    .controller("MultiplePassesController", ["$scope", "studentsService", "$http", "ServerDataModel", function ($scope, studentsService, $http, ServerDataModel) {
        $scope.currentUser = "Mr Montes"; //person sending in this case
        /*
        studentsService.getAll()
            .success(function (data) {
             
                $scope.refTable = data;
            })
            */
        $scope.refTable = ServerDataModel.getStudents();



        $scope.whenToSend = ["At Once", "End of Period", "At Teacher's Convenience"];
        $scope.when; // index of when to send
        $scope.goto; // string of where to go

        $scope.onRadioSelect = function (index) {
            $scope.when = index;
        }
        $scope.applyAll = function () {
            angular.forEach($scope.refTable, function (item) {
                item.time = $scope.whenToSend[$scope.when];
                item.location = $scope.goto;
            })
        };
        $scope.applySelected = function () {
            angular.forEach($scope.refTable, function (item) {
                if (item.selected) {
                    item.time = $scope.whenToSend[$scope.when];
                    item.location = $scope.goto;
                }

            });
        }
        $scope.selectAll = function () {
            angular.forEach($scope.refTable, function (item) {
                item.selected = true;
            })
        };
        $scope.unselectAll = function () {
            angular.forEach($scope.refTable, function (item) {
                item.selected = false;
            })
        };
        $scope.invertSelection = function () {
            angular.forEach($scope.refTable, function (item) {
                item.selected = !item.selected
            })
        }

        $scope.generatePasses = function (table) {
            debugger
            $scope.refTable = table || $scope.refTable;
            if (table) {
                angular.forEach($scope.refTable, function (student) {
                    student.selected = true;
                })
            }
            var passInfo =  [];
            angular.forEach($scope.refTable, function (item) {
                if (item.selected)// print passes only for selected students 
                    passInfo.push(PassInfoFrom(item));
            });


            if (passInfo.length == 0  ) {
                alert("Please select at least 1 student");
                return;
            }
            
           

            console.log(passInfo);
            $http.post("/pdf/PassGenerator", passInfo, { responseType: 'arraybuffer' })
                .success(function (data) {
                    var file = new Blob([data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    $scope.content = fileURL;
                })

        };
        $scope.generateAssignments = function () {
            $http.post("/pdf/PrintAssignments", '', { responseType: 'arraybuffer' })
                .success(function (data) {
                    var file = new Blob([data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    $scope.content = fileURL;
                })

        }

        $scope.generatePass = function (student) {
            student.selected = true;
            $scope.refTable = [student]
            $scope.generatePasses();
        }

        // Get passInfo from a student object
        // elements of passInfo see. Models->PassInformation.cs
        function PassInfoFrom(student) {
            var d = new Date();
            var times = [false, false, false];
            for (var i = 0 ; i < $scope.whenToSend.length; i++)
                if (student.time === $scope.whenToSend[i])
                    times[i] = true;
            var date = "" + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
            return { Name: student.fn + " " + student.ln, Grade: student.GR, RoomInNow: "abc123", Period: 5, Date: date, AtOnce: times[0], EndOfPeriod: times[1], AtTeachersConvenience: times[2], GoTo: student.location, PersonSending: $scope.currentUser };


        }

        var a = [{ Name: "Towers Gerard", Grade: 10, RoomInNow: "abc123", Period: 5, Date: "6/29/2015", AtOnce: false, AtTeachersConvenience: false, Date: "6/29/2015", EndOfPeriod: true, GoTo: "hg", Grade: 10, Name: "Towers Gerard", Period: 5, PersonSending: "Mr Montes", RoomInNow: "abc123" }];

    }])
}(angular.module("Argus")));
/*  PdfExtraction  Controller */
(function (app) {
    app
    .controller("PdfExtractionController", ["$scope", "$http", function ($scope, $http) {
        $scope.availableFields = [{ name: "Student Name", value: "names", "selected": false }
                            , { name: "Student Id", value: "ids", "selected": false }
                            , { name: "Student Grade", value: "grades", "selected": false }
                            , { name: "Student Classes", value: "classes", "selected": false }
                            , { name: "A-G/College-Readiness", value: "A-G_Grad", "selected": false }
        ];
        /*  VARIABLES INSIDE THE WIZARD */
        $scope.reportOptions = [
            { name: ['College', 'readiness'], value: "College Readiness", type: "pdf", url: "/pdf/" },
            { name: ['High School', 'Graduation', 'Requirements'], value: "High School Graduation Requirements", type: "pdf", url: "/pdf/" },
            { name: ['GPA', 'Report'], value: "GPA Reports", type: "pdf", url: "/pdf/" },
            { name: ['Student', 'Info'], value: "Student Info", type: "pdf", url: "/pdf/" }
        ];
        $scope.reportSelected;
        $scope.onReportSelected = function (index) {
            $scope.reportSelected = index; // save the index of the one pressed
            $scope.para = index < 2 ? "A-G_Grad" : 'classes';
            var para = $scope.para;
            if (myDropzone) {
                myDropzone.options.headers.para = index < 2 ? "classes" : 'A-G_Grad';
                console.log("header changed")
            }
            
        }
        $scope.para1 = "A-G_Grad";
        $scope.para2 = "classes";
        $scope.para = "classes";
        $scope.dataTable = [];
        var attached = 0;
        var myDropzone;
        var para
        $scope.dropzoneConfig = {
            'options': {// passed into the Dropzone constructor
                'url': "/pdf/GetFields",
                'uploadMultiple': 'true',
                'headers': { user: 'admin', para : $scope.para },
                'acceptedFiles': ".pdf,.csv,tsv,.json,",
                'maxFilesize' : 10,
                'init':function(){
                    this.on("processing", function (file) {
                        $scope.$apply($scope.working = true);
                        //this.options.url = lastUrl;
                        $scope.$apply($scope.processing = true);
                    });

                    this.on("success", function (file, response) {
                        console.log("sucesso");
                        $scope.dataTable = $scope.dataTable.concat(response);
                        console.log($scope.dataTable);
                    });

                    this.on("error", function (file, error, xhr) {
                        console.log(error);
                });
        },
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    formData.append('file', file);

                },
               
            },
            
            variables: {counter : attached, dropzone:myDropzone, para:para}
        }; // end dropzoneConfig


       
        $scope.addDropzone = function () {
            if (attached === 0) {

                myDropzone = new Dropzone("#myDropZone", {
                    url: "/pdf/GetFields",
                    headers: { user: "admin", para: $scope.para },
                    acceptedFiles: ".pdf,.csv,tsv,.json,",
                    init: function () {
                        this.on("processing", function (file) {
                            $scope.$apply($scope.working = true);
                            //this.options.url = lastUrl;
                            $scope.$apply($scope.processing = true);
                        });

                        this.on("success", function (file, response) {
                            console.log("sucesso");
                            $scope.pdf.dataTable = $scope.pdf.dataTable.concat(response);
                            console.log($scope.pdf.dataTable);
                        });

                        this.on("error", function (file, error, xhr) {
                            console.log(error);
                        });
                    }
                });
                attached++;
            }


        }

        $scope.download = function () {

            var text = tableToCsv($scope.dataTable);
            //console.log(text);
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'info.csv');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        function tableToCsv(table) {
            var text = "";
            var heading = "Name,ID,Grade,";

            var classHeading = "School,Grade,Year,Sem Type, Sem Num, Scholar GPA, Citizenship GPA,"
            for (var i = 0; i < 4; i++) classHeading += classHeading;
            var A_GHeading = "A,B,C,D,E,F,G,"
            var AcademicPlanHeading = "English, Social Science, Mathematics, Science, Physical Education, Visual-Perf, Elective, World Language";

            for (var i = 0; i < table.length; i++) {// for each student in table 
                text += table[i].Name + "," + table[i].ID + "," + table[i].Grade + ",";

                angular.forEach(table[i].Semesters, function (sem) {
                    text += sem.School + ',' + sem.Grade + ',' + sem.Year + ',' + sem.SemesterType + ',' + sem.SemesterNum + ',' + sem.ScholarGPA + ',' + sem.CitizenshipGPA + ',';
                })

                if ($scope.reportSelected == 0)
                    angular.forEach(table[i].SchoolAcademicPlan, function (item) {
                        text += item + ',';
                    })

                if ($scope.reportSelected == 1)
                    angular.forEach(table[i].A_G, function (req) {
                        text += req + ',';
                    })




                text += '\n';
            }

            switch ($scope.reportSelected) {
                case 0:
                    return heading + A_GHeading + "\n" + text;
                case 1:
                    return heading + AcademicPlanHeading + "\n" + text;
                default:
                    return heading + classHeading + "\n" + text;
            }

            //console.log(heading);
            if (table[0].Semesters.leng)
                return heading + classHeading + "\n" + text;
            return heading + AG_PlanHeading + "\n" + text;
        }




    }])
}(angular.module("Argus")));

/************************** Profile Controller *****************************/
(function (app) {
    app
    .controller("ProfileCtrl", ["$scope","students","$http", function ($scope, students, $http) {
        $scope.schedule = []; // holds  student's schedule
        $scope.activities = []; // holds student'activities
        $scope.checks = [];
        $scope.currentDate = new Date();

        $scope.$watch('checks', function (n, o) {
            console.log(n);
        },true)

        //console.log($scope.student)// contains the student to display

        $scope.$watch('student', function (newVal, oldVal) {
            console.info('student changed')
			console.log(newVal);
			$scope.schedule = newVal.professor_classes;
			var parentName = newVal.GuardianName?newVal.GuardianName.split(',') :["No", " name"] ;
				$scope.parents = [{fn:parentName[0], ln: parentName[1], phone:newVal.GuardianPhone  ||"none" , mphone:'None', email:'None' }]
			$http.get('api/classes/'+newVal.Id).then(function(response){
				$scope.schedule = response.data;
				console.log($scope.schedule);
			})
			$scope.activities = newVal.user.activities_affected;
			angular.forEach($scope.activities, function(act){
				act.ActionType = parseInt(act.ActionType);
				switch(act.ActionType){
					case 0:
						act.activity = 'Referred';
						break;
					case 1:
						act.activity = 'Present';
						break;
					case 2:
						act.activity = 'Reschedule';
						break;
					case 3: 
						act.activity = 'Referral Done';
						break;
					case 4:
						act.activity = 'Absent';
						break;
					case 5:
						act.activity = 'Absent Processed';
						break;
					case 6:
						act.activity = 'Parent Notified';
						break;
					default:
						act.activity = 'unknown' + act.ActionType;
				}
			})
        })
//        studentActivitiesService.getAll()
//        .then(function (data) {
//            $scope.activities = data;
//        }, function (err) {
//            console.log(err);
//        })
        /*  Grab All information from database */

        /*******************  Left Side Controllers ***************************/

//        classesService.get($scope.student.ID)
//            .success(function (data) {
//                $scope.schedule = data;
//            })
        $scope.schedule = [
                 { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'A' },
                 { period: 1, className: "Advanced Math II", teacher: "Mr. Brandon", room: 'A' },
                 { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'B' },
                 { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'B+' },
                 { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'C' },
                 { period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'C-' }
        ];
        $scope.colors = ['bg-green', 'bg-info', ];
        $scope.parents = [
            { Fn: "Max", ln: "Quinteros", phone: "6192451818", mphone: "", email: "parent@argus.com" },
            { Fn: "Max", ln: "Quinteros", phone: "6192451818", mphone: "", email: "max@argus.com" }
        ];
        $scope.tog = 0;
        $scope.click = function (index) {
            $scope.tog = index;
        };

        /*******************  Right Side Controllers*********************/
//        studentActivitiesService.get($scope.student.ID)
//            .success(function (data) {
//                if (data) {
//                    $scope.activities = data;
//                } else {
//                    $scope.activities = [];
//                }
//            })

        $scope.currentDate;
        $scope.$watch("profileForm.date.$modelValue", function (newVal, oldVal) {
            //console.info("date changedto :" + newVal)
        })

     
        $scope.showDetail = false;
        $scope.toggleShowDetail = function (index) {
            $scope.showDetail = !$scope.showDetail;
            $scope.selected = $scope.activities[index];
        };

        $scope.showComment = false;
        $scope.toggleShowComment = function (index) {
            $scope.showComment = !$scope.showComment;
            $scope.selected = $scope.activities[index];
        }

        $scope.addComment = function () {
            var entry =
                { date: formatDate(new Date), activity: "comment", Comment: $scope.comment, Staff: " Montes" }
            $scope.activities.push(entry)
            $scope.comment = '';
        }
        $scope.activities = [
    { date: "2015-01-15", activity: "AEC" },
    { date: "2015-01-21", activity: "ARC" },
    { date: "2015-01-22", activity: "AEC Clear" },
    { date: "2015-04-03", activity: "AEC Reschedule" },
    { date: "2015-05-03", activity: "ARC Clear" },
    { date: "2015-06-21", activity: "AEC Reschedule" },
    { date: "2015-06-01", activity: "ARC" },
    { date: "2015-08-03", activity: "ARC" },
    { date: "2015-12-25", activity: "AEC" },
        ];

        function formatDate(date) {
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        }

        $scope.filter = [];
        $scope.getActivities = function () {
            return ($scope.activities || []).map(function (w) {
                return w.activity;
            }).filter(function (w, idx, arr) {
                return arr.indexOf(w) === idx;
            });
        };

        $scope.filterByCategory = function (act) {
            return $scope.filter[act.activity] || noFilter($scope.filter);
        }// date selected on the checkboxes;
        function noFilter(filterObj) {
            for (var key in filterObj) {
                if (filterObj[key]) {
                    return false;
                }
            }
            return true;
        }


    }])
}(angular.module("Argus")));
/************************** Referrals Controller *****************************/
(function (app) {
    app.
    controller("referalController", ["$scope", "assignmentsListService",  "referrals", "students", "$http",
	function ($scope, assignmentsService, referrals,students, $http) {
		$scope.selected = {}; // model for the possible selections (selected.student,   or seleted.assignments)
        $scope.showChecks = false; // to use with assignSpecific function
        $scope.currentDate = new Date(); // date on the datepicker
        $scope.teacherStudents = []; // model for autocomplete  
        $scope.refTable = []; // model for dynamic table 
        $scope.edits = [];  
		
		
        //This to do:
        //1.-Get Referrals based on date. 
        //Push referred students. 
        //Change api to take in an array. 
        function getTeacherStudents(){
            students.getStudents().then(function(results) {
            console.log("Teacher students");
            console.log(results);
            $scope.teacherStudents = results;
          }, function(error) {
            console.log(error);
          });
        }
         getTeacherStudents();
    
        // check for changes in the date to retrieve that date's AEC list 
        $scope.$watch('form.date.$viewValue', function (newVal, oldVal) {
            if (newVal) {//when date has a valid date request the List from that date
                referrals.query({id:newVal},function(results) {
                    console.log("Returned  refferals");
                    console.log(results);
                   
				   // adjust the returned referrals 
				   for(var i = 0; i < results.length ; i++){
					   for(var j = 0 ; j < results[i].referred.length ; j++){
						   results[i].referred[j] = results[i].referred[j].assignment;
					   }
				   }
                    var data = results;
                    console.log("Data For the ref table");
					console.log(results);
                    // console.log(data);
                    if (!data) {
                        $scope.refTable = [];
                        alert("No students for current date");
                       
                    } else {
                        $scope.refTable = data;
                    }
                  }, function(error) {
                    console.log(error);
                });



                console.log("New Date : " +newVal );
                console.log("Old Date : " +oldVal );
                //console.log("New Date : " +formatDate(newVal) );
                $scope.currentDate = newVal;
                
            }
        });


        $scope.assignments = assignmentsService.query(function(data){
			console.log("Returned assignments");
            console.log(data);
		});//ServerDataModel.getAssignments();
		
        /* REFER A STUDENT LOGIC */

        // should be able to add different assignments to all the students ,, like hw1, and hw2 to all,, how??  oder? built a list then assign?
        //  select hw1 then press assign to all,, select hw2 then press assign to all again(this one) 
        // 
		
		// only called when a student is selected
		$scope.onSelectedStudent = function(){
			return;
			// add to the list
			var alreadyInList = false;
			for(var  i = 0 ; i < $scope.refTable.length; i++){
				if($scope.refTable[i].id === $scope.selected.student.user.id){
					alreadyInList = true;
				}
			}
			if(!alreadyInList)
				$scope.refTable.push($scope.selected.student.user);
			else
				alert('student is already in the list');
			// clear the field
			$scope.selected.student = null;
		}
		
        $scope.assignToAll = function () {
			debugger;
            var selectedAssignments = $scope.selected.assignments;
            angular.forEach($scope.refTable, function (student) {
				addAssignmentsToStudent(selectedAssignments, student);
            });
            $scope.selected.assignments = null; // clear homework field when assigned to all???
        };

        // to be implemented
        // given a list of 'students', assign each one the 'assignment', update table
        // and database to reflect changes (not really, database would be updated on submit but it would be queried through the process) 
        // if less than 7 use checkboxes, else allow type and auto suggest
        $scope.assignSpecific = function () {
            // check how many are there in the table 
            if ($scope.refTable.length < 7) { // show checkboxes 
                $scope.showChecks = true;
            } else { // open a modal wih a search box of the students in the table, make a new table, use assign to all in that table 
                alert("opened modal");

            }
        }

        // step 2
        $scope.assignSpecific2 = function () {
            var selectedAssignments  = $scope.selected.assignments;
            angular.forEach($scope.refTable, function (student) {
				if (student.selected)  // only do something on selected students
					addAssignmentsToStudent(selectedAssignments, student);
            })
            $scope.selected.assignments = null;
            $scope.showChecks = false;
        }

		var addAssignmentsToStudent = function(assignments, student){
			
			if(!student.referred){// current student doesnt have any assignments, add all the selected assignments	
				//  copy assignments into referred
				student.referred = assignments.slice();
				return;
			}

			for (var i = 0; i < assignments.length; i++) {
				var j = false;
				for (j = 0; j < student.referred.length; j++) {
					if (student.referred[j].Id === assignments[i].Id)
						break;
				}

				if (j === student.referred.length)// assignment is not already in the student
					student.referred.unshift(assignments[i]);
			}


			delete student.selected; // delete the selected property;

		}

        //submit list of refered students to the database
        $scope.submitReferedStudents = function () {
			// format the data so it an be easily insterted in the database
			var studentsReferred = [];
			angular.forEach($scope.refTable, function(student){
				angular.forEach(student.referred, function(assignment){
					var referral = {
						StudentId:student.id, 
						AssignmentId:assignment.Id,
						RefferalStatus : 0,
						Date :$scope.currentDate,
						ParentNotified : false,
						StudentNotified : false
					};
					studentsReferred.push(referral);
				})
			})
			
			referrals.save({data:studentsReferred, date:$scope.currentDate});
            //ServerDataModel.createAECList($scope.currentDate, $scope.refTable);
            $scope.refTable = [];
            
        }

    }])

}(angular.module("Argus")));

/************************** Admin1Referral Controller *****************************/
(function (app) {
    app.
    controller("admin1referalController",["$scope", "assignmentsListService",  "teachers", "referrals", "StudentsService", "$http",'$modal',"$timeout",
	function ($scope, assignmentsService,teachers, referrals,students, $http, $modal, $timeout) {
		$scope.selected = {}; // model for the possible selections (selected.student,   or seleted.assignments)
        $scope.showChecks = false; // to use with assignSpecific function
        $scope.currentDate = new Date(); // date on the datepicker
        $scope.teacherStudents = []; // model for autocomplete  
        $scope.refTable = []; // model for dynamic table 
        $scope.edits = [];  
		
		
        //This to do:
        //1.-Get Referrals based on date. 
        //Push referred students. 
        //Change api to take in an array. 
        function getTeacherStudents(){
            students.getStudents().then(function(results) {
            console.log("Teacher students");
            console.log(results);
            $scope.teacherStudents = results;
          }, function(error) {
            console.log(error);
          });
        }
         //getTeacherStudents();
		 
		 function getTeachers(){
			 $scope.teachers = teachers.query(function(data){
				 console.log('the teachers')
				 console.log(data);
			 });
		 }
		getTeachers();
		
        // check for changes in the date to retrieve that date's AEC list 
        $scope.$watch('form.date.$viewValue', function (newVal, oldVal) {
            if (newVal) {//when date has a valid date request the List from that date
				var processReceivedReferrals  = function(results) {
                    console.log("Returned  refferals");
                    console.log(results);
                   
				   // adjust the returned referrals 
							
						
					var AlluniqueTeachers = {};
					var results_length = results.length;
					var referrals=[];
					for(var i = 0; i < results_length; i++){
						var student  = results[i];
						var uniqueTeachers = {};
						angular.forEach(student.referred, function(referral, $index2){
							uniqueTeachers[referral.UserId] =  referral.user;
							delete referral.user;
							//AlluniqueTeachers[referral.StudentId] = uniqueTeachers;
						});
						var teachersNo =  Object.keys(uniqueTeachers).length;
						var teachersKeys = Object.keys(uniqueTeachers);
							for(var j = 0; j < teachersNo; j++){
								var studentCopy= angular.copy(student);
								var studentReferrals = [];
								studentCopy.teacher = uniqueTeachers[teachersKeys[j]];
								for(var k =0; k < student.referred.length; k++){
									
									var referral = student.referred[k];
									if(referral.assignment.TeacherId === teachersKeys[j])
										studentReferrals.push(referral.assignment);
								}
								studentCopy.referred = studentReferrals;
								studentCopy.old = true;
								referrals.push(studentCopy);
							}

					}
					results = referrals
					console.log(results);
                    var data = results;
                    console.log("Data For the ref table");
					console.log(results);
                    // console.log(data);
                    if (!data) {
                        $scope.refTable = [];
                        alert("No students for current date");
                       
                    } else {
                        $scope.refTable = data;
                    }
                  }
//                referrals.query({id:newVal},processReceivedReferrals, function(error) {
//                    console.log(error);
//                });



                console.log("New Date : " +newVal );
                console.log("Old Date : " +oldVal );
                //console.log("New Date : " +formatDate(newVal) );
                $scope.currentDate = newVal;
                
            }
        });

		
        /* REFER A STUDENT LOGIC */

        // should be able to add different assignments to all the students ,, like hw1, and hw2 to all,, how??  oder? built a list then assign?
        //  select hw1 then press assign to all,, select hw2 then press assign to all again(this one) 
        // 
		
		// only called when a student is selected
		$scope.onSelectedStudent = function(){
			return;
			// add to the list
			var alreadyInList = false;
			for(var  i = 0 ; i < $scope.refTable.length; i++){
				if($scope.refTable[i].id === $scope.selected.student.user.id){
					alreadyInList = true;
				}
			}
			if(!alreadyInList)
				$scope.refTable.push($scope.selected.student.user);
			else
				alert('student is already in the list');
			// clear the field
			//$scope.selected.student = null;
		};
		
		$scope.onSelectedTeacher  = function(){
			if(!$scope.selected.teacher){// if teacher deselected 
				$scope.teacherStudents = null;
				return;
			}
			var teacherId = $scope.selected.teacher.id;
			students.query({teacherId:teacherId},function(results) {
				console.log("Teacher students");
				console.log(results);
				
				$scope.teacherStudents = results;
			  }, function(error) {
				console.log(error);
			  });
			
		}
		
		
		
		$scope.openCreateNewAssignment = function(){
			var modalInstance = $modal.open({
                templateUrl: 'views/modals/addNewAssignmentModal.html',
                size: 'md',
                controller: function ($scope, teacher) {
                    $scope.teacher = teacher;
                },
                resolve: { // variables that get injected into the controller (taken from current $scope)
                    teacher: function () { return $scope.selected.teacher; },
                }
            }) // End modalInstace

            modalInstance.result.then(function(data){
				assignmentsService.save({teacher:$scope.selected.teacher, assignment:data}, function(response){
					debugger;
					var teacher = $scope.selected.teacher;
					response.assignment.Id = response.assignment.Id + "";
					 $scope.selected.teacher.assignments.push(response.assignment);
					 
					console.log('assignment successfully added');
					console.log($scope.selected.teacher.assignments)
				}, function(response){
					console.warn('assignment unseccessfuly added');
				});
			});		
		};
		
	
        $scope.assignToAll = function () {
			debugger;
            var selectedAssignments = $scope.selected.assignments;
            angular.forEach($scope.refTable, function (student) {
				addAssignmentsToStudent(selectedAssignments, student);
            });
            $scope.selected.assignments = null; // clear homework field when assigned to all???
        };
		
		$scope.addAssignment = function(){
			debugger;
			var selectedAssignments  = $scope.selected.assignments;
			var referralToAdd = $scope.selected.student;
			var selectedTeacher = $scope.selected.teacher;
			
			
			addAssignmentsToStudent(selectedAssignments, referralToAdd);
			referralToAdd.teacher = $scope.selected.teacher;
			$scope.refTable.push(referralToAdd);
			console.log($scope.refTable);
			$scope.selected.student = null;
		}
        // to be implemented
        // given a list of 'students', assign each one the 'assignment', update table
        // and database to reflect changes (not really, database would be updated on submit but it would be queried through the process) 
        // if less than 7 use checkboxes, else allow type and auto suggest
        $scope.assignSpecific = function () {
            // check how many are there in the table 
            if ($scope.refTable.length < 7) { // show checkboxes 
                $scope.showChecks = true;
            } else { // open a modal wih a search box of the students in the table, make a new table, use assign to all in that table 
                alert("opened modal");

            }
        }

        // step 2
        $scope.assignSpecific2 = function () {
            var selectedAssignments  = $scope.selected.assignments;
            angular.forEach($scope.refTable, function (student) {
				if (student.selected)  // only do something on selected students
					addAssignmentsToStudent(selectedAssignments, student);
            })
            $scope.selected.assignments = null;
            $scope.showChecks = false;
        }

		var addAssignmentsToStudent = function(assignments, student){
			
			if(!student.referred){// current student doesnt have any assignments, add all the selected assignments	
				//  copy assignments into referred
				student.referred = assignments.slice();
				return;
			}

			for (var i = 0; i < assignments.length; i++) {
				var j = false;
				for (j = 0; j < student.referred.length; j++) {
					if (student.referred[j].Id === assignments[i].Id)
						break;
				}

				if (j === student.referred.length)// assignment is not already in the student
					student.referred.unshift(assignments[i]);
			}


			delete student.selected; // delete the selected property;

		}

        //submit list of refered students to the database
        $scope.submitReferedStudents = function () {
			// format the data so it an be easily insterted in the database
			var studentsReferred = [];
			angular.forEach($scope.refTable, function(student){
				angular.forEach(student.referred, function(assignment){
					if(student.old)
						return;
					
					var referral = {
						StudentId:student.id, 
						UserId:assignment.TeacherId,
						AssignmentId:assignment.Id,
						RefferalStatus : 0,
						Date :$scope.currentDate,
						ParentNotified : false,
						StudentNotified : false
					};
					studentsReferred.push(referral);
				})
			})
			debugger;
			if(studentsReferred.length )
				referrals.save({data:studentsReferred, date:$scope.currentDate});
            //ServerDataModel.createAECList($scope.currentDate, $scope.refTable);
            $scope.refTable = [];
            
        }

    }])

}(angular.module("Argus")));

/************************** ReferralARC Controller *****************************/
(function (app) {
    app
    .controller("referalARCController", ["$scope", "studentsService", "ARCListService", "ServerDataModel", function ($scope, studentsService, ARCListService, ServerDataModel) {
        $scope.selected2; //student input model
        $scope.student; // student objet model
        $scope.selected3;// description
        $scope.teacher; // selected teacher 
        $scope.checks = [false, false, false];
        $scope.selectedPeriod; //
        $scope.sentToOffice; //
        $scope.reason;
        $scope.currentDate = new Date(); // date on the date picker
        $scope.refTable = []; // model for table
        $scope.schoolStudents = [] // model for autocomplete 



        $scope.$watch('form.date.$modelValue', function (newVal, oldVal) {

            if (newVal) {//when date has a valid date request the List from that date
                $scope.currentDate = newVal;
                console.log("newVal = " + $scope.form.date.$viewValue);
                var data = ServerDataModel.getARCList(formatDate(newVal));
                if (!data) {
                    $scope.refTable = [];
                    alert("No students for current date");

                } else {
                    $scope.refTable = data
                    console.log($scope.refTable);
                }
            }
        });

        // Get Server Data
        // Should get students from the whole school
        /*
        studentsService.getAll()
            .success(function(data){
                console.info("success: StudentService.getAll()");
                $scope.schoolStudents = data; 
            })
        */

        // Get today's list from referalARC Lists if already created (in case of change)
        /*
        ARCListService.get()
            .success(function(data){
                if (data === null)
                    console.warn("no ARC List for current date: " + new Date);
                else
                    $scope.refTable = data;
            })
        */
        //$scope.refTable = ServerDataModel.getARCList(formatDate(new Date));
        $scope.schoolStudents = ServerDataModel.getStudents();
        $scope.teachers = ServerDataModel.teachers;
        console.log($scope.teachers)
        $scope.periods = ["1", "2", "3", "4", "5", "6", "7"];
       
        //for ARC Referal

        // only add the student fn, ln, Id and GR.
        // we dont know the reason and who refered the student so we leave those blank
        // period = reason
        // Assignment = staff
        $scope.addRow = function () {
            var student = $scope.student;
            $scope.refTable.unshift({ 'fn': student.fn, 'ln': student.ln, 'ID': student.ID, 'GR': student.GR, 'Period': $scope.selectedPeriod, 'Teacher': $scope.teacher, 'Comment': $scope.selected2, 'Reason':$scope.reason , 'Staff':'Gonzales'});

            $scope.student = undefined;
            $scope.selected2 = '';
            $scope.teacher = undefined;
            $scope.reason = '';
            $scope.selected3 = '';
            $scope.sentToOffice = '';
            $scope.checks = [false, false, false];
            $scope.selectedPeriod = undefined;
        };
        $scope.onSelect2 = function ($item, $model, $label) {
            $scope.student = $item;
            //$scope.addRow2($item);
            $scope.selected2 = $model.fn + $model.ln;

        };

        $scope.addReasonStaff = function () {
            var index;
            if (!$scope.editActive)
                index = $scope.refTable.length - 1;
            else
                index = $scope.idxEditedItem;

            for (var i = 0; i < 4; i++)
                if ($scope.booleans[i])
                    $scope.indexSelected = i;

            $scope.refTable[index].Reason = $scope.reasons[$scope.indexSelected];
            // staff must be the current user that's managing
            $scope.refTable[index].Staff = "Gonzales";

            $scope.refTable[index].comment = $scope.selected3


            $scope.editActive = false;
        };

        $scope.editActive = false;
        $scope.idxEditedItem;
        $scope.editEntry = function (index) {
            $scope.editActive = true;
            $scope.idxEditedItem = index;
            var item = $scope.refTable[index];
            $scope.selected2 = item;
            $scope.selected3 = item.Comment;
            var ind = $scope.reasons.indexOf(item.Reason);
            $scope.booleans[$scope.indexSelected] = false;
            $scope.indexSelected = ind;
            $scope.booleans[ind] = true;

        }


        $scope.submitARCReferedStudents = function () {
            console.info($scope.refTable);
            ARCListService.save($scope.currentDate, $scope.refTable)
            $scope.refTable = [];
        }

    }])

}(angular.module("Argus")));
/************************** Saturday Controller *****************************/
(function (app) {
    app
    .controller("saturdaySchoolController", ["$scope", "studentsService", "saturdaySchoolService", "$modal", function ($scope, studentsService, saturdaySchoolService, $modal) {
        $scope.selected2 = ""; // model for the search field content
        $scope.selectedStudent; // actual object of the selected student
        $scope.refTable = []; // table for selected students
        $scope.currentDate = new Date().toString().split(' ');
        $scope.currentDate = $scope.currentDate[0] + "  " + $scope.currentDate[1] + "  " + $scope.currentDate[2] + " " + $scope.currentDate[3];
        $scope.signedinStudents = [];
        $scope.signedOutStudents = [];
        /*************** get Initial Page Data From Server **************/

        // get list of students for the current logged in teacher
        studentsService.getAll()
            .success(function (data) {
                $scope.teacherStudents = data
            })
        $scope.teacherStudents = [
  { ID: 1061201, fn: "ABARCA", ln: " ANTHONY", GR: 9 },
   { ID: 1044728, fn: "ABDULKADIR", ln: " FATIMA", GR: 10 },
    { ID: 1023650, fn: "ACEVES DOMINGUEZ", ln: " ROSALBA AIMEE", GR: 12 },
     { ID: 1024511, fn: "ACKERMAN", ln: " JASON EDWARD", GR: 12 },
     { ID: 1064877, fn: "ACOSTA ", ln: " ALEXXIS MARIE", GR: 10 },
     { ID: 1040249, fn: "ACUNA", ln: " ARLINE", GR: 11 },
     { ID: 1024574, fn: "ADAIR", ln: " JORDAN MARIE", GR: 12 },
        ];

        $scope.onSelect = function ($item, $model, $label) {
            $scope.selectedStudent = $item;
            var stu = $scope.selectedStudent
            $scope.selected2 = stu.fn + '  ' + stu.ln + ' ' + stu.ID + ' ' + stu.GR;
        }

        $scope.sign = function () {
            if ($scope.signedinStudents.indexOf($scope.selectedStudent) == -1)
                $scope.openSignin();
            else
                $scope.openSignout();
        }



        /* SignIn Modal */
        $scope.openSignin = function () {
            var signModal = $modal.open({
                templateUrl: 'views/modals/SaturdaySchoolModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, title) {
                    $scope.student = student;
                    $scope.title = title;
                    $scope.signature;


                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ image: $scope.signature });
                    }
                },
                resolve: {
                    student: function () { return $scope.selectedStudent; },
                    title: function () { return "Sign Here"; }
                }
            });// end modalInstance

            signModal.result.then(submitSign, function () {
                console.info('Modal dismised at:' + new Date());
            });
        }

        /* SignOut Modal */
        $scope.openSignout = function () {
            var signoutModal = $modal.open({
                templateUrl: 'SignoutModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, title) {
                    $scope.student = student;
                    $scope.title = title;
                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ student: $scope.student });
                    }
                },
                resolve: {
                    student: function () { return $scope.selectedStudent; },
                    title: function () { return "SignOut Confirm" }
                }
            });// end modal instance 
            signoutModal.result.then(signOut, function () {
                console.info("Modal dismissed at : " + new Date());
            })
        }

        /* Confirmation Modal */
        $scope.openConfirmation = function () {
            var confirmationModal = $modal.open({
                templateUrl: 'ConfirmationModal.html',
                size: 'md',
                controller: function ($scope, $modalInstance, student, title) {
                    $scope.student = student;
                    $scope.title = title;
                    $scope.signature;


                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
                    $scope.submit = function () {
                        $modalInstance.close({ image: $scope.signature, student: $scope.student });
                    }
                },
                resolve: {
                    student: function () { return $scope.selectedStudent; },
                    title: function () { return "Submit List"; }
                }
            });// end modalInstance

            confirmationModal.result.then(finishSaturday, function () {
                console.info('Modal dismised at:' + new Date());
            });
        }


        var submitSign = function (data) {
            $scope.signedinStudents.push($scope.selectedStudent);
            $scope.selected2 = '';
            $scope.selectedStudent = null;
            //alert("Student Signed in");

        };

        var finishSaturday = function (data) {
            $scope.selected2 = '';
            $scope.selectedStudent = null;
            saturdaySchoolService.save(new Date(), $scope.signedOutStudents);
            //alert("Today's List Submited")
        };

        var signOut = function (data) {
            var idx = $scope.signedinStudents.indexOf($scope.selectedStudent);
            $scope.signedOutStudents.push($scope.signedinStudents.splice(idx, 1));
            $scope.selected2 = '';
            $scope.selectedStudent = null;
            //alert("student Signed Out")
            console.log($scope.signedOutStudents);
        };

    }])
}(angular.module("Argus")));
/************************** Usage Controller *****************************/
(function (app) {
    app
    .controller("usageChartCtrl",["$scope", function ($scope) {
        /**
          * Options for Line chart
          */
        $scope.lineOptions = {
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true
        };


        /**
         * Data for Line chart
         */
        $scope.lineData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                /*
                {
                    label: "Example dataset",
                    fillColor: "rgba(26,179,148,0.5)", 
                    strokeColor: "rgba(26,179,148,0.7)", 
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                }*/
                {
                    label: "Example dataset",
                    fillColor: "rgba(185,35,34,.7)",
                    strokeColor: "#B92322",
                    pointColor: "#B92322",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
                
            ]
        };


    }])
    .controller('radialGaugeStatistics', ['$scope', function ($scope) {
        $scope.value = 60.5;
        $scope.upperLimit = 100;
        $scope.lowerLimit = 0;
        $scope.unit = " % ";
        $scope.precision = 1;
        $scope.ranges = [
            {
                min: 0,
                max: 20.5,
                color: '#C50200'
            },
            {
                min: 10.5,
                max: 40.5,
                color: '#FF7700'
            },
            {
                min: 20.5,
                max: 60.5,
                color: '#FDC702'
            },

            {
                min: 60.5,
                max: 100.0,
                color: '#8DCA2F'
            }
        ];
    }])

}(angular.module('Argus')));

/************************** StudentInfo Controller *****************************/
(function (app) {
    app
    .controller("studentInfoCtrl", ["$scope", "students",  function ($scope, students) {
        $scope.students;  // model for autocomplete
        $scope.toShow = []; //list of profiles to show on the view
        //student information from the database 
        students.getAllStudents(function(data){
			$scope.students = data;
		});

        $scope.studentInfo = { name: 'naomi', address: '1600ffdf' }
        ;
        $scope.max = 4;
        $scope.profiles = ['', '', '', ''];
        $scope.selected = {};
        $scope.active = 0;
        $scope.onEnter = function () {
			// get more information of the selected student 
			students.getStudent({id:$scope.selected.student.Id}, function(data){
				$scope.selected.student = data;
				$scope.toShow.push($scope.selected.student)
				$scope.active++; // increase number of active profiles
				$scope.selected.student = null; // clear search field
			});
			
            //$scope.profiles[$scope.active] = $item; //
          
			
			
        };
        $scope.remove = function ($index) {
            $scope.toShow.splice($index, 1);
            //$scope.profiles[$index] = '';
            $scope.active--;
        };



    }])

}(angular.module("Argus")));
/************************** tables Controller *****************************/
(function (app) {
    app
    .controller("tablesCtrl", ["$scope", "$http", "$filter", function ($scope, $http, $filter) {


        //$scope.refTable = []; // table being modified.. (push, delete, addRow. will be used to update DB on submit)
        $scope.row = "";

        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.refTableCurrentPage = [];

        $scope.$watch('refTable', function (newValue, OldValue) {
            console.log('refTable was modified')
            $scope.select(1);
        }, true)

        $scope.select = function (page) {
            var start, end;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            $scope.refTableCurrentPage = $scope.refTable.slice(start, end);
        };
        // $scope.select(1);

        $scope.onNumPerPageChange = function () {
            $scope.select(1);
            $scope.currentPage = 1;
            $scope.row = "";
        };

        $scope.order = function (rowName) {
            $scope.row !== rowName ? ($scope.row = rowName, $scope.refTable = $filter("orderBy")($scope.refTable, rowName), $scope.onOrderChange()) : void 0;
        };

        $scope.onOrderChange = function () {
            $scope.select(1);
            $scope.currentPage = 1;
        };

        $scope.filterByCategory = function (act) {
            return $scope.filter[act.activity] || noFilter($scope.filter);
        };

        // unecessary 
        $scope.getNames = function () {
            return ($scope.stuInfo1 || []).map(function (w) {
                return w.Teacher;
            }).filter(function (w, idx, arr) {
                return arr.indexOf(w) === idx;
            });
        };

        // unecessary 
        $scope.getAssign = function () {
            return ($scope.stuInfo || []).map(function (w) {
                return w.Assignment;
            }).filter(function (w, idx, arr) {
                return arr.indexOf(w) === idx;
            });
        };

    }]) // end tablesCtrl
}(angular.module("Argus")));
/************************** WelcomeWizard Controller *****************************/
(function (app) {
    app
    .controller("welcomeWizardController", ["$scope", "$http", function ($scope, $http) {
      
        $scope.dropzoneConfig = {
            
            'options': {// passed into the Dropzone constructor
                'url': api+'assignments',
                'uploadMultiple': false,
                acceptedFiles: "application/pdf",
                'headers': { 'UserID': '00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b' }
            },
            'eventHandlers': {
                'success': function (file, response) {
                    //$scope.refreshFiles();
                },
            }
        }; // end dropzoneConfig



    }])

}(angular.module("Argus")));
/************************** Chartist Controller *****************************/
(function (app) {
    app
    .controller("chartistCtrl", ["$scope", function ($scope) {

        $scope.lineData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            series: [
                [12, 9, 7, 8, 5],
                [2, 1, 3.5, 7, 3],
                [1, 3, 4, 5, 6]
            ]
        }

        $scope.lineOptions = {
            fullWidth: true,
            chartPadding: {
                right: 40
            }
        }

        var times = function (n) {
            return Array.apply(null, new Array(n));
        };

        var seriesCount = 0;
        var seriesPrev = 0;
        var prepareData = times(26).map(Math.random).reduce(function (data, rnd, index) {
            console.log(data);
            data.labels.push(index + 1);
            data.series.forEach(function (series) {
                if (seriesCount === 0) {
                    seriesCount = series;
                }
                if (series === seriesCount) {
                    series.push(Math.random() * (4 - 3) + 3)
                } else if (series !== seriesCount) {
                    series.push(Math.random() * (3 - 1) + 1)
                    seriesPrev = series;
                }

            });

            return data;
        }, {
            labels: [],
            series: times(2).map(function () {
                return new Array()
            })
        });

        $scope.scatterData = prepareData;

        $scope.scatterOptions = {
            showLine: false,
            axisX: {
                labelInterpolationFnc: function (value, index) {
                    return index % 4 === 0 ? 'ACT/SAT ' + (value + 1.2) * 10 + ' /' + (value) * 100 : null;
                }
            }
        }

        $scope.stackedData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            series: [
                [800000, 1200000, 1400000, 1300000],
                [200000, 400000, 500000, 300000],
                [100000, 200000, 400000, 600000]
            ]
        }
        $scope.stackedOptions = {
            stackBars: true,
            axisY: {
                labelInterpolationFnc: function (value) {
                    return (value / 1000) + 'k';
                }
            }
        }

        $scope.horizontalData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            series: [
                [5, 4, 3, 7, 5, 10, 3],
                [3, 2, 9, 5, 4, 6, 4]
            ]
        }

        $scope.horizontalOptions = {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            axisY: {
                offset: 70
            }
        }

        var prepareData = {
            series: [5, 3, 4]
        }

        $scope.pieData = prepareData

        var sum = function (a, b) {
            return a + b
        };

        $scope.pieOptions = {
            labelInterpolationFnc: function (value) {
                return Math.round(value / prepareData.series.reduce(sum) * 100) + '%';
            }
        }

        $scope.gaugeData = {
            series: [20, 10, 30, 40]
        }

        $scope.gaugeOptions = {
            donut: true,
            donutWidth: 60,
            startAngle: 270,
            total: 200,
            showLabel: false
        }


    }])

}(angular.module("Argus")));
/************************** Auth Controller *****************************/
(function(app){
	'use strict';
	
	app
	.controller('AuthController',function($auth, $state, $http, $rootScope){
		var vm = this;
		
		vm.loginError = false;
		vm.loginErrorText ;
		vm.login = function(){
			var credentials = {
				email:vm.email,
				password: vm.password
			}
			
			// Use Satellizer's $auth service to login
			$auth.login(credentials).then(function(response){
				// if login is successful, redirectto the users state
				//$state.go('users', {});
				
				return $http.get('api/authenticate/user');
				
				//handle errors
			}, function(response){
				vm.loginError = true;
				vm.loginErrorText = response.data.error;
				
			// because we returned the promise in the first then 
			// we can chain the next promise to the end here
			}).then(function(response){
				// stringify the returned data to prepare it 
				// to go into local storage
				var user = JSON.stringify(response.data.user);
				
				//set the stringified user data into local storage
				localStorage.setItem('user',user);
				
				// The user's authenticated state gets flipped to true
				// so we can now show parts of the ui that relyon the
				// user being logged in
				$rootScope.authenticated = true;
				
				// Putting the user's data on $rootScope allows 
				// us to access it anywhere across the app
				$rootScope.currentUser = response.data.user;
				$state.go(response.data.user.role.toLowerCase()+".dashboard");
				
			});
		}
	})
	
}(angular.module('Argus')));
