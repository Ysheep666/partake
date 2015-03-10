angular.module('ui.contenteditable', []).directive('contenteditable', function ($timeout) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) {
        return;
      }

      var opts = {};
      angular.forEach([
        'stripBr',
        'noLineBreaks',
        'selectNonEditable',
        'moveCaretToEndOnChange'
      ], function (opt) {
        var o = attrs[opt];
        opts[opt] = o && o !== 'false';
      });

      angular.forEach([
        'maxTextLength'
      ], function (opt) {
        opts[opt] = attrs[opt] || null;
      });

      // view -> model
      element.bind('input', function (e) {
        scope.$apply(function () {
          var text = element.text();
          var html = element.html();
          var rerender = false;

          if (opts.stripBr) {
            html = html.replace(/<br>$/, '');
          }

          if (opts.noLineBreaks) {
            var html2 = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '');
            if (html2 !== html) {
              rerender = true;
              html = html2;
            }
          }

          if (opts.maxTextLength && parseInt(opts.maxTextLength, 10) < text.length) {
            rerender = true;
            text = ngModel.$viewValue;
          }

          if (text !== html) {
            html = text;
            element.html(text);
          }

          ngModel.$setViewValue(html);
          if (rerender) {
            ngModel.$render();
          }
          if (html === '') {
            element.addClass('null');
            $timeout(function (){
              element[0].blur();
              element[0].focus();
            });
          } else {
            element.removeClass('null');
          }
        });
      });

      // model -> view
      var oldRender = ngModel.$render;
      ngModel.$render = function () {
        if (!!oldRender) {
          oldRender();
        }

        if (ngModel.$viewValue && ngModel.$viewValue !== '') {
          element.removeClass('null').html(ngModel.$viewValue);
        } else {
          element.addClass('null').html('');
        }
        if (opts.moveCaretToEndOnChange) {
          var el = element[0];
          var range = document.createRange();
          var sel = window.getSelection();
          if (el.childNodes.length > 0) {
            var el2 = el.childNodes[el.childNodes.length - 1];
            range.setStartAfter(el2);
          } else {
            range.setStartAfter(el);
          }
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      };

      if (opts.selectNonEditable) {
        element.bind('click', function (e) {
          var target = e.toElement;
          if (target !== this && angular.element(target).attr('contenteditable') === 'false') {
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStartBefore(target);
            range.setEndAfter(target);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        });
      }
    }
  }
});