// 默认
var router = require('express').Router();

// 首页
router.route('/').get(function (req, res) {
  res.render('default');
});

module.exports = router;
