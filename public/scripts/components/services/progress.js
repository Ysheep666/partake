var angular = require('angular');

angular.module('ui.progress', []).provider('Progress', {
  $get: function ($document, $timeout, $animate) {
    var progressEl = angular.element('<div class="progress"><div class="range"></div></div>');
    var status = 0;
    var started = false;
    var incTimeout = null;
    var completeTimeout = null;
    var rangeEl = progressEl.find('.range').eq(0);

    var _set = function (n) {
      if (!started) {
        return;
      }
      rangeEl.css({
        width: (n * 100) + '%'
      });
      status = n;
      $timeout.cancel(incTimeout);
      incTimeout = $timeout(function () {
        return _inc();
      }, 300);
    };

    var _inc = function () {
      var change;
      if (status >= 1) {
        return;
      }
      change = 0;
      if (status >= 0 && status < 0.3) {
        change = (Math.random() * 4 + 5) / 100;
      } else if (status >= 0.3 && status < 0.6) {
        change = (Math.random() * 3) / 100;
      } else if (status >= 0.6 && status < 0.9) {
        change = (Math.random() * 2) / 100;
      } else if (status >= 0.9 && status < 0.99) {
        change = 0.005;
      } else {
        change = 0;
      }
      _set(status + change);
    };

    var _start = function () {
      var $parent;
      $parent = $document.find('body');
      $timeout.cancel(completeTimeout);
      if (started) {
        return;
      }
      started = true;
      $animate.enter(progressEl, $parent);
      _set(0.02);
    };

    var _complete = function () {
      _set(1);
      completeTimeout = $timeout(function () {
        $animate.leave(progressEl).then(function () {
          started = false;
        });
      }, 500);
    };

    return {
      start: _start,
      complete: _complete
    };
  }
});
