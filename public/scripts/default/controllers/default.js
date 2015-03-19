var angular = require('angular');

angular.module('defaultApp.controller').controller('SearchCtrl', function ($scope, $state, $stateParams, Default) {
  $scope.query = $stateParams.q;
  $scope.users = [];
  $scope.projects = [];

  var search = null;
  $scope.$watch('query', function (query) {
    window.clearTimeout(search);
    search = window.setTimeout(function () {
      if (query) {
        Default.search(query).then(function (results) {
          $scope.users = results.users;
          $scope.projects = results.projects;
        });
      } else {
        $scope.users = [];
        $scope.projects = [];
      }

      $state.go('default.search', {q: $scope.query}, {notify: false})
    }, 500);
  });

  angular.element('.search-input input').focus();
});
