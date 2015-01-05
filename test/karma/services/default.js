describe('Default --> default service', function () {
  var Default, $httpBackend;

  beforeEach(module('defaultApp.service'));
  beforeEach(inject(function ($injector) {
    Default = $injector.get('Default');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('退出登录', function () {
    $httpBackend.expectDELETE('/api/logout').respond(201, {message: '退出登录成功'});
    Default.logout().then(function (data) {
      expect(data).to.deep.equals({message: '退出登录成功'});
    });
    $httpBackend.flush();
  });
});
