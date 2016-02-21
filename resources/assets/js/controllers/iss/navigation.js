/* global angular */

(function (app) {
	"use strict";
	app.controller('NavigationISSCtrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			
			{
				id: 'ISS List',
				link: "iss.Lists.iss",
				icon: 'list-alt fa-2x'
			}, {
				id: 'ISS Followup List',
				link: "iss.pending",
				icon: 'exclamation fa-2x'
			}
		];
	});
}(angular.module('Argus')));

