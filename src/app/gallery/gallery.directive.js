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

		function GalleryController ($scope, $timeout, $filter, $modal, lodash, galleryService) {
			var gallery = this;

			var galleryImages = [];

			// controller public functions
			gallery.enlargeImage = enlargeImage;
			gallery.updateGallery = updateGallery;

			// making sure to run digest one more time since we are editing the scope properties
			$timeout(activate, 1);

			////////

			function activate () {

				// make sure to update pagination and gallery compoents after results amount was changed
				$scope.$watch('gallery.resultsPerPage', function( newValue ) {
						resetPagination();
						updateGallery(gallery.filteredImages);
					}
				);

				// make sure to update pagenation and gallery components after search was changed
				$scope.$watch('gallery.searchFilter', function( newValue ) {
						resetPagination();
						gallery.filteredImages = $filter('filter')(galleryImages, newValue);
						updateGallery(gallery.filteredImages);
					}
				);

				prepareModels();
			}

			function prepareModels () {
				// handle default values of scope properties
				gallery.search = gallery.search !== 'false' ? true : false;
				gallery.paginate = gallery.paginate !== 'false' ? true : false;
				gallery.sorting = gallery.sorting !== 'false' ? true : false;

				gallery.resultsPerPage = gallery.resultsPerPage ? gallery.resultsPerPage : 10;
				gallery.autoRotateTime = gallery.autoRotateTime ? gallery.autoRotateTime : 4;

				// create results options model
				gallery.resOptions = [5, 10, 15, 20];

				// create sort options model
				gallery.sortTypes = ['title', 'date'];
				gallery.sortType = gallery.sortTypes[0];

				// serach model
				gallery.searchFilter = '';

				resetPagination();

				// handle feed property (array/string)
				if (angular.isString(gallery.feed)) {
					// get the images
					galleryService.getImages(gallery.feed).then(function (images) {
						prepareImages(images);
					});
				} else {
					prepareImages(gallery.feed);
				}
			}

			function resetPagination () {
				gallery.pageNum = 1;
			}

			function prepareImages (images) {
				galleryImages = images;
				gallery.allImages = galleryImages;
				gallery.filteredImages = galleryImages;
				updateGallery(gallery.filteredImages);
			}

			function updateGallery (images) {
				if( !images ) {
					return;
				}

				gallery.currentPageImages = galleryService.setCurrentImages(images, gallery.pageNum, gallery.resultsPerPage);

			}

			function enlargeImage (img) {
				var imgIndex = lodash.indexOf(gallery.visibleImages, img);

				$modal.open({
				   animation: true,
				   size: 'lg',
				   templateUrl: 'app/gallery/gallery-modal.html',
				   controller: 'GalleryModalController',
				   controllerAs: 'modal',
				   bindToController: true,
   				   resolve: {
   				   		gallery: function () {
   				   			return {
   				   				images: gallery.visibleImages,
   				   				currentImgIndex: imgIndex
							};
   				   		}
				   }
				 });
			}


		}

})();
