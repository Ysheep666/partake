var fs = require('fs');
var angular = require('angular');

angular.module('manageApp.controller').controller('ProjectDetailsCtrl', function ($scope, Notification, ErrorTip, Project, project) {
  $scope.agreements = window.PT.agreements;
  $scope.languages = window.PT.languages;
  $scope.systems = window.PT.systems;

  $scope.project = project;
  $scope.project.description = ($scope.project.description.replace('&amp;', '&')
    .replace('&quot;', '"')
    .replace('&#x27;', "'")
    .replace('&lt;', '<')
    .replace('&gt;', '>')
    .replace('&#x2F;', '/'));

  // 提交项目
  $scope.submit = function () {
    if (!$scope.form.$valid) {
      return false;
    }

    Project.update($scope.project.id, {
      name: $scope.project.name,
      url: $scope.project.url,
      description: $scope.project.description,
      agreement: $scope.project.agreement,
      languages: $scope.project.languages,
      systems: $scope.project.systems
    }).then(function () {
      $scope.project.verify = true;
      project = $scope.project;
      Notification.show('提交项目成功', 'success');
      $scope.$close();
    }, function (err) {
      ErrorTip.show(err.data);
    });
  };
});

angular.module('manageApp.controller').controller('ProjectListCtrl', function ($scope, $state, $stateParams, $modal, ErrorTip, Project) {
  var currentPage = parseInt($stateParams.page, 10);

  $scope.count = 0;
  $scope.currentPage = 0;

  Project.query({
    index: 10 * (currentPage -1),
    count: 10
  }).then(function (result) {
    $scope.count = result.count;
    $scope.currentPage = currentPage;
    $scope.projects = result.data;
  });

  $scope.filterVerify = function () {
    return true;
  };

  $scope.pageChanged = function () {
    $state.go('project.list', {page: $scope.currentPage}, {reload: true});
  };

  $scope.verify = function (project) {
    $modal.open({
      template: fs.readFileSync(__dirname + '/../../../templates/manage/project-details.html', 'utf8'),
      controller: 'ProjectDetailsCtrl',
      windowClass: 'stick-up project-details',
      resolve: {
        project: function () {
          return project;
        }
      }
    });
  };
});

angular.module('manageApp.controller').controller('ProjectVerifyCtrl', function ($scope, $state, $stateParams, $modal, ErrorTip, Project) {
  var currentPage = parseInt($stateParams.page, 10);

  $scope.count = 0;
  $scope.currentPage = 0;

  Project.query({
    type: 'verify',
    index: 10 * (currentPage -1),
    count: 10
  }).then(function (result) {
    $scope.count = result.count;
    $scope.currentPage = currentPage;
    $scope.projects = result.data;
  });

  $scope.filterVerify = function (project) {
    return !!project.verify;
  };

  $scope.pageChanged = function () {
    $state.go('project.verify', {page: $scope.currentPage}, {reload: true});
  };

  $scope.verify = function (project) {
    $modal.open({
      template: fs.readFileSync(__dirname + '/../../../templates/manage/project-details.html', 'utf8'),
      controller: 'ProjectDetailsCtrl',
      windowClass: 'stick-up project-details',
      resolve: {
        project: function () {
          return project;
        }
      }
    });
  };
});

angular.module('manageApp.controller').controller('ProjectNoVerifyCtrl', function ($scope, $state, $stateParams, $modal, ErrorTip, Project) {
  var currentPage = parseInt($stateParams.page, 10);

  $scope.count = 0;
  $scope.currentPage = 0;

  Project.query({
    type: 'noverify',
    index: 10 * (currentPage -1),
    count: 10
  }).then(function (result) {
    $scope.count = result.count;
    $scope.currentPage = currentPage;
    $scope.projects = result.data;
  });

  $scope.filterVerify = function (project) {
    return !project.verify;
  };

  $scope.pageChanged = function () {
    $state.go('project.noverify', {page: $scope.currentPage}, {reload: true});
  };

  $scope.verify = function (project) {
    $modal.open({
      template: fs.readFileSync(__dirname + '/../../../templates/manage/project-details.html', 'utf8'),
      controller: 'ProjectDetailsCtrl',
      windowClass: 'stick-up project-details',
      resolve: {
        project: function () {
          return project;
        }
      }
    });
  };
});


