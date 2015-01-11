var fs = require('fs');
var angular = require('angular');

angular.module('defaultApp.directive').directive('postList', function() {
 return {
    restrict: 'E',
    replace: true,
    scope : {projects: '=projects'},
    template: fs.readFileSync(__dirname + '/../../../templates/default/post-list.html', 'utf8'),
    link: function (scope, element, attrs) {
    }
  };
});