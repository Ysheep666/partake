var fs = require('fs');
var $ = require('jquery');
var angular = require('angular');

require('./components/filters/default');
require('./components/filters/capitalize');
require('./components/services/progress');
require('./components/services/notification');

angular.module('defaultApp.controller', []);
angular.module('defaultApp.directive', []);
angular.module('defaultApp.filter', ['filter.default', 'filter.capitalize']);
angular.module('defaultApp.service', ['ui.progress', 'ui.notification']);

require('./default/controllers/default');
require('./default/directives/post-list');
require('./default/services/default');
require('./default/services/project');

angular.module('defaultApp', [
  'ngCookies',
  'ui.router',
  'defaultApp.controller',
  'defaultApp.directive',
  'defaultApp.filter',
  'defaultApp.service'
]).config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('default', {
    url: '/',
    template: fs.readFileSync(__dirname + '/../templates/default/default.html', 'utf8'),
    controller: 'DefaultCtrl',
    resolve: {
      projects: function (Project) {
        return Project.query();
      }
    }
  }).state('abc', {
    url: '/abc',
    template: '<div>abc</div><a href="/">index</a>',
    controller: function () {}
  });

  $urlRouterProvider.otherwise('/');
}).run(function ($http, $cookies, $rootScope, $window, Progress, Notification, Default) {
  $http.defaults.headers.common['x-csrf-token'] = $cookies._csrf;

  $rootScope.$on('$stateChangeStart', function () {
    Progress.start();
  });

  $rootScope.$on('$stateChangeSuccess', function () {
    Progress.complete();
  });

  // 退出登录
  $rootScope.logout = function () {
    Default.logout().then(function () {
      $window.location.href = '/';
    }, function (err) {
      Notification.show('退出登录失败', 'danger');
    });
  };
});

$(document).ready(function () {
  angular.bootstrap(document, ['defaultApp']);
});
