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

			gallery.enlargeImg = enlargeImg;
			gallery.updateGallery = updateGallery;

			// make sure to update pagination and gallery compoents after results amount was changed
			$scope.$watch('gallery.resultsPerPage', function( newValue ) {
					updateGallery(gallery.images);
				}
			);

			// make sure to update pagenation and gallery components after search was changed
			$scope.$watch('gallery.searchFilter', function( newValue ) {
					var afterSearch = $filter('filter')(gallery.images, newValue);
					updateGallery(afterSearch);
				}
			);


			// making sure to run digest one more time since we are editing the scope properties
			$timeout(activate, 1);

			////////

			function activate () {

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

				gallery.pageNum = 1;


				// handle feed property (array/string)
				if (angular.isString(gallery.feed)) {
					galleryService.getImages(gallery.feed).then(function (images) {
						gallery.images = images;
						updateGallery(gallery.images);
					});
				} else {
					gallery.images = gallery.feed;
					updateGallery(gallery.images);
				}
			}

			function updateGallery (images) {
				if( !images ) {
					return;
				}
				console.log(images.length);
				var pageIndex = (gallery.pageNum -1) * gallery.resultsPerPage;
				gallery.currentPageImages = lodash.slice(images, pageIndex, pageIndex + gallery.resultsPerPage);
				gallery.totalImages = images.length;

			}

			function enlargeImg (img) {
				var imgIndex = lodash.indexOf(gallery.filteredImages, img);

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
   				   				images: gallery.filteredImages,
   				   				currentImgIndex: imgIndex
							};
   				   		}
				   }
				 });
			}
		}

})();
