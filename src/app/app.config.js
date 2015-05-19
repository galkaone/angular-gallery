(function() {
    'use strict';

	angular.module('app')
		.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

			$locationProvider.html5Mode(true);
			$urlRouterProvider.otherwise('/');


		});

})();
