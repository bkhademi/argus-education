/* global angular, api*/

function formatDate(date) {
	console.log(date);
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}


/* referrals $resource */
(function (app) {
	'use strict';
	app
		.factory('referrals', ['$resource', '$filter', function ($resource, $filter) {

			var resource = $resource('api/referrals/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

			var utils = {};
			utils.getList = function(){
				return resource.get({list:true}).$promise;
			}
			utils.deleteReferralsFromStudent = function (student) {
				var toRemoveReferralIds = $filter('filter')(student.referred, function (o) {
					return o.remove;
				});

				toRemoveReferralIds = toRemoveReferralIds.map(function (item) {
					return item.Id;
				});
				var urlEncoded = {id: student.Id, student: true};
				var payload = {
					Comment: student.comment || '',
					Date: $scope.currentDate,
					RemoveAll: student.removingAll,
					StudentId: student.Id,
					ToRemoveReferralIds: toRemoveReferralIds
				};
				var request = resource.update(urlEncoded, payload);
				return request.$promise;
			};

			return angular.extend(utils, resource);


		}]);
}(angular.module("Argus")));

/*custom notify */
(function (app) {
	'use strict';
	app
		.factory('MyNotify', ['notify', function (notify) {
			var templateUrl = 'views/common/notify.html';

			var customNotify = function (msg, type) {
				notify.closeAll();
				var classes = 'alert-'.concat(type);

				notify({message: msg, templateUrl: templateUrl, classes: classes});
			};


			return customNotify;
		}]);

}(angular.module("Argus")));


/* referralsAdmin */
(function (app) {
	'use strict';
	app
		.factory('AdminReferralsService', ['$resource', function ($resource) {
			var ref = $resource('api/admin_referrals/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return ref;
		}]);

}(angular.module("Argus")));

/* Referrals Service */
(function (app) {
	'use strict';
	app.factory('ReferralsService', ['$resource', '$filter', function ($resource, $filter) {

		var resource = $resource('api/referrals/:id', {}, {
			update: {
				method: 'PUT'
			}
		});

		var utils = {};
		utils.deleteReferralsFromStudent = function (date, student) {
			var toRemoveReferralIds = $filter('filter')(student.referred, function (o) {
				return o.remove;
			});

			toRemoveReferralIds = toRemoveReferralIds.map(function (item) {
				return item.Id;
			});
			var urlEncoded = {id: student.Id, student: true};
			var payload = {
				param: 'ClearStudent',
				Comment: student.comment || '',
				Date: date,
				RemoveAll: student.removingAll,
				StudentId: student.Id,
				ToRemoveReferralIds: toRemoveReferralIds
			};
			var request = resource.update(urlEncoded, payload);
			return request.$promise;
		};

		return angular.extend(utils, resource);


	}]);
}(angular.module('Argus')));

/* Activities Admin */
(function (app) {
	'use strict';
	app
		.factory('AdminActivitiesService', ['$resource', function ($resource) {
			var ref = $resource('api/admin_activities/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return ref;
		}]);

}(angular.module("Argus")));

/* Users Admin */
(function (app) {
	'use strict';

	app
		.factory('AdminUsersService', ['$resource', function ($resource) {
			var ref = $resource('api/admin_users/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return ref;
		}]);

}(angular.module("Argus")));

/* Users  */
(function (app) {
	'use strict';

	app
		.factory('UsersService', ['$resource', function ($resource) {
			var ref = $resource('api/users/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return ref;
		}]);

}(angular.module("Argus")));

/* Roles Admin */
(function (app) {
	'use strict';
	app
		.factory('RolesService', ['$resource', function ($resource) {
			var ref = $resource('api/roles/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return ref;
		}]);

}(angular.module("Argus")));

/* schools Admin */
(function (app) {
	'use strict';
	app
		.factory('SchoolsService', ['$resource', function ($resource) {
			var ref = $resource('api/schools/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return ref;
		}]);

}(angular.module("Argus")));
/* ClassStudentsService */
(function (app) {
	'use strict';
	app
		.factory('ClassStudentsService', ['$resource', function ($resource) {
			var ref = $resource('api/classstudents/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return ref;
		}]);

}(angular.module("Argus")));
/* STUDENTS */
(function (app) {
	'use strict';
	app
		.factory('students', ['$resource', function ($resource) {
			// ngResource call to our static data
			var Students = $resource('api/students/:id', {}, {
				update: {
					method: 'PUT',
					headers: {'UserID': 'Yes'}
				}
			});

			function getStudents(teacherId) {
				return Students.query({teacherId: teacherId}).$promise.then(function (results) {
					return results;
				}, function (error) {
					console.log(error);
				});
			}

			function getAllStudents(success, failure) {
				return Students.query({admin: true}, success, failure);
			}

			function getStudent(param, success, failure) {
				return Students.get(param, success, failure);
			}

			return {
				getStudents: getStudents,
				getAllStudents: getAllStudents,
				getStudent: getStudent
			};

		}]);
}(angular.module("Argus")));

/* Students */
(function (app) {
	'use strict';
	app
		.factory('StudentsService', ['$resource','$filter', function ($resource,$filter) {
			var studentsResource = $resource('api/students/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			var obj = {};
			obj.students = studentsResource.query({admin: true, light: true});
			obj.refresh = function () {
				obj.students = studentsResource.query({admin: true, light: true});
			};
			obj.addTodaysAct = function(student){
				student.buttons = [];
				student.aec = $filter("filter")(student.referred,function(referral){
					return referral.ReferralTypeId == 12;
				});
				student.orm = $filter("filter")(student.referred,function(referral){
					return referral.ReferralTypeId == 1 || referral.ReferralTypeId == 2 || referral.ReferralTypeId == 3
						|| referral.ReferralTypeId == 16 || referral.ReferralTypeId == 19;
				});
				student.reteach = $filter("filter")(student.referred,function(referral){
					return referral.ReferralTypeId == 18;
				});
				student.ldentention = $filter("filter")(student.referred,function(referral){
					return referral.ReferralTypeId == 9;
				});
				student.iss = $filter("filter")(student.referred,function(referral){
					return referral.ReferralTypeId == 5 || referral.ReferralTypeId == 6 || referral.ReferralTypeId == 7
						|| referral.ReferralTypeId == 10 || referral.ReferralTypeId == 15 || referral.ReferralTypeId == 17;
				});
				student.oss = $filter("filter")(student.referred,function(referral){
					return referral.ReferralTypeId == 11;
				});
				var name = student.user.FirstName;
				if(student.oss.length > 0){
					student.buttons.push({name:"OSS", color:"OSS", description:""})
				}
				if(student.iss.length > 0){
					var reftype = "Referral Type: " + student.iss[0].referral_type.Name;
					var user = "Assigned By: " + student.iss[0].user.FirstName
					student.buttons.push({name:"ISS", color:"ISS", description: reftype + ", " + user })
				}
				if(student.orm.length > 0){
					var reftype = "Referral Type: " + student.orm[0].referral_type.Name;
					var user = "Assigned By: " + (student.orm[0].teacher.Id == 0 ? student.orm[0].user.FirstName :
						student.orm[0].teacher.FirstName + " " + student.orm[0].teacher.LastName);
					student.buttons.push({name:"ORM", color:"O-Room", description: reftype + ", " + user})
				}
				if(student.reteach.length > 0){
					var reftype = "Referral Type: " + student.reteach[0].referral_type.Name;
					var user = "Assigned By: " + student.reteach[0].teacher.FirstName + " " +
						student.reteach[0].teacher.LastName
					student.buttons.push({name:"RET", color:"Re-Teach", description: reftype + ", " + user})
				}
				if(student.aec.length > 0){
					var reftype = "Referral Type: " + student.aec[0].referral_type.Name;
					var num_assignments = "Number of Assignments: " + student.aec.length
					student.buttons.push({name:"AEC", color:"AEC", description: reftype = reftype + ", " + num_assignments})
				}
				if(student.ldentention.length > 0){
					var tardy_period = "Tardy Period: " + student.ldentention[0].period.Number
					student.buttons.push({name:"LDT", color:"Ldetention", description: tardy_period})
				}
			};
			return angular.extend(studentsResource, obj);
		}]);

}(angular.module("Argus")));


/* professor classes */
(function (app) {
	'use strict';
	app
		.factory('ProfessorClassesService', ['$resource', function ($resource) {
			var students = $resource('api/professorclasses/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

			return students;
		}]);

}(angular.module("Argus")));

/* TEACHERS */
(function (app) {
	'use strict';
	app
		.factory('teachers', ['$resource', function ($resource) {
			var teachers = $resource('api/teachers/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

			return teachers;
		}]);
}(angular.module("Argus")));

/* Periods */
(function (app) {
	app
		.factory("PeriodsService", ["$resource", function ($resource) {
			return $resource('api/periods/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

		}]);
}(angular.module("Argus")));

/* Rooms */
(function (app) {
	app
		.factory("RoomsService", ["$resource", function ($resource) {
			return $resource('api/rooms/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
		}]);
}(angular.module("Argus")));


/* O-Room */
(function (app) {
	app
		.factory("OroomService", ["$resource", "ReferralTypesService", "UtilService", "$filter",'notify',
			function ($resource, types, UtilService, $filter,notify) {
				var resource = $resource('api/oroom/:id', {}, {
					update: {
						method: 'PUT'
					}
				});

				resource.getList = function (date, periodIds) {
					var list = resource.get({roster: true, Date: date, 'Periods[]': periodIds}, function (data) {
						resource.count = data.OroomListCount;
						resource.markOverlaps(data.OroomList);
						resource.markActions(data.OroomList);
					});
					return list.$promise;
				};

				resource.markOverlaps = function (students) {
					angular.forEach(students, function (student) {
						var overlap = UtilService.getStudentOverlaps(student);
						student.referred = $filter('filter')(student.referred, function (o) {
							return o.ReferralTypeId === 1 || o.ReferralTypeId === 2
								|| o.ReferralTypeId === 3 || o.ReferralTypeId === 16
								|| o.ReferralTypeId === 19;
						});
						if (overlap.hasoss)
							angular.extend(overlap, {class: 'bg-danger', msg: 'Has OSS'});
						else if (overlap.hasiss) {
							angular.extend(overlap, {class: 'bg-danger', msg: 'Has ISS'});
							if (overlap.isscleared) {
								overlap.msg = 'ISS Cleared';
								overlap.class = '';
							}
						} else if (overlap.hasreteach)
							angular.extend(overlap, {class: 'bg-warning', msg: 'Has Reteach'});
						else if (overlap.hasaec)
							angular.extend(overlap, {class: 'bg-warning', msg: 'Has AEC'});


						if (angular.equals({}, overlap))
							return;

						student.overlap = overlap;
					});
				};

				resource.markOverlapsReport = function (students) {
					angular.forEach(students, function (student) {
						var overlap = UtilService.getStudentOverlaps(student);
						student.referred = $filter('filter')(student.referred, function (o) {
							return o.ReferralTypeId === 1 || o.ReferralTypeId === 2
								|| o.ReferralTypeId === 3 || o.ReferralTypeId === 16
								|| o.ReferralTypeId === 19;
						});
						if (overlap.hasoss)
							angular.extend(overlap, {class: 'bg-gray', msg: 'Has OSS'});
						else if (overlap.hasiss) {
							angular.extend(overlap, {class: 'bg-gray', msg: 'Has ISS'});
							if (overlap.isscleared) {
								overlap.msg = 'ISS Cleared';
								overlap.class = '';
							}
						} else if (overlap.hasreteach)
							angular.extend(overlap, {class: '', msg: 'Has Reteach'});
						else if (overlap.hasaec)
							angular.extend(overlap, {class: '', msg: 'Has AEC'});


						if (angular.equals({}, overlap))
							return;

						student.overlap = overlap;
					});
				};

				resource.markActions = function (students) {
					angular.forEach(students, function (student) {
						// only use the highest priority referral(  [0]  )
						ref = student.referred[0];
						switch (ref.ActivityTypeId) {

							case 24:// Present
								if (ref.RefferalStatus == 1)
									ref.consequence = {referral_type: {Name: 'Completed'}};
								student.status = {class: 'bg-green'};
								break;
							case 88://
								if (ref.RefferalStatus == 1)
									ref.consequence = {referral_type: {Name: 'Cleared'}};
								student.status = {class: 'bg-green'};
								break;
							case 28:// Sent Out
							case 29:// Walked Out
							case 25:// No Show
								student.status = {class: 'bg-danger'};
								delete student.overlap.class;
								break;
							case 26:// Left School
							case 27:// School Absent
							case 30:// Other
								student.status = {class: 'bg-gray'};
								if (ref.RefferalStatus == 1)
									ref.consequence = {referral_type: {Name: 'ORoom → Re-ORoom'}};
								delete student.overlap.class;
								break;
							default:
								console.log('wrong Activity Type');

						}
						;
					});
				};

				resource.markFromStatus = function (students) {

				};

				resource.copyUpdatedResourceAndMarkActions = function (student, data) {
					if (data.referrals && data.referrals.length != 0)
						student.referred = data.referrals;
					else
						student.referred[0] = data.referral;

					resource.markActions([student]);
				};

				resource.updateAttendance = function (date, student) {
					$toRemoveReferralIds = $filter('filter')(student.referred, function (o) {
						return o.remove;
					});

					$toRemoveReferralIds = $toRemoveReferralIds.map(function (item) {
						return item.Id;
					});
					var urlEncoded = {id: student.referred[0].Id, attendance: true};
					var payload = {
						ActionType: student.ActivityTypeId,
						Comment: student.comment || '',
						Date: date,
						MoveClearToDate: student.moveDate,
						RemoveAll: student.removingAll,
						StudentId: student.Id,
						ToRemoveReferralIds: $toRemoveReferralIds

					};
					var request = resource.update(urlEncoded, payload, function (data) {
						resource.copyUpdatedResourceAndMarkActions(student, data);
						resource.count--;
					}, function(data){
						if(data.status = 409) {// conflict.. referral already taken
							resource.copyUpdatedResourceAndMarkActions(student, data);
							resource.count--;
						}else{
							notify('error, Before continuing please contact the system admin');
						}
					});

					return request.$promise;
				};

				resource.count = 0;

				resource.getCount =  function(){
					resource.get({count: true, roster: true},function(data){
						resource.count  = data.OroomList;
					});

				};

				return resource;
			}]);
}(angular.module("Argus")));

/* Lunch */
(function (app) {
	app
		.factory("LunchService", ["$resource", "UtilService", '$filter',
			function ($resource, UtilService, $filter) {
				var resource = $resource('api/lunch/:id', {}, {
					update: {
						method: 'PUT'
					}
				});


				resource.markOverlaps = function (students) {
					angular.forEach(students, function (student) {
						var overlap = UtilService.getStudentOverlaps(student);
						student.referred = $filter('filter')(student.referred, function (o) {
							return o.ReferralTypeId === 9;
						});
						if (overlap.hasoss)
							angular.extend(overlap, {class: 'bg-danger', msg: 'Has OSS'});
						else if (overlap.hasiss) {
							angular.extend(overlap, {class: 'bg-danger', msg: 'Has ISS'});
							if (overlap.isscleared) {
								overlap.msg = 'ISS Cleared';
								overlap.class = '';
							}
						}

						student.overlap = overlap;
					});
				};

				resource.markOverlapsReport = function (students) {
					angular.forEach(students, function (student) {
						var overlap = UtilService.getStudentOverlaps(student);
						student.referred = $filter('filter')(student.referred, function (o) {
							return o.ReferralTypeId === 9
						});
						if (overlap.hasoss)
							angular.extend(overlap, {class: 'bg-gray', msg: 'Has OSS'});
						else if (overlap.hasiss)
							angular.extend(overlap, {class: 'bg-gray', msg: 'Has ISS'});


						if (angular.equals({}, overlap))
							return;

						student.overlap = overlap;
					});
				};

				resource.markActions = function (students) {
					angular.forEach(students, function (student) {
						// only use the highest priority referral(  [0]  )
						switch (student.referred[0].ActivityTypeId) {
							case 0 :
								console.log('N/A');
								break;
							case 31:// Present
								student.status = {class: 'bg-green'};
								break;
							case 35:// Sent Out
							case 36:// Walked Out
							case 32:// No Show
								student.status = {class: 'bg-danger'};
								break;
							case 33:// Left School
							case 34:// School Absent
							case 37:// Other
								student.status = {class: 'bg-gray'};
								break;
							default:
								console.log('wrong Activity Type');

						}
						;
					});
				};

				resource.copyUpdatedResourceAndMarkActions = function (student, data) {
					angular.extend(student.referred[0], data.referral);
					resource.markActions([student]);
				};

				resource.separateLists = function (students) {

				};


				resource.updateAttendance = function (date, student) {
					var urlEncoded = {id: student.referred[0].Id};
					var payload = {
						ActionType: student.ActivityTypeId,
						Comment: student.comment,
						StudentId: student.Id,
						Date: date
					};
					return resource.update(urlEncoded, payload, function (data) {
						resource.copyUpdatedResourceAndMarkActions(student, data);
						resource.count--;
					}).$promise;


				};

				resource.getList = function (date) {
					var list = resource.get({Date: date}, function (data) {
						resource.count = data.lunchStudentsCount;
						resource.markOverlaps(data.lunchStudents);
						resource.markActions(data.lunchStudents);
					});
					return list.$promise;
				};

				resource.count = 0;

				resource.getCount =  function(){
					resource.get({count: true, roster: true},function(data){
						resource.count  = data.lunchStudentsCount;
					});

				};

				resource.saveReferral = function (date, student) {
					var urlEncoded = {};
					var payload = {
						StudentId: student.Id,
						PeriodId: student.period ? student.period.Id : 0,
						TardyTime: student.tardyTime,
						Date: date
					};
					return resource.save(urlEncoded, payload,function(){resource.count++;}).$promise;
				};


				return resource;

			}]);

}(angular.module("Argus")));

/* ISS */
(function (app) {
	app
		.factory("ISSService", ["$resource", "UtilService", '$filter',
			function ($resource, UtilService, $filter) {
				var resource = $resource('api/iss/:id', {}, {
					update: {
						method: 'PUT'
					}
				});

				var utils = {};

				utils.copyUpdatedResourceAndMarkActions = function (student, data) {
					student.referred = data.referrals;
					utils.markActions([student]);
				};

				utils.updateAttendance = function (date, student) {
					$toRemoveReferralIds = $filter('filter')(student.referred, function (o) {
						return o.remove;
					});

					$toRemoveReferralIds = $toRemoveReferralIds.map(function (item) {
						return item.Id;
					});

					var urlEncoded = {id: student.referred[0].Id};
					var payload = {
						ActionType: student.ActivityTypeId,
						Comment: student.comment || '',
						Date: date,
						MoveClearToDate: student.moveDate,
						RemoveAll: student.removingAll,
						StudentId: student.Id,
						ToRemoveReferralIds: $toRemoveReferralIds
					};

					var request = resource.update(urlEncoded, payload, function (data) {
						utils.copyUpdatedResourceAndMarkActions(student, data);
					});
					return request.$promise;
				};

				utils.semiUpdateAttendance = function (date, student) { // support staff

				};

				utils.markOverlaps = function (students) {

					angular.forEach(students, function (student) {
						var overlap = UtilService.getStudentOverlaps(student);
						student.referred = $filter('filter')(student.referred, function (o) {
							return o.ReferralTypeId === 5 || o.ReferralTypeId === 6
								|| o.ReferralTypeId === 7 || o.ReferralTypeId === 10
								|| o.ReferralTypeId === 17
								;
						});
						if (overlap.hasoss)
							angular.extend(overlap, {class: 'bg-danger', msg: 'Has OSS'});
						else if (overlap.hasorm)
							angular.extend(overlap, {class: 'bg-danger', msg: 'Has ORM'});
						else if (overlap.hasreteach)
							angular.extend(overlap, {class: 'bg-warning', msg: 'Has Reteach'});
						else if (overlap.hasaec)
							angular.extend(overlap, {class: 'bg-warning', msg: 'Has AEC'});


						if (angular.equals({}, overlap))
							return;

						student.overlap = overlap;


					});
				};

				utils.markOverlapsReport = function (students) {
					angular.forEach(students, function (student) {
						var overlap = UtilService.getStudentOverlaps(student);
						student.referred = $filter('filter')(student.referred, function (o) {
							return o.ReferralTypeId === 5 || o.ReferralTypeId === 6
								|| o.ReferralTypeId === 7 || o.ReferralTypeId === 10
								|| o.ReferralTypeId === 11 || o.ReferralTypeId === 15
								|| o.ReferralTypeId === 17
								;
						});
						if (overlap.hasoss)
							angular.extend(overlap, {class: 'bg-gray', msg: 'Has OSS'});
						else if (overlap.hasiss)
							angular.extend(overlap, {class: '', msg: 'Has ISS'});
						else if (overlap.hasreteach)
							angular.extend(overlap, {class: '', msg: 'Has Reteach'});
						else if (overlap.hasaec)
							angular.extend(overlap, {class: '', msg: 'Has has AEC'});


						if (angular.equals({}, overlap))
							return;

						student.overlap = overlap;
					});
				};

				utils.markActions = function (students) {
					angular.forEach(students, function (student) {
						// only use the highest priority referral(  [0]
						switch (student.referred[0].ActivityTypeId) {
							case 0 :
								console.log('N/A');
								break;
							case 38:// Present
								if (student.referred[0].RefferalStatus == 1)
									student.referred[0].consequence = {referral_type: {Name: 'Present'}};
								student.status = {class: 'bg-green'};
								break;
							case 87:// clear
								if (student.referred[0].RefferalStatus == 1)
									student.referred[0].consequence = {referral_type: {Name: 'Cleared'}};
								student.status = {class: 'bg-green'};
								break;
							case 42:// Sent Out
							case 43:// Walked Out
							case 39:// No Show
								student.status = {class: 'bg-danger'};
								delete student.overlap.class;
								break;
							case 40:// Left School
							case 41:// School Absent
							case 47:// Other
							case 91:// Other
							case 86:// reassign
								student.status = {class: 'bg-gray'};
								if (student.referred[0].RefferalStatus == 1)
									student.referred[0].consequence = {referral_type: {Name: 'ISS → Re-ISS'}};
								delete student.overlap.class;
								break;
							default:
								console.log('wrong Activity Type');

						}
						;
					});
				};

				utils.getList = function (date, callback) {
					var list = resource.query({roster: true, Date: date}, function (data) {
						callback && callback(data);
						utils.markOverlaps(data);
						utils.markActions(data);
					});

					return list;
				};

				return angular.extend(resource, utils);
			}]);
}(angular.module("Argus")));


/* ISS Followup Service */
(function (app) {
	app.factory('ISSFollowupService', ['$resource', 'UtilService', '$filter',
		function ($resource, UtilService, $filter) {
			var resource = $resource('api/issfollowup/:id', {}, {
				update: {method: 'PUT'}
			});
			var utils = {};
			utils.getList = function () {
				return resource.query({roster: true}, function (data) {

				});
			};

			utils.updateAttendance = function (student, date) {
				var urlEncoded = {id: student.Id};
				var payload = {Comment: student.comment || '', StudentId: student.StudentId};
				switch (student.ActivityTypeId) {
					case 1:
						payload.param = 'reassign';
						break;
					case 2:
						payload.param = 'oss';
						payload.DateOfSuspensionStart = student.dateOfSuspensionStart;
						payload.DateOfSuspensionEnd = student.dateOfSuspensionEnd;
						payload.MeetingDate = student.meetingDate;
						payload.MeetingTime = student.meetingTime;
						payload.MeetingWithId = student.teacher.id;
						break;
					case 3:
						payload.param = 'clear';
						break;
				}
				return resource.update(urlEncoded, payload).$promise;
			}

			return angular.extend(utils, resource);

		}]);
}(angular.module('Argus')));

/* OSS */
(function (app) {
	app
		.factory("OSSService", ["$resource", "UtilService", '$filter', function ($resource, UtilService, $filter) {
			var resource = $resource('api/oss/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

			var utils = {};

			utils.markOverlaps = function (students) {
				angular.forEach(students, function (student) {
					var overlap = UtilService.getStudentOverlaps(student);

					if (overlap.hasiss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has ISS'});
					else if (overlap.hasorm)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has ORM'});
					else if (overlap.aec)
						angular.extend(overlap, {class: 'bg-warning', msg: 'Has AEC'});

					if (angular.equals({}, overlap))
						return;

					student.overlap = overlap;

				})
			}

			utils.markOverlapsReport = function (students) {
				angular.forEach(students, function (student) {
					var overlap = UtilService.getStudentOverlaps(student);

					if (overlap.hasiss)
						angular.extend(overlap, {class: '', msg: 'Has ISS'});
					else if (overlap.hasorm)
						angular.extend(overlap, {class: '', msg: 'Has ORM'});
					else if (overlap.aec)
						angular.extend(overlap, {class: '', msg: 'Has AEC'});

					if (angular.equals({}, overlap))
						return;

					student.overlap = overlap;

				})
			}

			utils.getParentMeetingList = function () {
				return resource.query({param: 'parentMeetingList'}, function (data) {
					angular.forEach(data, function (ref) {
						debugger;
						if (ref.Date.split(' ')[0] == ref.DateEnd)
							ref.DateEnd = null;

					})
				});
			};

			utils.updateParentMeetingInformation = function (referral) {
				var urlEncoded = {id: referral.Id};
				var payload = {};
				payload.PMPInfo = true;
				payload.DateOfSuspension = referral.dateOfSuspension;
				payload.MeetingDate = referral.meetingDate;
				payload.MeetingTime = referral.meetingTime;
				payload.MeetingWithId = referral.teacher.id;
				return resource.update(urlEncoded, payload, function (data) {
					debugger;
					angular.extend(referral, data.referral);
				}).$promise;
			};

			utils.updateParentMeetingAttendance = function (referral) {
				var urlEncoded = {id: referral.Id};
				var payload = {
					StudentId: referral.student_user.id,
					Comment: referral.comment
				};
				switch (referral.ActivityTypeId) {
					case 1:
						$toRemoveReferralIds = $filter('filter')(referral.student_user.student.referred, function (o) {
							return o.remove;
						});

						$toRemoveReferralIds = $toRemoveReferralIds.map(function (item) {
							return item.Id;
						});
						angular.extend(payload, {
							attendance: true,
							ToRemoveReferralIds: $toRemoveReferralIds
						});

						break;
					case 2:
						angular.extend(payload, {noshow: true})
						break;
					case 3:
						angular.extend(payload, {
							DateOfSuspension: student.dateOfSuspension,
							MeetingDate: student.meetingDate,
							MeetingTime: student.meetingTime,
							MeetingWithId: student.teacher.id

						})
						break;
				}
				return resource.update(urlEncoded, payload).$promise;
			};

			utils.getOSSList = function (date, callback) {
				return resource.query({param: 'ossList', Date: date}, callback);
			}

			return angular.extend(resource, utils);

		}]);
}(angular.module("Argus")));

/* OSS Followup */
(function (app) {
	app
		.factory("OSSFollowupService", ["$resource", "UtilService", '$filter', function ($resource, UtilService, $filter) {
			var resource = $resource('api/ossfollowup/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			var utils = {};
			utils.getList = function (date) {
				return resource.query({roster: true});
			};
			utils.updateParentMeetingInformation = function (referral) {
				var urlEncoded = {id: referral.Id};
				var payload = {};
				payload.PMPInfo = true;
				payload.DateOfSuspension = referral.dateOfSuspension;
				payload.MeetingDate = referral.meetingDate;
				payload.MeetingTime = referral.meetingTime;
				payload.MeetingWithId = referral.teacher.id;
				return resource.update(urlEncoded, payload, function (data) {
					debugger;
					angular.extend(referral, data.referral);
				}).$promise;
			};

			return angular.extend(resource, utils);
		}]);
}(angular.module("Argus")));

/* ASP */
(function (app) {
	app
		.factory("ASPService", ["$resource", 'UtilService', '$filter', function ($resource, UtilService, $filter) {
			var resource = $resource('api/asp/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

			var utils = {};

			utils.markOverlaps = function (students) {
				angular.forEach(students, function (student) {
					var overlap = UtilService.getStudentOverlaps(student);

					if (overlap.hasoss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has OSS'});
					else if (overlap.hasiss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has ISS'});
					else if (overlap.hasorm)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has ORM'});
					else if (overlap.aec)
						angular.extend(overlap, {class: 'bg-warning', msg: 'Has AEC'});

					if (angular.equals({}, overlap))
						return;

					student.overlap = overlap;

				})
			}

			return angular.extend(resource, utils);
		}]);
}(angular.module("Argus")));

/* AEC List */
(function (app) {
	app.factory("AECListService", ["$http", '$resource', 'ReferralTypesService', '$filter', 'UtilService',
		function ($http, $resource, types, $filter, UtilService) {

			var resource = $resource('api/aeclist/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			var utils = {};

			utils.markOverlaps = function (data, schoolId) {

				angular.forEach(data, function (student) {
					var overlap = UtilService.getStudentOverlaps(student);
					//  get rid of other referrals and only leave AEC
					student.referred = $filter('filter')(student.referred, function (o) {
						return o.ReferralTypeId === 12;
					});
					if (overlap.hasoss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has OSS'});
					else if (overlap.hasiss) {
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has ISS'});
						if (overlap.isscleared) overlap.msg = 'ISS Cleared';
					} else if (overlap.hasorm) {
						angular.extend(overlap, {class: 'bg-danger', msg: 'Has ORM'});
						if (overlap.ormcleared) overlap.msg = 'ORM Cleared';
					} else if (overlap.hasreteach)
						angular.extend(overlap, {class: 'bg-warning', msg: 'Has Reteach'});


					if (angular.equals({}, overlap))
						return;

					student.overlap = overlap;
				});
			};

			utils.markOverlapsReport = function (data, schoolId) {

				angular.forEach(data, function (student) {
					var overlap = UtilService.getStudentOverlaps(student);
					//  get rid of other referrals and only leave AEC
					student.referred = $filter('filter')(student.referred, function (o) {
						return o.ReferralTypeId === 12;
					});
					if (overlap.hasoss)
						angular.extend(overlap, {class: 'bg-gray', msg: 'Has OSS'});
					else if (overlap.hasiss)
						angular.extend(overlap, {class: 'bg-gray', msg: 'Has ISS'});
					else if (overlap.hasorm)
						angular.extend(overlap, {class: 'bg-gray', msg: 'Has ORM'});
					else if (overlap.hasreteach)
						angular.extend(overlap, {class: 'bg-gray', msg: 'Has Reteach'});


					if (angular.equals({}, overlap))
						return;

					student.overlap = overlap;
				});
			};

			utils.markActions = function (data) {
				angular.forEach(data, function (student) {

					var assignments = {completed: [], incompleted: []};
					student.activity = student.referred[0].activity || {};
					student.ActivityTypeId = student.referred[0].ActivityTypeId;
					var onlyAEC = $filter('filter')(student.referred, function (o) {
						return o.ReferralTypeId === 12;
					})
					student.referred = onlyAEC;
					angular.forEach(onlyAEC, function (ref) {
						ref.HasFolder = (ref.HasFolder === 1 || ref.hasFolder ) ? true : false;
						if (ref.ActivityTypeId === 49) {// present, check what assignments were completed
							ref.AssignmentCompleted = (ref.AssignmentCompleted === 1 || ref.AssignmentCompleted) ? true : false;
							if (ref.AssignmentCompleted)
								assignments.completed.push(ref);
							else
								assignments.incompleted.push(ref);

							student.activity.Name = 'Present: ';
						}
					});
					switch (student.ActivityTypeId) {
						case 49:// present

							if (assignments.incompleted.length === 0) {
								student.status = {class: 'bg-green'};
								student.activity.Name += 'complete'
							} else {
								student.status = {class: 'bg-green'};
								student.activity.Name += 'incomplete';
							}
							if (student.referred[0].RefferalStatus == 2)
								student.referred[0].consequence = {referral_type: {Name: 'Completed'}};
							break;
						case 55: // sent out
						case 56: // walked out
						case 52: // no show
							student.status = {class: 'bg-danger'};
							break;

						case 51: // cleared
							student.status = {class: 'bg-green'};
							if (student.referred[0].RefferalStatus == 2)
								student.referred[0].consequence = {referral_type: {Name: 'Cleared'}};
							break;
						case 53:// Left School
						case 54:// School Absent
						case 57:// Other
						case 50: // rescheduled
							student.status = {class: 'bg-gray'};
							if (student.referred[0].RefferalStatus == 2)
								student.referred[0].consequence = {referral_type: {Name: 'AEC → Re-AEC'}};
							break;
					}
					if (student.referred[0].RefferalStatus == 4) {
						student.status = {class: 'bg-warning'};
					}
				});
			};

			utils.markFromStatus = function (data) {
				angular.forEach(data, function (student) {
					angular.forEach(student.referred, function (ref) {
						switch (ref.RefferalStatus) {
							case 0://

								break;
							case 1:
								break;
							case 2:
								break;
							case 3:
								break;
							case 4:
								student.activity.Name = "Pending Followup";
								break;
						}
					});
				});
			};

			utils.copyUpdatedResourceAndMarkActions = function (student, data) {
				if (data.wasClear) {
					student.referred = data.referrals;
				} else {
					angular.forEach(data.referrals, function (ref, $index) {
						angular.extend(student.referred[$index], ref);
					});
				}
				utils.markActions([student]);

			};

			utils.updateAttendance = function (currentDate, student) {

				if (student.ActivityTypeId == 50)
					return utils.updateAttendanceReschedule(currentDate, student);
				else if (student.ActivityTypeId == 51)
					return utils.updateAttendanceClear(currentDate, student);

				// sent when present
				var referrals = student.referred.map(function (o) {
					return {Id: o.Id, AssignmentCompleted: o.AssignmentCompleted};
				});
				// sent otherwise
				var referralIds = student.referred.map(function (o) {
					return o.Id;
				});
				var urlEncoded = {id: student.Id};
				var payload = {
					param: 'attendance',
					ActionType: student.ActivityTypeId,
					Comment: student.comment,
					Date: currentDate,
					Referrals: student.ActivityTypeId == 49 ? referrals : referralIds
				};

				return resource.update(urlEncoded, payload, function (data) {
					utils.copyUpdatedResourceAndMarkActions(student, data);
				}).$promise;

			};

			utils.updateAttendanceReschedule = function (date, student) {
				debugger;

				var referrals = student.referred.map(function (o) {
					return o.Id;
				});
				var urlEncoded = {id: student.Id};
				var payload = {
					param: 'reschedule',
					Comment: student.comment,
					newDate: student.rescheduleDate,
					Date: date,
					ReferralIds: referrals,
					excused: student.excused
				};

				return resource.update(urlEncoded, payload, function (data) {
					utils.copyUpdatedResourceAndMarkActions(student, data);
				}).$promise;
			};

			utils.updateAttendanceClear = function (date, student) {
				$toRemoveReferralIds = $filter('filter')(student.referred, function (o) {
					return o.remove;
				});

				$toRemoveReferralIds = $toRemoveReferralIds.map(function (item) {
					return item.Id;
				});
				var urlEncoded = {id: student.referred[0].Id, attendance: true};
				var payload = {
					param: 'clear',
					ActionType: student.ActivityTypeId,
					Comment: student.comment || '',
					Date: date,
					MoveClearToDate: student.moveDate,
					RemoveAll: student.removingAll,
					StudentId: student.Id,
					ToRemoveReferralIds: $toRemoveReferralIds

				};
				debugger;
				var request = resource.update(urlEncoded, payload, function (data) {
					utils.copyUpdatedResourceAndMarkActions(student, data);
				});

				return request.$promise;

			};

			// data = { comment, date, excused, student}
			utils.updateReschedule = function (currentDate, data) {
				var student = data.student;

				var referrals = student.referred.map(function (o) {
					return o.Id;
				});
				var urlEncoded = {id: student.Id};
				var payload = {
					param: 'reschedule',
					Comment: data.comment,
					newDate: data.date,
					Date: currentDate,
					ReferralIds: referrals,
					excused: data.excused
				};

				return resource.update(urlEncoded, payload, function (data) {
					utils.copyUpdatedResourceAndMarkActions(student, data);
				}).$promise;
			};

			utils.updateClear = function (currentDate, student, comment) {
				var referralsIds = student.referred.map(function (o) {
					return o.Id;
				});
				var urlEncoded = {id: student.Id};
				var payload = {
					param: 'clear',
					Date: currentDate,
					Comment: comment,
					ReferralIds: referralsIds
				};
				return resource.update(urlEncoded, payload, function (data) {
					utils.copyUpdatedResourceAndMarkActions(student, data);
				}).$promise;
			};

			utils.submitList = function (students, date) {
				var promises = [];
				/*var overlaps = $filter('filter')(students, function (o) {
				 o = o.overlap;
				 return o.hasoss || o.hasiss || o.hasorm || o.hasreteach;
				 });
				 var overlapIds = overlaps.map(function (o) {
				 return o.Id;
				 });*/
				var payload = {
					param: 'commitAEC',
					Date: date,
				};


				return resource.update({id: 1}, payload, function (data) {
					angular.forEach(students, function (student) {
						if (student.ActivityTypeId !== 0) {//|| overlapIds.indexOf(student.Id) !== -1 )
							student.referred[0].referralStatus = 2;
							return;
						}
						student.activity.Name = "Pending Followup";
						student.referred[0].RefferalStatus = 4;
					});
				}).$promise;

			};

			utils.updateOverlapAttendance = function (date, student) {
				var referrals = student.referred.map(function (o) {
					return {Id: o.Id, HasFolder: o.HasFolder || false};
				});

				var payload = {
					param: 'attendance',
					param2: 'hasFolders',
					ActionType: student.ActionTypeId,
					Comment: student.comment,
					Date: date,
					Referrals: referrals
				};
				var urlEncoded = {id: student.Id};
				return resource.update(urlEncoded, payload, function (data) {
					utils.copyUpdatedResourceAndMarkActions(student, data);
				}).$promise;
			};

			utils.getList = function (date, callback) {
				var list = resource.query({Date: date}, function (data) {
					callback && callback(data);
					utils.markOverlaps(data);
					utils.markActions(data);
					utils.markFromStatus(data);
				});
				return list;
			};

			return angular.extend(resource, utils);


		}]);
}(angular.module("Argus")));

/* Reteach List */
(function (app) {
	app.factory("ReteachListService", ['$resource', 'UtilService', '$filter', function ($resource, UtilService, $filter) {
		var resource = $resource('api/reteachlist/:id', {}, {
			update: {
				method: 'PUT'
			}
		});

		var utils = {};

		utils.copyUpdatedResourceAndMarkActions = function (student, data) {
			angular.forEach(data.referrals, function (ref, $index) {
				angular.extend(student.referred[$index], ref);
			});
			utils.markActions([student]);

		};

		utils.markOverlaps = function (students, schoolId) {
			angular.forEach(students, function (student) {
				var overlap = UtilService.getStudentOverlaps(student);
				//  get rid of other referrals and only leave reteach
				//debugger;
				student.referred = $filter('filter')(student.referred, function (o) {
					return o.ReferralTypeId === 18;
				});

				if (overlap.hasoss)
					angular.extend(overlap, {class: 'bg-danger', msg: 'Has OSS'});
				else if (overlap.hasiss) {
					angular.extend(overlap, {class: 'bg-danger', msg: 'Has ISS'});
					if (overlap.isscleared) overlap.msg = 'ISS Cleared';
				} else if (overlap.hasorm) {
					angular.extend(overlap, {class: 'bg-danger', msg: 'Has ORM'});
					if (overlap.ormcleared) overlap.msg = 'ORM Cleared';
				} else if (overlap.hasaec)
					angular.extend(overlap, {class: 'bg-warning', msg: 'Has AEC'});


				if (angular.equals({}, overlap))
					return;

				student.overlap = overlap;
			})
		};

		utils.markOverlapsReport = function (students, schoolId) {
			angular.forEach(students, function (student) {
				var overlap = UtilService.getStudentOverlaps(student);
				//  get rid of other referrals and only leave reteach
				//debugger;
				student.referred = $filter('filter')(student.referred, function (o) {
					return o.ReferralTypeId === 18;
				});

				if (overlap.hasoss)
					angular.extend(overlap, {class: 'bg-gray', msg: 'Has OSS'});
				else if (overlap.hasiss)
					angular.extend(overlap, {class: 'bg-gray', msg: 'Has ISS'});
				else if (overlap.hasorm)
					angular.extend(overlap, {class: 'bg-gray', msg: 'Has ORM'});
				else if (overlap.hasaec)
					angular.extend(overlap, {class: '', msg: 'Has AEC'});


				if (angular.equals({}, overlap))
					return;

				student.overlap = overlap;
			})
		};

		utils.markActions = function (students) {
			//debugger;
			angular.forEach(students, function (student) {
				student.activity = student.referred[0].activity || {};
				student.ActivityTypeId = student.referred[0].ActivityTypeId;
				switch (student.ActivityTypeId) {
					case 75: // sent out
					case 70: // walked out
					case 67: // no show
						student.status = {class: 'bg-danger'};
						break;

					case 66: // cleared
					case 64:// present
						student.status = {class: 'bg-green'};
						if (student.referred[0].RefferalStatus == 2)
							student.referred[0].consequence = {referral_type: {Name: 'Completed'}};
						break;
					case 68:// Left School
					case 69:// School Absent
					case 71:// Other
					case 65: // rescheduled
						student.status = {class: 'bg-gray'};
						if (student.referred[0].RefferalStatus == 2)
							student.referred[0].consequence = {referral_type: {Name: 'Reteach → Re-Reteach'}};
						break;
				}
				if (student.referred[0].RefferalStatus == 8) {
					student.status = {class: 'bg-warning'};
				}
			});
		};

		utils.markFromStatus = function (data) {
			angular.forEach(data, function (student) {
				angular.forEach(student.referred, function (ref) {
					switch (ref.RefferalStatus) {
						case 0://

							break;
						case 1:
							break;
						case 2:
							break;
						case 3:
							break;
						case 8:
							student.activity.Name = "Pending Followup";
							break;
					}
				});
			});
		};

		utils.updateAttendance = function (date, student) {


			// sent when present
			var referrals = student.referred.map(function (o) {
				return {Id: o.Id, AssignmentCompleted: o.AssignmentCompleted};
			});
			// sent otherwise
			var referralIds = student.referred.map(function (o) {
				return o.Id;
			});

			var urlEncoded = {id: student.Id};
			var payload = {
				param: 'attendance',
				ActionType: student.ActivityTypeId,
				Comment: student.comment,
				Date: date,
				Referrals: student.ActivityTypeId == 64 ? referrals : referralIds
			};

			return resource.update(urlEncoded, payload, function (data) {
				utils.copyUpdatedResourceAndMarkActions(student, data);
			}).$promise;

		};


		utils.updateReschedule = function (date, student) {

		};

		utils.updateClear = function (date, student) {

		};

		utils.submitList = function (students, date) {
			var payload = {
				param: 'commitReteach',
				Date: date,
			};


			return resource.update({id: 1}, payload, function (data) {
				angular.forEach(students, function (student) {
					if (student.ActivityTypeId !== 0) {//|| overlapIds.indexOf(student.Id) !== -1 )
						student.referred[0].referralStatus = 2;
						return;
					}
					student.activity.Name = "Pending Followup";
					student.referred[0].RefferalStatus = 8;
				});
			}).$promise;

		};

		utils.getList = function (date, callback) {
			var list = resource.query({Date: date}, function (data) {
				callback && callback(data);
				utils.markOverlaps(data);
				utils.markActions(data);
				utils.markFromStatus(data);
			});
			return list;
		};

		return angular.extend(resource, utils);
	}]);
}(angular.module("Argus")));

/* AEC Absence */
(function (app) {

	app.factory("AECAbsenceListService", ["$http", '$resource', 'UtilService', '$filter',
		function ($http, $resource, UtilService, $filter) {
			var resource = $resource('api/aecabsencelist/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

			var utils = {};

			utils.getList = function (date, callback) {
				var list = resource.query({Date: date}, utils.markOverlaps);
				return list;
			};

			utils.markOverlaps = function (data, schoolId) {

				angular.forEach(data, function (student) {
					var overlap = UtilService.getStudentOverlaps(student);
					//  get rid of other referrals and only leave AEC
					student.referred = $filter('filter')(student.referred, function (o) {
						return o.ReferralTypeId === 12;
					});
					if (overlap.hasoss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Had OSS'});
					else if (overlap.hasiss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Had ISS'});
					else if (overlap.hasreteach)
						angular.extend(overlap, {class: 'bg-warning', msg: 'Had Reteach'});
					else if (overlap.hasorm)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Had ORM'});


					if (angular.equals({}, overlap))
						return;

					student.overlap = overlap;
				});
			};

			utils.updateAttendance = function (date, student) {
				//  One Request
				var referralIds = student.referred.map(function (o) {
					return o.Id;
				});
				var referred = student.referred.map(function (o) {
					return {Id: o.Id, HasFolder: o.HasFolder, assignment: o.assignment};
				});
				var urlEncoded = {id: student.id};
				var payload = {
					ActionType: student.radioModel,
					Comment: student.comment,
					Date: date,
					referrals: referralIds,
					referred: referred
				};
				return resource.update(urlEncoded, payload).$promise;

			};


			return angular.extend(resource, utils);

		}]);
}(angular.module("Argus")));

/* Reteach Absence List */
(function (app) {

	app.factory("ReteachAbsenceListService", ['$resource', 'UtilService', '$filter',
		function ($resource, UtilService, $filter) {
			var resource = $resource('api/reteachaecabsencelist/:id', {}, {
				update: {
					method: 'PUT'
				}
			});


			var utils = {};


			utils.getList = function (date, callback) {
				var list = resource.query({Date: date});
				return list;
			};

			utils.markOverlaps = function (data, schoolId) {
				angular.forEach(data, function (student) {
					var overlap = UtilService.getStudentOverlaps(student);
					//  get rid of other referrals and only leave AEC
					student.referred = $filter('filter')(student.referred, function (o) {
						return o.ReferralTypeId === 18;
					});
					if (overlap.hasoss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Had OSS'});
					else if (overlap.hasiss)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Had ISS'});
					else if (overlap.hasaec)
						angular.extend(overlap, {class: 'bg-warning', msg: 'Had AEC'});
					else if (overlap.hasorm)
						angular.extend(overlap, {class: 'bg-danger', msg: 'Had ORM'});


					if (angular.equals({}, overlap))
						return;

					student.overlap = overlap;
				});
			};

			utils.updateAttendance = function (date, student) {
				//  One Request
				var referralIds = student.referred.map(function (o) {
					return o.Id;
				});
				var referred = student.referred.map(function (o) {
					return {Id: o.Id, HasFolder: o.HasFolder, assignment: o.assignment};
				});
				var urlEncoded = {id: student.id};
				var payload = {
					ActionType: student.radioModel,
					Comment: student.comment,
					Date: date,
					referrals: referralIds,
					referred: referred
				};
				return resource.update(urlEncoded, payload).$promise;
			}


			return angular.extend(resource, utils);

		}]);
}(angular.module("Argus")));


/* Activities */
(function (app) {
	app
		.factory("ActivitiesService", ["$resource", function ($resource) {
			return $resource('api/activities/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

		}]);
}(angular.module("Argus")));

/* Counters */
(function (app) {
	app
		.factory("CountersService", ["$resource", function ($resource) {
			return $resource('api/counters/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

		}]);
}(angular.module("Argus")));

/* Utility Functions */
(function (app) {
	app
		.factory("UtilService", ['ReferralTypesService', function (types) {
			return {
				markOroomOverlaps: function (students) {
					angular.forEach(students, function (student) {
						var status = {classs: '', action: ''};
						var overlap = {};
						var hasoss = false, hasiss = false, hasaec = false, hasoroom = false, hasreteach = false;
						angular.forEach(student.referred, function (ref, $index) {
							if (types.isAEC(ref.ReferralTypeId))
								hasaec = true;
//								else if (types.isORM(ref.ReferralTypeId))
//									hasoroom = true;
							else if (types.isISS(ref.ReferralTypeId))
								hasiss = true;
							else if (types.isOSS(ref.ReferralTypeId))
								hasoss = true;
							else if (types.isReteach(ref.ReferralTypeId))
								hasreteach = true;
						});
						if (hasoss)
							overlap = {class: 'bg-danger', msg: 'Has OSS'};
						else if (hasiss)
							overlap = {class: 'bg-danger', msg: 'Has ISS'};
//							else if (hasoroom)
//								overlap = {class: 'bg-warning', msg: 'Has ORoom'};
						else if (hasaec)
							overlap = {class: 'bg-warning', msg: 'Has AEC'};
						else if (hasreteach)
							overlap = {class: 'bg-warning', msg: 'Has Reteach'};
						student.overlap = overlap;

					});

				},

				getStudentOverlaps: function (student) {
					var overlap = {};
					angular.forEach(student.referred, function (ref) {

						if (types.isORM(ref.ReferralTypeId)) {
							overlap.hasorm = true;
							if (ref.ActivityTypeId == 88) overlap.ormcleared = true;
						} else if (types.isISS(ref.ReferralTypeId)) {
							overlap.hasiss = true;
							if (ref.ActivityTypeId == 87) overlap.isscleared = true;
						}
						else if (types.isOSS(ref.ReferralTypeId))
							overlap.hasoss = true;
						else if (types.isReteach(ref.ReferralTypeId)) {
							overlap.hasreteach = true;
							if (ref.ActivityTypeId == 66) overlap.reteachcleared = true;
						} else if (types.isAEC(ref.ReferralTypeId)) {
							overlap.hasaec = true;
							if (ref.ActivityTypeId == 51) overlap.aeccleared = true;
						}
					});
					return overlap;
				},
				getShades: function (color1, color2, shades) {
					var midpoints = shades - 2;
					// remove hashtag
					color1 = color1.substr(1);
					color2 = color2.substr(1);
					var color1Comp = {
						R: ParseInt(color1.slice(0, 2), 16),
						B: ParseInt(color1.slice(2, 4), 16),
						G: ParseInt(color1.slice(4), 16)
					};
					var color2Comp = {
						R: ParseInt(color2.slice(0, 2), 16),
						B: ParseInt(color2.slice(2, 4), 16),
						G: ParseInt(color2.slice(4), 16)
					};

					var stepsSizes = {
						R: stepSize(color1Comp.R, color2Comp.R),
						B: stepSize(color1Comp.B, color2Comp.B),
						G: stepSize(color1Comp.G, color2Comp.G)
					};

					function stepSize(c1, c2) {
						return (ceil(abs(c1 - c2)) / (midpoints + 1) );
					}

					function shade(c1, c2, i) {

					}

					var shades = [];
					for (var i; i < midpoints; i++) {
						var newShadeComponents = {
							R: shade(color1Comp.R, color2Comp.R),
							B: shade(color1Comp.B, color2Comp.B),
							G: shade(color1Comp.G, color2Comp.G)
						};

					}

					return shades;
				},
				downloadCSV: function (text, fileName) {
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(text));
					element.setAttribute('download', fileName + '.csv');
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				}

			};

		}]);
}(angular.module("Argus")));

/* Referral Types */
(function (app) {
	app.factory('ReferralTypesService', function () {
		return {
			oroom: [1, 2, 3, 16, 19],
			aec: [12],
			iss: [5, 6, 7, 10, 15, 17],
			reteach: [18],
			oss: [11],
			isAEC: function (type) {
				return this.aec.indexOf(type) !== -1;
			},
			isORM: function (type) {
				return this.oroom.indexOf(type) !== -1;
			},
			isISS: function (type) {
				return this.iss.indexOf(type) !== -1;
			},
			isOSS: function (type) {
				return this.oss.indexOf(type) !== -1;
			},
			isReteach: function (type) {
				return this.reteach.indexOf(type) !== -1;
			}
		};
	});

}(angular.module("Argus")));

/* Development Common Functions */
(function (app) {
	app
		.factory("DevService", ["$resource", function ($resource) {
			return {
				openError: function (error) {
					var wnd = window.open("about:blank", "", "_blank");
					wnd.document.write(error.data);
				}
			};

		}]);
}(angular.module("Argus")));

/* Time Format Functions */
(function (app) {
	app
		.factory("FormatTimeService", ["$resource", function ($resource) {
			return {
				formatAMPM: function (date) {
					var hours = date.getHours();
					var minutes = date.getMinutes();
					var seconds = date.getSeconds();
					var ampm = hours >= 12 ? 'pm' : 'am';
					hours = hours % 12;
					hours = hours ? hours : 12; // the hour '0' should be '12'
					hours = hours < 10 ? '0' + hours : hours;
					minutes = minutes < 10 ? '0' + minutes : minutes;
					seconds = seconds < 10 ? '0' + seconds : seconds;
					var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
					return strTime;
				},
				formatTime24: function (date) {
					var hours = date.getHours();
					var minutes = date.getMinutes();
					var seconds = '00';
					hours = hours < 10 ? '0' + hours : hours;
					minutes = minutes < 10 ? '0' + minutes : minutes;
					var strTime = hours + ":" + minutes + ":" + seconds;
					return strTime;
				},
				formatDate: function (date) {
					var month = date.getMonth() + 1;
					var day = date.getDate();
					var year = date.getFullYear();
					var strDate = month + '/' + day + "/" + year;
					return strDate;
				}
			};

		}]);
}(angular.module("Argus")));

/* UserActions */
(function (app) {
	'use strict';
	app
		.factory('UserActionsService', ["$resource", function ($resource) {
			return $resource('api/useractions/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
		}]);

}(angular.module("Argus")));

/* Passes Service */
(function (app) {
	app.factory("PassesService", ["$resource", function ($resource) {
		return $resource(api + "printPasses/:id", {}, {
			pdf: {
				method: 'POST',
				headers: {accept: 'application/pdf'},
				responseType: 'arraybuffer',
				cache: true,
				transformResponse: function (data) {

					var pdf;
					if (data) {
						pdf = new Blob([data], {type: 'application/pdf'});
					}
					return {
						response: pdf
					};
				}
			}
		});
	}]);
}(angular.module("Argus")));

/* Reports Service */
(function (app) {
	app.factory('ReportsService', ['$resource', function ($resource) {
		return $resource(api + "report-eod-all-pdf", {}, {
			EODAll: {
				method: 'GET',
				headers: {accept: 'application/pdf'},
				responseType: 'arraybuffer',
				cache: true,
				transformResponse: function (data) {

					var pdf;
					if (data) {
						pdf = new Blob([data], {type: 'application/pdf'});
					}
					return {
						response: pdf
					};
				}
			}
		});
	}])

}(angular.module('Argus')));

/* Assignments File */
(function (app) {
	app.factory("assignmentsService", ["$resource", function ($resource) {
		return $resource("/api/assignments/:id", {id: '@id'}, {
			pdf: {
				method: 'GET',
				headers: {accept: 'application/pdf'},
				responseType: 'arraybuffer',
				cache: true,
				transformResponse: function (data) {
					console.log(data);
					var pdf;
					if (data) {
						pdf = new Blob([data], {type: 'application/pdf'});
					}
					return {
						response: pdf
					};
				}
			}
		});
	}]);
}(angular.module("Argus")));

/* Assignments List */
(function (app) {
	app.factory("assignmentsListService", ["$resource", function ($resource) {
		return $resource("/api/assignments/:id", {id: '@id'}, {
			pdf: {
				method: 'GET',
				headers: {accept: 'application/pdf'},
				responseType: 'arraybuffer',
				cache: true,
				transformResponse: function (data) {
					console.log(data);
					var pdf;
					if (data) {
						pdf = new Blob([data], {type: 'application/pdf'});
					}
					return {
						response: pdf
					};
				}
			}
		});
	}]);
}(angular.module("Argus")));

/* Classes */
(function (app) {
	app
		.factory("classesService", ["$resource", function ($resource) {
			return $resource('api/classes/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

		}]);
}(angular.module("Argus")));

/* fileUpload */
(function (app) {
	app
		.service('fileUploadService', ['$http', function ($http) {
			this.uploadFileToUrl = function (file, uploadUrl) {
				var fd = new FormData();
				fd.append('file', file);
				$http.post(uploadUrl, fd, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					})
					.success(function (data) {
						console.log("server Response " + data.message);
					})
					.error(function (err) {
						console.log("error, :" + err);
					}); // end $http.post
			};
		}]);
}(angular.module("Argus")));

/* Saturday School */
(function (app) {
	'use strict';
	app
		.factory("saturdaySchoolService", ["$http", function ($http) {
			return {
				get: function (date) {
					if (!date)
						date = new Date();
					return $http.get("/Saturday", {'data': formatDate(date)});
				},
				save: function (date, stuInfo) {
					return $http.put("/Saturday", {'date': formatDate(date), 'stuInfo': stuInfo});

				}
			};
		}]);
}(angular.module("Argus")));

(function (app) {
	app.factory('PrintHtmlService', ['$resource', function ($resource) {
		var functions = {};
		var resource = $resource(api + "report-print/:id", {}, {
			print: {
				method: 'POST',
				headers: {accept: 'application/pdf'},
				responseType: 'arraybuffer',
				cache: true,
				transformResponse: function (data) {
					console.log(data);
					var pdf;
					if (data) {
						pdf = new Blob([data], {type: 'application/pdf'});
					}
					return {
						response: pdf
					};
				}
			}
		});
		functions.printDiv = function (totalsId, listId, chartsId) {

			var totals = document.getElementById(totalsId).innerHTML;
			var list = document.getElementById(listId)? document.getElementById(listId).innerHTML : null;
			var charts = document.getElementById(chartsId)? document.getElementById(chartsId).innerHTML : null;
			//var header = document.getElementById('doc-header').innerHTML;
			//var ship = document.getElementById('doc-ship-info').innerHTML;
			//var cust = document.getElementById('doc-cust-info').innerHTML;
			//var products = document.getElementById('doc-products').innerHTML;
			//var footer = document.getElementById('doc-footer').innerHTML;
			resource.print({
				totals:totals,
				list: list,
				charts:charts
				//head: header,
				//ship: ship,
				//cust: cust,
				//products: products,
				//footer: footer,
			}, function (data) {
				var fileURL = URL.createObjectURL(data.response);
				window.open(fileURL);
			});

		};

		return angular.extend(functions,resource);
	}])
}(angular.module('Argus')));



