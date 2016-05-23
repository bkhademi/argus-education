(function(app){
"use strict";
	app
	.config(
	['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$authProvider', '$httpProvider', '$provide',
		function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $authProvider, $httpProvider, $provide){
			var redirectWhenLoggedOut = function ($q, $injector) {
				return {
					responseError: function (rejection) {
						// Need to use $injector.get to bring in $state or else we get
						// a circular dependency error
						var $state = $injector.get('$state');
						
						// instead of checking fora status code of 400 which might be used
						// for other reasons in laravel, we check for the specific rejection
						// reason to tell us if we need to redirect to the loggin state
						var rejectionReason = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid', 'user_not_found'];
						
						// Loop through each rejection reason and redirect to the login
						// state if one is encountered
						angular.forEach(rejectionReason, function (value, key) {
							if (rejection.data.error === value) {
								// if we get a rejection corresponfing to one of the reasons
								// in our array, we know we need to authenticate the user so
								// we can remove the current user from local storage
								localStorage.removeItem('user');
								
								// Send the user to the auth state so they can login
								$state.go('auth');
							}    
						});
						return $q.reject(rejection);
					}
				}
			};
			
			// Setup for the $httpInterceptor
			$provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
			
			// push the new factory onto the $http interceptor array
			$httpProvider.interceptors.push('redirectWhenLoggedOut');
			
			// satellizer configuration that specifies which API
			// route the JWT should be retrieved fromCharCode
			$authProvider.loginUrl = '/api/authenticate';
			
			
			
		}])
		.run(function ($rootScope, $state) {
			
			
			// $stateChangeStart is fired whenever the state changes. We can use some parameters
			// such as toState to hook into details about the state as it is changing
			// stateChangeStart
			$rootScope.$on('$stateChangeStart', function (event, toState) {
				// Grab the user from local storage and parse it to an object
				var user = JSON.parse(localStorage.getItem('user'));
				debugger;
				console.log("USER: ");
				console.log(user);
				// If there is any user data in local storage then the user is quite
				// likely authenticated. If their token is expired, or if they are
				// otherwise not actually authenticated, they will be redirected to
				// the auth state because of the rejected request anyway
				if (user) {
					
					// The user's authenticated state gets flipped to
					// true so we can now show parts of the UI that rely
					// on the user being logged in
					$rootScope.authenticated = true;
					
					// Putting the user's data on $rootScope allows
					// us to access it anywhere across the app. Here
					// we are grabbing what is in local storage
					$rootScope.currentUser = user;
					// debugger
					// If the user is logged in and we hit the auth route we don't need
					// to stay there and can send the user to the main state
					if (toState.name === "auth") {
						// Preventing the default behavior allows us to use $state.go
						// to change states
						event.preventDefault();
						var userRole = $rootScope.currentUser.role.toLowerCase();
						var go = userRole + ".dashboard";
						// go to the "main" state which in our case is users
						debugger;
						$state.go('admin1');//$rootScope.currentUser.role+".dashboard");
					}
				}
			})
			//$rootScope.$state = $state;
		})
}(angular.module('Argus')));