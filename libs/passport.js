// 用户认证
var async = require('async');
var User = require('../models/user');

module.exports = function (passport) {
  var auth = adou.config.auth;

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, 'name nickname email avatar', done);
  });

  passport.use(new (require('passport-github').Strategy)({
    clientID: auth.github.client_id,
    clientSecret: auth.github.client_secret,
    callbackURL: auth.github.callback_url
  }, function (accessToken, refreshToken, profile, done) {
    var u = profile._json;
    async.waterfall([function (fn) {
      User.findOne({github: u.id}, fn);
    }, function (user, fn) {
      if (!user) {
        user = new User({
          github: u.id,
        });
      }

      user.name = u.login;
      user.nickname = u.name;
      user.email = u.email;
      user.avatar = u.avatar_url;

      user.save(fn);
    }], function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  }));
};
