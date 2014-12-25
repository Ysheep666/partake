var request = require('supertest');

describe('Page --> default controller', function () {
  var agent = request.agent(require('../../../index'));

  it('Get:/ -- 首页', function (done) {
    var req = agent.get('/');
    req.expect(200).end(function (err, res) {
      if (err) {
        return done(err);
      }
      done()
    });
  });
});
