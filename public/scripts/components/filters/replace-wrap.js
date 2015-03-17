var angular = require('angular');

angular.module('filter.replace-wrap', []).filter('replaceWrap', function () {
  return function (input) {
    return input.replace(/\n/g, '<br>');
  };
});
