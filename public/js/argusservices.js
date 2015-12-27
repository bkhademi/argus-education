function formatDate(date) {
    console.log(date);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}


(function() {
    
    'use strict';

    angular
        .module('Argus')
        .factory('referrals', referrals);

        function referrals($resource) {
            
            var Referal = $resource('api/referrals/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });

            function getReferals(id) {
                return Referal.query({id:id}).$promise.then(function(results) {
                  return results;
                }, function(error) {
                  console.log(error);
                });
            }

            function saveReferals(data) {
                return Referal.save(data).$promise.then(function(success) {
                console.log(success);
              }, function(error) {
                console.log(error);
              });
            }

            
            return Referal;
//			{
//                getReferals:getReferals,
//				save : saveReferals
//            };
            
        }
})();

(function() {
    
    'use strict';

    angular
        .module('Argus')
        .factory('students', students);

        function students($resource) {
            // return $resource('api/students/:id', {}, {
            //     update: {
            //         method: 'PUT'
            //     }
            // });


            
            // ngResource call to our static data
            var Students = $resource('api/students/:id', {}, {
                update: {
                    method: 'PUT',
                    headers: { 'UserID': 'Yes' }
                }
            });

            // $promise.then allows us to intercept the results of the 
            // query so we can add the loggedTime property
            // function getStudents() {
            //     return Students.query();
            // }

            function getStudents(teacherId) {
                return Students.query({teacherId:teacherId}).$promise.then(function(results) {
                  return results;
                }, function(error) {
                  console.log(error);
                });
            }
			
			function getAllStudents(success, failure){
				return Students.query({admin:true},success, failure);
			}
            function getStudent(param, success, failure){
				return Students.get(param, success, failure);
			}
            
            return {
                getStudents:getStudents,
				getAllStudents:getAllStudents,
				getStudent:getStudent
            };
            
        }
})();

(function() {
    
    'use strict';

    angular
        .module('Argus')
        .factory('teachers', referrals);

        function referrals($resource) {
            var teachers = $resource('api/teachers/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });

            return teachers;
        }
})();

(function() {
    
    'use strict';

    angular
        .module('Argus')
        .factory('BbyArgusGeneralDBService', referrals);

        function referrals($resource) {
            var teachers = $resource('api/bbyargus/generaldb/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });

            return teachers;
        }
})();


(function() {
    
    'use strict';

    angular
        .module('Argus')
        .factory('UserActionsService', referrals);

        function referrals($resource) {
            var teachers = $resource('api/useractions/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });

            return teachers;
        }
})();


/* AEC List */
(function (app) {

    app.factory("AECListService", ["$http", function ($http) {
        return {
            get: function (date) {
                if (!date)
                    date = new Date();
                return $http.get("/AECList", { data: formatDate(date) });

            },

            save: function (date, stuInfo) {
                return $http.put("/AECList", { 'date': formatDate(date), 'stuInfo': stuInfo });
            },

            // depending on the assignments the student might be cleared or rescheduled for tomorrow
            deleteFromStudent: function (studentID, assignments, date) {
                return $http.delete("/AECList", { data: { 'studentID': studentID, 'assignments': assignments, date: formatDate(date) } });
            },
            reschedule: function (comment, dateOld, dateNew, staff, student) {
                //var staff = 'Montes';
                return $http.post("/AECList", { 'comment': comment, 'dateOld': formatDate(dateOld), 'dateNew': formatDate(dateNew), 'staff': staff, 'student': student });


            }
        };
    }])
}(angular.module("Argus")));
/* AEC Absence*/
(function (app) {

    app.factory("AECAbsenceListService", ["$http", function ($http) {
        return {
            get: function (date) {
                if (!date)
                    date = new Date();
                return $http.get("/AECAbsenceList", { data: formatDate(date) });
            },
            save: function (date, stuInfo) {
                return $http.put("/AECAbsenceList", { 'date': formatDate(date), 'stuInfo': stuInfo });
            },

            deleteFromStudent: function (studentID, assignments, date) {
                return $http.delete("/AECAbsenceList", { data: { 'studentID': studentID, 'assignments': assignments, date: formatDate(date) } });
            },

            reschedule: function (comment, date, student) {
                return $http.post("/AECAbsenceList", { 'comment': comment, 'date': formatDate(date), 'student': student })
            }



        };

    }])
}(angular.module("Argus")));
/* ARC List */
(function (app) {

    app.factory("ARCListService", ["$http", function ($http) {

        return {
            get: function (date) {
                if (!date)
                    date = new Date();
                return $http.get("/ARCList", { data: formatDate(date) });
            },
            save: function (date, stuInfo) {
                return $http.put("/ARCList", { 'date': formatDate(date), 'stuInfo': stuInfo });
            },

            clear: function (comment, date, staff, student) {
                return $http.delete("/ARCList", { data: { 'comment': comment, 'date': formatDate(date), 'staff': staff, 'student': student } });
            },

            reschedule: function (comment, date1, date2, staff, student) {

                return $http.post("/ARCList", { 'comment': comment, 'dateOld': formatDate(date1), 'dateNew': formatDate(date2), staff: staff, 'student': student })
            }



        };
    }])
}(angular.module("Argus")));
/* ARC Absence*/
(function (app) {

    app.factory("ARCAbsenceListService", ["$http", function ($http) {
        return {
            get: function (date) {
                if (!date)
                    date = new Date();
                return $http.get("/ARCAbsenceList", { data: formatDate(date) });
            },
            save: function (date, stuInfo) {
                return $http.put("/ARCAbsenceList", { 'date': formatDate(date), 'stuInfo': stuInfo });
            },

            deleteFromStudent: function (studentID, assignments, date) {
                return $http.delete("/ARCAbsenceList", { data: { 'studentID': studentID, 'assignments': assignments, date: formatDate(date) } });
            },

            reschedule: function (comment, dateOld, dateNew, student) {
                console.log(dateOld);
                console.log(dateNew);
                return $http.post("/ARCAbsenceList", { 'comment': comment, 'dateOld': formatDate(dateOld), 'dateNew': formatDate(dateNew), 'student': student })
            }



        };

    }])
}(angular.module("Argus")));
(function(app){
	app.factory("PassesService",["$resource", function($resource){
		return $resource(api+"printPasses/:id",{},{
			pdf:{
				method:'POST',
				headers:{accept:'application/pdf'},
				responseType:'arraybuffer',
				cache:true,
				transformResponse:function(data){
					console.log(data);
					var pdf;
					if(data){
						pdf = new Blob([data],{type:'application/pdf'})
					}
					return {
						response:pdf
					}
				}
			}
		} )	
	}]);
}(angular.module("Argus")));

/* Assignments File */
(function (app) {
    app.factory("assignmentsService", [ "$resource", function ( $resource) {
            return $resource("/api/assignments/:id",{id:'@id'}, {
                pdf:{
                    method:'GET',
                    headers:{  accept:'application/pdf'},
                    responseType:'arraybuffer',
                    cache:true,
                    transformResponse:function(data){
                        console.log(data);
                        var pdf;
                        if(data){
                            pdf = new Blob([data],{type:'application/pdf'})
                        }
                        return {
                            response:pdf
                        }
                    }
                }
            });
    }]);
}(angular.module("Argus")));

/* Assignments List */
(function (app) {
    app.factory("assignmentsListService", [ "$resource", function ( $resource) {
            return $resource("/api/assignments/:id",{id:'@id'}, {
                pdf:{
                    method:'GET',
                    headers:{  accept:'application/pdf'},
                    responseType:'arraybuffer',
                    cache:true,
                    transformResponse:function(data){
                        console.log(data);
                        var pdf;
                        if(data){
                            pdf = new Blob([data],{type:'application/pdf'})
                        }
                        return {
                            response:pdf
                        };
                    }
                }
            });
    }]);
}(angular.module("Argus")));


/* Classes */
(function (app) {
    app
    .factory("classesService", ["$http", function ($http) {
        return {
            get: function (studentID) {
                return $http.get("/classes/" + studentID);
            }

        };

    }])
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
                headers: { 'Content-Type': undefined }
            })
            .success(function (data) {
                console.log("server Response " + data.message);
            })
            .error(function (err) {
                console.log("error, :" + err);
            }); // end $http.post
        }
    }])
}(angular.module("Argus")));
/* Rooms */
(function (app) {
    app.service("RoomService", ["$scope", "$http", function ($scope, $http) {

    }])
}(angular.module("Argus")));
/* Saturday School */
(function (app) {
    function formatDate(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    app
    .factory("saturdaySchoolService", ["$http", function ($http) {
        return {
            get: function (date) {
                if (!date)
                    date = new Date();
                return $http.get("/Saturday", { 'data': formatDate(date) });
            },
            save: function (date, stuInfo) {
                return $http.put("/Saturday", { 'date': formatDate(date), 'stuInfo': stuInfo });

            },

        }
    }])
}(angular.module("Argus")));
/* Manage Saturday School */

/* Students Activities */
(function (app) {
    app
    .factory("studentActivitiesService", ["$http","$q","ServerDataModel", function ($http,$q,ServerDataModel) {
        return {
            getAll: function () {
                var deferred = $q.defer();
                deferred.resolve(ServerDataModel.getActivities());
                deferred.reject("error");
                return deferred.promise;
            },

            get: function (studentID) {
                return $http.get("/studentActivities/" + studentID);
            },




        };

    }])
}(angular.module("Argus")));
/* Students */
(function (app) {
	'use strict';
	
    angular
	.module('Argus')
	.factory('StudentsService', ['$resource',function ($resource) {
		var students = $resource('api/students/:id', {}, {
			update: {
				method: 'PUT'
			}
		});
		
		return students;
	}]);
    
}(angular.module("Argus")));
/* Teachers  */
(function (app) {
    app.factory("teacherService", ["$scope", "$http", function ($scope, $http) {


    }])
}(angular.module("Argus")));
