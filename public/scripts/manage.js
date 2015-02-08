var fs = require('fs');
var $ = require('jquery');
var angular = require('angular');

require('./components/filters/default');
require('./components/filters/capitalize');
require('./components/services/notification');
require('./components/services/error-tip');

angular.module('ui.modal', ['ui.bootstrap.modal', 'ui.bootstrap.tpls']);

angular.module('manageApp.controller', []);
angular.module('manageApp.directive', []);
angular.module('manageApp.filter', ['filter.default', 'filter.capitalize']);
angular.module('manageApp.service', ['ui.progress', 'ui.notification', 'ui.modal', 'ui.error-tip']);

require('./manage/controllers/project');
require('./manage/services/default');
require('./manage/services/project');

angular.module('manageApp', [
  'ngAnimate',
  'ngCookies',
  'ui.router',
  'ct.ui.router.extras',
  'sun.scrollable',
  'angular-loading-bar',
  'manageApp.controller',
  'manageApp.directive',
  'manageApp.filter',
  'manageApp.service'
]).config(function ($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $locationProvider.html5Mode(true);
  cfpLoadingBarProvider.includeSpinner = false;

  $stateProvider.state('manage', {
    url: '/manage',
    views: {
      'content@': {
        template: fs.readFileSync(__dirname + '/../templates/manage/project-list.html', 'utf8'),
        controller: 'ProjectListCtrl',
        resolve: {
          projects: function (Project) {
            return Project.query({admin: true});
          }
        }
      }
    },
    sticky: true
  });

  $urlRouterProvider.otherwise('/manage');
}).run(function ($http, $cookies, $rootScope, $window, $state, Progress, Notification, Default) {
  $http.defaults.headers.common['x-csrf-token'] = $cookies._csrf;
  $rootScope.$state = $state;

  $rootScope.$on('$stateChangeStart', function () {
    Progress.start();
  });

  $rootScope.$on('$stateChangeSuccess', function () {
    Progress.complete();
  });

  $rootScope.logout = function () {
    Default.logout().then(function () {
      $window.location.href = '/';
    }, function (err) {
      Notification.show('退出登录失败', 'danger');
    });
  };
});

$(document).ready(function () {
  angular.bootstrap(document, ['manageApp']);
});
