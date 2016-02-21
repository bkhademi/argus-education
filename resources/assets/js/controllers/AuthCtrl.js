(function (app) {
	'use strict';

	app
		.controller('AuthController', function ($auth, $state, $http, $rootScope) {
			var vm = this;

			vm.loginError = false;
			vm.loginErrorText;
			vm.login = function () {
				var credentials = {
					email: vm.email,
					password: vm.password
				}

				// Use Satellizer's $auth service to login
				$auth.login(credentials).then(function (response) {
					// if login is successful, redirectto the users state
					//$state.go('users', {});

					return $http.get('api/authenticate/user');

					//handle errors
				}, function (response) {
					vm.loginError = true;
					vm.loginErrorText = response.data.error;

					// because we returned the promise in the first then 
					// we can chain the next promise to the end here
				}).then(function (response) {
					// stringify the returned data to prepare it 
					// to go into local storage
					var user = JSON.stringify(response.data.user);

					//set the stringified user data into local storage
					localStorage.setItem('user', user);

					// The user's authenticated state gets flipped to true
					// so we can now show parts of the ui that relyon the
					// user being logged in
					$rootScope.authenticated = true;

					// Putting the user's data on $rootScope allows 
					// us to access it anywhere across the app
					$rootScope.currentUser = response.data.user;
					var goto = '';
					switch (response.data.user.role) {
						case 'Lead GTM Coordinator':
							goto  = 'admin1';
							break;
						case 'AEC Coordinator':
							goto = 'admin2';
							break;
						case 'O-Room Coordinator':
							goto = 'admin3';
							break;
						case 'Student':
							goto = 'teacher';
							break;
						case 'Teacher':
							goto = 'student';
							break;
					}
					//response.data.user.role.toLowerCase()
					$state.go(goto + ".dashboard");

				});
			}
		})

}(angular.module('Argus')));