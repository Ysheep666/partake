var fs = require('fs');
var angular = require('angular');

angular.module('defaultApp.directive').directive('comment', function($state, Notification, ErrorTip, Comment) {
 return {
    restrict: 'E',
    replace: true,
    scope : {project: '=project'},
    template: fs.readFileSync(__dirname + '/../../../templates/default/partials/comment.html', 'utf8'),
    link: function (scope, element) {
      element.find('textarea').on('focusout', function () {
        scope.form.$setPristine();
      });

      scope.comment = {};

      scope.comment.project = scope.project.id;
      scope.comment.user = scope.$root.me.id;

      scope.submit = function () {
        if (!scope.form.$valid) {
          return false;
        }

        Comment.create(scope.comment).then(function (data) {
          Notification.show('提交评论成功', 'success');

          if (scope.project.comment_count < 20) {
            scope.project.comments.push({
              id: data.id,
              content: scope.comment.content,
              vote_count: 0,
              created_at: new Date(),
              user: scope.$root.me
            });
          }

          scope.project.comment_count++;
          scope.form.$setPristine();
          scope.comment.content = '';
        }, function (err) {
          ErrorTip.show(err.data);
        });
      };
    }
  };
});
