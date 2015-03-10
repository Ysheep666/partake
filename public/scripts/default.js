var fs = require('fs');
var $ = require('jquery');
var angular = require('angular');

require('./components/filters/capitalize');
require('./components/filters/day-time');
require('./components/filters/default');
require('./components/filters/escape');
require('./components/services/notification');
require('./components/directives/contenteditable');
require('./components/directives/image-src');
require('./components/directives/user-avatar');

angular.module('ui.bootstrap', ['ui.bootstrap.modal', 'ui.bootstrap.tooltip', 'ui.bootstrap.popover', 'ui.bootstrap.tpls']);

angular.module('defaultApp.controller', []);
angular.module('defaultApp.directive', ['ui.contenteditable', 'ui.image-src', 'ui.user-avatar']);
angular.module('defaultApp.filter', ['filter.default', 'filter.capitalize', 'filter.day-time', 'filter.escape']);
angular.module('defaultApp.service', ['ui.bootstrap', 'ui.notification', 'ui.error-tip']);

require('./default/controllers/project');
require('./default/controllers/user');
require('./default/directives/comment-delete');
require('./default/directives/comment-upvote');
require('./default/directives/comment');
require('./default/directives/form-group-default');
require('./default/directives/project-item');
require('./default/directives/project-upvote');
require('./default/directives/textarea-auth-height');
require('./default/services/ui/error-tip');
require('./default/services/comment');
require('./default/services/default');
require('./default/services/project');
require('./default/services/user');

angular.module('defaultApp', [
  'ngSanitize',
  'ngAnimate',
  'ngCookies',
  'ui.router',
  'ct.ui.router.extras',
  'angularMoment',
  'sun.scrollable',
  'angular-loading-bar',
  'angularFileUpload',
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
    template: '<scrollable class="modal-view"><div class="slide-right-content" ui-view="modal"></div></scrollable><button type="button" class="close" data-dismiss="alert" ng-click="$close()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>',
    backdrop: 'static',
    windowClass: 'slide-right'
  };
  var slideModalOpen = function (modal, previousState, state, options) {
    options = $.extend(true, {}, slideModalOpenOptions, options);
    previousState.memo('modalInvoker');
    modal.open(options).result.then(function () {
      if (!previousState.get('modalInvoker').state.name) {
        state.go('default.project.list');
      } else {
        previousState.go('modalInvoker');
      }
    }, function () {
      // TODO: 这里不应该直接这样处理
      angular.element('.modal-backdrop').remove();
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


  $stateProvider.state('slide', {abstract: true});

  // 项目
  $stateProvider.state('slide.project', {abstract: true});
  $stateProvider.state('slide.project.details', {
    parent: 'slideModal',
    url: '/projects/{id:[0-9a-fA-F]{24}}',
    views: {
      'modal@': {
        template: fs.readFileSync(__dirname + '/../templates/default/project-details.html', 'utf8'),
        controller: 'ProjectDetailsCtrl'
      }
    }
  });

  $stateProvider.state('slide.project.create', {
    parent: 'slideModalSm',
    url: '/projects/create',
    views: {
      'modal@': {
        template: fs.readFileSync(__dirname + '/../templates/default/project-create.html', 'utf8'),
        controller: 'ProjectCreateCtrl'
      }
    }
  });



  $stateProvider.state('default', {sticky: true, abstract: true});

  // 查找
  $stateProvider.state('default.search', {
    url: '/search',
    views: {
      'wrapper@': {
        template: '1234'
      }
    }
  });

  // 项目
  $stateProvider.state('default.project', {abstract: true});
  $stateProvider.state('default.project.list', {
    url: '/',
    views: {
      'wrapper@': {
        template: fs.readFileSync(__dirname + '/../templates/default/project-list.html', 'utf8'),
        controller: 'ProjectListCtrl'
      }
    }
  });

  // 用户
  $stateProvider.state('default.user', {
    abstract: true,
    url: '/@{name:[^/]*}'
  });

  $stateProvider.state('default.user.details', {
    url: '',
    views: {
      'wrapper@': {
        template: fs.readFileSync(__dirname + '/../templates/default/user-details.html', 'utf8'),
        controller: 'UserDetailsCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/');
}).run(function ($http, $cookies, $rootScope, $state, $window, Notification, Default) {
  $rootScope.me = null;
  if (angular.element('meta[name="partake-user-id"]').length) {
    $rootScope.me = {
      id: angular.element('meta[name="partake-user-id"]').attr('content'),
      name: angular.element('meta[name="partake-user-name"]').attr('content'),
      nickname: angular.element('meta[name="partake-user-nickname"]').attr('content'),
      avatar: angular.element('meta[name="partake-user-avatar"]').attr('content'),
      description: angular.element('meta[name="partake-user-description"]').attr('content')
    };
  }

  $http.defaults.headers.common['X-Csrf-Token'] = $cookies._csrf;
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
