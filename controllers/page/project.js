// 项目
var router = require('express').Router();
var mongoose = require('mongoose');

// 页面跳转
router.route('/:id/link').get(function (req, res, done) {
  mongoose.model('Project').findById(req.params.id).select('url').exec(function (err, project) {
    if (err) {
      return done(err);
    }
    return res.redirect(project.url);
  });
});

module.exports = router;
