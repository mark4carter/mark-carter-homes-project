'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'myApp.view1'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

myApp.controller('NavCtrl', function($scope, GiphyHTTPService, GiphySelectionService) {
	$scope.giphySearchInput = "pug";

	$scope.getGiphyData = function() {		
		GiphyHTTPService.pullData($scope.giphySearchInput).then(function(data) {
			GiphySelectionService.updateData(data);
		});
	}
});