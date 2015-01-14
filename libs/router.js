// 路由
/* jshint unused: false */
module.exports = function (app) {
  app.use(require('../controllers/page/default'));
  app.use('/auth', require('../controllers/page/auth'));
  app.use('/manage', require('../controllers/page/manage'));

  app.use('/api/*', function (req, res, done) {
    res.contentType('application/vnd.' + adou.config.setting.api_vnd + '+json');
    done();
  });

  app.use('/api/', require('../controllers/api/default'));
  app.use('/api/projects', require('../controllers/api/project'));

  if ('production' === app.get('env')) {
    // 500
    app.use(function (err, req, res, done) {
      console.error(err);
      if (req.xhr) {
        res.status(500).json({
          error: '系统出错！'
        });
      } else {
        res.status(500).render('500', {
          title: 500
        });
      }
    });

    // 404
    app.use(function (req, res) {
      console.warn('' + req.originalUrl + ' does not exist.');
      if (req.xhr) {
        res.status(404).json({
          error: '请求地址不存在！'
        });
      } else {
        res.status(404).render('404', {
          title: 404
        });
      }
    });
  }
};
