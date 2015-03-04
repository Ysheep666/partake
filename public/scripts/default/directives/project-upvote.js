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
          if ($scope.project.votes && $scope.project.vote_count < 38) {
            var _index = -1;
            for (var i = 0; i < $scope.project.votes.length; i++) {
              var v = $scope.project.votes[i];
              if (v.id === $rootScope.me.id) {
                _index = i;
                break;
              }
            }

            if (_index === -1) {
              $scope.project.votes.push({
                id: $rootScope.me.id,
                name: $rootScope.me.name,
                nickname: $rootScope.me.nickname,
                avatar: $rootScope.me.avatar,
                description: $rootScope.me.description
              });
            } else {
              $scope.project.votes.splice(_index, 1);
            }
          }
        }
      });
    },
    link: function (scope, element) {
      element.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scope.vote();
      });
    }
  };
});
