'use strict';

/* Controllers */
stockApp.controller('RootController', function ($scope, $navigate, localStorageService, orderByFilter, getItems, getCategories){
	$scope.$navigate = $navigate;

    var init = function() {
	 	$scope.categories = getCategories.data;	
		$scope.items = getItems.data;  	
    }   
	init();
		
	// Add a new category to the 'categories' array
	$scope.addcategory = function() {
		$scope.categories.push({
			title: $scope.title, 
			items: 0, 
		});
				
		localStorageService.add('categories',angular.toJson($scope.categories));
		$scope.title = '';
		
		$navigate.back();
	};
	
	// Remove saved categories and associated items
	$scope.deleteAll = function() {
	  localStorageService.remove('categories'); 
	  getCategories.data = [];	
	  $scope.categories = [];  
	}; 		
	 	
});


stockApp.controller('ItemsController', function ($scope, $navigate, $routeParams, localStorageService, getItems, getStats, getCategories){	
	$scope.$navigate = $navigate;

    var init = function() {
		$scope.items = getItems.data;
		$scope.categories = getCategories.data;
		$scope.stats = getStats.data;	
		
		$scope.itemsCategory = { category: $routeParams['category'] }

		$scope.shirtSizes = [
		    {sex:'Male', size: 'S'},
		    {sex:'Male', size: 'M'},
		    {sex:'Male', size: 'L'},
		    {sex:'Male', size: 'XL'},
		    {sex:'Female', size: 'S'},
		    {sex:'Female', size: 'M'},
		    {sex:'Female', size: 'L'},
		    {sex:'Female', size: 'XL'}
		];
		   	
    }   
	init();

	//initForm();
	function initForm() {
		$scope.price = '0.00';
		$scope.qty = 1;
		$scope.bundleQty = 1;
	}
	
	// Add a new item to the 'items' array
	$scope.additem = function() {
		if ( $scope.qty > 1 ) {
			if (!$scope.bundleQty) {
				$scope.bundleQty = 1; // Set the bundle quantity to 1 by default
			}
			
			if ($routeParams['category'] == 'Shirts') {
				$scope.size = 'Male S';
			}
			
			$scope.items.push({
				title: $scope.title, 
				price: $scope.price*100, // Store price as integer
				payment: 'cash',    
				category: $routeParams['category'],  
				size: $scope.size,  
				bundleQty: $scope.bundleQty,    
				qty: parseInt($scope.qty), 
				initQty: parseInt($scope.qty)
			});
			
			$scope.save(); // Save items	
			
  			//logItems(($scope.items).length-1, 'added');
			
			// Clear the form
			$scope.title = '';
			$scope.price = '';
			$scope.qty = '';
			$scope.bundleQty = '';
			
			$navigate.back();
		} else {
			alert('Quantity cannot be zero');
		}
	};

	// Subtracts one from item quantity and stats as 'sold'
	$scope.subtract = function(item) {
		item.qty = item.qty - item.bundleQty;  // Subtract the bundle quantity
		
		var options = {};
		
		if (item.bundleQty > 1) {
			options.qty = item.bundleQty;	
		}		
		if (item.size) {
			options.size = item.size;	
		}
		
		options.price = item.price;

		if (item.qty >= 0) {
			logItems(item, 'sold', options);
		} else { // All sold
			alert('Sold out');
		}  	  
	};  
 		
	$scope.subtractAuto = function(index) {
	  //alert('this should keep subtracting');
	}; 
	
	// Adds one to item quantity and stats as 'added'
	$scope.add = function(item) {
	  	item.qty = parseInt(item.qty) + parseInt(item.bundleQty); // Add the bundle quantity (usually 1)
	  	
	  	var options = {};
		if (item.bundleQty > 1) {
			options.qty = item.bundleQty;	
		}		
		if (item.size) {
			options.size = item.size;	
		}
	  	
  		logItems(item, 'added', options);  			  
	  	if (item.qty == 1) { 
	  		// No longer sold out 
	  	}
	};

	// Stats added and sold items to the 'stats' table	
	function logItems(item, type, options) {
		
		$scope.stats.push({
			itemId: $scope.items.indexOf(item), 
			type: type, 
			title: item.title, 
			options: options, 
			payment: item.payment, 		
			timestamp: new Date().getTime() 
		});	

		$scope.saveStats(); // Update stats	  		  	
		$scope.save(); // Save items		  		  	
	}; 
	
	// Use drag left and right gestures for add and subtract instead of buttons
	$scope.dragleft = function(e, pos) {
		$navigate.back();
	   //alert(e);
	}; 
	
	$scope.unFocus = function() {
		document.activeElement.blur();
	}	
	
	// Returns the total quantity of items	
	$scope.totalQuantity = function() {
	    var count = 0;
	    angular.forEach($scope.filtered, function(item) {
	      	count = count + parseInt(item.qty);	    		
	    });
	    return count;
	}; 	
		
	// Remove saved items and clear scope
	$scope.deleteItems = function() {
	    if (confirm('Are you sure you want to delete all items?')) {
			localStorageService.remove('items');
			getItems.data = [];	 	  
			$scope.items = [];			
		}
	}; 	
	

	$scope.toggle = function(original, a, b) {		
		return original == a ? b : a;		
	}
	
	$scope.save = function() {	
		console.log('save');
		localStorageService.add('items',angular.toJson($scope.items));		
	}	
	
	$scope.saveStats = function() {	
		localStorageService.add('stats',angular.toJson($scope.stats));		
	}


});

stockApp.controller('StatsController', function ($scope, $navigate,localStorageService, getItems, getStats){	
	$scope.$navigate = $navigate;
	
    var init = function() {	
		$scope.items = getItems.data;
		$scope.stats = getStats.data;			
    }   
	init();
    

	// Returns the number of items that have been sold
	$scope.areSold = function() {
	    var count = 0;
	    angular.forEach($scope.stats, function(stat) {
	    	if (stat.type == 'sold') {
	      		++count;	    		
	    	}
	    });
	    return count;
	}; 	
	
	$scope.totalItems = function() {
	    var count = 0;
	    angular.forEach($scope.items, function(item) {
	      	count = count + item.initQty;	    		
	    });
	    return count;
	}; 	
	
	// Returns the total amount earned or in cash based on the logged price - accepts type = 'earned' or 'cash'
	$scope.total = function(type) {
	    var total = 0;
	    angular.forEach($scope.stats, function(stat) {
	    	if (stat.type == 'sold') {
		    	if ((type == 'earned') || (stat.payment == 'cash' && type == 'cash')) {
		      		total = total + stat.options.price;  	
		    	}		
	    	}    	    	
	    });
	    return total;
	}; 	
	
	
	// Remove stats log
	$scope.deleteStats = function() {
		if (confirm('Are you sure you want to delete all items?')) {
			localStorageService.remove('stats');
			$scope.stats = [];
			getStats.data = [];	 
		}
	}; 	
	
	$scope.dragleft = function() {
		$navigate.back();
	}; 		
	
});

  