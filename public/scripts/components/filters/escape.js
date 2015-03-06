var angular = require('angular');

angular.module('filter.escape', []).filter('escape', function () {
  return function (input) {
    return (input.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\//g, '&#x2F;'));
  };
});
