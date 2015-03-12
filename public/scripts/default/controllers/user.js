var angular = require('angular');

angular.module('defaultApp.controller').controller('UserDetailsCtrl', function ($scope, $stateParams, $upload, Notification, ErrorTip, Default, User) {
  User.get($stateParams.name).then(function (user) {
    $scope.user = user;
  });

  $scope.$on('follow', function (event, user) {
    if ($scope.user.is_me) {
      if (user.follower) {
        $scope.user.follower_count++;
      } else {
        $scope.user.follower_count--;
      }
    }
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
  $scope.status = {more: true, loading: false, nil: false};

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

        if (!$scope.projects.length) {
          $scope.status.nil = true;
        }
      });
    }
  };
});

angular.module('defaultApp.controller').controller('UserSubmitsCtrl', function ($scope, User) {
  $scope.count = 10;
  $scope.projects = [];
  $scope.status = {more: true, loading: false, nil: false};

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

        if (!$scope.projects.length) {
          $scope.status.nil = true;
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

angular.module('defaultApp.controller').controller('UserFansCtrl', function ($scope, User) {
  $scope.count = 30;
  $scope.users = [];
  $scope.status = {more: true, loading: false, nil: false};

  $scope.more = function () {
    if (!$scope.status.loading) {
      $scope.status.loading = true;
      User.queryFans($scope.$parent.user.id, {
        index: $scope.users.length,
        count: $scope.count
      }).then(function (users) {
        if (users.length) {
          for (var i = 0; i < users.length; i++) {
            $scope.users.push(users[i]);
          }
          $scope.status.loading = false;
        } else {
          $scope.status.more = false;
        }

        if (!$scope.users.length) {
          $scope.status.nil = true;
        }
      });
    }
  };
});

angular.module('defaultApp.controller').controller('UserFollowsCtrl', function ($scope, User) {
  $scope.count = 30;
  $scope.users = [];
  $scope.status = {more: true, loading: false, nil: false};

  $scope.$on('follow', function (event, user) {
    if ($scope.$parent.user.is_me) {
      for (var i = 0; i < $scope.users.length; i++) {
        if (user.id === $scope.users[i].id) {
          $scope.users[i].isnt_follower = !user.follower;
          break;
        }
      }
    }
  });

  $scope.more = function () {
    if (!$scope.status.loading) {
      $scope.status.loading = true;
      User.queryFollows($scope.$parent.user.id, {
        index: $scope.users.length,
        count: $scope.count
      }).then(function (users) {
        if (users.length) {
          for (var i = 0; i < users.length; i++) {
            $scope.users.push(users[i]);
          }
          $scope.status.loading = false;
        } else {
          $scope.status.more = false;
        }

        if (!$scope.users.length) {
          $scope.status.nil = true;
        }
      });
    }
  };
});


