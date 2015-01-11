describe('Notification --> notification services service', function () {
  var $document, $timeout, Notification;

  beforeEach(module('ui.notification'));
  beforeEach(inject(function ($injector) {
    $document = $injector.get('$document');
    $timeout = $injector.get('$timeout');
    Notification = $injector.get('Notification');
  }));

  afterEach(function () {
    $document.find('div.notification-wrapper').remove();
  });

  it('错误提示', function () {
    Notification.show('错误提示', 'danger');
    var notificationEl = $document.find('div.notification-wrapper');
    expect(notificationEl.find('.alert').hasClass('alert-danger')).to.equals(true);
  });

  it('成功提示', function () {
    Notification.show('成功提示', 'success');
    var notificationEl = $document.find('div.notification-wrapper');
    expect(notificationEl.find('.alert').hasClass('alert-success')).to.equals(true);
  });

  it('警告提示', function () {
    Notification.show('警告提示', 'warning');
    var notificationEl = $document.find('div.notification-wrapper');
    expect(notificationEl.find('.alert').hasClass('alert-warning')).to.equals(true);
  });

  it('显示多个提示', function () {
    Notification.show('显示多个提示1', 'success');
    Notification.show('显示多个提示2', 'success');
    var notificationEl = $document.find('div.notification-wrapper');
    expect(notificationEl.find('.alert').length).to.equals(2);
  });

  it('过期隐藏', function () {
    Notification.show('过期隐藏', 'success');
    expect($document.find('div.notification-wrapper').length).to.equals(1);
    $timeout.flush(2000);
    expect($document.find('div.notification-wrapper').find('.alert').hasClass('hide')).to.equals(true);
  });

  it('提示默认位置', function () {
      Notification.show('提示默认位置', 'success');
    var notificationEl = $document.find('div.notification-wrapper');
    expect(notificationEl.data('position')).to.equals('top-right');
  });

  it('自定义提示位置', function () {
    Notification.show('自定义提示位置', 'success', {position: 'bottom-right'});
    var notificationEl = $document.find('div.notification-wrapper');
    expect(notificationEl.data('position')).to.equals('bottom-right');
  });
});
