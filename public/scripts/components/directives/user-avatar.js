var fs = require('fs');
var angular = require('angular');

angular.module('ui.user-avatar', []).directive('userAvatar', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    scope : {user: '=user'},
    template: fs.readFileSync(__dirname + '/../../../templates/components/user-avatar.html', 'utf8'),
    link: function (scope, element, attrs) {
      $(element).popover({
        container: 'body',
        html: true,
        placement: 'top',
        trigger: 'click',
        content: $compile(fs.readFileSync(__dirname + '/../../../templates/components/user-avatar-card.html', 'utf8'))(scope)
      });
      // element.on('mouseenter', function () {
      //   console.log('12312');
      // }).on('mouseleave', function () {
      //   console.log('asd12321');
      // });
    }
  };
});