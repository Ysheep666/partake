// 管理
var router = require('express').Router();

var auth = require('../../libs/middlewares/auth');

// 权限过滤
router.route('*').all(auth.checkUser).all(auth.checkAdministrate);

// 审核管理
router.route([
  '/',
  '/projects',
  '/projects/:id',
  '/projects/:id/verify',
  '/projects/:id/noverify',
  '/users'
]).get(function (req, res) {
  // 格言警句
  var aphorism = (function () {
    var aphorisms = PT.config.data.aphorisms;
    return aphorisms[Math.floor(Math.random() * aphorisms.length)];
  }());

  res.render('manage', {
    aphorism: aphorism
  });
});

module.exports = router;
