var fs = require('fs');
var angular = require('angular');

angular.module('defaultApp.directive').directive('commentDelete', function () {
  return {
    restrict: 'E',
    replace: true,
    scope : {project: '=project', comment: '=comment'},
    template: fs.readFileSync(__dirname + '/../../../templates/default/partials/comment-delete.html', 'utf8'),
    controller: function ($scope, $rootScope, ErrorTip, Comment) {
      $scope.delete = function () {
        Comment.delete($scope.comment.id).then(function (comment) {
          $scope.comment.is_delete = true;
          $scope.project.comment_count--;
        }, function (err) {
          ErrorTip.show(err.data);
        });
      };
    },
    link: function (scope, element) {
      element.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scope.delete();
      });
    }
  };
});
