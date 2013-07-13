'use strict';

/* Services */

stockApp.service('itemCount', function() {
	return items.length;
});

// Load categories array from local storage
stockApp.factory('getCategories', function(localStorageService) {
  var categories = angular.fromJson(localStorageService.get('categories'));
  if (!categories) { categories = []; }
  return {
    data: categories
  };
});

// Load items array from local storage
stockApp.factory('getItems', function(localStorageService) {
  var items = angular.fromJson(localStorageService.get('items'));
  if (!items) { items = []; }
  return {
    data: items
  };
});


// Load stats array from local storage
stockApp.factory('getStats', function(localStorageService) {
  var stats = angular.fromJson(localStorageService.get('stats'));
  if (!stats) { stats = []; }
  return {
    data: stats
  };
});
