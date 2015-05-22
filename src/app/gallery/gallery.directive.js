(function() {

	'use strict';

	// sub module need to extract
	angular.module('gk.gallery')
		.directive('myGallery', myGallery);

		function myGallery () {
			return {
				scope: {
					feed: '@',
					search: '@',
					paginate: '@',
					sorting: '@',
					resultsPerPage: '@',
					autoRotateTime: '@'
				},
				replace: true,
				restrict: 'E',
				templateUrl: 'app/gallery/gallery.html',
				controller: GalleryController,
				controllerAs: 'gallery',
				bindToController: true
			};
		}

		function GalleryController ($timeout, $modal, lodash, galleryService) {
			var gallery = this;

			gallery.enlargeImg = enlargeImg;

			// making sure to run digest one more time since we are editing the scope properties
			$timeout(activate, 1);

			////////

			function activate () {

				// handle feed property (array/string)
				if (angular.isString(gallery.feed)) {
					galleryService.getImages(gallery.feed).then(function (images) {
						gallery.images = images;
					});
				}else {
					gallery.images = gallery.feed;
				}

				// handle default value for scope properties
				gallery.search = gallery.search !== 'false' ? true : false;
				gallery.paginate = gallery.paginate !== 'false' ? true : false;
				gallery.sorting = gallery.sorting !== 'false' ? true : false;

				gallery.resultsPerPage = gallery.resultsPerPage ? gallery.resultsPerPage : 10;
				gallery.autoRotateTime = gallery.autoRotateTime ? gallery.autoRotateTime : 4;

				gallery.resOptions = [5, 10, 15, 20];

				gallery.sortTypes = ['title', 'date'];
				gallery.sortType = gallery.sortTypes[0];

				//
				gallery.searchFilter = '';
			}

			function enlargeImg (img) {
				var imgIndex = lodash.indexOf(gallery.filteredImages, img);

				$modal.open({
				   animation: true,
				   templateUrl: 'app/gallery/gallery-modal.html',
				   controller: 'GalleryModalController',
				   controllerAs: 'modal',
				   bindToController: true,
   				   resolve: {
   				   		gallery: function () {
   				   			return {
   				   				images: gallery.filteredImages,
   				   				currentImgIndex: imgIndex
							};
   				   		}
				   }
				 });
			}
		}

})();
