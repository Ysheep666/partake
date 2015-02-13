var fs = require('fs');
var angular = require('angular');

angular.module('defaultApp.directive').directive('projectUpvote', function () {
  return {
    restrict: 'E',
    replace: true,
    scope : {project: '=project'},
    template: fs.readFileSync(__dirname + '/../../../templates/default/partials/project-upvote.html', 'utf8'),
    controller: function ($scope, $rootScope, ErrorTip, Project) {
      $scope.vote = function () {
        Project.upvote($scope.project.id).then(function (project) {
           $rootScope.$broadcast('vote', project);
        }, function (err) {
          ErrorTip.show(err.data);
        })
      };

      $rootScope.$on('vote', function (event, project) {
        if ($scope.project.id === project.id) {
          $scope.project.vote = project.vote;
          $scope.project.vote_count = project.vote_count;
        }
      });
    },
    link: function (scope, element) {
      element.on('click', function (e) {
        e.stopPropagation();
        scope.vote();
      });
    }
  };
});
