var fs = require('fs');
var $ = require('jquery');
var angular = require('angular');

require('./components/filters/default');
require('./components/filters/capitalize');
require('./components/filters/day-time');
require('./components/services/notification');
require('./components/directives/user-avatar');

angular.module('ui.bootstrap', ['ui.bootstrap.modal', 'ui.bootstrap.tooltip', 'ui.bootstrap.popover', 'ui.bootstrap.tpls']);

angular.module('defaultApp.controller', []);
angular.module('defaultApp.directive', ['ui.user-avatar']);
angular.module('defaultApp.filter', ['filter.default', 'filter.capitalize', 'filter.day-time']);
angular.module('defaultApp.service', ['ui.bootstrap', 'ui.notification', 'ui.error-tip']);

require('./default/controllers/project');
require('./default/directives/form-group-default');
require('./default/directives/project-item');
require('./default/directives/project-upvote');
require('./default/services/ui/error-tip');
require('./default/services/default');
require('./default/services/project');

angular.module('defaultApp', [
  'ngAnimate',
  'ngCookies',
  'ui.router',
  'ct.ui.router.extras',
  'angularMoment',
  'sun.scrollable',
  'angular-loading-bar',
  'infinite-scroll',
  'defaultApp.controller',
  'defaultApp.directive',
  'defaultApp.filter',
  'defaultApp.service'
]).config(function ($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $locationProvider.html5Mode(true);
  cfpLoadingBarProvider.includeSpinner = false;

  var slideModalOpenOptions = {
    template: '<scrollable class="modal-view"><div ui-view="modal"></div></scrollable><button type="button" class="close" data-dismiss="alert" ng-click="$close()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>',
    backdrop: true,
    windowClass: 'slide-right'
  };
  var slideModalOpen = function (modal, previousState, state, options) {
    options = $.extend(true, {}, slideModalOpenOptions, options);
    previousState.memo('modalInvoker');
    modal.open(options).result.finally(function () {
      if (!previousState.get('modalInvoker').state.name) {
        state.go('project.list');
      } else {
        previousState.go('modalInvoker');
      }
    });
  };

  $stateProvider.state('slideModal', {
    abstract: true,
    onEnter: function ($modal, $previousState, $state) {
      slideModalOpen($modal, $previousState, $state);
    }
  });

  $stateProvider.state('slideModalSm', {
    abstract: true,
    onEnter: function ($modal, $previousState, $state) {
      slideModalOpen($modal, $previousState, $state, {
        size: 'sm'
      });
    }
  });

  $stateProvider.state('search', {
    url: '/search',
    views: {
      'wrapper@': {
        template: '1234'
      }
    },
    sticky: true
  });

  $stateProvider.state('project', {sticky: true});

  $stateProvider.state('project.list', {
    url: '/',
    views: {
      'wrapper@': {
        template: fs.readFileSync(__dirname + '/../templates/default/project-list.html', 'utf8'),
        controller: 'ProjectListCtrl'
      }
    }
  });

  $stateProvider.state('project.details', {
    parent: 'slideModal',
    url: '/projects/{id:[0-9a-fA-F]{24}}',
    views: {
      'modal@': {
        template: fs.readFileSync(__dirname + '/../templates/default/project-details.html', 'utf8'),
        controller: 'ProjectDetailsCtrl',
        resolve: {
          project: function ($stateParams, Project) {
            return Project.get($stateParams.id);
          }
        }
      }
    }
  });

  $stateProvider.state('project.create', {
    parent: 'slideModalSm',
    url: '/projects/create',
    views: {
      'modal@': {
        template: fs.readFileSync(__dirname + '/../templates/default/project-create.html', 'utf8'),
        controller: 'ProjectCreateCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/');
}).run(function ($http, $cookies, $rootScope, $state, $window, Notification, Default) {
  $http.defaults.headers.common['x-csrf-token'] = $cookies._csrf;
  $rootScope.$state = $state;

  $rootScope.logout = function () {
    Default.logout().then(function () {
      $window.location.href = '/';
    }, function () {
      Notification.show('退出登录失败', 'danger');
    });
  };
});

$(document).ready(function () {
  angular.bootstrap(document, ['defaultApp']);
});
