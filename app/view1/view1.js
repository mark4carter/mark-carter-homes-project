'use strict';

var view1 = angular.module('myApp.view1', ['ngRoute'])

view1.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])


// Controllers

view1.controller('View1Ctrl', function($scope, GiphyHTTPService, GiphySelectionService) {

	$scope.giphySearchInput = 'pug';
	$scope.giphySelectionService = GiphySelectionService;

	$scope.getGiphyData = function() {
		GiphyHTTPService.pullData($scope.giphySearchInput).then(function(data) {
			$scope.giphySelectionService.updateData(data);
		});
	};

	$scope.getGiphyData();
});


// Services

view1.factory('GiphyHTTPService', function($q, $http, GiphySelectionService) {
	return {
		pullData: function(giphySearchInput) {
			GiphySelectionService.isLoading = true;
			if (GiphySelectionService.getGiphyData) {
				GiphySelectionService.updateData(null);
			}
			var defer = $q.defer();
			var encodedGiphyInput = encodeURIComponent(giphySearchInput);
			$http.get("http://api.giphy.com/v1/gifs/search?q=" +
				encodedGiphyInput +
				"&api_key=dc6zaTOxFJmzC&limit=5")
			.success(function(data) {
				setTimeout(function(){
					GiphySelectionService.isLoading = false;
					defer.resolve(data.data);
				}, 1000);
			});
			return defer.promise;
		}
	};
});

view1.factory('GiphySelectionService', function() {

	var service = {};
	var giphyData = null;

	service.isLoading = false;
	service.currentIndex = 0;

	service.updateData = function (data) {
		giphyData = data;
		if (giphyData) {
			giphyData.forEach(function(image) {
				image.visible = false;
			});

			if (giphyData[service.currentIndex] !== undefined) {
				giphyData[service.currentIndex].visible = true;
			} else if (giphyData[0] !== undefined) {
				service.currentIndex = 0;
			}
		}
	}

	service.getGiphyData = function (data) {
		return giphyData;
	}

	service.next = function() {
		service.currentIndex < giphyData.length - 1 ? service.currentIndex++ : service.currentIndex = 0;
	};

	service.prev = function() {
		service.currentIndex > 0 ? service.currentIndex-- : service.currentIndex = giphyData.length - 1;
	};

	service.selectByIndex = function(index) {
		service.currentIndex = index;
	}

	return service;
})



// Directives

view1.directive('giphythumbs', function($timeout, GiphySelectionService) {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			images: '='
		},
		link: function(scope, elem, attrs) {
			scope.giphySelectionService = GiphySelectionService;
		},
		templateUrl: 'templates/thumbnail-template.html'
	};
});

view1.directive('slideshow', function($timeout, GiphySelectionService) {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			images: '=',
			currentIndex: '='
		},
		link: function(scope, elem, attrs) {
			scope.giphySelectionService = GiphySelectionService;

			scope.$watchGroup(['giphySelectionService.currentIndex'], function() {
				if (scope.images) {
					scope.images.forEach(function(image) {
						image.visible = false;
					});
					scope.images[scope.giphySelectionService.currentIndex].visible = true;
				}
			})
		},
		templateUrl: 'templates/slideshow-template.html'
	};
});
