var fs = require('fs');
var angular = require('angular');
var modernizr = require('modernizr');

angular.module('ui.user-avatar', []).directive('userAvatar', function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    scope : {user: '=user', v: '@v'},
    template: fs.readFileSync(__dirname + '/../../../templates/components/user-avatar.html', 'utf8'),
    link: function (scope, element, attrs) {
      if (modernizr.touch) {
        return;
      }

      element.addClass(attrs.class);

      var $el = element.find('a.u');

      element.on('click', function (e) {
        e.stopPropagation();
        $el.data('bs.popover').$tip.unbind();
        $el.popover('hide');
      });

      $el.popover({
        container: 'body',
        html: true,
        placement: 'bottom',
        trigger: 'manual',
        content: $compile(fs.readFileSync(__dirname + '/../../../templates/components/user-avatar-card.html', 'utf8'))(scope),
        template: '<div class="popover user-avatar-popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
      });

      var hideTimeOut = null;
      $el.on('mouseenter mouseleave', function (e) {
        if (e.type === 'mouseenter') {
          if (hideTimeOut) {
            window.clearTimeout(hideTimeOut);
          } else {
            var $window = $(window);
            var popover = $el.data('bs.popover');
            if ($window.scrollTop() + $window.height() - $el.offset().top < 300) {
              popover.options.placement = 'top';
            } else {
              popover.options.placement = 'bottom';
            }

            $el.popover('show');
            popover.$tip.on('mouseenter mouseleave', function (ev) {
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

            popover.$tip.on('click', 'a', function (e) {
              e.stopPropagation();
              $el.data('bs.popover').$tip.unbind();
              $el.popover('hide');
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
