var fs = require('fs');
var angular = require('angular');
var modernizr = require('modernizr');

angular.module('ui.user-avatar', []).directive('userAvatar', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    scope : {user: '=user'},
    template: fs.readFileSync(__dirname + '/../../../templates/components/user-avatar.html', 'utf8'),
    link: function (scope, element) {
      if (modernizr.touch) {
        return;
      }

      var $el = element.find('img.a');
      $el.popover({
        container: element,
        html: true,
        placement: 'bottom',
        trigger: 'manual',
        content: $compile(fs.readFileSync(__dirname + '/../../../templates/components/user-avatar-card.html', 'utf8'))(scope),
        template: '<div class="popover user-avatar-popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
      });

      var hideTimeOut = null;
      $el.bind('mouseenter mouseleave', function (e) {
        if (e.type === 'mouseenter') {
          if (hideTimeOut) {
            window.clearTimeout(hideTimeOut);
          } else {
            var $window = $(window);
            var popover = $el.data('bs.popover');
            if ($window.scrollTop() + $window.height() - $el.offset().top < 250) {
              popover.options.placement = 'top';
            } else {
              popover.options.placement = 'bottom';
            }

            $el.popover('show');
            popover.$tip.bind('mouseenter mouseleave', function (ev) {
              if (ev.type === 'mouseenter') {
                if (hideTimeOut) {
                  window.clearTimeout(hideTimeOut);
                }
              } else {
                hideTimeOut = window.setTimeout(function () {
                  hideTimeOut = null;
                  $el.data('bs.popover').$tip.unbind();
                  $el.popover('hide');
                }, 150);
              }
            });
          }
        } else {
          hideTimeOut = window.setTimeout(function () {
            hideTimeOut = null;
            $el.data('bs.popover').$tip.unbind();
            $el.popover('hide');
          }, 150);
        }
      });
    }
  };
});
