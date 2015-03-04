// 路由
/* jshint unused: false */
var _ = require('lodash');
module.exports = function (app) {
  app.use(require('../controllers/page/default'));
  app.use('/auth', require('../controllers/page/auth'));
  app.use('/manage', require('../controllers/page/manage'));
  app.use('/projects', require('../controllers/page/project'));

  app.use('/api/*', function (req, res, done) {
    req.isApi = true;
    res.contentType('application/vnd.' + adou.config.setting.api_vnd + '+json');
    done();
  });

  app.use('/api/', require('../controllers/api/default'));
  app.use('/api/comments', require('../controllers/api/comment'));
  app.use('/api/projects', require('../controllers/api/project'));
  app.use('/api/users', require('../controllers/api/user'));

  // 错误处理
  app.use(function (err, req, res, done) {
    if (!err.isValidation) {
      return done(err);
    }

    var errs = _.uniq(err.errors, function (err) {
      return err.param;
    });

    return res.status(400).json({
      error: errs
    });
  });

  // 500
  app.use(function (err, req, res, done) {
    console.error(err);
    if (req.xhr || req.isApi) {
      res.status(500).json({
        error: '系统出错！'
      });
    } else {
      res.status(500).render('500', {
        code: 500,
        message: '系统出错！'
      });
    }
  });

  // 404
  app.use(function (req, res) {
    console.warn('' + req.originalUrl + ' does not exist.');
    if (req.xhr || req.isApi) {
      res.status(404).json({
        error: '请求地址不存在！'
      });
    } else {
      res.status(404).render('404', {
        code: 404,
        message: '当前页面不存在！'
      });
    }
  });
};
