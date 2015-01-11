describe('Filter --> capitalize filter', function () {
  var $filter;

  beforeEach(module('filter.capitalize'));
  beforeEach(inject(function ($injector) {
    $filter = $injector.get('$filter');
  }));

  it('为空，则显示空', function () {
    expect($filter('capitalize')('')).to.equals('');
  });

  it('单词首字母大写', function () {
    expect($filter('capitalize')('hello world')).to.equals('Hello World');
  });
});
