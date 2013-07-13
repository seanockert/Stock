'use strict';

/* Filters */

/*
angular.module('stockCtrl.filters', []).
	filter('toArray', function() { return function(obj) {
	    if (!(obj instanceof Object)) return obj;
	    return _.map(obj, function(val, key) {
	        return Object.defineProperty(val, '$key', {__proto__: null, value: key});
	    });
	}});
*/

stockApp.filter('toArray', function() { return function(obj) {
    if (!(obj instanceof Object)) return obj;
    return _.map(obj, function(val, key) {
        return Object.defineProperty(val, '$key', {__proto__: null, value: key});
    });
}});
