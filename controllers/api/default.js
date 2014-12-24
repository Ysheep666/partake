// 默认 Api
var router = require('express').Router();

router.route('/').get(function (req, res) {
  res.json({ok: true});
});

module.exports = router;
