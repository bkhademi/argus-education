/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('inspinia', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
		'ngResource',					// Simplified REST interaction
        'satellizer'					// Token Based authenticacion
    ]);
	
	angular.module("Argus", ['inspinia'])
})();

var api = "api/";



        
