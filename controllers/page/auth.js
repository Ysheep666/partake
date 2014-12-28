// 用户认证
var router = require('express').Router();
var passport = require('passport');

// github 认证
router.route('/github').get(passport.authenticate('github'));

// github 认证回调
router.route('/github/callback').get(passport.authenticate('github', {failureRedirect: '/auth/login'}), function (req, res) {
  res.redirect('/');
});

module.exports = router;
