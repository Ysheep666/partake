var moment = require('moment');
var angular = require('angular');

angular.module('defaultApp.controller').controller('ProjectListCtrl', function ($rootScope, $scope, Project) {
  $scope.count = 3;
  $scope.results = [];
  $scope.status = {more: true, loading: false};

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

  $rootScope.$on('refreshProjectList', function () {
    $scope.results = [];
    $scope.status = {more: true, loading: false};
    $scope.more();
  });
});

angular.module('defaultApp.controller').controller('ProjectDetailsCtrl', function ($scope, project) {
  $scope.project = project;
});

angular.module('defaultApp.controller').controller('ProjectCreateCtrl', function ($rootScope, $scope, Notification, ErrorTip, Project) {
  $scope.submit = function () {
    if (!$scope.form.$valid) {
      return false;
    }

    Project.create($scope.project).then(function (project) {
      Notification.show('提交项目成功', 'success');

      $scope.$close();
      $rootScope.$broadcast('refreshProjectList');
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };
});
