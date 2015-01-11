var angular = require('angular');

angular.module('defaultApp.controller').controller('DefaultCtrl', function ($scope, projects) {
  $scope.projects = projects;
});
