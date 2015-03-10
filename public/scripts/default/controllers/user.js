var angular = require('angular');

angular.module('defaultApp.controller').controller('UserDetailsCtrl', function ($scope, $stateParams, $upload, Notification, ErrorTip, Default, User) {
  User.get($stateParams.name).then(function (user) {
    $scope.user = user;
  });

  $scope.temporary_avatar_upload = false;
  var upload = function (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      $scope.temporary_avatar_upload = true;
      Default.getUpToken({bucket: 'partake-images'}).then(function (data) {
        $scope.upload = $upload.upload({
          url: window.PT.upyun.api + '/partake-images',
          file: file,
          headers: {
            'Content-Type': undefined,
            'X-Requested-With': undefined,
            'X-Csrf-Token': undefined
          },
          fields: data
        }).success(function (data) {;
          $scope.upload = upload;
          $scope.temporary_avatar_upload = false;
          $scope.temporary_user.avatar = window.PT.upyun.buckets['partake-images'] + data.url;
        });
      }, function (err) {
        ErrorTip.show(err.data || err);
      });
    }
  };

  $scope.upload = upload;

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

angular.module('defaultApp.controller').controller('UserVotesCtrl', function ($scope, User) {
  $scope.count = 10;
  $scope.projects = [];
  $scope.status = {more: true, loading: false};

  $scope.more = function () {
    if (!$scope.status.loading) {
      $scope.status.loading = true;
      User.queryVote($scope.$parent.user.id, {
        index: $scope.projects.length,
        count: $scope.count
      }).then(function (projects) {
        if (projects.length) {
          for (var i = 0; i < projects.length; i++) {
            $scope.projects.push(projects[i]);
          }
          $scope.status.loading = false;
        } else {
          $scope.status.more = false;
        }
      });
    }
  };
});

angular.module('defaultApp.controller').controller('UserSubmitsCtrl', function ($scope, User) {
  $scope.count = 10;
  $scope.projects = [];
  $scope.status = {more: true, loading: false};

  $scope.more = function () {
    if (!$scope.status.loading) {
      $scope.status.loading = true;
      User.querySubmit($scope.$parent.user.id, {
        index: $scope.projects.length,
        count: $scope.count
      }).then(function (projects) {
        if (projects.length) {
          for (var i = 0; i < projects.length; i++) {
            $scope.projects.push(projects[i]);
          }
          $scope.status.loading = false;
        } else {
          $scope.status.more = false;
        }
      });
    }
  };

  $scope.$on('refreshProjectList', function () {
    $scope.results = [];
    $scope.status = {more: true, loading: false};
    $scope.more();
  });
});


