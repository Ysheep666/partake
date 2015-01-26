var angular = require('angular');

angular.module('manageApp.controller').controller('ProjectListCtrl', function ($scope, projects) {
  $scope.projects = projects;

  $scope.totalItems = 64;
  $scope.currentPage = 4;
});