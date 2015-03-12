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
    },
    // 关注
    follow: function (id) {
      return $http.post('/api/users/' + id + '/fans').then(function (response) {
        return response.data;
      });
    },
    // 查询投票的项目
    queryVote: function (id, query) {
      return $http.get('/api/users/' + id + '/votes' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    },
    // 查询提交的项目
    querySubmit: function (id, query) {
      return $http.get('/api/users/' + id + '/submits' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    },
    // 查询用户粉丝
    queryFans: function (id, query) {
      return $http.get('/api/users/' + id + '/fans' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    },
    // 查询用户关注的人
    queryFollows: function (id, query) {
      return $http.get('/api/users/' + id + '/follows' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    }
  };
});
