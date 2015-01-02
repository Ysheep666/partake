// 默认 Api
var router = require('express').Router();

router.route('/').get(function (req, res) {
  res.json({ok: true});
});

// 退出登录
router.route('/logout').delete(function (req, res) {
  req.logout();
  return res.status(202).json({
    message: '退出登录成功'
  });
});

module.exports = router;
