var $ = require('jquery');
var angular = require('angular');

angular.module('controllers', []);

require('./controllers/default');

angular.module('defaultApp', [
  'ngCookies',
  'ui.router',
  'controllers'
]).config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/404');
  $locationProvider.html5Mode(true);

  $stateProvider.state('default', {
    url: '/',
    template: 'template',
    controller: 'DefaultCtrl'
  });
}).run(function ($http, $cookies, $rootScope) {
  $http.defaults.headers.common['x-csrf-token'] = $cookies._csrf;

  // 退出登录
  $rootScope.logout = function () {
    $rootScope.loginStatus = 'loading';
    $http.delete('/api/logout').success(function (data) {
      $rootScope.loginStatus = 'success';
      window.location.href = '/';
    });
  };
});

$(document).ready(function () {
  angular.bootstrap(document, ['defaultApp']);
});

