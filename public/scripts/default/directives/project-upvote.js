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
            var _id = angular.element('meta[name="partake-user-id"]').attr('content');
            for (var i = 0; i < $scope.project.votes.length; i++) {
              var v = $scope.project.votes[i];
              if (v.id === _id) {
                _index = i;
                break;
              }
            }

            if (_index === -1) {
              $scope.project.votes.push({
                id: _id,
                name: angular.element('meta[name="partake-user-name"]').attr('content'),
                nickname: angular.element('meta[name="partake-user-nickname"]').attr('content'),
                avatar: angular.element('meta[name="partake-user-avatar"]').attr('content'),
                description: angular.element('meta[name="partake-user-description"]').attr('content')
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
        e.stopPropagation();
        scope.vote();
      });
    }
  };
});
