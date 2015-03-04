var fs = require('fs');
var angular = require('angular');

angular.module('defaultApp.directive').directive('commentUpvote', function () {
  return {
    restrict: 'E',
    replace: true,
    scope : {comment: '=comment'},
    template: fs.readFileSync(__dirname + '/../../../templates/default/partials/comment-upvote.html', 'utf8'),
    controller: function ($scope, $rootScope, ErrorTip, Comment) {
      $scope.vote = function () {
        Comment.upvote($scope.comment.id).then(function (comment) {
          $scope.comment.vote = comment.vote;
          $scope.comment.vote_count = comment.vote_count;
        }, function (err) {
          ErrorTip.show(err.data);
        })
      };
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
