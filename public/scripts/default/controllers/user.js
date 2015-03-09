var angular = require('angular');

angular.module('defaultApp.controller').controller('UserDetailsCtrl', function ($scope, $stateParams, Notification, User) {
  User.get($stateParams.name).then(function (user) {
    $scope.user = user;
  });

  $scope.avatarToEdit = function () {};

  $scope.toEdit = function () {
    $scope.is_edit = true;
    $scope.temporary_user = angular.copy($scope.user);
  };

  $scope.toSave = function () {
    User.update($scope.temporary_user.id, {
      avatar: $scope.temporary_user.avatar,
      nickname: $scope.temporary_user.nickname,
      description: $scope.temporary_user.description
    }).then(function () {
      $scope.is_edit = false;
      $scope.user = angular.copy($scope.temporary_user);
      Notification.show('更新信息成功', 'success');
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };

  $scope.toCancel = function () {
    $scope.is_edit = false;
  };
});
