(function() {
	'use strict';

	angular
		.module('gk.gallery')
		.constant('galleryConfig', {
			URL: 'https://s3.amazonaws.com/launchme/images.json'
		});

})();
