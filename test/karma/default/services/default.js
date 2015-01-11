describe('Default --> default service', function () {
  var Default, $rootScope, $httpBackend;

  beforeEach(module('defaultApp.service'));
  beforeEach(inject(function ($injector) {
    Default = $injector.get('Default');
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('退出登录', function () {
    var resolved;
    $httpBackend.expectDELETE('/api/logout').respond(201, {message: '退出登录成功'});
    Default.logout().then(function (data) {
      resolved = data;
    });
    $httpBackend.flush();
    $rootScope.$digest();
    expect(resolved).to.deep.equals({message: '退出登录成功'});
  });
});
