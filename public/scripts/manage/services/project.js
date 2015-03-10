var $ = require('jquery');
var angular = require('angular');

angular.module('manageApp.service').factory('Project', function ($http) {
  return {
    query: function (query) {
      query = $.extend({}, {admin: true}, query);
      return $http.get('/api/projects' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return {
          data: response.data,
          count: parseInt(response.headers('item-count'), 10)
        };
      });
    },

    update: function (id, project) {
      return $http.put('/api/projects/' + id + '?admin=true', project).then(function (response) {
        return response.data;
      });
    }
  };
});
