var angular = require('angular');

angular.module('defaultApp.controller').controller('ProjectListCtrl', function ($scope, projects) {
  $scope.projects = projects;
});

angular.module('defaultApp.controller').controller('ProjectDetailsCtrl', function ($scope, project) {
  $scope.project = project;
});

angular.module('defaultApp.controller').controller('ProjectCreateCtrl', function ($scope, ErrorTip, Project) {
  $scope.submit = function () {
    if (!$scope.form.$valid) {
      return false;
    }

    Project.create($scope.project).then(function (data) {
      console.log(arguments);
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };
});
