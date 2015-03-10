var angular = require('angular');

angular.module('ui.image-src', []).directive('imageSrc', function () {
  return {
    restrict: 'A',
    scope : {src: '@imageSrc'},
    link: function (scope, element, attrs) {
      var githubMap = {
        'avatar.small': 100,
        'avatar.extra.small': 30
      };

      scope.$watch('src', function (src) {
        if (src) {
          if (attrs.v) {
            if (src.indexOf('github') < 0) {
              src = src + '!' + attrs.v;
            } else {
              src = src + '&s=' + githubMap[attrs.v];
            }
          }
          element.attr('src', src);
        }
      });
    }
  };
});
