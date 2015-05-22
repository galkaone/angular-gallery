/**
 *  I HAVE CONFESSION TO MAKE
 *  I was about to use this module "https://github.com/fiestah/angular-gallery-directive"
 *  and on the last minute i found a problem, since i dont have much time(not even to build my own directive), i copied the code and
 *  made some custom modifications:
 * - selected index preorty
 * - interval property
 * Yep its ugly I know(tried to save some time, didnt work out..)
 */


angular.module('gk.components.slider')

/**
 * Container directive for the items, navigation and nav dots container
 * elements.
 */
.directive('mySlider', function ($timeout, $interval) {

	function link(scope, element, attrs) {

		scope.selectedIndex       = 0;
		scope.selectedScreenIndex = 0;

		// Get the offset position of a particular item
		function getItemOffset(index) {
			return scope.items[index].offsetLeft;
		}

		// Get the number of fully-visible items in the gallery container
		function getNumPerScreen() {
			// Get dimensions on demand to account for screen resizes
			var visibleWidth = element[0].offsetWidth;
			var items        = scope.items;

			for (var i=0; i<items.length; i++) {
				if (getItemOffset(i) + items[i].offsetWidth > visibleWidth) {
					return i;
				}
			}
		}

		function scrollToItem (index) {
			scope.selectedIndex = index;
			scope.position = {
				left: -(getItemOffset(index)) + 'px'
			};

			// Reset isWrapping
			$timeout(function () {
				scope.isWrapping = false;
			}, 50);
		}


		// Scroll by individual items
		scope.scrollToItem = scrollToItem;

		scope.previousItem = function () {
			var numOfItems = scope.items.length;
			var index = scope.hasPreviousItem()
				? scope.selectedIndex - 1
				: numOfItems - 1;

			// Going from the first item to the last
			scope.isWrapping = scope.isWrappingPrevious = !scope.hasPreviousItem();

			scope.scrollToItem(index);
		};

		scope.nextItem = function () {
			var numOfItems = scope.items.length;
			var nextIndex = (scope.selectedIndex + 1) % numOfItems;

			// Going from the last item to the first
			scope.isWrapping = scope.isWrappingNext = !scope.hasNextItem();

			scope.scrollToItem(nextIndex);
		};

		scope.hasPreviousItem = function () {
			return scope.selectedIndex !== 0;
		};

		scope.hasNextItem = function () {
			var numOfItems = scope.items.length;
			return scope.selectedIndex !== numOfItems - 1;
		};


		// Scroll by collection of items.
		//
		// FIXME: `numOfScreens` incorrectly assumes fixed item widths. Accounting
		// for variable widths gets a little complicated.
		scope.scrollToScreen = function (screenIndex) {
			var numOfItems = scope.items.length;
			var numPerScreen = getNumPerScreen();
			var itemIndex = (screenIndex * numPerScreen);
			var numOfScreens = Math.ceil(numOfItems / numPerScreen);

			scope.selectedScreenIndex = screenIndex;

			scope.position = {
				left: -(getItemOffset(numPerScreen * screenIndex)) + 'px'
			};
		};

		scope.previousScreen = function () {
			var numOfItems = scope.items.length;
			var numOfScreens = Math.ceil(numOfItems / getNumPerScreen());
			var index = scope.hasPreviousScreen()
				? scope.selectedScreenIndex - 1
				: numOfScreens - 1;

			// Going from the first screen to the last
			scope.isWrapping = scope.isWrappingPrevious = !scope.hasPreviousScreen();

			scope.scrollToScreen(index);
		};

		scope.nextScreen = function () {
			var numOfItems = scope.items.length;
			var numOfScreens = Math.ceil(numOfItems / getNumPerScreen());
			var nextIndex = (scope.selectedScreenIndex + 1) % numOfScreens;

			// Going from the last screen to the first
			scope.isWrapping = scope.isWrappingNext = !scope.hasNextScreen();

			scope.scrollToScreen(nextIndex);
		};

		scope.hasPreviousScreen = function () {
			return scope.selectedScreenIndex !== 0;
		};

		scope.hasNextScreen = function () {
			var numOfItems = scope.items.length;
			var numOfScreens = Math.ceil(numOfItems / getNumPerScreen());
			return scope.selectedScreenIndex !== numOfScreens - 1;
		};


		// My custom code (UGLY I know)
		if (attrs.startIndex) {
			$timeout(function () {
				var numOfItems = scope.items.length;
				var currtIndex = attrs.startIndex % numOfItems;
				scope.isWrapping = scope.isWrappingNext = !scope.hasNextItem();
				scrollToItem(currtIndex);
			},1);
		}

		if (attrs.autoSlide === 'true') {
			var interval = attrs.autoSlideTime || 5;
				console.log(interval);
			interval = parseInt(interval) * 1000;

			$interval(function () {
				scope.nextItem();
			}, interval);
		}

	}

	return {
		restrict: 'EA',
		link: link,
		controller: function ($scope) {
			this.registerItems = function (items) {
				$scope.items = items;
			};
		}
	};
})

/**
 * Directive for the "film strip" parent element which contains all the
 * scrollable items.
 */
.directive('mySliderItemList', function () {
	return {
		restrict: 'EA',
		link: function (scope, element) {
			// Updates the position of the film strip
			scope.$watch('position', function () {
				element.css(scope.position || {
					left: 0
				});
			});
		}
	};
})

/**
 * Keep track of each item as it gets added to the DOM tree. Doing it
 * dynamically this way because ng-repeat (correctly) does not have a done
 * state, and thus depends on the gallery item to register itself as it gets
 * compiled by angular.
 */
.directive('mySliderItem', function () {
	function link(scope, element, attrs, galleryCtrl) {
		var items = element.parent().children();
		galleryCtrl.registerItems(items);
	}

	return {
		require: '^mySlider',
		restrict: 'EA',
		link: link
	}
})

/**
 * Directive that shows the position of the currently selected item.
 */
.directive('mySliderIndicators', function () {
	return {
		restrict: 'EA',
		template: '<a'
			+ ' href="" class="indicator"'
			+ ' ng-repeat="item in items track by $index"'
			+ ' ng-class="{selected: selectedIndex === $index}"'
			+ ' ng-click="scrollToItem($index)"'
			+ '><span class="num">{{$index + 1}}</span></a>'
	};
});
