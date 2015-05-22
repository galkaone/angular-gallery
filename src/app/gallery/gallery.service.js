(function() {
	'use strict';

	angular
		.module('gk.gallery')
		.service('galleryService', galleryService);

	function galleryService ($q, $http) {

		var service = {
			getImages: getImages
		};

		return service;

		/////////

		function getImages (url) {
			var deferred = $q.defer();

			$http.get(url)
				.success(function(data) {
					deferred.resolve(data);
				})
				.error(function(errors) {
					deferred.reject('invalid path');
				});

			return deferred.promise;
		}
	}

})();
