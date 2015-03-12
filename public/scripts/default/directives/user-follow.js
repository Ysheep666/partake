var fs = require('fs');
var angular = require('angular');

angular.module('defaultApp.directive').directive('userFollow', function () {
  return {
    restrict: 'E',
    replace: true,
    scope : {user: '=user'},
    template: fs.readFileSync(__dirname + '/../../../templates/default/partials/user-follow.html', 'utf8'),
    controller: function ($scope, $rootScope, ErrorTip, User) {
      $scope.follow = function () {
        User.follow($scope.user.id).then(function (user) {
           $rootScope.$broadcast('follow', user);
        }, function (err) {
          ErrorTip.show(err.data);
        });
      };

      $scope.$on('follow', function (event, user) {
        if ($scope.user.id === user.id) {
          $scope.user.follower = user.follower;
          $scope.user.fans_count = user.fans_count;
        }
      });
    },
    link: function (scope, element) {
      element.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scope.follow();
      });
    }
  };
});
