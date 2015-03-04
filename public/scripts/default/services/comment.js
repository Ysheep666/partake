var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.service').factory('Comment', function ($http) {
  return {
    // 创建评论
    create: function (comment) {
      return $http.post('/api/comments', angular.copy(comment)).then(function (response) {
        return response.data;
      });
    },
    // 点赞
    upvote: function (id) {
      return $http.post('/api/comments/' + id + '/votes').then(function (response) {
        return response.data;
      });
    }
  };
});
