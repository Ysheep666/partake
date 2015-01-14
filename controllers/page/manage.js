// 管理
var router = require('express').Router();

var User = require('../../models/user');

// 权限过滤
router.route('*').get(function(req, res, done) {
  if (!req.user) {
    return res.redirect('/');
  }

  User.findById(req.user.id, 'administrate', function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user.administrate) {
      return res.redirect('/');
    }
    return done();
  });
});

// 审核管理
router.route('/').get(function (req, res) {
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
