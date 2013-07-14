'use strict';


var stockApp = angular.module('stockApp', ['LocalStorageModule', 'ajoslin.mobile-navigate', 'angular-gestures', 'toggle-switch']);
//'mgcrea.overflowScroll'

// Set up routing
stockApp.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'RootController',
            templateUrl: 'views/RootControllerView.html'
            ,reverse: true
        })        
        
        .when('/add',
        {
            controller: 'RootController',
            templateUrl: 'views/AddCategoryView.html'
        })

        .when('/items/:category',
        {
            controller: 'ItemsController',
            templateUrl: 'views/ItemsControllerView.html'
        })

        .when('/items/add/:category',
        {
            controller: 'ItemsController',
            templateUrl: 'views/AddItemView.html'
        })

        .when('/stats',
        {
            controller: 'StatsController',
            templateUrl: 'views/StatsControllerView.html'
        })

        .otherwise({ redirectTo: '/'});
})
.run(function($route, $http, $templateCache) {
  angular.forEach($route.routes, function(r) {
    if (r.templateUrl) { 
      $http.get(r.templateUrl, {cache: $templateCache});
    }
  });
})
.directive('ngTap', function() {
  var isTouchDevice = !!("ontouchstart" in window);
  return function(scope, elm, attrs) {
    if (isTouchDevice) {
      var tapping = false;
      elm.bind('touchstart', function() { tapping = true; });
      elm.bind('touchmove', function() { tapping = false; });
      elm.bind('touchend', function() { 
        tapping && scope.$apply(attrs.ngTap);
      });
    } else {
      elm.bind('click', function() {
        scope.$apply(attrs.ngTap);
      });
    }
  };
});
