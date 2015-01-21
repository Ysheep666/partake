var $ = require('jquery');
var angular = require('angular');

angular.module('ui.notification', []).factory('Notification', function ($document, $timeout) {
  return {
    defaultOptions: {
      position: 'bottom-left', // top-left, top-right, bottom-right, bottom-left
      showClose: true,
      timeout: 3000,
      onShown: function() {},
      onClosed: function() {}
    },
    show: function (message, type, options) {
      var that = this;
      that.options = $.extend(true, {}, that.defaultOptions, options);

      var $wrapper = $document.find('div.notification-wrapper[data-position="' + that.options.position + '"]');
      if (!$wrapper.length) {
        $wrapper = angular.element('<div class="notification-wrapper" data-position="' + that.options.position + '"></div>');
        $document.find('body').append($wrapper);
      }

      var $content = angular.element('<div class="alert alert-' + type + '"></div>');
      if (that.options.showClose) {
        $content.append('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
      }
      $content.append('<span>' + message + '</span>');
      $wrapper.prepend($content);

      that.options.onShown();
      var _close = function () {
        $content.addClass('hide').fadeOut('slow', function () {
          $content.remove();
          that.options.onClosed();
          if ('' == $wrapper.html()) {
            $wrapper.remove();
          }
        });
      };

      $timeout(_close, that.options.timeout);
      if ($content.find('.close').length) {
        $content.find('.close').on('click', function (event) {
          event.preventDefault();
          _close();
        });
      }
    }
  };
});
