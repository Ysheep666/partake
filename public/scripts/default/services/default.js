var angular = require('angular');

angular.module('defaultApp.service').factory('Default', function ($http) {
  return {
    search: function (query) {
      return $http.get('/api/search?q=' + query).then(function (response) {
        return response.data;
      });
    },
    // 获取又拍云 Token 信息
    getUpToken: function (data) {
      return $http.post('/api/uptoken', data).then(function (response) {
        return response.data;
      });
    },
    // 退出登录
    logout: function () {
      return $http.delete('/api/logout').then(function (response) {
        return response.data;
      });
    }
  };
});
