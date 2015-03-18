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

// 分享
router.route('/:id/share').get(function (req, res, done) {
  if (!req.query.to) {
    return done();
  }

  mongoose.model('Project').findById(req.params.id).select('name description').exec(function (err, project) {
    if (err) {
      return done(err);
    }

    if (req.query.to === 'weibo') {
      return res.redirect('http://v.t.sina.com.cn/share/share.php?url=http://partake.top/projects/' + project.id + '&title=' + encodeURIComponent(project.name + ' - ' + project.description) + '&appkey=497698346');
    } else if (req.query.to === 'weixin') {
      return res.render('project/share', {project: project});
    } else {
      return done();
    }
  });
});

module.exports = router;
