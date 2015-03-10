var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.service').factory('Project', function ($http) {
  return {
    // 查询项目
    query: function (query) {
      return $http.get('/api/projects' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    },
    // 获取项目信息
    get: function (id) {
      return $http.get('/api/projects/' + id).then(function (response) {
        return response.data;
      });
    },
    // 创建项目
    create: function (project) {
      return $http.post('/api/projects', project).then(function (response) {
        return response.data;
      });
    },
    // 点赞
    upvote: function (id) {
      return $http.post('/api/projects/' + id + '/votes').then(function (response) {
        return response.data;
      });
    }
  };
});
