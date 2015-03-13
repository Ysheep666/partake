var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.directive').directive('inputAutoWidth', function($timeout) {
 return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var fontSize = element.css('fontSize');

      fontSize = fontSize.substring(0, fontSize.indexOf('px'));
      fontSize = parseInt(fontSize, 10);

      var reset = function () {
        var length = element.val().length;
        if (length) {
          element.width(length * fontSize);
        } else {
          element.width(attrs.width);
        }
      };

      $timeout(reset, 0);
      element.on('input', reset);
    }
  };
});
