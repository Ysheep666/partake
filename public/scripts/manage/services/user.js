var $ = require('jquery');
var angular = require('angular');

angular.module('manageApp.service').factory('User', function ($http) {
  return {
    // 查找用户
    query: function (query) {
      query = $.extend({}, {admin: true}, query);
      return $http.get('/api/users' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    },
    // 更新用户
    update: function (id, update) {
      return $http.put('/api/users/' + id + '?admin=true', update).then(function (response) {
        return response.data;
      });
    },
    // 删除
    delete: function (id) {
      return $http.delete('/api/users/' + id + '?admin=true').then(function (response) {
        return response.data;
      });
    }
  };
});
