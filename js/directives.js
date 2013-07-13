'use strict';

/* Directives */

/*
angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
*/

angular.module('toggle-switch', ['ng']).directive('toggleSwitch', function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      items: '@',
      model: '='
    },
    //template: '<div class="switch" ng-click="toggle()"><div class="switch-animate" ng-class="{\'switch-off\': !model, \'switch-on\': model}"><span class="switch-left">On</span><span class="knob">&nbsp;</span><span class="switch-right">Off</span></div></div>',
    template: '<div class="toggle" ng-click="toggle({{items}})" ng-class="{\'inactive\': !model, \'active\': model}"><div class="toggle-handle"></div></div>',
    link: function($scope, element, attrs) {
      if ($scope.model == null) {
        $scope.model = false;
      }
      return $scope.toggle = function(index) {
        console.log(index);
        return $scope.model = !$scope.model;
      };
    }
  };
});




/**
 * @ngdoc overview
 * @name ngMobile
 * @description
 * Touch events and other mobile helpers.
 * Based on jQuery Mobile touch event handling (jquerymobile.com)
 */

// define ngMobile module
var ngMobile = angular.module('ngMobile', []);



ngMobile.factory('$mobileDrag', ['$mobile', function($mobile) {
  $mobile.register({
      name: 'drag',
      index: 50,
      defaults: {
        drag_max_pointers : 1,
          drag_min_distance : 10,
          // prevent default browser behavior when dragging occurs
          // when you are using the drag gesture, it is a good practice to set this true
          drag_block   : false,
          prevent_ghost_clicks: true  // shared setting between ngClick and Drag
      },
      handler: function dragGesture(ev, inst) {
          // current gesture isnt drag, but dragged is true
          // this means an other gesture is busy. now call dragend
          if(inst.current.name != this.name && this.triggered) {
              inst.trigger(this.name +'end', ev);
              this.triggered = false;
              return;
          }

          // max touches
          if(ev.touches.length > inst.options.drag_max_pointers) {
              return;
          }

          switch(ev.eventType) {
              case $mobile.utils.EVENT_START:
                ev.stopPropagation();
                
                  this.triggered = false;
                  break;

              case $mobile.utils.EVENT_MOVE:
                ev.stopPropagation();
                
                  // when the distance we moved is too small we skip this gesture
                  // or we can be already in dragging
                  if(ev.distance < inst.options.drag_min_distance &&
                      inst.current.name != this.name) {
                      return;
                  }

                  // we are dragging!
                  if(inst.current.name != this.name) {
                    inst.current.name = this.name;

                    // Adjust the start position based on the min drag distance
                    var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
                    inst.current.startEvent.center.pageX += ev.deltaX * factor;
                    inst.current.startEvent.center.pageY += ev.deltaY * factor;
                    inst.extendEventData(ev);
                }

                  // first time, trigger dragstart event
                  if(!this.triggered) {
                      inst.trigger(this.name +'start', ev);
                      this.triggered = true;
                  }

                  // trigger normal event
                  inst.trigger(this.name, ev);

                  // block the browser events
                  ev.preventDefault();
                  break;

              case $mobile.utils.EVENT_END:
                ev.stopPropagation();
                
                  // trigger dragend
                  if(this.triggered) {
                      inst.trigger(this.name +'end', ev);

            if (ev.srcEvent.type == 'touchend' && inst.options.prevent_ghost_clicks) {
              $mobile.utils.preventGhostClick(ev.startEvent.touches[0].clientX, ev.startEvent.touches[0].clientY);
            }
                  }

                  this.triggered = false;
                  break;
          }
      }
  });

  return $mobile;
}]);

ngMobile.directive('ngDrag', ['$parse', '$mobileDrag', function($parse, $mobile) {
  return {
    restrict: 'A',    // Attribute
    link: function(scope, element, attrs) {
      var x0,     // X 0ffset of drag start
        y0,     // Y 0ffset of drag start
        x,      // Current X offset during drag
        y,      // Current Y offset during drag
        props,    // Stores the change in position
        start,    // Is this the first move
        performDrag = attrs['ngDrag'] == 'true',
        moveY = attrs['yAxis'] != 'false',
        moveX = attrs['xAxis'] != 'false',
        dragStart,
        onDrag,
        dragEnd;

      if (attrs['dragStart']) {
        dragStart = $parse(attrs['dragStart']);
      }

      if (attrs['onDrag']) {
        onDrag = $parse(attrs['onDrag']);
      }

      if (attrs['dragEnd']) {
        dragEnd = $parse(attrs['dragEnd']);
      }

      $mobile.gestureOn(element, 'drag').bind('dragstart', function(event) {
        x0 = event.center.pageX - element[0].offsetLeft;
        y0 = event.center.pageY - element[0].offsetTop;

        start = true;
      }).bind('drag', function(event) {
        props = {};

        x = event.center.pageX - x0;
        y = event.center.pageY - y0;

        if (start === true && dragStart) {
          start = false;
          scope.$apply(function() {
            dragStart(scope, {$event: event, $element: element});
          });
        }

        if (performDrag) {
          if (moveX) {
            props.left = x;
            element.css('left', x + 'px');
          }
          if (moveY) {
            props.top = y;
            element.css('top', y + 'px');
          }
        } else {
          if (moveX) { props.left = x; }
          if (moveY) { props.top = y; }
        }

        if (onDrag) {
          scope.$apply(function() {
            onDrag(scope, {$event: event, $element: element, $position: props});
          });
        }
      }).bind('dragend', function(event) {
        if (dragEnd) {
          scope.$apply(function() {
            dragEnd(scope, {$event: event, $element: element, $position: props});
          });
        }
      });
    }
  };
}]);
