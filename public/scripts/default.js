var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.controller', []);
angular.module('defaultApp.filter', []);
angular.module('defaultApp.service', []);

require('./controllers/default');
require('./filters/default');
require('./services/default');

angular.module('defaultApp', [
  'ngCookies',
  'ui.router',
  'defaultApp.controller',
  'defaultApp.filter',
  'defaultApp.service'
]).config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('default', {
    url: '/',
    template: '<p>这个只是一个演示</h1>',
    controller: 'DefaultCtrl'
  });
  $urlRouterProvider.otherwise('/404');
}).run(function ($http, $cookies, $rootScope, Default) {
  $http.defaults.headers.common['x-csrf-token'] = $cookies._csrf;

  // 退出登录
  $rootScope.logout = function () {
    Default.logout().success(function () {
      window.location.href = '/';
    });
  };
});

$(document).ready(function () {
  angular.bootstrap(document, ['defaultApp']);
});

