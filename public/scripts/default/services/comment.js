var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.service').factory('Comment', function ($http) {
  return {
    // 创建评论
    create: function (comment) {
      return $http.post('/api/comments', comment).then(function (response) {
        return response.data;
      });
    },
    // 点赞
    upvote: function (id) {
      return $http.post('/api/comments/' + id + '/votes').then(function (response) {
        return response.data;
      });
    },
    // 删除
    delete: function (id) {
      return $http.delete('/api/comments/' + id ).then(function (response) {
        return response.data;
      });
    }
  };
});
