var fs = require('fs');
var $ = require('jquery');
var angular = require('angular');

angular.module('defaultApp.directive').directive('formGroupDefault', function() {
 return {
    restrict: 'C',
    link: function (scope, element, attrs) {
      element.on('click', function () {
        $(this).find(':input').focus();
      });

      element.on('focus', ':input', function () {
        $('.form-group.form-group-default').removeClass('focused');
        $(this).parents('.form-group').addClass('focused');
      });

      element.on('blur', ':input', function () {
        $(this).parents('.form-group').removeClass('focused');
        if ($(this).val()) {
          $(this).closest('.form-group').find('label').addClass('fade');
        } else {
          $(this).closest('.form-group').find('label').removeClass('fade');
        }
      });
    }
  };
});
