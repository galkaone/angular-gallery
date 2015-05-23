(function() {
	'use strict';

	angular
		.module('gk.gallery')
		.service('galleryService', galleryService);

	function galleryService ($q, $http, localStorageService, lodash) {

		var blackList;

		var service = {
			getImages: getImages,
			setCurrentImages: setCurrentImages,
			addToBlackList: addToBlackList,
			filterBlackList: filterBlackList
		};

		blackList = getBlackList();

		return service;

		/////////

		function getImages (url) {
			var deferred = $q.defer();

			$http.get(url)
				.success(function(images) {
					images = filterBlackList(images);
					deferred.resolve(images);
				})
				.error(function(errors) {
					deferred.reject('invalid path');
				});

			return deferred.promise;
		}

		function setCurrentImages (images, pageNumber, resultsPerPage) {
			var pageIndex;

			resultsPerPage = parseInt(resultsPerPage);
			pageIndex = (parseInt(pageNumber) -1) * resultsPerPage;

			return lodash.slice(images, pageIndex, pageIndex + resultsPerPage);
		}

		function getBlackList () {
			return localStorageService.get('blacklist') || {};
		}

		function addToBlackList (blockedImg) {

			if (!blackList[blockedImg.url]) {
				blackList[blockedImg.url] = blockedImg.url;
				localStorageService.set('blacklist', blackList);
			}
		}

		function filterBlackList (images) {
			var filtered = [];

			var img;
			for (var i=0; i < images.length; i++) {
				img = images[i];
				// if the image is not in blacklist than add it to the array
				if (!blackList[img.url]) {
					filtered.push(img);
				}
			}

			return filtered;
		}
	}

})();
