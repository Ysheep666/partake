var angular = require('angular');

angular.module('filter.day-time', []).filter('dayTime', function () {
  return function (input, value) {
    if (moment(input).startOf('day').isSame(moment().startOf('day'))) {
      return '今天';
    } else if (moment(input).add(1, 'days').startOf('day').isSame(moment().startOf('day'))) {
      return '昨天'
    } else if (moment(input).add(2, 'days').startOf('day').isSame(moment().startOf('day'))) {
      return '前天'
    } else {
      return moment(input).format('dddd');
    }
  };
});
