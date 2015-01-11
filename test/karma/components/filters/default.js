describe('Filter --> default filter', function () {
  var $filter;

  beforeEach(module('filter.default'));
  beforeEach(inject(function ($injector) {
    $filter = $injector.get('$filter');
  }));

  it('为空，则显示默认值', function () {
    expect($filter('default')('', 'default')).to.equals('default');
  });

  it('不为空，则显示输入值', function () {
    expect($filter('default')('demo', 'default')).to.equals('demo');
  });
});
