var moment = require('moment');
var angular = require('angular');

angular.module('defaultApp.controller').filter('dayTime', function () {
  return function (input, value) {
    if (moment(input).startOf('day').isSame(moment().startOf('day'))) {
      return '今天';
    } else if (moment(input).add(1, 'days').startOf('day').isSame(moment().startOf('day'))) {
      return '昨天'
    } else if (moment(input).add(2, 'days').startOf('day').isSame(moment().startOf('day'))) {
      return '前天'
    } else {
      return moment(input).format('dddd');
    }
  };
}).controller('ProjectListCtrl', function ($scope, Project) {
  $scope.count = 3;
  $scope.results = [];
  $scope.status = {more: true};

  $scope.more = function () {
    if (!$scope.status.loading) {
      $scope.status.loading = true;
      Project.query({
        index: $scope.results.length,
        count: $scope.count
      }).then(function (results) {
        if (results.length) {
          for (var i = 0; i < results.length; i++) {
            $scope.results.push(results[i]);
          }
          $scope.status.loading = false;
        } else {
          $scope.status.more = false;
        }
      });
    }
  };
});

angular.module('defaultApp.controller').controller('ProjectDetailsCtrl', function ($scope, project) {
  $scope.project = project;
});

angular.module('defaultApp.controller').controller('ProjectCreateCtrl', function ($scope, Notification, ErrorTip, Project) {
  $scope.submit = function () {
    if (!$scope.form.$valid) {
      return false;
    }

    Project.create($scope.project).then(function (project) {
      $scope.$close();
      Notification.show('提交项目成功', 'success');
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };
});
