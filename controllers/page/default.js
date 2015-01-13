// 默认
var router = require('express').Router();

// 首页
router.route([
  '/',
  '/projects/:id'
]).get(function (req, res) {
  res.render('default');
});

module.exports = router;
