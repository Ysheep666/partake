var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.service').factory('Project', function ($http) {
  return {
    query: function (query) {
      return $http.get('/api/projects' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    },
    get: function (id) {
      return $http.get('/api/projects/' + id).then(function (response) {
        return response.data;
      });
    },
    create: function (project) {
      return $http.post('/api/projects', project).then(function (response) {
        return response.data;
      });
    }
  };
});
