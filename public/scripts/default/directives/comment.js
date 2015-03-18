var fs = require('fs');
var angular = require('angular');

angular.module('defaultApp.directive').directive('comment', function($state, $filter, Notification, ErrorTip, Comment) {
 return {
    restrict: 'E',
    replace: true,
    scope : {project: '=project'},
    template: fs.readFileSync(__dirname + '/../../../templates/default/partials/comment.html', 'utf8'),
    link: function (scope, element) {
      scope.parent = null;
      scope.comment = {};

      scope.$on('reply', function (event, parent) {
        element.find('textarea').focus();
        scope.parent = angular.copy(parent);
      });

      element.find('textarea').on('focusout', function () {
        scope.form.$setPristine();
      });

      scope.cancel = function () {
        scope.parent = null;
      };

      scope.submit = function () {
        if (!scope.form.$valid) {
          return false;
        }

        var comment = {
          project: scope.project.id,
          user: scope.$root.me.id,
          content: scope.comment.content
        };

        if (scope.parent) {
          comment.parent = scope.parent.id;
        }

        Comment.create(comment).then(function (data) {
          Notification.show('提交评论成功', 'success');

          if (scope.project.comment_count < 20) {
            if (scope.parent) {
              for (var i = 0; i < scope.project.comments.length; i++) {
                if (scope.project.comments[i].id === scope.parent.id) {
                  scope.project.comments[i].children.push({
                    id: data.id,
                    content: $filter('escape')(scope.comment.content),
                    vote_count: 0,
                    created_at: new Date(),
                    user: scope.$root.me
                  });
                  break;
                }
              }
            } else {
              scope.project.comments.push({
                id: data.id,
                content: $filter('escape')(scope.comment.content),
                vote_count: 0,
                created_at: new Date(),
                user: scope.$root.me
              });
            }
          }

          scope.project.comment_count++;
          scope.form.$setPristine();

          scope.parent = null
          scope.comment.content = '';
        }, function (err) {
          ErrorTip.show(err.data);
        });
      };
    }
  };
});
