describe('Controller --> default page', function () {
  var $controller;

  beforeEach(module('defaultApp.controller'));
  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');
  }));

  it('测试点击', function () {
    var $scope = {};
    $controller('DefaultCtrl', {'$scope': $scope});

    var result = $scope.click();
    expect(result).to.equals('demo');
  });
});
