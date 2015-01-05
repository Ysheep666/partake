var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.service').factory('Notification', function ($document, $timeout) {
  return {
    defaultOptions: {
      position: 'top-right', // top-left, top-right, bottom-right, bottom-left
      showClose: true,
      timeout: 4000,
      onShown: function() {},
      onClosed: function() {}
    },
    show: function (message, type, options) {
      this.options = $.extend(true, {}, this.defaultOptions, options);

      var $wrapper = $document.find('div.notification-wrapper[data-position="' + this.options.position + '"]');
      if (!$wrapper.length) {
        $wrapper = angular.element('<div class="notification-wrapper" data-position="' + this.options.position + '"></div>');
        $document.find('body').append($wrapper);
      }

      var $content = angular.element('<div class="alert alert-' + type + '"></div>');
      if (this.options.showClose) {
        $content.append('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
      }
      $content.append('<span>' + this.options.message + '</span>');
      $wrapper.append($content);

      $timeout(function () {
        $content.remove();
        $wrapper.remove();
      }, this.options.timeout)
    }
  };
});
