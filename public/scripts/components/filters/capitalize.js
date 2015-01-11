var angular = require('angular');

angular.module('filter.capitalize', []).filter('capitalize', function () {
  return function (input) {
    if (!input) {
      return ''
    }
    var strs = input.split(' ');
    for (var i = 0; i < strs.length; i++) {
      strs[i] = strs[i].charAt(0).toUpperCase() + strs[i].slice(1);
    }
    return strs.join(' ');
  };
});
