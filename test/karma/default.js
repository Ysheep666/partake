describe('Main --> default application', function () {
  var $rootScope, $httpBackend;

  beforeEach(module('defaultApp'));
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('退出登录', function () {
    $httpBackend.expectDELETE('/api/logout').respond(201, {message: '退出登录成功'});
    $rootScope.logout();
    expect($rootScope.loginStatus).to.equals('loading');

    $httpBackend.flush();
    expect($rootScope.loginStatus).to.equals('success');
  });
});
