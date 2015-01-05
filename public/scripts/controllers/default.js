var angular = require('angular');

angular.module('defaultApp.controller').controller('DefaultCtrl', function ($scope) {
  $scope.click = function () {
    return 'demo';
  };
});
