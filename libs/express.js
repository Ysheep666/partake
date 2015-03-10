// express 配置
var path = require('path');
var express = require('express');

module.exports = function (app, passport) {
  var setting = PT.config.setting;

  app.use(require('compression')());

  app.engine('dust', require('consolidate').dust);
  app.set('view engine', 'dust');

  app.use(require('serve-favicon')(path.join(setting.root, 'public', 'favicon.ico')));

  // 开发
  if ('development' === app.get('env')) {
    app.use(express.static(path.join(setting.root, '.tmp', 'public')));
    app.use(express.static(path.join(setting.root, 'public')));

    app.use(require('morgan')('short'));
    app.set('views', path.join(setting.root, 'views'));
  }

  // 测试
  if ('test' === app.get('env')) {
    app.set('views', path.join(setting.root, 'views'));
  }

  // 生产
  if ('production' === app.get('env')) {
    app.use(express.static(path.join(setting.root, 'dist', 'public')));
    app.set('views', path.join(setting.root, 'dist', 'views'));
  }

  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: 'json'}));

  app.use(require('method-override')());
  app.use(require('express-validator')());

  app.use(require('cookie-parser')(setting.secret));

  var session = require('express-session');
  app.use(session({
    name: 'partake.id',
    secret: setting.secret,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 * 12
    },
    store: new (require('connect-redis')(session))((function () {
      var options = {};
      var url = require('url').parse(PT.config.db.redis);
      if (url.auth) {
        var userparts = url.auth.split(':');
        options.user = userparts[0];
        if (userparts.length === 2) {
          options.pass = userparts[1];
        }
      }
      options.host = url.hostname;
      options.port = url.port;
      if (url.pathname) {
        options.db   = url.pathname.replace('/', '', 1);
      }
      options.prefix = 'session:';
      return options;
    })()),
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  if ('test' !== app.get('env')) {
    app.use(require('csurf')());
  }

  app.use(function (req, res, done) {
    if ('test' !== app.get('env')) {
      res.cookie('_csrf', req.csrfToken());
    }

    res.locals.app = setting;
    res.locals.app.user = req.user;
    done();
  });
};
