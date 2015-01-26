var angular = require('angular');

angular.module('manageApp.service').factory('Default', function ($http) {
  return {
    // 退出登录
    logout: function () {
      return $http.delete('/api/logout').then(function (response) {
        return response.data;
      });
    }
  };
});
