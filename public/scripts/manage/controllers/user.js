var angular = require('angular');

angular.module('manageApp.controller').controller('UserListCtrl', function ($scope, ErrorTip, User) {
  User.query().then(function (users) {
    $scope.users = users;
  });

  $scope.provider = function (user) {
    User.update(user.id, {provider: !user.provider}).then(function () {
      user.provider = !user.provider;
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };

  $scope.administrate = function (user) {
    User.update(user.id, {administrate: !user.administrate}).then(function () {
      user.administrate = !user.administrate;
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };

  $scope.delete = function (user) {
    User.delete(user.id).then(function () {
      $scope.users.splice($scope.users.indexOf(user), 1);
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };
});