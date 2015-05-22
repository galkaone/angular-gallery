(function() {

	'use strict';

	angular.module('gk.gallery')
		.controller('GalleryModalController', GalleryModalController);

		function GalleryModalController ($scope, $modalInstance, gallery) {
			var modal = this;

			modal.gallery = gallery;

		}

})();
