var angular = require('angular');

angular.module('defaultApp.controller').controller('DetailsCtrl', function ($scope, project) {
  $scope.project = project;
});
