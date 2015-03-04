var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.directive').directive('textareaAuthHeight', function($timeout) {
 return {
    restrict: 'A',
    link: function (scope, element) {
      var _height = 0;
      $timeout(function () {
        _height = element.height();
      }, 0);

      element.on('focusin input', function () {
        element.height(element[0].scrollHeight < 240 ? element[0].scrollHeight : 240);
      });

      element.on('focusout', function () {
        element.height(_height);
      });
    }
  };
});
