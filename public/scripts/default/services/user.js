var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.service').factory('User', function ($http) {
  return {
    // 获取用户信息
    get: function (name) {
      return $http.get('/api/users/@' + name).then(function (response) {
        return response.data;
      });
    },
    // 更新用户
    update: function (id, user) {
      return $http.put('/api/users/' + id, user).then(function (response) {
        return response.data;
      });
    }
  };
});
