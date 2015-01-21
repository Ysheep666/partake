var angular = require('angular');

angular.module('ui.error-tip', ['ui.notification']).factory('ErrorTip', function (Notification) {
  return {
    show: function (response, type, options) {
      var error = response.error, errors = [];

      if (typeof error === 'string') {
        errors = [error];
      } else {
        errors = (function() {
          var results = [];
          for (var i = 0; i < error.length; i++) {
            results.push(error[i].msg);
          }
          return results;
        })();
      }

      Notification.show(errors.join('<br>'), 'danger');
    }
  };
});
