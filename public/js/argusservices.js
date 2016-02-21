/* global angular, api*/

function formatDate(date) {
	console.log(date);
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

/* referrals $resource */
(function (app) {
	'use strict';
	app
		.factory('referrals', ['$resource', function ($resource) {

				var Referal = $resource('api/referrals/:id', {}, {
					update: {
						method: 'PUT'
					}
				});

				function getReferals(id) {
					return Referal.query({id: id}).$promise.then(function (results) {
						return results;
					}, function (error) {
						console.log(error);
					});
				}

				function saveReferals(data) {
					return Referal.save(data).$promise.then(function (success) {
						console.log(success);
					}, function (error) {
						console.log(error);
					});
				}


				return Referal;


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

/* USers Admin */
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

/* USers Admin */
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

/* schools Admin */
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
		.factory('StudentsService', ['$resource', function ($resource) {
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

				return angular.extend(studentsResource, obj);
			}]);

}(angular.module("Argus")));

/* professorclasses */
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


/* O-Room */
(function (app) {
	app
		.factory("OroomService", ["$resource", function ($resource) {
				return $resource('api/oroom/:id', {}, {
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


/* Lunch */
(function (app) {
	app
		.factory("LunchService", ["$resource", function ($resource) {
				return $resource('api/lunch/:id', {}, {
					update: {
						method: 'PUT'
					}
				});

			}]);
}(angular.module("Argus")));

/* ISS */
(function (app) {
	app
		.factory("ISSService", ["$resource", function ($resource) {
				return $resource('api/iss/:id', {}, {
					update: {
						method: 'PUT'
					}
				});

			}]);
}(angular.module("Argus")));

/* OSS */
(function (app) {
	app
		.factory("OSSService", ["$resource", function ($resource) {
				return $resource('api/oss/:id', {}, {
					update: {
						method: 'PUT'
					}
				});

			}]);
}(angular.module("Argus")));

/* ASP */
(function (app) {
	app
		.factory("ASPService", ["$resource", function ($resource) {
				return $resource('api/asp/:id', {}, {
					update: {
						method: 'PUT'
					}
				});
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
							var overlap = {place: '', class: ''};
							var hasoss = false, hasiss = false, hasaec = false, hasoroom = false, hasreteach=false;
							angular.forEach(student.referred, function (ref, $index) {
								if (types.isAEC(ref.ReferralTypeId))
									hasaec = true;
//								else if (types.isORM(ref.ReferralTypeId))
//									hasoroom = true;
								else if (types.isISS(ref.ReferralTypeId))
									hasiss = true;
								else if (types.isOSS(ref.ReferralTypeId))
									hasoss = true;
								else if(types.isReteach(ref.ReferralTypeId))
									hasreteach = true;
							});
							debugger;
							if (hasoss)
								overlap = {class: 'bg-danger', msg: 'Has OSS'};
							else if (hasiss)
								overlap = {class: 'bg-danger', msg: 'Has ISS'};
//							else if (hasoroom)
//								overlap = {class: 'bg-warning', msg: 'Has ORoom'};
							else if (hasaec)
								overlap = {class: 'bg-warning', msg: 'Has AEC'};
							else if(hasreteach)
								overlap = {class: 'bg-warning', msg: 'Has Reteach'};
							student.overlap = overlap;
							
						});
						
					},
					getShades: function(color1, color2, shades){
						var midpoints = shades-2;
						// remove hashtag
						color1 = color1.substr(1);
						color2 = color2.substr(1);
						var color1Comp = {R:ParseInt(color1.slice(0,2),16), B:ParseInt(color1.slice(2,4),16), G:ParseInt(color1.slice(4),16)};
						var color2Comp = {R:ParseInt(color2.slice(0,2),16), B:ParseInt(color2.slice(2,4),16), G:ParseInt(color2.slice(4),16)};
						
						var stepsSizes =  {R:stepSize(color1Comp.R,color2Comp.R), B:stepSize(color1Comp.B,color2Comp.B), G:stepSize(color1Comp.G,color2Comp.G)};
						
						function stepSize(c1,c2){
							return (ceil(abs(c1-c2))/(midpoints+1) );
						}
						function shade(c1, c2,i){
							
						}
						
						var shades = [];
						for(var i ; i < midpoints; i++){
							var newShadeComponents = {R:shade(color1Comp.R,color2Comp.R),B:shade(color1Comp.B,color2Comp.B),G:shade(color1Comp.G,color2Comp.G)};
							 
						}
						
						return shades;
					},
					downloadCSV :function(text,fileName){
						var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
						element.setAttribute('download', fileName+'.csv');
						element.style.display = 'none';
						document.body.appendChild(element);
						element.click();
						document.body.removeChild(element);
					}

				};

			}]);
}(angular.module("Argus")));

(function (app) {
	app.factory('ReferralTypesService', function () {
		return {
			oroom: [1, 2, 3, 16, 10, 19],
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

/* AEC List */
(function (app) {
	app.factory("AECListService", ["$http", '$resource',
		function ($http, $resource) {
			return $resource('api/aeclist/:id', {}, {
				update: {
					method: 'PUT'
				}
			});

			return {
				get: function (date) {
					if (!date)
						date = new Date();
					return $http.get("/AECList", {data: formatDate(date)});

				},
				save: function (date, stuInfo) {
					return $http.put("/AECList", {'date': formatDate(date), 'stuInfo': stuInfo});
				},
				// depending on the assignments the student might be cleared or rescheduled for tomorrow
				deleteFromStudent: function (studentID, assignments, date) {
					return $http.delete("/AECList", {data: {'studentID': studentID, 'assignments': assignments, date: formatDate(date)}});
				},
				reschedule: function (comment, dateOld, dateNew, staff, student) {
					//var staff = 'Montes';
					return $http.post("/AECList", {'comment': comment, 'dateOld': formatDate(dateOld), 'dateNew': formatDate(dateNew), 'staff': staff, 'student': student});


				}
			};
		}]);
}(angular.module("Argus")));

/* AEC Absence*/
(function (app) {

	app.factory("AECAbsenceListService", ["$http", '$resource', function ($http, $resource) {
			return $resource('api/aecabsencelist/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
			return {
				get: function (date) {
					if (!date)
						date = new Date();
					return $http.get("/AECAbsenceList", {data: formatDate(date)});
				},
				save: function (date, stuInfo) {
					return $http.put("/AECAbsenceList", {'date': formatDate(date), 'stuInfo': stuInfo});
				},
				deleteFromStudent: function (studentID, assignments, date) {
					return $http.delete("/AECAbsenceList", {data: {'studentID': studentID, 'assignments': assignments, date: formatDate(date)}});
				},
				reschedule: function (comment, date, student) {
					return $http.post("/AECAbsenceList", {'comment': comment, 'date': formatDate(date), 'student': student});
				}
			};

		}]);
}(angular.module("Argus")));

/* Reteach List */
(function (app) {

	app.factory("ReteachListService", ['$resource', function ($resource) {
			return $resource('api/reteachlist/:id', {}, {
				update: {
					method: 'PUT'
				}
			});
		}]);
}(angular.module("Argus")));

/* Reteach List */
(function (app) {

	app.factory("ReteachAbsenceListService", ['$resource', function ($resource) {
			return $resource('api/reteachaecabsencelist/:id', {}, {
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




