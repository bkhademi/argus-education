/* global angular */

(function (app) {
	app.controller('OroomRosterCtrl', ['$scope', 'notify', '$modal', 'OroomService', "AECListService",'UtilService',
		function ($scope, notify, $modal, orooms, aec, utils) {
			//$scope.currentDate = new Date();


			$scope.getList = function () {
				orooms.get({roster: true}, function (data) {
					$scope.refTable = data.OroomList;
					$scope.count.oroom = data.OroomList.length;
//				angular.forEach(data.OroomList, function (item) {
//					if (item.counters.ISSDays > 0) {
//						item.overlap = {class: 'bg-danger', msg: 'Has ISS'};
//						var referred = [];
//						angular.forEach(item.referred , function(ref){
//							if((ref.ReferralTypeId === 5 || ref.ReferralTypeId === 6 || ref.ReferralTypeId === 7 || ref.ReferralTypeId === 17 ))
//								referred.push(ref);
//						});
//						item.referred = referred;
//					}
//				});

/*					var to_remove_indexes = [];
					
					angular.forEach(data.OroomList, function (item, $index) {


						var referred = [];
						var hasOroom = false;
						angular.forEach(item.referred, function (ref, $index) {
							if (ref.ReferralTypeId === 12) {
								item.overlap = {class: 'bg-warning', msg: 'Has AEC'};
							}

						});
						var hasiss = false;
						angular.forEach(item.referred, function (ref, $index) {
							
							if ((ref.ReferralTypeId === 5 || ref.ReferralTypeId === 6 || ref.ReferralTypeId === 7
								|| ref.ReferralTypeId === 10 || ref.ReferralTypeId === 17 || ref.ReferralTypeId === 15 )) {
									hasiss = true;
									item.overlap = {class: 'bg-danger', msg: 'Has ISS'};
							}
							referred.push(ref);

							if ((ref.ReferralTypeId === 1 || ref.ReferralTypeId === 2 || ref.ReferralTypeId === 3 || ref.ReferralTypeId === 16 || ref.ReferralTypeId === 10 || ref.ReferralTypeId === 19)) {
								
								hasOroom = true;
							}

						});
						if(hasiss){
							//console.log('Has ISS');
							//console.log(item);
						}
			
						if (!hasOroom) {
							console.log('doesnt have oroom');
							to_remove_indexes.push($index);
						}
						item.referred = referred;

					});

					angular.forEach(to_remove_indexes, function (index, $index) {
						console.log(data.OroomList[index]);
						data.OroomList.splice(index, 1);
					});
*/
					utils.markOroomOverlaps(data.OroomList);
					//console.log(data.OroomList);
				});
			};
			$scope.getList();
			$scope.oRoomAttendance = function (student, $index) {
				var modalInstance;
				console.log('o-room attendance');

				var overlap = false;
				var overlapPlace = '';

				if (student.counters.ISSDays > 0) {
					overlapPlace = 'ISS';
					overlap = true;
				}
//					if (student.counters.OSSPMP > 0) {
//						overlapPlace = 'OSS';
//						overlap = true;
//					}

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
					//template:'<div> MODAL : true in Referral IN </div>',
					size: 'lg',
					controller: function ($scope, student, PeriodsService) {
						$scope.periods = PeriodsService.query();
//						student.hasAEC = false;
//						$scope.showAssignments = false;
//						if(student.overlap && student.overlap.msg === 'Has AEC'){
//							console.log('this student has AEC');
//							student.hasAEC = true;
//						}
//						$scope.referredAEC = 1;
//						
//						$scope.$watch('student.radioModel', function(n,o){
//							if(n && n == 24 && student.hasAEC ){
//								$scope.showAssignments = true;
//							}else{
//								$scope.showAssignments = false;
//							}
//						})
						
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
					
					if(student.radioModel == 24 && student.hasAEC){
						
						var aecPresent = '49';
						var comment = student.comment || '';
						angular.forEach(student.referred, function(item){
							if(item.ReferralTypeId !== 12)
								return;
							console.log(item);
							if(item.assignment.selected){
								comment += '(' + item.assignment.Name +' completed)';
							}else{
								comment += '(' + item.assignment.Name +' incomplete)';
							}
						});
						student.comment = comment;
						console.log(student.comment);
						
					}
					
					
					orooms.update({id: student.referred[0].Id, attendance: true}, {
						ActionType: student.radioModel,
						Comment: student.comment,
						StudentId: student.id
					}, function (data) {
						notify(data.msg);
					}, function (error) {
						notify('error, Before continuing please contact an admin');
					});

					$scope.refTable.splice($index, 1);
					//$scope.selected.student = null;
				}, function () {// on modal DISMISS

				});

			};

			$scope.printList = function () {
				var heading = 'First Name, Last Name, Student ID, Pending Days, Referral Type, 8th period, Attendance\n';
				var text = heading;
				angular.forEach($scope.refTable, function (item) {
					text += item.user.FirstName + ', ' + item.user.LastName + ', ';
					text += item.user.UserName + ',' + item.counters.ORoomsToBeServed + ', ';
					text += item.referred[0].referral_type.Name + ', ';
					text += item.classes[7] ? item.classes[7].professor_class.room.Name : 'N/A';

					text += '\n';
				});

				$scope.download(text, 'O-Room');
			};
		}]);
}(angular.module('Argus')));
