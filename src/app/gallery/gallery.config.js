(function() {
	'use strict';

	angular
		.module('gk.gallery')
		.config(config)
		.constant('galleryConfig', {
			URL: 'https://s3.amazonaws.com/launchme/images.json'
		});

	function config (localStorageServiceProvider) {
		localStorageServiceProvider
		    .setPrefix('gk.gallery');
	}


})();
