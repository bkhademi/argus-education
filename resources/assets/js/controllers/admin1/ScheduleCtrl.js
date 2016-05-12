(function (app) {
	"use strict";
	app.
		controller("ScheduleController",
			["$scope", '$modal', 'notify', '$http',
				function ($scope, assignmentsService, teachers, referrals, students, $modal, notify, $http, reteach, ProfessorClassesService) {
					$scope.currentDate = new Date(); // date on the datepicker

					$scope.dropzoneConfig = {
						maxFileSize:1,

						options: {// passed into the Dropzone constructor
							url: api+'schedule',
							paramName:"file",
							acceptedFiles: ".xlsx",
							uploadMultiple: false,
							headers: { 'Authorization':'Bearer '+ localStorage.getItem('satellizer_token') }

						},
						eventHandlers: {
							success: function (file, response) {
							},
						},

					}; // end dropzoneConfig


				}])

}(angular.module('Argus')));