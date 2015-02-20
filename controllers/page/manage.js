// 管理
var router = require('express').Router();

var auth = require('../../libs/middlewares/auth');

// 权限过滤
router.route('*').all(auth.checkUser).all(auth.checkAdministrate);

// 审核管理
router.route([
  '/',
  '/users'
]).get(function (req, res) {
  // 格言警句
  var aphorism = (function () {
    var aphorisms = adou.config.data.aphorisms;
    return aphorisms[Math.floor(Math.random() * aphorisms.length)];
  }());

  res.render('manage', {
    aphorism: aphorism
  });
});

module.exports = router;
