var $ = require('jquery');
var angular = require('angular');

angular.module('manageApp.service').factory('Project', function ($http) {
  return {
    query: function (query) {
      return $http.get('/api/projects' + (query ? '?' + $.param(query) : '')).then(function (response) {
        return response.data;
      });
    }
  };
});
