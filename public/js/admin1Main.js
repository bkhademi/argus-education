(function(app){
	"use strict";  
	app.controller('DashAdmin1Ctrl', ['$scope', '$modal', 'referrals', 'notify',
	function($scope, $modal, referrals, notify){
		
		 
		$scope.studentsToday =0;
		var date = Date();
		var dateStr = date.substring(4,7) + ' '+date.substring(8,10) + ' '+date.substring(11,15);
		referrals.query({id:dateStr},function(data){
			var count= 0;
			for(var i = 0; i < data.length ; i++){
				for(var j = 0 ; j < data[i].referred.length ; j++){
				}
				if(data[i].referred.length !== 0 ){
					count++;
				}
				
			}
			$scope.studentsToday = count;
		});;
		$scope.followUp  = 0;
		referrals.query({id:dateStr, absence:true},function(data){$scope.followUp = data.length;});
		
		$scope.downloadEODReport =function(){
			notify({message:'Now Doing, hold on'});
			return;
		};
		
		/**
		 * Opens modal for average attendance
		 */
		$scope.openAverageAttendance = function () {
			$scope.studentsToday  = 0;
			$scope.FollowUp = 0;
			$scope.averageAttendance = 0;
			$scope.rating = 0;
			
			var averageAttendanceModal = $modal.open({
				templateUrl: 'averageAttendanceModal.html',
				size: 'lg',
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); }
				},
				resolve: {
					graphOptions : function () { return $scope.lineOptions },
					graphData: function () { return $scope.lineData }
				}
			})// End assignmentsModal
		};
		/**
		 * Opens Modal for Rating's Modal
		 */
		$scope.openRating = function () {
			var ratingsModal = $modal.open({
				templateUrl: 'ratingsModal.html',
				size: 'lg',
				controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
					$scope.graphOptions = graphOptions;
					$scope.graphData = graphData;
					
					$timeout(function () {
						$scope.drawGraph = true;
					}, 100);
					
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); }
				},
				resolve: {
					graphOptions : function () { return $scope.lineOptions },
					graphData: function () { return $scope.lineData }
				}
			})// End assignmentsModal
		};
		
		/**
		 * Data for Line chart
		 */
		$scope.lineData = {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "Example dataset",
					fillColor: "rgba(185, 35, 34, .5)",
					strokeColor: "rgba(185, 35, 34, .8)",
					pointColor: "#B92322",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [0, 0, 0, 0, 0, 0, 0]
				}
			]
		};
		
		/**
		 * Options for Line chart
		 */
		$scope.lineOptions = {
			scaleShowGridLines: true,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineWidth: 1,
			bezierCurve: false,
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
		 * Data for Doughnut chart
		 */
		$scope.doughnutData = [
			{
				value: 300,
				color: "#2f4050",
				highlight: "#1ab394",
				label: "App"
			},
			{
				value: 50,
				color: "#2f4060",
				highlight: "#1ab394",
				label: "Software"
			},
			{
				value: 100,
				color: "#2f4070",
				highlight: "#1ab394",
				label: "Laptop"
			}
		];
		
		/**
		 * Options for Doughnut chart
		 */
		$scope.doughnutOptions = {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 45, // This is 0 for Pie charts
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false
		};
		
		/**
		 * List of the techer's tutors if any
		 */
		$scope.teachersTeam = [
			{fn:"Adrian Omar", ln:"Galicia Mendez", subjects:["Math", "Physics","Spanish"], days:["M","W", "Sat"], rate:9.5},
			{fn:"Brandon", ln:"Hernandez", subjects:["Math", "Physics","Chemistry", "Biology"], days:["T","Th", "F"], rate:8.9},
			{fn:"Jose", ln:"Martinez", subjects:["Math", "Physics","Computer Science"], days:["M","W", "Sat"], rate:2.1},
		]
		
	}]);
}(angular.module('Argus')));
(function(app){
	"use strict";
	app
	.controller("manageAECAbsenceController", 
	["$scope",  "$modal", "referrals","PassesService","UserActionsService",'BbyArgusGeneralDBService',
		function ($scope, $modal,referrals, passes, useractions, generaldb) {
			$scope.selected = {};
			$scope.refTable = [];// table model
			$scope.currentDate = new Date(); // date on the date picker
			
			/**
			 * Watch for changes in the datepicker then load the AECAbsence list
			 */
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
						
						generaldb.query(function(data){
							console.log(data);
						})
					})
				}
			});
			
			/**
			 * Makes API call to get a pdf of the AECAbsence passes for the students
			 * assigned AEC for the current date
			 */
			$scope.getPasses = function(){
				$scope.getPasses = function(){
					passes.pdf({date:$scope.currentDate, param:'absence'}, function(data){
						var fileURL = URL.createObjectURL(data.response);
						window.open(fileURL);
					})
				};
			}
			
			/**
			 * Select the student that is clicked in the table so that the user doesn't 
			 * have to type it 
			 * @param {int} $index: reftable index of the clicked student 
			 */
			$scope.onSelect = function($index){
				$scope.selected.student = $scope.refTable[$index];
			};
			
			/**
			 * Makes a download prompt of the current AEC list as a csv file
			 * @param {string} text
			 */
			var download = function (text) {
				
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				element.setAttribute('download', 'info.csv');
				element.style.display = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			};
			
			/**
			 * Converts the Kids that were marked with SentOut or Walkout  into a csv text 
			 * format so it can downloaded and Referred to O-Room
			 * be passed to the download method 
			 */
			$scope.oRoomListCSV = function(){
				useractions.query({param:'ORoom'}, function(data){
					//headings
					var text = 'FirstName,LastName,StudentId\n';
					angular.forEach(data,  function(item){
						text +=  item.FirstName + ',' + item.LastName + ',' + item.UserName;
						
						text +=  ' \n';
					})
					download(text);
				})
			};
			
			/******** MANAGE AEC Absence **********/
			// for the next submit functions remove student from list self-reducing list.
			// To avoid duplicate profile entries only 1 entry should be created in
			// useractions table and all referrals must be changed in referrals 
			// table (see backend implementation)
			/**
			 * PUT API call to change the referral status to referred (ReferralStatus 0)
			 * as well as loggin it in the user actions for the profile 
			 * @param {object} data: information returned by modal 
			 * 	(noShow,walkOut, SentOut, schoolAbsent, disciplinary, clear,comment )
			 */
			var submitComment = function (data) {// data:{comment, noShow, walkOut, sentOut}
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
			/** Comment Modal
			 * Opens the Comment modal and passes in the student selected to be available
			 * in the modal context, calls the SubmitComment function when modal
			 * submit button is clicked, does nothing otherwise
			 */
			$scope.openComment = function (studentInfo) {
				var commentModal = $modal.open({
					templateUrl: 'views/modals/CommentAbsenceModal.html',
					size: 'md',
					controller: function ($scope, student) {
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
}(angular.module('Argus')));
(function (app) {
	"use strict";
	app
	.controller("manageAECController", ["$scope",  "$filter", "$modal", "referrals", "PassesService", "StudentsService", "notify",
		function ($scope,  $filter, $modal,  referrals,  passes, students, notify) {
			$scope.selected = {};
			$scope.refTable = [];// table model
			$scope.currentDate = new Date();
			
			/**
				* Watch for changes in the datepicker then load the AECList 
				* For the selected Date. Also adjusts data received
				* to be easily shown in the view
			*/
			$scope.$watch('form.date.$viewValue', function (newVal) {
				
				if (newVal) {//when date has a valid date request the List from that date
					$scope.currentDate = newVal;
					console.log("newVal = " + $scope.form.date.$viewValue);
					
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
			
			
			/**
				* Makes API call to get a pdf of the AEC passes for the students
				* assigned AEC for the current date
			*/
			$scope.getPasses = function(){
				passes.pdf({date:$scope.currentDate, param:'AECList'}, function(data){
					console.log(data);
					var fileURL = URL.createObjectURL(data.response);
					window.open(fileURL);
				})
				
			};
			
			/**
				* Select the student that is clicked in the table so that the user doesn't 
				* have to type it 
				* @param {int} $index: reftable index of the clicked student 
			*/
			$scope.onSelect = function($index){
				$scope.selected.student = $scope.refTable[$index];
			};
			
			
			/**
				* Makes a download prompt of the current AEC list as a csv file
				* @param {string} text
			*/
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
			
			/**
				* Converts the current AEC list into a csv text format so it can
				* be passed to the download method 
			*/
			$scope.AECListCSV = function(){		
				var text = 'TeacherFirst,TeacherLast,FirstName,LastName,StudentId, Grade, Assignment\n';
				angular.forEach($scope.refTable,  function(item){
					angular.forEach(item.referred, function(referred){
						text +=    referred.user.FirstName +', ' + referred.user.LastName+","+item.FirstName + ',' + item.LastName + ',' + item.student.StudentId + ',';
						text +=   item.student.Grade +', '+ referred.assignment.Name;  
						text +=  ' \n';
					});
				})
				download(text);
			};
			
			
			/******** MANAGE AEC **********/
			// for the next submit functions remove student from list self-reducing list.
			// To avoid duplicate profile entries only 1 entry should be created in
			// useractions table and all referrals must be changed in referrals 
			// table (see backend implementation)
			/**
				* PUT API call to change the referral status to present (ReferralStatus 2)
				* as well as loggin it in the user actions for the profile 
				* @param {object} data: information returned by modal (student)
			*/
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
						notify({message: "Present Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});
				})
				//referrals.update({'param':'present','id':student.id},{ data:completedAssignments });
				
				//remove element from table; backend works the logic for completeness and incompleteness
				// and to put the student in AEC Absence list// here or on backend
				removeSelectedStudentFromTableAndClear();
			};
			
			/**
				* PUT API call to change the referral status to reschedule (ReferralStatus 2), 
				* rescheduling all the referrals as well as loggin the reschedule 
				* into user actions for the profile 
				* @param {object} data: information returned by modal (date,comment,student,excused)
			*/
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
					}, function (response){
						notify({message: "Reschedule Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});
				});
				
				removeSelectedStudentFromTableAndClear();
			};
			
			/**
				* PUT API call to change the referral status to clear(ReferralStatus 3), 
				* rescheduling all the referrals as well as loggin the reschedule 
				* into user actions for the profile 
				* @param {object} data: information returned by modal (comment, student)
			*/
			var submitClear = function (data) {
				
				// submit information of student '$scope.selected.student' to the database
				referrals.update({param:'clear', comment:data.comment, id:data.student.referred[0].id}, data,
				function(response){
					
				}, function(response){
						notify({message: "Clear Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
				});
				//remove element from table; backend works the logic for completeness and incompleteness
				// and to put the student in AEC Absence list// here or on backend
				removeSelectedStudentFromTableAndClear();
			};
			
			/**
				* PUT API call to log parent notified information for current student
				* into user actions for the profile. 
				* In the case that parent requested a reschedule $scope.selected student 
				* is changed to the current student and submit reschedule is 
				* on that student, preprocess of data needed(line 193)
				* to provide necessary info for sumit Reschedule 
				* @param {object} data: information returned by modal (student,reschedule,newDate)
			*/
			var submitParentNotified = function (data) {
				var rescheduleComment = "Parent Requested Reschedule";
				console.log(data.student);
				
				
				// Remove Student if reschedule
				if (data.reschedule) {
					// sent a post to the reschedule api point
					angular.extend(data,{comment:rescheduleComment,excused:true, oldDate:$scope.currentDate, date:data.newDate});
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
					},function(response){
						
					}, function(response){
						notify({message: "Parent Notified Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					});
					
					
				}
				
				
			}
			
			/**
				* PUT API call to log student notified information for student clicked
				* 
				* @param {object} ref: student selected
				* @param {int} $index: refTable index of student selected
			*/
			$scope.submitStudentNotified = function(ref, $index){
				
				var studentNotified =ref.student.Notified;
				students.update({id:ref.id}, {Notified:!studentNotified?1:0},function(response){
					console.log(response);
				})
				console.log($scope.refTable[$index]);
			};
			
			/**
				* PUT API call to change the all unprocessed referrals to absent(ReferralStatus 4)
				* as well as logging the absent into user actions for the profile 
			*/
			$scope.finishManageAEC = function(){
				angular.forEach($scope.refTable, function(student){
					angular.forEach(student.referred, function(assignment){
						referrals.update({'id':assignment.id},
						{'param':'absent' }, function(response){
							
						}, function(response){
						notify({message: "Finish Failed, Please Contact The Admin",
						classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
					})
					});
				});
				$scope.refTable = [];
			}
			/********************************************** MODALS   **************************/
			
			/** Present Modal
				* Opens the present modal and passes in the student selected to be available
				* in the modal context, calls the submitPresent function when modal
				* submit button is clicked, does nothing otherwise
			*/
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
			
			/** Reschedule Modal
				* Opens the Reschedule modal and passes in the student selected to be available
				* in the modal context, calls submitReschedule function when modal 
				* submit button is clicked,does nothing otherwise
			*/
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
			
			/** Clear Modal
				* Opens the Clear modal and passes in the student selected to be available
				* in the modal context, calls submitClear function when modal 
				* submit button is clicked,does nothing otherwise
			*/
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
			
			/** Parent Notified Modal
				* Opens the Parent Notified modal and passes in the student selected to be 
				* available in the modal context, as well as the current date. 
				* calls submitParentNotified function when modal submit 
				* button is clicked,does nothing otherwise
				* @param {object} stu: student selected for parent notified
			*/
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
			
			/**
				* Removes $scope.selected student from the refTable and then
				* sets it to null (clear field)
				* 
			*/
			var removeSelectedStudentFromTableAndClear = function(){
				for (var i = 0; i < $scope.refTable.length; i++)
				if ($scope.selected.student.id === $scope.refTable[i].id){
					$scope.refTable.splice(i, 1);
					break;
				}
				$scope.selected.student = null;
			}
			}]);
	
}(angular.module('Argus')));						
(function (app) {
	"use strict";
	app.controller('NavigationCtrl', function () {
			var path = "../Client/Views/dashItems/";
			var vm = this;
			/**
			 * Navigation bar places with their links and icons
			 */
			vm.tabs = [ 
				{
					id: 'Dashboard',
					text: ['Dashboard', 'System'],
					route: path + 'referal.html',
					link: "admin1.dashboard",
					icon: 'dashboard fa-2x'
				}, {
					id: 'Referral System',
					text: ['Referral', 'System'],
					route: path + 'referral.html',
					link: "admin1.referral",
					icon: 'eye fa-2x'
				},
				{
					id: 'AEC List',
					text: ['AEC', 'List'],
					route: path + 'manageAEC.html',
					link: "admin1.AECList",
					icon: 'list-alt fa-2x'
				}, {
					id: 'Absence List',
					text: ['Absence', 'List'],
					route: path + 'manageAECAbsence.html',
					link: "admin1.pending",
					icon: 'exclamation fa-2x'
				}, {
					id: 'Student Data',
					text: ['Student', 'Data'],
					route: path + 'studentInfo.html',
					link: "admin1.studentData",
					icon: 'user fa-2x'
				},{
					id: 'ORoom Activity Log Admin',
					text: ['Oroom', 'Activity', 'log'],
					link: "admin1.oroomActivityLogAdmin",
					icon: 'user fa-2x'
				},{
					id: 'ORoom Activity Log',
					text: ['Oroom', 'Activity', 'log'],
					link: "admin1.oroomActivitiLog",
					icon: 'user fa-2x'
				}
				
				//		, {
				//            id: 'Create Student Pass',
				//            text: ['Create', 'Pass'],
				//            route: path + "multiplePasses.html",
				//            link: "admin1.createStudentPass",
				//            icon: 'file fa-2x'
				//        }
			];
		});
}(angular.module('Argus')));
(function(app){
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
					act.activity = ' Cleared';
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
	
}(angular.module('Argus')));
(function(app){
	"use strict";
	app.
	controller("admin1referalController",
	["$scope", "assignmentsListService",  "teachers", "referrals", "StudentsService", '$modal','notify','$http',
		function ($scope, assignmentsService,teachers, referrals,students,$modal, notify, $http) {
			$scope.selected = {}; // model for the possible selections (selected.student,   or seleted.assignments)
			$scope.currentDate = new Date(); // date on the datepicker
			$scope.teacherStudents = []; // model for autocomplete  
			$scope.refTable = []; // model for dynamic table 
			$scope.edits = [];  
			$scope.eightPeriods = [];
			
			function getTeachers(){
				$scope.teachers = teachers.query(function(data){
					console.log('the teachers')
					console.log(data);
				});
			}
			getTeachers();
			
			/**
			 * Watch for changes in the datepicker to add students to that date's
			 * AEC List
			 */
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
	
			
			/**
			 * Called when a student is selected or deselected 
			 * no action for now 
			 */
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
			
			/**
			 * Called when teacher is selected or deselected. Retrieves the selected
			 * teacher's students if a teacher is selected.  If deselected
			 * set teacherStudents to null
			 */
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
			
			
			/** New Assignment Modal
			 * Opens the New Assignment modal and passes in the teacher selected to be available
			 * in the modal context, on submit makes a post call to assignments
			 * to add the current assignment to the teacher 
			 */
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
			
			/**
			 * Adds selected.student with selected.assignments to the refTable
			 * then clears selected.student
			 */
			$scope.addToList = function(){
				var selectedAssignments  = $scope.selected.assignments;
				var referralToAdd = $scope.selected.student;
				var selectedTeacher = $scope.selected.teacher;
				$http.get('api/classes/'+$scope.selected.student.id).then(function(response){
					var last = response.data[7];
					$scope.eightPeriods.push(last)
					console.log($scope.eightPeriods);
				})
				
				addAssignmentsToStudent(selectedAssignments, referralToAdd);
				referralToAdd.teacher = $scope.selected.teacher;
				$scope.refTable.push(referralToAdd);
				console.log($scope.refTable);
				$scope.selected.student = null;
			}
			
			/**
			 * Adds assignments to the student object 
			 * @param  {[objects]} assignments	: list of assignment objects to be added
			 * @param 	{object} 	student		: 
			 */
			function addAssignmentsToStudent(assignments, student){
				
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
			
			/**
			 * POST API call to referrals. adds all the students in the refTable to the 
			 * current date's AEC list.
			 * Despite the number of assignmets only 1 entry should be loged in 
			 * into user activities with information containig the assignments
			 */
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
				if(studentsReferred.length )
					referrals.save({data:studentsReferred, date:$scope.currentDate}, function(response){

						}, function(response){
							notify({message: "Submit Failed, Please Contact The Admin",
							classes: 'alert-danger', templateUrl: 'views/common/notify.html'});
						});
				//ServerDataModel.createAECList($scope.currentDate, $scope.refTable);
				$scope.refTable = [];
				
			}
			
		}])
		
}(angular.module('Argus')));
(function(app){
	"use strict";
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
}(angular.module('Argus')));
(function(app){
"use strict";
	app.config(['$stateProvider','$urlRouterProvider', '$ocLazyLoadProvider','$provide', 
	function($stateProvider,$urlRouterProvider, $ocLazyLoadProvider,  $provide){
		$ocLazyLoadProvider.config({
			// Set to true if you want to see what and when is dynamically loaded
			debug: false
		});
		$urlRouterProvider.otherwise('/auth');
		$stateProvider
		.state('auth', {
			url: '/auth',
			templateUrl: 'views/login.html',
			controller: 'AuthController as auth',
			data: {pageTitle: "Login", specialClass: "white-bg"}
		})
		.state('admin1', {
			abstract: true,
			url: "/admin1",
			templateUrl: "views/common/contentArgus.html",
			resolve: { 
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
						},
						{
							name: 'angles',
							files: ['js/plugins/chartJs/angles.js']
						},
						{
							files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
						},
						{
							name: 'ui.footable',
							files: ['js/plugins/footable/angular-footable.js']
							}, {
							insertBefore: '#loadBefore',
							files: ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js', 'js/plugins/fullcalendar/gcal.js']
						},
						{
							name: 'ui.calendar',
							files: ['js/plugins/fullcalendar/calendar.js']
						},
						{
							insertBefore: '#loadBefore',
							name: 'localytics.directives',
							files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
						},
						{
							name: 'cgNotify',
							files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
						},
						{
							name: 'ui.slimscroll',
							files: ['js/plugins/slimscroll/angular.slimscroll.js']
						}
						
					]);
				}
			}
		})
		.state('admin1.dashboard', {
			url: "/dashboard",
			templateUrl: 'views/admin1/dashboard.html',
			data: {pageTitle: 'Dashboard'},
			controller: "DashAdmin1Ctrl",
			resolve: {
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
						},
						{
							name: 'datePicker',
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						}
					]);
				}
			}
		})
		.state('admin1.referral', {
			url: "/adminReferral",
			templateUrl: 'views/admin1/Referral.html',
			data: {pageTitle: 'Referral'},
			controller: 'admin1referalController',
			resolve: {
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'datePicker',
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						}
					]);
				}
			}
			
		})
		.state('admin1.AECList', {
			url: "/AECList",
			templateUrl: 'views/sharedItems/manageAEC.html',
			data: {pageTitle: 'AEC List'},
			controller : 'manageAECController',
			resolve: {
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'datePicker',
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						},
						{
							name: 'BarcodeGenerator',
							files: ['css/plugins/barcode/barcode.css', 'js/plugins/barcode/barcode.js']
						}
					]);
				}
			}
			
		})
		.state('admin1.pending', {
			url: "/pending",
			templateUrl: 'views/sharedItems/manageAECabsence.html',
			data: {pageTitle: 'Pending'},
			controller: 'manageAECAbsenceController',
			resolve: {
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'datePicker',
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						}
					]);
				}
			}
		})
		.state('admin1.studentData', {
			url: "/studentData",
			templateUrl: 'views/sharedItems/studentInfo.html',
			data: {pageTitle: 'Student Data'},
			controller: 'studentInfoCtrl',
			resolve: {
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'datePicker',
							files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
						}
					]);
				}
			}
		})
		.state('admin1.createStudentPass', {
			url: "/createStudentPass",
			templateUrl: 'views/sharedItems/multiplePasses.html',
			data: {pageTitle: 'Create Pass'}
		})
	
	}])
	
}(angular.module('Argus')));
(function (app) {
	"use strict";
	app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$provide',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {
			$ocLazyLoadProvider.config({
				// Set to true if you want to see what and when is dynamically loaded
				debug: false
			});
			$urlRouterProvider.otherwise('/auth');
			$stateProvider
				.state('admin2	', {
					abstract: true,
					url: "/admin2",
					templateUrl: "views/common/contentArgus.html",
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'angles',
									files: ['js/plugins/chartJs/angles.js']
								},
								{
									files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
								},
								{
									name: 'ui.footable',
									files: ['js/plugins/footable/angular-footable.js']
								}, {
									insertBefore: '#loadBefore',
									files: ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js', 'js/plugins/fullcalendar/gcal.js']
								},
								{
									name: 'ui.calendar',
									files: ['js/plugins/fullcalendar/calendar.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								},
								{
									name: 'ui.slimscroll',
									files: ['js/plugins/slimscroll/angular.slimscroll.js']
								}

							]);
						}
					}
				})
				.state('admin2.dashboard', {
					url: "/dashboard",
					templateUrl: 'views/admin2/dashboard.html',
					data: {pageTitle: 'Dashboard'},
					controller: "DashAdmin2Ctrl",
					resolve: {
						loadPlugin: function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									files: ['js/plugins/d3/d3.min.js', "js/plugins/jquery-tipsy/jquery.tipsy.js", "css/plugins/gauge/gauge_small.css", "css/plugins/gauge/gauge.css"]
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								}
							]);
						}
					}
				})
				.state('admin1.oroomActivityLogAdmin', {
					url: "/OroomActivityLogA",
					templateUrl: 'views/admin2/oroomActivityLogAdmin.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogAdminCtrl',
					resolve: {
					}
				})
				.state('admin1.oroomActivitiLog', {
					url: "/OroomActivityLog",
					templateUrl: 'views/admin2/oroomActivityLog.html',
					data: {pageTitle: 'Oroom Activity Log'},
					controller: 'oRoomActivityLogCtrl',
					resolve: {
					}
				});
				
		}]);


}(angular.module('Argus')));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (app) {
	app.controller('oRoomActivityLogAdminCtrl', ['$scope', 'notify', 'StudentsService', 'teachers', '$modal', '$interval',
		function ($scope, notify, students, teachers, $modal, $interval) {
			$scope.selected = {student: null};
			$scope.refTable1 = [];
			$scope.refTable2 = [];
			$scope.activities = [
				{name: "In O-Room", value: 0},
				{name: "Assign ISS", value: 1},
				{name: "Walked-Out", value: 2},
				{name: "Other", value: 3},
			];
			
			
			
			$interval(function(){
				var now = new Date();
				$scope.currentTime = formatAMPM(now);
				$scope.currentDate = formatDate(now);
				// check time and change period accordingly 
				$scope.currentPeriod = 3;
				
			},1000);
			
			
			
			 

			students.query({admin: true, light: true}, function (results) {
				console.log("Teacher students");
				console.log(results);

				$scope.schoolStudents = results;
				//testing 
				$scope.selected.student = results[0];
				$scope.onSelectedStudent();
			}, function (error) {
				console.log(error);
			});

			$scope.teachers = teachers.query(function (data) {
				console.log('the teachers');
				console.log(data);
			});

			$scope.onSelectedStudent = function () {
				$scope.selected.student.activity = $scope.activities[0];
				$scope.refTable1.unshift($scope.selected.student);
				$scope.selected.student = null;
				//request the teachers of this student: no

			};
			$scope.onActivitySelected = function (student, oldActivity) {
				console.log(student.activity);
				console.log(oldActivity);
				if (student.activity.value !== 1) {
					return;
				}
				var modalInstance = $modal.open({
					templateUrl: 'views/modals/ISSReferralModal.html'  ,
					//template: '<div> MODAL: assignISS selected</div>',
					size: 'lg',
					controller: function ($scope, student) {
						$scope.student = student;
					},
					resolve: {
						student: function () {
							return student;
						}
					}
				});
				
				modalInstance.result.then(function () {//on SUBMIT
					// post the ISS referral to the database 

					//change switch  to static 
					//student.staticRef = true;
					
					// change teacher to static
					//student.staticTeacher = true;
					
					// change row to non removable
					student.nonRemovable = true;
					
					student.staticActivity = true;

				});
			};
			$scope.onReferralInTrue = function (student) {
				if (student.referralIn === false) {
					return;
				}
				if (!student.sentOutBy) {
					notify({message: 'Please Select A Teacher First'});
					student.referralIn = false;
					return;
				}

				var modalInstance = $modal.open({
					templateUrl: 'views/modals/oRoomReferralModal.html',
					//template:'<div> MODAL : true in Referral IN </div>',
					size: 'lg',
					controller: function ($scope, student) {
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

					//add student to the list on the right
					$scope.refTable2.unshift(student);

					//change switch  to static 
					student.staticRef = true;
					// change teacher to static
					student.staticTeacher = true;
					// change row to non removable
					student.nonRemovable = true;

				});

			}

			function formatAMPM(date) {
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();
				var ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var strTime = hours + ':' + minutes +':'+seconds+ ' ' + ampm;
				return strTime;
			}
			
			function formatDate(date){
				var month = date.getMonth();
				var day = date.getDate();
				var year = date.getFullYear();
				var strDate = month + '/'+ day + "/" + year;
				return strDate;
			}
			
		}]);
}(angular.module('Argus')));
//# sourceMappingURL=admin1Main.js.map
