var fs = require('fs');
var $ = require('jquery');
var angular = require('angular');

require('./components/filters/day-time');
require('./components/filters/default');
require('./components/filters/escape');
require('./components/filters/replace-wrap');
require('./components/services/notification');
require('./components/directives/image-src');
require('./components/directives/user-avatar');

angular.module('ui.bootstrap', ['ui.bootstrap.modal', 'ui.bootstrap.tooltip', 'ui.bootstrap.popover', 'ui.bootstrap.tpls']);

angular.module('defaultApp.controller', []);
angular.module('defaultApp.directive', ['ui.image-src', 'ui.user-avatar']);
angular.module('defaultApp.filter', ['filter.default', 'filter.day-time', 'filter.escape', 'filter.replace-wrap']);
angular.module('defaultApp.service', ['ui.bootstrap', 'ui.notification', 'ui.error-tip']);

require('./default/controllers/project');
require('./default/controllers/user');
require('./default/directives/comment-delete');
require('./default/directives/comment-upvote');
require('./default/directives/comment');
require('./default/directives/input-auto-width');
require('./default/directives/form-group-default');
require('./default/directives/project-item');
require('./default/directives/project-upvote');
require('./default/directives/textarea-auto-height');
require('./default/directives/user-follow');
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
    template: '<div class="modal-view slide-right-content" ui-view="modal"></div>',
    windowClass: 'slide-right',
    controller: function ($scope, $timeout) {
      $timeout(function () {
        var el = $('<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
        angular.element('.modal-dialog').append(el);
        el.on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          $scope.$close();
        });
      }, 150);
    }
  };

  var slideModalOpen = function (modal, previousState, state, timeout, options) {
    options = $.extend(true, {}, slideModalOpenOptions, options);
    previousState.memo('modalInvoker');

    var _close = function () {
      if (!previousState.get('modalInvoker').state.name) {
        timeout(function () {
          state.go('default.project.list');
        }, 200);
      } else {
        state.invoker = true;
        previousState.go('modalInvoker');
      }
    };

    modal.open(options).result.then(_close, function (status) {
      if (status && status.state_change) {
        angular.element('.modal-backdrop').remove();
      } else {
        _close();
      }
    });
  };

  $stateProvider.state('slideModal', {
    abstract: true,
    onEnter: function ($modal, $previousState, $state, $timeout) {
      slideModalOpen($modal, $previousState, $state, $timeout);
    }
  });

  $stateProvider.state('slideModalSm', {
    abstract: true,
    onEnter: function ($modal, $previousState, $state, $timeout) {
      slideModalOpen($modal, $previousState, $state, $timeout, {
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
  $stateProvider.state('default.nil', {url: ''});

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
    url: '/@{name:[^/]*}',
    views: {
      'wrapper@': {
        template: fs.readFileSync(__dirname + '/../templates/default/user-details.html', 'utf8'),
        controller: 'UserDetailsCtrl'
      }
    }
  });

  $stateProvider.state('default.user.votes', {
    url: '',
    views: {
      'content': {
        template: fs.readFileSync(__dirname + '/../templates/default/user-projects.html', 'utf8'),
        controller: 'UserVotesCtrl'
      }
    }
  });

  $stateProvider.state('default.user.submits', {
    url: '/submits',
    views: {
      'content': {
        template: fs.readFileSync(__dirname + '/../templates/default/user-projects.html', 'utf8'),
        controller: 'UserSubmitsCtrl'
      }
    }
  });

  $stateProvider.state('default.user.fans', {
    url: '/fans',
    views: {
      'content': {
        template: fs.readFileSync(__dirname + '/../templates/default/user-peoples.html', 'utf8'),
        controller: 'UserFansCtrl'
      }
    }
  });

  $stateProvider.state('default.user.follows', {
    url: '/follows',
    views: {
      'content': {
        template: fs.readFileSync(__dirname + '/../templates/default/user-peoples.html', 'utf8'),
        controller: 'UserFollowsCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/');
}).run(function ($http, $cookies, $rootScope, $state, $timeout, $window, Notification, Default) {
  $rootScope.me = null;
  if (angular.element('meta[name="partake-user-id"]').length) {
    $rootScope.me = {
      is_me: true,
      id: angular.element('meta[name="partake-user-id"]').attr('content'),
      name: angular.element('meta[name="partake-user-name"]').attr('content'),
      nickname: angular.element('meta[name="partake-user-nickname"]').attr('content'),
      avatar: angular.element('meta[name="partake-user-avatar"]').attr('content'),
      description: angular.element('meta[name="partake-user-description"]').attr('content')
    };
  }

  $http.defaults.headers.common['X-Csrf-Token'] = $cookies._csrf;
  $rootScope.$state = $state;

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (fromState.name === 'slide.project.details' && toState.name === 'default.user.votes' && !$state.invoker) {
      event.preventDefault();
      $state.go('default.nil', {}, {notify: false});
      $timeout(function () {
        $state.go(toState, toParams);
      }, 0);
    }
    $state.invoker = false;
  });

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
  document.body.addEventListener('touchstart', function () {}, false);
});
